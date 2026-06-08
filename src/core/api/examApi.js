import { apiRequest } from "./apiClient";

// ── Auth ──────────────────────────────────────────────────────
export const login = (email, password) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const studentSignup = (data) =>
  apiRequest("/exam/student/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ── Student ───────────────────────────────────────────────────
export const getStudentSubjects = () => apiRequest("/exam/student/subjects");

export const getStudentModelAnswers = (subjectId) =>
  apiRequest(`/exam/student/model-answers/${subjectId}`);

export const uploadStudentPaper = (formData) =>
  apiRequest("/exam/student/upload", {
    method: "POST",
    body: formData,
  });

export const submitStudentMcq = (data) =>
  apiRequest("/exam/student/submit-mcq", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const parseMcqFromModel = (model) => {
  if (!model?.mcq_answers || !Object.keys(model.mcq_answers).length) {
    return null;
  }

  const questionKey = Object.keys(model.mcq_answers).sort()[0];
  const text = model.model_answer_text || "";
  const lines = text.split("\n");
  const questionLines = [];
  const options = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^Q\d+\s*[:\-.]/i.test(trimmed)) break;
    questionLines.push(line);
    const optionMatch = trimmed.match(/^([A-E])\)\s*(.+)$/i);
    if (optionMatch) {
      options.push({
        key: optionMatch[1].toUpperCase(),
        text: optionMatch[2],
      });
    }
  }

  return {
    questionKey,
    questionText: questionLines.join("\n").trim(),
    options,
  };
};

export const getStudentResults = () => apiRequest("/exam/student/results");

export const getStudentResult = (resultId) =>
  apiRequest(`/exam/student/results/${resultId}`);

// ── Admin ─────────────────────────────────────────────────────
export const getAdminSubjects = () => apiRequest("/exam/admin/subjects");

export const createSubject = (data) =>
  apiRequest("/exam/admin/subjects", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getAdminModelAnswers = (subjectId) => {
  const query = subjectId ? `?subject_id=${subjectId}` : "";
  return apiRequest(`/exam/admin/model-answers${query}`);
};

export const createModelAnswer = (data) =>
  apiRequest("/exam/admin/model-answers", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getAdminModelAnswer = (answerId) =>
  apiRequest(`/exam/admin/model-answers/${answerId}`);

export const updateModelAnswer = (answerId, data) =>
  apiRequest(`/exam/admin/model-answers/${answerId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteModelAnswer = (answerId) =>
  apiRequest(`/exam/admin/model-answers/${answerId}`, {
    method: "DELETE",
  });

export const uploadModelAnswerPdf = (formData) =>
  apiRequest("/exam/admin/model-answers/upload-pdf", {
    method: "POST",
    body: formData,
  });

export const getAdminSubmissions = () => apiRequest("/exam/admin/submissions");

export const getAdminResults = () => apiRequest("/exam/admin/results");

export const getAdminResult = (resultId) =>
  apiRequest(`/exam/admin/results/${resultId}`);

export const editResult = (resultId, data) =>
  apiRequest(`/exam/admin/results/${resultId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteResult = (resultId) =>
  apiRequest(`/exam/admin/results/${resultId}`, {
    method: "DELETE",
  });

export const recheckSubmission = (submissionId) =>
  apiRequest(`/exam/admin/check/${submissionId}`, { method: "POST" });
