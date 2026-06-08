import React from "react";
import { Inbox } from "react-feather";

const PortalEmpty = ({ icon: Icon = Inbox, title = "No data yet", message }) => (
  <div className="ep-empty">
    <div className="ep-empty-icon">
      <Icon size={24} />
    </div>
    <h5>{title}</h5>
    {message && <p className="mb-0">{message}</p>}
  </div>
);

export default PortalEmpty;
