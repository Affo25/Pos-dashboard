import React from "react";

const PortalTabs = ({ tabs, active, onChange }) => (
  <div className="ep-tabs">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        className={`ep-tab ${active === tab.id ? "active" : ""}`}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default PortalTabs;
