import React from "react";
import { statusBadgeClass } from "./portalUtils";

export const PortalBadge = ({ status, label }) => (
  <span className={`ep-badge ${statusBadgeClass(status || label)}`}>
    {label || status || "-"}
  </span>
);

export default PortalBadge;
