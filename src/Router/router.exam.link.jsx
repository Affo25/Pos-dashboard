import React from "react";
import { Route } from "react-router-dom";
import { all_routes } from "./all_routes";
import ExamDashboard from "../feature-module/exam/ExamDashboard";
import StudentSignup from "../feature-module/exam/student/StudentSignup";
import StudentSubjects from "../feature-module/exam/student/StudentSubjects";
import StudentUpload from "../feature-module/exam/student/StudentUpload";
import StudentResults from "../feature-module/exam/student/StudentResults";
import StudentResultDetail from "../feature-module/exam/student/StudentResultDetail";
import AdminSubjects from "../feature-module/exam/admin/AdminSubjects";
import AdminModelAnswers from "../feature-module/exam/admin/AdminModelAnswers";
import AdminSubmissions from "../feature-module/exam/admin/AdminSubmissions";
import AdminResults from "../feature-module/exam/admin/AdminResults";
import AdminResultDetail from "../feature-module/exam/admin/AdminResultDetail";
import SigninThree from "../feature-module/pages/login/signinThree";
import RegisterThree from "../feature-module/pages/register/registerThree";
import Users from "../feature-module/usermanagement/users";

const routes = all_routes;

export const publicRoutes = [
  { id: 1, path: routes.dashboard, name: "dashboard", element: <ExamDashboard />, route: Route },
  { id: 2, path: routes.studentSubjects, name: "student-subjects", element: <StudentSubjects />, route: Route },
  { id: 3, path: routes.studentUpload, name: "student-upload", element: <StudentUpload />, route: Route },
  { id: 4, path: routes.studentResults, name: "student-results", element: <StudentResults />, route: Route },
  { id: 5, path: routes.studentResultDetail, name: "student-result-detail", element: <StudentResultDetail />, route: Route },
  { id: 6, path: routes.adminSubjects, name: "admin-subjects", element: <AdminSubjects />, route: Route },
  { id: 7, path: routes.adminModelAnswers, name: "admin-model-answers", element: <AdminModelAnswers />, route: Route },
  { id: 8, path: routes.adminSubmissions, name: "admin-submissions", element: <AdminSubmissions />, route: Route },
  { id: 9, path: routes.adminResults, name: "admin-results", element: <AdminResults />, route: Route },
  { id: 10, path: routes.adminResultDetail, name: "admin-result-detail", element: <AdminResultDetail />, route: Route },
  { id: 11, path: routes.users, name: "users", element: <Users />, route: Route },
];

export const pagesRoute = [
  { id: 1, path: routes.signinthree, name: "signin", element: <SigninThree />, route: Route },
  { id: 2, path: routes.registerThree, name: "register", element: <RegisterThree />, route: Route },
  { id: 3, path: routes.studentSignup, name: "student-signup", element: <StudentSignup />, route: Route },
  { id: 4, path: routes.signin, name: "signin-redirect", element: <SigninThree />, route: Route },
];

export const posRoutes = [];
