import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminSubmissions, recheckSubmission } from "../../../core/api/examApi";
import { all_routes } from "../../../Router/all_routes";
import { showErrorToast, showSuccessToast } from "../../../core/utils/toast";
import ExamLayout from "../ExamLayout";
import PortalCard from "../components/PortalCard";
import PortalTable from "../components/PortalTable";
import PortalBadge from "../components/PortalBadge";
import { formatDate } from "../components/portalUtils";

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rechecking, setRechecking] = useState(null);

  const load = () => {
    setLoading(true);
    getAdminSubmissions()
      .then((res) => setSubmissions(res.data || []))
      .catch((err) => showErrorToast("Error", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRecheck = async (id) => {
    setRechecking(id);
    try {
      const res = await recheckSubmission(id);
      if (res.success) {
        showSuccessToast("Checked", res.message);
        setSubmissions((prev) =>
          prev.map((s) =>
            s._id === id
              ? {
                  ...s,
                  check_status: "completed",
                  result_id: res.data?.result_id || s.result_id,
                }
              : s
          )
        );
        load();
      } else {
        showErrorToast("Check Failed", res.message || "Could not check submission");
        load();
      }
    } catch (err) {
      showErrorToast("Failed", err.message);
    } finally {
      setRechecking(null);
    }
  };

  const columns = [
    { key: "title", title: "Title" },
    {
      key: "subject_name",
      title: "Subject",
      render: (row) => row.subject_name || "-",
    },
    { key: "student_email", title: "Student", render: (row) => row.student_email || "-" },
    {
      key: "type",
      title: "Type",
      render: (row) => (
        <PortalBadge
          label={row.submission_type === "mcq_text" ? "MCQ Online" : "PDF Upload"}
          status={row.submission_type === "mcq_text" ? "info" : "neutral"}
        />
      ),
    },
    { key: "ocr_status", title: "OCR", render: (row) => <PortalBadge status={row.ocr_status} label={row.ocr_status} /> },
    { key: "check_status", title: "Check Status", render: (row) => <PortalBadge status={row.check_status} label={row.check_status} /> },
    { key: "created_at", title: "Submitted", render: (row) => formatDate(row.created_at) },
    {
      key: "action",
      title: "Action",
      render: (row) => (
        <div className="d-flex flex-wrap gap-2">
          <button
            className="ep-btn ep-btn-outline ep-btn-sm"
            onClick={() => handleRecheck(row.id)}
            disabled={rechecking === row.id}
          >
            {rechecking === row.id ? "Checking..." : "Re-check"}
          </button>
          {row.result_id && (
            <Link
              to={all_routes.adminResultDetail.replace(":id", row.result_id)}
              className="ep-btn ep-btn-primary ep-btn-sm"
            >
              View Result
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <ExamLayout
      title="Student Submissions"
      subtitle="Monitor PDF uploads and online MCQ attempts by subject"
      variant="admin"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Submissions" }]}
    >
      <PortalCard
        title="Submission Queue"
        subtitle={`${submissions.length} total submission(s)`}
      >
        <PortalTable
          columns={columns}
          rows={submissions.map((s) => ({ ...s, id: s._id }))}
          loading={loading}
          emptyTitle="No submissions yet"
          emptyMessage="Student submissions will appear here once they submit exams."
        />
      </PortalCard>
    </ExamLayout>
  );
};

export default AdminSubmissions;
