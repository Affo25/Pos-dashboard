import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getStudentModelAnswers,
  getStudentSubjects,
  parseMcqFromModel,
  submitStudentMcq,
  uploadStudentPaper,
} from "../../../core/api/examApi";
import { showErrorToast, showSuccessToast } from "../../../core/utils/toast";
import ExamLayout from "../ExamLayout";
import PortalCard from "../components/PortalCard";
import PortalTabs from "../components/PortalTabs";
import PortalTable from "../components/PortalTable";
import PortalBadge from "../components/PortalBadge";
import { buildSubjectNameMap, getSubjectName } from "../components/portalUtils";

const StudentUpload = () => {
  const [tab, setTab] = useState("mcq");
  const [subjects, setSubjects] = useState([]);
  const [modelAnswers, setModelAnswers] = useState([]);
  const [form, setForm] = useState({
    subject_id: "",
    model_answer_id: "",
    title: "",
  });
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStudentSubjects()
      .then((res) => setSubjects(res.data || []))
      .catch((err) => showErrorToast("Error", err.message));
  }, []);

  useEffect(() => {
    if (!form.subject_id) {
      setModelAnswers([]);
      return;
    }
    getStudentModelAnswers(form.subject_id)
      .then((res) => setModelAnswers(res.data || []))
      .catch((err) => showErrorToast("Error", err.message));
  }, [form.subject_id]);

  const selectedModel = useMemo(
    () => modelAnswers.find((m) => m._id === form.model_answer_id),
    [modelAnswers, form.model_answer_id]
  );

  const mcqPreview = useMemo(
    () => parseMcqFromModel(selectedModel),
    [selectedModel]
  );

  const mcqExams = useMemo(
    () => modelAnswers.filter((m) => m.exam_type === "mcq" || m.mcq_answers),
    [modelAnswers]
  );

  useEffect(() => {
    setSelectedAnswer("");
  }, [form.model_answer_id]);

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showErrorToast("Validation", "Please select a PDF file");
      return;
    }
    const fd = new FormData();
    fd.append("subject_id", form.subject_id);
    fd.append("model_answer_id", form.model_answer_id);
    fd.append("title", form.title);
    fd.append("file", file);

    setLoading(true);
    try {
      const res = await uploadStudentPaper(fd);
      if (res.success) {
        showSuccessToast("Uploaded", res.message);
        setForm({ subject_id: "", model_answer_id: "", title: "" });
        setFile(null);
      } else {
        showErrorToast("Upload Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Upload Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMcqSubmit = async (e) => {
    e.preventDefault();
    if (!mcqPreview) {
      showErrorToast("Validation", "Selected exam has no MCQ question.");
      return;
    }
    if (!selectedAnswer) {
      showErrorToast("Validation", "Please select an answer.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitStudentMcq({
        subject_id: form.subject_id,
        model_answer_id: form.model_answer_id,
        title: form.title.trim(),
        question_key: mcqPreview.questionKey,
        answer: selectedAnswer,
      });
      if (res.success) {
        showSuccessToast("Submitted", res.message);
        setForm({ subject_id: "", model_answer_id: "", title: "" });
        setSelectedAnswer("");
      } else {
        showErrorToast("Submit Failed", res.message);
      }
    } catch (err) {
      showErrorToast("Submit Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const optionList = mcqPreview?.options?.length
    ? mcqPreview.options
    : ["A", "B", "C", "D"].map((key) => ({ key, text: `Option ${key}` }));

  const subjectNameById = useMemo(() => buildSubjectNameMap(subjects), [subjects]);
  const selectedSubjectName = getSubjectName(subjectNameById, form.subject_id);

  const examTableRows = (tab === "mcq" ? mcqExams : modelAnswers).map((m) => ({
    ...m,
    id: m._id,
    subject_name: getSubjectName(subjectNameById, m.subject_id),
  }));

  return (
    <ExamLayout
      title="Submit Exam"
      subtitle="Answer MCQ questions online or upload a PDF answer sheet"
      variant="student"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Submit Exam" }]}
      action={
        <Link to="/student/results" className="ep-btn ep-btn-outline">
          View Results
        </Link>
      }
    >
      <PortalTabs
        tabs={[
          { id: "mcq", label: "Single MCQ" },
          { id: "pdf", label: "PDF Upload" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <PortalCard
        title={tab === "mcq" ? "Online MCQ Submission" : "PDF Paper Upload"}
        subtitle={tab === "mcq" ? "Select your exam and answer instantly" : "Upload a scanned exam paper for AI checking"}
      >
        {tab === "mcq" ? (
          <form onSubmit={handleMcqSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="ep-form-label">Subject</label>
                <select
                  className="ep-select"
                  value={form.subject_id}
                  onChange={(e) =>
                    setForm({ ...form, subject_id: e.target.value, model_answer_id: "" })
                  }
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="ep-form-label">MCQ Exam</label>
                <select
                  className="ep-select"
                  value={form.model_answer_id}
                  onChange={(e) =>
                    setForm({ ...form, model_answer_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select MCQ exam</option>
                  {mcqExams.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="ep-form-label">Submission title</label>
                <input
                  className="ep-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Quiz attempt 1"
                  required
                />
              </div>
            </div>

            {mcqPreview ? (
              <div className="ep-mcq-panel">
                <h5 className="mb-3">Question</h5>
                <p style={{ whiteSpace: "pre-line", fontSize: "1rem" }}>{mcqPreview.questionText}</p>
                <label className="ep-form-label mt-3">Select your answer</label>
                <div className="ep-mcq-options">
                  {optionList.map((option) => (
                    <label
                      key={option.key}
                      className={`ep-mcq-option ${selectedAnswer === option.key ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="mcq_answer"
                        value={option.key}
                        checked={selectedAnswer === option.key}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                      />
                      <span>
                        <strong>{option.key}</strong>
                        {option.text ? ` — ${option.text}` : ""}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : form.model_answer_id ? (
              <p className="text-muted mb-3">This exam has no MCQ question to answer online.</p>
            ) : null}

            <button type="submit" className="ep-btn ep-btn-primary mt-3" disabled={loading || !mcqPreview}>
              {loading ? "Submitting..." : "Submit Answer"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePdfSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="ep-form-label">Subject</label>
                <select
                  className="ep-select"
                  value={form.subject_id}
                  onChange={(e) =>
                    setForm({ ...form, subject_id: e.target.value, model_answer_id: "" })
                  }
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="ep-form-label">Exam / Model Answer</label>
                <select
                  className="ep-select"
                  value={form.model_answer_id}
                  onChange={(e) =>
                    setForm({ ...form, model_answer_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select exam</option>
                  {modelAnswers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="ep-form-label">Paper Title</label>
                <input
                  className="ep-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Midterm Math Paper"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="ep-form-label">PDF File</label>
                <input
                  type="file"
                  className="ep-input"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
            </div>
            <button type="submit" className="ep-btn ep-btn-primary" disabled={loading}>
              {loading ? "Uploading..." : "Upload & Check"}
            </button>
          </form>
        )}
      </PortalCard>

      {form.subject_id && (
        <PortalCard
          title="Available Exams"
          subtitle={`Exams for ${selectedSubjectName}`}
        >
          <PortalTable
            columns={[
              { key: "subject_name", title: "Subject" },
              { key: "title", title: "Exam Title" },
              {
                key: "exam_type",
                title: "Type",
                render: (row) => <PortalBadge label={row.exam_type} status="info" />,
              },
              { key: "total_marks", title: "Total Marks" },
            ]}
            rows={examTableRows}
            emptyTitle="No exams available"
            emptyMessage="No exams have been published for this subject yet."
          />
        </PortalCard>
      )}
    </ExamLayout>
  );
};

export default StudentUpload;
