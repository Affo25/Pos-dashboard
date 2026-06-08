import React, { useEffect, useMemo, useState } from "react";
import {
  createModelAnswer,
  deleteModelAnswer,
  getAdminModelAnswers,
  getAdminSubjects,
  parseMcqFromModel,
  updateModelAnswer,
  uploadModelAnswerPdf,
} from "../../../core/api/examApi";
import { showErrorToast, showSuccessToast } from "../../../core/utils/toast";
import ExamLayout from "../ExamLayout";
import PortalCard from "../components/PortalCard";
import PortalTabs from "../components/PortalTabs";
import PortalTable from "../components/PortalTable";
import PortalBadge from "../components/PortalBadge";
import { buildSubjectNameMap, getSubjectName } from "../components/portalUtils";

const emptyMcqForm = {
  subject_id: "",
  title: "",
  question_no: 1,
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
  marks: 1,
};

const buildMcqTextFromForm = (mcqForm) => {
  const qNo = Number(mcqForm.question_no) || 1;
  const key = `Q${qNo}`;
  const lines = [
    `Question ${qNo}: ${mcqForm.question_text.trim()}`,
    mcqForm.option_a ? `A) ${mcqForm.option_a.trim()}` : "",
    mcqForm.option_b ? `B) ${mcqForm.option_b.trim()}` : "",
    mcqForm.option_c ? `C) ${mcqForm.option_c.trim()}` : "",
    mcqForm.option_d ? `D) ${mcqForm.option_d.trim()}` : "",
    "",
    `${key}: ${mcqForm.correct_answer.trim()}`,
  ].filter(Boolean);
  return { key, text: lines.join("\n") };
};

const mapAnswerToMcqForm = (answer) => {
  const parsed = parseMcqFromModel(answer);
  const options = parsed?.options || [];
  return {
    subject_id: answer.subject_id || "",
    title: answer.title || "",
    question_no: parsed?.questionKey?.replace(/^Q/i, "") || 1,
    question_text:
      parsed?.questionText?.replace(/^Question\s+\d+:\s*/i, "") || "",
    option_a: options.find((o) => o.key === "A")?.text || "",
    option_b: options.find((o) => o.key === "B")?.text || "",
    option_c: options.find((o) => o.key === "C")?.text || "",
    option_d: options.find((o) => o.key === "D")?.text || "",
    correct_answer: Object.values(answer.mcq_answers || {})[0] || "A",
    marks: answer.total_marks || 1,
  };
};

const getQuestionPreview = (row) => {
  const parsed = parseMcqFromModel(row);
  if (parsed?.questionText) {
    const text = parsed.questionText.replace(/^Question\s+\d+:\s*/i, "");
    return text.length > 60 ? `${text.slice(0, 60)}...` : text;
  }
  if (row.theory_questions?.length) {
    const q = row.theory_questions[0].question;
    return q.length > 60 ? `${q.slice(0, 60)}...` : q;
  }
  const firstLine = (row.model_answer_text || "").split("\n")[0] || "-";
  return firstLine.length > 60 ? `${firstLine.slice(0, 60)}...` : firstLine;
};

