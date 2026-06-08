import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Award,
  BarChart2,
  Book,
  BookOpen,
  FileText,
  Inbox,
  Upload,
  Users,
} from "react-feather";
import { all_routes } from "../../Router/all_routes";
import {
  getAdminModelAnswers,
  getAdminResults,
  getAdminSubjects,
  getAdminSubmissions,
  getStudentResults,
  getStudentSubjects,
} from "../../core/api/examApi";
import { getDisplayName, getUserRoleLabel } from "../../core/utils/authHelpers";
import ExamLayout from "./ExamLayout";
import PortalStatCard from "./components/PortalStatCard";
import { isAdminRole } from "./components/portalUtils";

const ExamDashboard = () => {
  const route = all_routes;
  const user = useSelector((state) => state.auth_user);
  const isAdmin = isAdminRole(user?.user_type);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        if (isAdmin) {
          const [subjects, models, submissions, results] = await Promise.all([
            getAdminSubjects(),
            getAdminModelAnswers(),
            getAdminSubmissions(),
            getAdminResults(),
          ]);
          const pending = (submissions.data || []).filter(
            (s) => s.check_status === "pending" || s.check_status === "processing"
          ).length;
          setStats({
            subjects: subjects.data?.length || 0,
            models: models.data?.length || 0,
            submissions: submissions.data?.length || 0,
            results: results.data?.length || 0,
            pending,
          });
        } else {
          const [subjects, results] = await Promise.all([
            getStudentSubjects(),
            getStudentResults(),
          ]);
          const resultList = results.data || [];
          const avg =
            resultList.length > 0
              ? Math.round(
                  resultList.reduce((sum, r) => sum + (r.percentage || 0), 0) /
                    resultList.length
                )
              : 0;
          setStats({
            subjects: subjects.data?.length || 0,
            results: resultList.length,
            avg,
          });
        }
      } catch {
        setStats({});
      }
    };
    load();
  }, [isAdmin]);

  const adminQuickLinks = useMemo(
    () => [
      {
        to: route.adminSubjects,
        icon: BookOpen,
        title: "Subjects",
        text: "Create and manage exam subjects",
        cta: "Manage",
      },
      {
        to: route.adminModelAnswers,
        icon: FileText,
        title: "Model Answers",
        text: "Build MCQ keys and answer sheets",
        cta: "Configure",
      },
      {
        to: route.adminSubmissions,
        icon: Inbox,
        title: "Submissions",
        text: "Review student papers and MCQ attempts",
        cta: "Review",
      },
      {
        to: route.adminResults,
        icon: BarChart2,
        title: "Results",
        text: "Analyze scores and edit marks",
        cta: "Analyze",
      },
      {
        to: route.users,
        icon: Users,
        title: "Users",
        text: "Manage admin and student accounts",
        cta: "Open",
      },
    ],
    [route]
  );

  const studentQuickLinks = useMemo(
    () => [
      {
        to: route.studentSubjects,
        icon: Book,
        title: "Subjects",
        text: "Browse available exams and courses",
        cta: "Browse",
      },
      {
        to: route.studentUpload,
        icon: Upload,
        title: "Submit Exam",
        text: "Answer MCQ online or upload PDF",
        cta: "Start",
      },
      {
        to: route.studentResults,
        icon: Award,
        title: "My Results",
        text: "Track scores and AI feedback",
        cta: "View",
      },
    ],
    [route]
  );

  return (
    <ExamLayout
      title="Exam Intelligence Portal"
      subtitle={`Welcome back, ${getDisplayName(user)} — ${getUserRoleLabel(user)} dashboard`}
      variant={isAdmin ? "admin" : "student"}
    >
      <div className="ep-stats-grid">
        {isAdmin ? (
          <>
            <PortalStatCard icon={BookOpen} label="Subjects" value={stats.subjects ?? "—"} tone="indigo" />
            <PortalStatCard icon={FileText} label="Model Answers" value={stats.models ?? "—"} tone="violet" />
            <PortalStatCard icon={Inbox} label="Submissions" value={stats.submissions ?? "—"} tone="sky" />
            <PortalStatCard icon={BarChart2} label="Graded Results" value={stats.results ?? "—"} tone="emerald" />
            <PortalStatCard icon={Inbox} label="Pending Checks" value={stats.pending ?? "—"} tone="amber" />
          </>
        ) : (
          <>
            <PortalStatCard icon={Book} label="Available Subjects" value={stats.subjects ?? "—"} tone="sky" />
            <PortalStatCard icon={Award} label="Completed Exams" value={stats.results ?? "—"} tone="indigo" />
            <PortalStatCard icon={BarChart2} label="Average Score" value={stats.avg != null ? `${stats.avg}%` : "—"} tone="emerald" />
          </>
        )}
      </div>

      <h4 className="mb-3" style={{ fontWeight: 700, color: "#0f172a" }}>
        {isAdmin ? "Administration" : "Student Workspace"}
      </h4>
      <div className="ep-quick-grid">
        {(isAdmin ? adminQuickLinks : studentQuickLinks).map((item) => (
          <Link key={item.to} to={item.to} className="ep-quick-card">
            <div className="ep-quick-icon">
              <item.icon size={22} />
            </div>
            <h5>{item.title}</h5>
            <p>{item.text}</p>
            <span className="ep-btn ep-btn-outline ep-btn-sm">{item.cta}</span>
          </Link>
        ))}
      </div>
    </ExamLayout>
  );
};

export default ExamDashboard;
