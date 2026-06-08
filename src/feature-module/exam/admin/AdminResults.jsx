import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteResult, getAdminResults } from "../../../core/api/examApi";
import { showErrorToast, showSuccessToast } from "../../../core/utils/toast";
import ExamLayout from "../ExamLayout";
import PortalCard from "../components/PortalCard";
import PortalTable from "../components/PortalTable";
import PortalBadge from "../components/PortalBadge";
import { formatDate, scoreColor } from "../components/portalUtils";

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);

  const load = () => {
    setLoading(true);
    getAdminResults()
      .then((res) => setResults(res.data || []))
      .catch((err) => showErrorToast("Error", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const studentHistory = useMemo(() => {
    if (!viewItem?.student_id) return [];
    return results.filter((r) => r.student_id === viewItem.student_id);
  }, [results, viewItem]);

  const handleDelete = async (row) => {
    const label = row.student_name || row.student_id;
    if (!window.confirm(`Delete result for "${label}"? This cannot be undone.`)) return;
    try {
      const res = await deleteResult(row._id);
      if (res.success) {
        showSuccessToast("Deleted", res.message);
        if (viewItem?._id === row._id) setViewItem(null);
        load();
      } else {
        showErrorToast("Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Failed", err.message);
    }
  };

  const columns = [
    {
      key: "student_name",
      title: "Student",
      render: (row) => (
        <div>
          <div>{row.student_name || "Unknown"}</div>
          {row.student_email && (
            <small className="text-muted">{row.student_email}</small>
          )}
        </div>
      ),
    },
    {
      key: "subject_name",
      title: "Subject",
      render: (row) => row.subject_name || row.subject_id || "-",
    },
    {
      key: "exam_title",
      title: "Exam",
      render: (row) => row.exam_title || row.model_answer_title || "-",
    },
    { key: "mcq_score", title: "MCQ" },
    { key: "theory_score", title: "Theory" },
    {
      key: "total",
      title: "Total",
      render: (row) => `${row.total_score}/${row.total_marks}`,
    },
    {
      key: "percentage",
      title: "Score %",
      render: (row) => (
        <PortalBadge status={scoreColor(row.percentage)} label={`${row.percentage}%`} />
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => <PortalBadge status={row.status} label={row.status} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="ep-actions">
          <button
            type="button"
            className="ep-btn ep-btn-outline ep-btn-sm"
            onClick={() => setViewItem(row)}
          >
            View
          </button>
          <Link
            to={`/admin/results/${row.id}`}
            className="ep-btn ep-btn-outline ep-btn-sm"
          >
            Edit
          </Link>
          <button
            type="button"
            className="ep-btn ep-btn-danger ep-btn-sm"
            onClick={() => handleDelete(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <ExamLayout
      title="Results & Analytics"
      subtitle="Review graded exams and manually adjust scores"
      variant="admin"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Results" }]}
    >
      <PortalCard title="Graded Results" subtitle={`${results.length} result(s) available`}>
        <PortalTable
          columns={columns}
          rows={results.map((r) => ({ ...r, id: r._id }))}
          loading={loading}
          emptyTitle="No results yet"
          emptyMessage="Results appear after student submissions are checked."
        />
      </PortalCard>

      {viewItem && (
        <div className="ep-modal-backdrop" onClick={() => setViewItem(null)}>
          <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h3 className="ep-modal-title">Student Exam Detail</h3>
              <button
                type="button"
                className="ep-modal-close"
                onClick={() => setViewItem(null)}
              >
                ×
              </button>
            </div>
            <div className="ep-modal-body">
              <div className="ep-detail-row">
                <div className="ep-detail-label">Student</div>
                <div className="ep-detail-value">
                  {viewItem.student_name || "Unknown"}
                  {viewItem.student_email ? ` (${viewItem.student_email})` : ""}
                </div>
              </div>
              <div className="ep-detail-row">
                <div className="ep-detail-label">Subject</div>
                <div className="ep-detail-value">
                  {viewItem.subject_name || viewItem.subject_id || "-"}
                </div>
              </div>
              <div className="ep-detail-row">
                <div className="ep-detail-label">Exam</div>
                <div className="ep-detail-value">
                  {viewItem.exam_title || viewItem.model_answer_title || "-"}
                </div>
              </div>
              <div className="ep-detail-row">
                <div className="ep-detail-label">Score</div>
                <div className="ep-detail-value">
                  {viewItem.total_score}/{viewItem.total_marks} ({viewItem.percentage}%)
                  — MCQ: {viewItem.mcq_score}, Theory: {viewItem.theory_score}
                </div>
              </div>
              <div className="ep-detail-row">
                <div className="ep-detail-label">Feedback</div>
                <div className="ep-detail-value">
                  {viewItem.overall_feedback || "-"}
                </div>
              </div>

              {viewItem.mcq_results?.length > 0 && (
                <>
                  <h5 className="mt-3 mb-2">MCQ Results</h5>
                  <div className="ep-table-wrap">
                    <table className="ep-table">
                      <thead>
                        <tr>
                          <th>Question</th>
                          <th>Student Answer</th>
                          <th>Correct</th>
                          <th>Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewItem.mcq_results.map((m, i) => (
                          <tr key={i}>
                            <td>{m.question}</td>
                            <td>{m.student_answer || "-"}</td>
                            <td>{m.correct_answer}</td>
                            <td>
                              <PortalBadge
                                status={m.is_correct ? "success" : "danger"}
                                label={`${m.marks_awarded}`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {viewItem.theory_results?.length > 0 && (
                <>
                  <h5 className="mt-4 mb-2">Theory Results</h5>
                  {viewItem.theory_results.map((t, i) => (
                    <div key={i} className="ep-mcq-panel mb-3">
                      <h6>
                        Q{t.question_no}: {t.question}
                      </h6>
                      <p className="mb-1">
                        <strong>Marks:</strong> {t.marks_awarded}/{t.max_marks}
                      </p>
                      <p className="mb-1">
                        <strong>Student Answer:</strong> {t.student_answer || "-"}
                      </p>
                      <p className="mb-1">
                        <strong>Model Answer:</strong> {t.model_answer || "-"}
                      </p>
                      <p className="mb-0">
                        <strong>Feedback:</strong> {t.ai_feedback || "-"}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {studentHistory.length > 1 && (
                <>
                  <h5 className="mt-4 mb-2">
                    All Exams by {viewItem.student_name || "Student"}
                  </h5>
                  <div className="ep-table-wrap">
                    <table className="ep-table">
                      <thead>
                        <tr>
                          <th>Exam</th>
                          <th>Subject</th>
                          <th>Score</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentHistory.map((r) => (
                          <tr
                            key={r._id}
                            style={{
                              background:
                                r._id === viewItem._id ? "#eef2ff" : undefined,
                              cursor: "pointer",
                            }}
                            onClick={() => setViewItem(r)}
                          >
                            <td>{r.exam_title || r.model_answer_title || "-"}</td>
                            <td>{r.subject_name || "-"}</td>
                            <td>
                              {r.total_score}/{r.total_marks} ({r.percentage}%)
                            </td>
                            <td>{formatDate(r.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className="ep-modal-footer">
              <button
                type="button"
                className="ep-btn ep-btn-outline"
                onClick={() => setViewItem(null)}
              >
                Close
              </button>
              <Link
                to={`/admin/results/${viewItem._id}`}
                className="ep-btn ep-btn-primary"
              >
                Edit Result
              </Link>
            </div>
          </div>
        </div>
      )}
    </ExamLayout>
  );
};

export default AdminResults;
