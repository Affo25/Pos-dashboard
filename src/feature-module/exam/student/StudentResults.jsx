import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentResults, getStudentSubjects } from "../../../core/api/examApi";
import { showErrorToast } from "../../../core/utils/toast";
import ExamLayout from "../ExamLayout";
import PortalCard from "../components/PortalCard";
import PortalTable from "../components/PortalTable";
import PortalBadge from "../components/PortalBadge";
import PortalStatCard from "../components/PortalStatCard";
import { Award, TrendingUp } from "react-feather";
import { buildSubjectNameMap, getSubjectName, scoreColor } from "../components/portalUtils";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudentResults(), getStudentSubjects()])
      .then(([resultsRes, subjectsRes]) => {
        setResults(resultsRes.data || []);
        setSubjects(subjectsRes.data || []);
      })
      .catch((err) => showErrorToast("Error", err.message))
      .finally(() => setLoading(false));
  }, []);

  const subjectNameById = useMemo(() => buildSubjectNameMap(subjects), [subjects]);

  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
      : 0;

  const columns = [
    {
      key: "subject_id",
      title: "Subject",
      render: (row) => getSubjectName(subjectNameById, row.subject_id),
    },
    { key: "mcq_score", title: "MCQ" },
    { key: "theory_score", title: "Theory" },
    { key: "total", title: "Total", render: (row) => `${row.total_score}/${row.total_marks}` },
    {
      key: "percentage",
      title: "Score %",
      render: (row) => (
        <PortalBadge status={scoreColor(row.percentage)} label={`${row.percentage}%`} />
      ),
    },
    { key: "status", title: "Status", render: (row) => <PortalBadge status={row.status} label={row.status} /> },
    {
      key: "action",
      title: "Action",
      render: (row) => (
        <Link to={`/student/results/${row.id}`} className="ep-btn ep-btn-outline ep-btn-sm">
          View Detail
        </Link>
      ),
    },
  ];

  return (
    <ExamLayout
      title="My Results"
      subtitle="Track your performance, scores, and AI-generated feedback"
      variant="student"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Results" }]}
      action={
        <Link to="/student/upload" className="ep-btn ep-btn-primary">
          Submit New Exam
        </Link>
      }
    >
      <div className="ep-stats-grid">
        <PortalStatCard icon={Award} label="Completed Exams" value={results.length} tone="sky" />
        <PortalStatCard icon={TrendingUp} label="Average Score" value={results.length ? `${avgScore}%` : "—"} tone="emerald" />
      </div>

      <PortalCard title="Performance History" subtitle="All graded submissions">
        <PortalTable
          columns={columns}
          rows={results.map((r) => ({ ...r, id: r._id }))}
          loading={loading}
          emptyTitle="No results yet"
          emptyMessage="Submit an MCQ answer or upload a PDF to see your graded results here."
        />
      </PortalCard>
    </ExamLayout>
  );
};

export default StudentResults;
