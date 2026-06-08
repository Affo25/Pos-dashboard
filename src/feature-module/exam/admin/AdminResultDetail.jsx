import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteResult, editResult, getAdminResult } from "../../../core/api/examApi";
import { showErrorToast, showSuccessToast } from "../../../core/utils/toast";
import ExamLayout from "../ExamLayout";
import PortalCard from "../components/PortalCard";
import PortalLoading from "../components/PortalLoading";
import PortalBadge from "../components/PortalBadge";
import { scoreColor } from "../components/portalUtils";

const AdminResultDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [edit, setEdit] = useState({
    mcq_score: "",
    theory_score: "",
    overall_feedback: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () =>
    getAdminResult(id)
      .then((res) => {
        setResult(res.data);
        setEdit({
          mcq_score: res.data.mcq_score,
          theory_score: res.data.theory_score,
          overall_feedback: res.data.overall_feedback,
        });
      })
      .catch((err) => showErrorToast("Error", err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await editResult(id, {
        mcq_score: Number(edit.mcq_score),
        theory_score: Number(edit.theory_score),
        overall_feedback: edit.overall_feedback,
      });
      if (res.success) {
        showSuccessToast("Saved", res.message);
        load();
      }
    } catch (err) {
      showErrorToast("Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this result permanently?")) return;
    try {
      const res = await deleteResult(id);
      if (res.success) {
        showSuccessToast("Deleted", res.message);
        navigate("/admin/results");
      }
    } catch (err) {
      showErrorToast("Failed", err.message);
    }
  };

  if (loading) {
    return (
      <ExamLayout title="Result Detail" variant="admin">
        <PortalLoading />
      </ExamLayout>
    );
  }

  if (!result) {
    return (
      <ExamLayout title="Result Detail" variant="admin">
        <p>Result not found.</p>
      </ExamLayout>
    );
  }

  const studentLabel = result.student_name || result.student_id;

  return (
    <ExamLayout
      title="Result Review"
      subtitle={`${studentLabel} — ${result.exam_title || result.model_answer_title || "Exam"} — ${result.total_score}/${result.total_marks}`}
      variant="admin"
      breadcrumbs={[
        { label: "Dashboard", to: "/" },
        { label: "Results", to: "/admin/results" },
        { label: "Detail" },
      ]}
      action={
        <div className="ep-actions">
          <Link to="/admin/results" className="ep-btn ep-btn-outline">
            Back
          </Link>
          <button
            type="button"
            className="ep-btn ep-btn-danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      }
    >
      <div className="ep-result-grid">
        <PortalCard title="Student">
          <h4 className="mb-1">{result.student_name || "Unknown"}</h4>
          <p className="mb-0 text-muted">{result.student_email || "-"}</p>
        </PortalCard>
        <PortalCard title="Subject">
          <h4 className="mb-0">{result.subject_name || "-"}</h4>
        </PortalCard>
        <PortalCard title="Exam">
          <h4 className="mb-0">{result.exam_title || result.model_answer_title || "-"}</h4>
        </PortalCard>
        <PortalCard title="Overall">
          <PortalBadge status={scoreColor(result.percentage)} label={`${result.percentage}%`} />
          <p className="mt-2 mb-0">{result.overall_feedback}</p>
        </PortalCard>
      </div>

      <div className="ep-result-grid">
        <PortalCard title="MCQ Score">
          <h2 className="mb-0">{result.mcq_score}</h2>
        </PortalCard>
        <PortalCard title="Theory Score">
          <h2 className="mb-0">{result.theory_score}</h2>
        </PortalCard>
        <PortalCard title="Total">
          <h2 className="mb-0">
            {result.total_score}/{result.total_marks}
          </h2>
        </PortalCard>
      </div>

      {result.mcq_results?.length > 0 && (
        <PortalCard title="MCQ Breakdown" subtitle="Question-by-question results">
          <div className="ep-table-wrap">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Student Answer</th>
                  <th>Correct Answer</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {result.mcq_results.map((m, i) => (
                  <tr key={i}>
                    <td>{m.question}</td>
                    <td>{m.student_answer || "-"}</td>
                    <td>{m.correct_answer}</td>
                    <td>
                      <PortalBadge
                        status={m.is_correct ? "success" : "danger"}
                        label={`${m.marks_awarded} pts`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PortalCard>
      )}

      {result.theory_results?.map((t, i) => (
        <PortalCard key={i} title={`Question ${t.question_no}`} subtitle={t.question}>
          <p className="mb-2">
            <strong>Marks:</strong> {t.marks_awarded}/{t.max_marks}
          </p>
          <p className="mb-2">
            <strong>Student Answer:</strong> {t.student_answer || "-"}
          </p>
          <p className="mb-2">
            <strong>Model Answer:</strong> {t.model_answer || "-"}
          </p>
          <p className="mb-0">
            <strong>AI Feedback:</strong> {t.ai_feedback || "-"}
          </p>
        </PortalCard>
      ))}

      <PortalCard title="Manual Score Adjustment" subtitle="Override automated grading when needed">
        <form onSubmit={handleSave} className="row g-3">
          <div className="col-md-3">
            <label className="ep-form-label">MCQ Score</label>
            <input
              type="number"
              className="ep-input"
              value={edit.mcq_score}
              onChange={(e) => setEdit({ ...edit, mcq_score: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <label className="ep-form-label">Theory Score</label>
            <input
              type="number"
              className="ep-input"
              value={edit.theory_score}
              onChange={(e) => setEdit({ ...edit, theory_score: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="ep-form-label">Overall Feedback</label>
            <input
              className="ep-input"
              value={edit.overall_feedback}
              onChange={(e) =>
                setEdit({ ...edit, overall_feedback: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="ep-btn ep-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Manual Edit"}
            </button>
          </div>
        </form>
      </PortalCard>
    </ExamLayout>
  );
};

export default AdminResultDetail;
