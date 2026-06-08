import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, Upload } from "react-feather";
import { getStudentSubjects } from "../../../core/api/examApi";
import { showErrorToast } from "../../../core/utils/toast";
import ExamLayout from "../ExamLayout";
import PortalCard from "../components/PortalCard";
import PortalTable from "../components/PortalTable";
import PortalBadge from "../components/PortalBadge";
import PortalStatCard from "../components/PortalStatCard";

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentSubjects()
      .then((res) => setSubjects(res.data || []))
      .catch((err) => showErrorToast("Error", err.message))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "code", title: "Code" },
    { key: "name", title: "Subject" },
    { key: "description", title: "Description", render: (row) => row.description || "-" },
    { key: "status", title: "Status", render: (row) => <PortalBadge status={row.status} label={row.status} /> },
    {
      key: "action",
      title: "Action",
      render: (row) => (
        <Link to="/student/upload" className="ep-btn ep-btn-outline ep-btn-sm">
          Take Exam
        </Link>
      ),
    },
  ];

  return (
    <ExamLayout
      title="My Subjects"
      subtitle="Browse Business Law topics and start your next exam"
      variant="student"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Subjects" }]}
      action={
        <Link to="/student/upload" className="ep-btn ep-btn-primary">
          <Upload size={16} /> Submit Exam
        </Link>
      }
    >
      <div className="ep-stats-grid mb-4">
        <PortalStatCard icon={Book} label="Available Subjects" value={subjects.length} tone="sky" />
        <PortalStatCard icon={Upload} label="Submission Methods" value="MCQ + PDF" tone="indigo" />
      </div>

      <PortalCard title="Subject Catalog" subtitle="All subjects available to you">
        <PortalTable
          columns={columns}
          rows={subjects.map((s) => ({ ...s, id: s._id }))}
          loading={loading}
          emptyTitle="No subjects available"
          emptyMessage="Ask your administrator to publish subjects for your account."
        />
      </PortalCard>
    </ExamLayout>
  );
};

export default StudentSubjects;
