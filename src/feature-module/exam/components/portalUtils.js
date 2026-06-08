export const statusBadgeClass = (status = "") => {
  const value = String(status).toLowerCase();
  if (["active", "completed", "auto", "success"].includes(value)) return "success";
  if (["pending", "processing"].includes(value)) return "warning";
  if (["failed", "inactive", "error"].includes(value)) return "danger";
  if (["manually_edited"].includes(value)) return "info";
  return "neutral";
};

export const scoreColor = (percentage = 0) => {
  if (percentage >= 70) return "success";
  if (percentage >= 40) return "warning";
  return "danger";
};

export const isAdminRole = (userType) =>
  ["admin", "superAdmin", "modertor"].includes(userType);

export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const buildSubjectNameMap = (subjects = []) => {
  const map = {};
  subjects.forEach((s) => {
    map[s._id] = s.name;
  });
  return map;
};

export const getSubjectName = (map, subjectId) =>
  map[subjectId] || subjectId || "-";

export const PRIMARY_SUBJECT_NAME = "Business Law";

export const filterPrimarySubjects = (subjects = []) =>
  subjects.filter(
    (subject) =>
      (subject.name || "").toLowerCase() === PRIMARY_SUBJECT_NAME.toLowerCase()
  );
