import React from "react";

const PortalStatCard = ({ icon: Icon, label, value, tone = "indigo" }) => (
  <div className="ep-stat-card">
    <div className={`ep-stat-icon ${tone}`}>
      {Icon && <Icon size={22} />}
    </div>
    <div className="ep-stat-label">{label}</div>
    <div className="ep-stat-value">{value}</div>
  </div>
);

export default PortalStatCard;
