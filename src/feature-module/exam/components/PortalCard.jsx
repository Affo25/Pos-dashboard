import React from "react";

const PortalCard = ({ title, subtitle, action, children, className = "" }) => (
  <div className={`ep-card ${className}`.trim()}>
    {(title || action) && (
      <div className="ep-card-header">
        <div>
          {title && <h3 className="ep-card-title">{title}</h3>}
          {subtitle && <p className="ep-card-subtitle">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div className="ep-card-body">{children}</div>
  </div>
);

export default PortalCard;
