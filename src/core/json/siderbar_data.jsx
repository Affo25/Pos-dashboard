import React from "react";
import * as Icon from "react-feather";

export const SidebarData = [
  {
    label: "Main",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "Portal Dashboard",
        icon: <Icon.Grid />,
        link: "/",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
  {
    label: "Student",
    studentOnly: true,
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Student Portal",
    submenuItems: [
      {
        label: "Subjects",
        link: "/student/subjects",
        icon: <Icon.Book />,
        showSubRoute: false,
        submenu: false,
        studentOnly: true,
      },
      {
        label: "Submit Exam",
        link: "/student/upload",
        icon: <Icon.Upload />,
        showSubRoute: false,
        submenu: false,
        studentOnly: true,
      },
      {
        label: "My Results",
        link: "/student/results",
        icon: <Icon.Award />,
        showSubRoute: false,
        submenu: false,
        studentOnly: true,
      },
    ],
  },
  {
    label: "Admin",
    adminOnly: true,
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Admin Portal",
    submenuItems: [
      {
        label: "Subjects",
        link: "/admin/subjects",
        icon: <Icon.BookOpen />,
        showSubRoute: false,
        submenu: false,
        adminOnly: true,
      },
      {
        label: "Model Answers",
        link: "/admin/model-answers",
        icon: <Icon.FileText />,
        showSubRoute: false,
        submenu: false,
        adminOnly: true,
      },
      {
        label: "Submissions",
        link: "/admin/submissions",
        icon: <Icon.Inbox />,
        showSubRoute: false,
        submenu: false,
        adminOnly: true,
      },
      {
        label: "Results",
        link: "/admin/results",
        icon: <Icon.BarChart2 />,
        showSubRoute: false,
        submenu: false,
        adminOnly: true,
      },
      {
        label: "Users",
        link: "/users",
        icon: <Icon.Users />,
        showSubRoute: false,
        submenu: false,
        adminOnly: true,
      },
    ],
  },
  {
    label: "Account",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Account",
    submenuItems: [
      {
        label: "Logout",
        link: "/signin-3",
        icon: <Icon.LogOut />,
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
];
