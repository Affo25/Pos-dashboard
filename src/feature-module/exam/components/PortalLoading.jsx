import React from "react";

const PortalLoading = ({ message = "Loading..." }) => (
  <div className="ep-loading">
    <div className="ep-spinner" />
    <span>{message}</span>
  </div>
);

export default PortalLoading;
