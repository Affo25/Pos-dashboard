import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDisplayName, getUserRoleLabel } from "../../core/utils/authHelpers";
import { isAdminRole } from "./components/portalUtils";
import "./exam-portal.css";

const ExamLayout = ({
  title,
  subtitle,
  children,
  action,
  breadcrumbs = [],
  variant,
}) => {
  const user = useSelector((state) => state.auth_user);
  const portalVariant = variant || (isAdminRole(user?.user_type) ? "admin" : "student");

  return (
    <div className="page-wrapper exam-portal">
      <div className="content">
        {breadcrumbs.length > 0 && (
          <nav className="ep-breadcrumb">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.label}>
                {index > 0 && <span>/</span>}
                {item.to ? (
                  <Link to={item.to}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className={`ep-hero ${portalVariant}`}>
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
            <div>
              <h1 className="ep-hero-title">{title}</h1>
              {subtitle && <p className="ep-hero-subtitle">{subtitle}</p>}
              <div className="ep-hero-meta">
                <span className="ep-pill">{getDisplayName(user)}</span>
                <span className="ep-pill">{getUserRoleLabel(user)} Portal</span>
                <span className="ep-pill">
                  {portalVariant === "admin" ? "Management Console" : "Student Workspace"}
                </span>
              </div>
            </div>
            {action && <div>{action}</div>}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default ExamLayout;