const AdminModelAnswers = () => {
  const [subjects, setSubjects] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState("single");
  const [form, setForm] = useState({
    subject_id: "",
    title: "",
    exam_type: "mixed",
    model_answer_text: "Q1: A\nQ2: B\nQ3: C",
    total_marks: 100,
    mcq_marks: 40,
    theory_marks: 60,
    theory_questions: JSON.stringify(
      [
        {
          question_no: 1,
          question: "Explain photosynthesis",
          model_answer: "Process by which plants make food using sunlight",
          marks: 10,
        },
      ],
      null,
      2
    ),
  });
  const [mcqForm, setMcqForm] = useState(emptyMcqForm);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState(emptyMcqForm);

  const load = () => {
    getAdminSubjects().then((r) => setSubjects(r.data || []));
    getAdminModelAnswers().then((r) => setAnswers(r.data || []));
  };

  useEffect(() => {
    load();
  }, []);

  const subjectNameById = useMemo(() => buildSubjectNameMap(subjects), [subjects]);

  const handleSingleMcqSubmit = async (e) => {
    e.preventDefault();
    if (!mcqForm.subject_id || !mcqForm.title.trim() || !mcqForm.question_text.trim()) {
      showErrorToast("Validation", "Subject, title and question are required.");
      return;
    }

    const { key, text } = buildMcqTextFromForm(mcqForm);
    const answer = mcqForm.correct_answer.trim().toUpperCase();
    const marks = Number(mcqForm.marks) || 1;

    setLoading(true);
    try {
      const res = await createModelAnswer({
        subject_id: mcqForm.subject_id,
        title: mcqForm.title.trim(),
        exam_type: "mcq",
        model_answer_text: text,
        mcq_answers: { [key]: answer },
        total_marks: marks,
        mcq_marks: marks,
        theory_marks: 0,
        theory_questions: [],
      });
      if (res.success) {
        showSuccessToast("Saved", "MCQ saved successfully.");
        setMcqForm({ ...emptyMcqForm, subject_id: mcqForm.subject_id });
        setShowCreate(false);
        load();
      } else {
        showErrorToast("Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let theory_questions = [];
      try {
        theory_questions = JSON.parse(form.theory_questions);
      } catch {
        showErrorToast("Invalid JSON", "Theory questions must be valid JSON");
        setLoading(false);
        return;
      }
      const res = await createModelAnswer({
        subject_id: form.subject_id,
        title: form.title,
        exam_type: form.exam_type,
        model_answer_text: form.model_answer_text,
        total_marks: Number(form.total_marks),
        mcq_marks: Number(form.mcq_marks),
        theory_marks: Number(form.theory_marks),
        theory_questions,
      });
      if (res.success) {
        showSuccessToast("Saved", res.message);
        setShowCreate(false);
        load();
      } else {
        showErrorToast("Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return showErrorToast("Validation", "Select a PDF");
    const fd = new FormData();
    fd.append("subject_id", form.subject_id);
    fd.append("title", form.title);
    fd.append("exam_type", form.exam_type);
    fd.append("total_marks", form.total_marks);
    fd.append("mcq_marks", form.mcq_marks);
    fd.append("theory_marks", form.theory_marks);
    fd.append("file", pdfFile);
    setLoading(true);
    try {
      const res = await uploadModelAnswerPdf(fd);
      if (res.success) {
        showSuccessToast("Uploaded", res.message);
        setShowCreate(false);
        load();
      } else {
        showErrorToast("Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (row) => {
    setEditItem(row);
    setEditForm(mapAnswerToMcqForm(row));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editItem) return;

    const { key, text } = buildMcqTextFromForm(editForm);
    const answer = editForm.correct_answer.trim().toUpperCase();
    const marks = Number(editForm.marks) || 1;

    setLoading(true);
    try {
      const res = await updateModelAnswer(editItem._id, {
        subject_id: editForm.subject_id,
        title: editForm.title.trim(),
        exam_type: "mcq",
        model_answer_text: text,
        mcq_answers: { [key]: answer },
        total_marks: marks,
        mcq_marks: marks,
        theory_marks: 0,
        theory_questions: [],
      });
      if (res.success) {
        showSuccessToast("Updated", res.message);
        setEditItem(null);
        load();
      } else {
        showErrorToast("Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    try {
      const res = await deleteModelAnswer(row._id);
      if (res.success) {
        showSuccessToast("Deleted", res.message);
        load();
      } else {
        showErrorToast("Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Failed", err.message);
    }
  };

  const viewParsed = viewItem ? parseMcqFromModel(viewItem) : null;

  return (
    <ExamLayout
      title="Model Answer Builder"
      subtitle="Create MCQ keys, theory rubrics, and PDF answer sheets"
      variant="admin"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Model Answers" }]}
      action={
        <button
          type="button"
          className="ep-btn ep-btn-primary"
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? "Hide Create Form" : "Add Model Answer"}
        </button>
      }
    >
      {showCreate && (
        <>
          <PortalTabs
            tabs={[
              { id: "single", label: "Single MCQ" },
              { id: "text", label: "Text / JSON" },
              { id: "pdf", label: "PDF Upload" },
            ]}
            active={tab}
            onChange={setTab}
          />

          <PortalCard
            title={
              tab === "single"
                ? "Create Single MCQ"
                : tab === "text"
                  ? "Advanced Text Entry"
                  : "Upload Answer PDF"
            }
            subtitle="Configure how student submissions will be auto-graded"
          >
            {tab === "single" ? (
              <form onSubmit={handleSingleMcqSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="ep-form-label">Subject</label>
                    <select
                      className="ep-select"
                      value={mcqForm.subject_id}
                      onChange={(e) =>
                        setMcqForm({ ...mcqForm, subject_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="ep-form-label">Exam title</label>
                    <input
                      className="ep-input"
                      value={mcqForm.title}
                      onChange={(e) =>
                        setMcqForm({ ...mcqForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="ep-form-label">Question No.</label>
                    <input
                      type="number"
                      min="1"
                      className="ep-input"
                      value={mcqForm.question_no}
                      onChange={(e) =>
                        setMcqForm({ ...mcqForm, question_no: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="ep-form-label">Marks</label>
                    <input
                      type="number"
                      min="1"
                      className="ep-input"
                      value={mcqForm.marks}
                      onChange={(e) =>
                        setMcqForm({ ...mcqForm, marks: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="ep-form-label">Question</label>
                  <textarea
                    className="ep-textarea"
                    rows={3}
                    value={mcqForm.question_text}
                    onChange={(e) =>
                      setMcqForm({ ...mcqForm, question_text: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="row g-3 mb-3">
                  {["a", "b", "c", "d"].map((opt) => (
                    <div className="col-md-3" key={opt}>
                      <label className="ep-form-label">Option {opt.toUpperCase()}</label>
                      <input
                        className="ep-input"
                        value={mcqForm[`option_${opt}`]}
                        onChange={(e) =>
                          setMcqForm({ ...mcqForm, [`option_${opt}`]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-3">
                    <label className="ep-form-label">Correct answer</label>
                    <select
                      className="ep-select"
                      value={mcqForm.correct_answer}
                      onChange={(e) =>
                        setMcqForm({ ...mcqForm, correct_answer: e.target.value })
                      }
                    >
                      {["A", "B", "C", "D"].map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-9">
                    <label className="ep-form-label">Preview</label>
                    <div className="ep-preview-box">
                      {mcqForm.question_text
                        ? buildMcqTextFromForm(mcqForm).text
                        : "Fill the form to preview..."}
                    </div>
                  </div>
                </div>
                <button type="submit" className="ep-btn ep-btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save MCQ"}
                </button>
              </form>
            ) : tab === "text" ? (
              <form onSubmit={handleTextSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <select
                      className="ep-select"
                      value={form.subject_id}
                      onChange={(e) =>
                        setForm({ ...form, subject_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      className="ep-input"
                      placeholder="Exam title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <select
                      className="ep-select"
                      value={form.exam_type}
                      onChange={(e) =>
                        setForm({ ...form, exam_type: e.target.value })
                      }
                    >
                      <option value="mixed">Mixed</option>
                      <option value="mcq">MCQ</option>
                      <option value="theory">Theory</option>
                    </select>
                  </div>
                </div>
                <textarea
                  className="ep-textarea mb-3"
                  rows={4}
                  value={form.model_answer_text}
                  onChange={(e) =>
                    setForm({ ...form, model_answer_text: e.target.value })
                  }
                />
                <textarea
                  className="ep-textarea mb-3"
                  rows={6}
                  value={form.theory_questions}
                  onChange={(e) =>
                    setForm({ ...form, theory_questions: e.target.value })
                  }
                />
                <button type="submit" className="ep-btn ep-btn-primary" disabled={loading}>
                  Save Model Answer
                </button>
              </form>
            ) : (
              <form onSubmit={handlePdfSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <select
                      className="ep-select"
                      value={form.subject_id}
                      onChange={(e) =>
                        setForm({ ...form, subject_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      className="ep-input"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="file"
                      className="ep-input"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="ep-btn ep-btn-primary mt-3" disabled={loading}>
                  Upload PDF
                </button>
              </form>
            )}
          </PortalCard>
        </>
      )}

      <PortalCard title="Saved Model Answers" subtitle={`${answers.length} answer key(s)`}>
        <PortalTable
          columns={[
            { key: "title", title: "Title" },
            {
              key: "subject_id",
              title: "Subject",
              render: (row) => getSubjectName(subjectNameById, row.subject_id),
            },
            {
              key: "question",
              title: "Question",
              render: (row) => getQuestionPreview(row),
            },
            {
              key: "exam_type",
              title: "Type",
              render: (row) => <PortalBadge label={row.exam_type} status="info" />,
            },
            {
              key: "mcq_answers",
              title: "Answer Key",
              render: (row) =>
                row.mcq_answers
                  ? Object.entries(row.mcq_answers)
                      .map(([q, ans]) => `${q}: ${ans}`)
                      .join(", ")
                  : "-",
            },
            { key: "total_marks", title: "Marks" },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="ep-actions">
                  <button
                    type="button"
                    className="ep-btn ep-btn-outline ep-btn-sm"
                    onClick={() => setViewItem(row)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="ep-btn ep-btn-outline ep-btn-sm"
                    onClick={() => handleEditOpen(row)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="ep-btn ep-btn-danger ep-btn-sm"
                    onClick={() => handleDelete(row)}
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={answers.map((a) => ({ ...a, id: a._id }))}
          emptyTitle="No model answers yet"
          emptyMessage='Click "Add Model Answer" to create your first answer key.'
        />
      </PortalCard>

      {viewItem && (
        <div className="ep-modal-backdrop" onClick={() => setViewItem(null)}>
          <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h3 className="ep-modal-title">Answer Detail</h3>
              <button
                type="button"
                className="ep-modal-close"
                onClick={() => setViewItem(null)}
              >
                ×
              </button>
            </div>
            <div className="ep-modal-body">
              <div className="ep-detail-row">
                <div className="ep-detail-label">Title</div>
                <div className="ep-detail-value">{viewItem.title}</div>
              </div>
              <div className="ep-detail-row">
                <div className="ep-detail-label">Subject</div>
                <div className="ep-detail-value">
                  {getSubjectName(subjectNameById, viewItem.subject_id)}
                </div>
              </div>
              <div className="ep-detail-row">
                <div className="ep-detail-label">Type</div>
                <div className="ep-detail-value">{viewItem.exam_type}</div>
              </div>
              <div className="ep-detail-row">
                <div className="ep-detail-label">Question</div>
                <div className="ep-detail-value">
                  {viewParsed?.questionText || viewItem.model_answer_text || "-"}
                </div>
              </div>
              {viewParsed?.options?.length > 0 && (
                <div className="ep-detail-row">
                  <div className="ep-detail-label">Options</div>
                  <div className="ep-detail-value">
                    {viewParsed.options
                      .map((o) => `${o.key}) ${o.text}`)
                      .join("\n")}
                  </div>
                </div>
              )}
              <div className="ep-detail-row">
                <div className="ep-detail-label">Correct Answer</div>
                <div className="ep-detail-value">
                  {viewItem.mcq_answers
                    ? Object.entries(viewItem.mcq_answers)
                        .map(([q, ans]) => `${q}: ${ans}`)
                        .join(", ")
                    : "-"}
                </div>
              </div>
              <div className="ep-detail-row">
                <div className="ep-detail-label">Total Marks</div>
                <div className="ep-detail-value">{viewItem.total_marks}</div>
              </div>
              {viewItem.theory_questions?.length > 0 && (
                <div className="ep-detail-row">
                  <div className="ep-detail-label">Theory</div>
                  <div className="ep-detail-value">
                    {viewItem.theory_questions
                      .map(
                        (t) =>
                          `Q${t.question_no}: ${t.question}\nAnswer: ${t.model_answer}`
                      )
                      .join("\n\n")}
                  </div>
                </div>
              )}
              <div className="ep-detail-row">
                <div className="ep-detail-label">Full Text</div>
                <div className="ep-detail-value">{viewItem.model_answer_text || "-"}</div>
              </div>
            </div>
            <div className="ep-modal-footer">
              <button
                type="button"
                className="ep-btn ep-btn-outline"
                onClick={() => setViewItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editItem && (
        <div className="ep-modal-backdrop" onClick={() => setEditItem(null)}>
          <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h3 className="ep-modal-title">Edit Model Answer</h3>
              <button
                type="button"
                className="ep-modal-close"
                onClick={() => setEditItem(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="ep-modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="ep-form-label">Subject</label>
                    <select
                      className="ep-select"
                      value={editForm.subject_id}
                      onChange={(e) =>
                        setEditForm({ ...editForm, subject_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="ep-form-label">Exam title</label>
                    <input
                      className="ep-input"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="ep-form-label">Question</label>
                  <textarea
                    className="ep-textarea"
                    rows={3}
                    value={editForm.question_text}
                    onChange={(e) =>
                      setEditForm({ ...editForm, question_text: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="row g-3 mb-3">
                  {["a", "b", "c", "d"].map((opt) => (
                    <div className="col-md-3" key={opt}>
                      <label className="ep-form-label">Option {opt.toUpperCase()}</label>
                      <input
                        className="ep-input"
                        value={editForm[`option_${opt}`]}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            [`option_${opt}`]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="ep-form-label">Correct answer</label>
                    <select
                      className="ep-select"
                      value={editForm.correct_answer}
                      onChange={(e) =>
                        setEditForm({ ...editForm, correct_answer: e.target.value })
                      }
                    >
                      {["A", "B", "C", "D"].map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="ep-form-label">Question No.</label>
                    <input
                      type="number"
                      min="1"
                      className="ep-input"
                      value={editForm.question_no}
                      onChange={(e) =>
                        setEditForm({ ...editForm, question_no: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="ep-form-label">Marks</label>
                    <input
                      type="number"
                      min="1"
                      className="ep-input"
                      value={editForm.marks}
                      onChange={(e) =>
                        setEditForm({ ...editForm, marks: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="ep-modal-footer">
                <button
                  type="button"
                  className="ep-btn ep-btn-outline"
                  onClick={() => setEditItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="ep-btn ep-btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ExamLayout>
  );
};

export default AdminModelAnswers;
