import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getStudentResult, getStudentSubjects } from "../../../core/api/examApi";
import { showErrorToast } from "../../../core/utils/toast";
import ExamLayout from "../ExamLayout";
import PortalCard from "../components/PortalCard";
import PortalLoading from "../components/PortalLoading";
import PortalBadge from "../components/PortalBadge";
import { buildSubjectNameMap, getSubjectName, scoreColor } from "../components/portalUtils";

const StudentResultDetail = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudentResult(id), getStudentSubjects()])
      .then(([resultRes, subjectsRes]) => {
        setResult(resultRes.data);
        setSubjects(subjectsRes.data || []);
      })
      .catch((err) => showErrorToast("Error", err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const subjectNameById = useMemo(() => buildSubjectNameMap(subjects), [subjects]);
  const subjectName = result ? getSubjectName(subjectNameById, result.subject_id) : "-";

  if (loading) {
    return (
      <ExamLayout title="Result Detail" variant="student">
        <PortalLoading />
      </ExamLayout>
    );
  }

  if (!result) {
    return (
      <ExamLayout title="Result Detail" variant="student">
        <p>Result not found.</p>
      </ExamLayout>
    );
  }

  return (
    <ExamLayout
      title="Exam Result"
      subtitle={`${subjectName} — ${result.total_score}/${result.total_marks} (${result.percentage}%)`}
      variant="student"
      breadcrumbs={[
        { label: "Dashboard", to: "/" },
        { label: "Results", to: "/student/results" },
        { label: "Detail" },
      ]}
      action={
        <Link to="/student/results" className="ep-btn ep-btn-outline">
          Back to Results
        </Link>
      }
    >
      <div className="ep-result-grid">
        <PortalCard title="Subject">
          <h4 className="mb-0">{subjectName}</h4>
        </PortalCard>
        <PortalCard title="MCQ Score">
          <h2 className="mb-0">{result.mcq_score}</h2>
        </PortalCard>
        <PortalCard title="Theory Score">
          <h2 className="mb-0">{result.theory_score}</h2>
        </PortalCard>
        <PortalCard title="Overall Performance">
          <div
            className="ep-score-ring"
            style={{ "--pct": result.percentage }}
          >
            <span>{result.percentage}%</span>
          </div>
          <PortalBadge status={scoreColor(result.percentage)} label={result.status} />
        </PortalCard>
      </div>

      <PortalCard title="AI Feedback" subtitle="Personalized performance summary">
        <p className="mb-0">{result.overall_feedback || "No feedback available."}</p>
      </PortalCard>

      {result.mcq_results?.length > 0 && (
        <PortalCard title="MCQ Breakdown" subtitle="Question-by-question review">
          <div className="ep-table-wrap">
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Your Answer</th>
                  <th>Correct</th>
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

      {result.theory_results?.length > 0 && (
        <PortalCard title="Theory Feedback" subtitle="Detailed AI evaluation per question">
          {result.theory_results.map((t, i) => (
            <div key={i} className="ep-mcq-panel mb-3">
              <h6>Q{t.question_no}: {t.question}</h6>
              <p className="mb-1"><strong>Marks:</strong> {t.marks_awarded}/{t.max_marks}</p>
              <p className="mb-1"><strong>Your Answer:</strong> {t.student_answer || "-"}</p>
              <p className="mb-0"><strong>Feedback:</strong> {t.ai_feedback}</p>
            </div>
          ))}
        </PortalCard>
      )}
    </ExamLayout>
  );
};

export default StudentResultDetail;
