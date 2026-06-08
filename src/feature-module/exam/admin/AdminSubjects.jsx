import React, { useEffect, useState } from "react";
import { createSubject, getAdminSubjects } from "../../../core/api/examApi";
import { showErrorToast, showSuccessToast } from "../../../core/utils/toast";
import ExamLayout from "../ExamLayout";
import PortalCard from "../components/PortalCard";
import PortalTable from "../components/PortalTable";
import PortalBadge from "../components/PortalBadge";

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const load = () => {
    setTableLoading(true);
    getAdminSubjects()
      .then((res) => setSubjects(res.data || []))
      .catch((err) => showErrorToast("Error", err.message))
      .finally(() => setTableLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createSubject(form);
      if (res.success) {
        showSuccessToast("Created", res.message);
        setForm({ name: "", code: "", description: "" });
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

  const columns = [
    { key: "code", title: "Code" },
    { key: "name", title: "Name" },
    { key: "description", title: "Description", render: (row) => row.description || "-" },
    { key: "status", title: "Status", render: (row) => <PortalBadge status={row.status} label={row.status} /> },
  ];

  return (
    <ExamLayout
      title="Subject Management"
      subtitle="Add Business Law topics such as Contract Law, Sale of Goods Act, Company Law"
      variant="admin"
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Subjects" }]}
    >
      <PortalCard title="Add New Subject" subtitle="Create a subject students can enroll in">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label className="ep-form-label">Subject name</label>
            <input className="ep-input" placeholder="Sale of Goods Act – MCQ" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="col-md-3">
            <label className="ep-form-label">Code</label>
            <input className="ep-input" placeholder="BLAW-SOG-01" value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })} required />
          </div>
          <div className="col-md-3">
            <label className="ep-form-label">Description</label>
            <input className="ep-input" placeholder="Optional description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="ep-btn ep-btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Add Subject"}
            </button>
          </div>
        </form>
      </PortalCard>

      <PortalCard title="All Subjects" subtitle={`${subjects.length} subject(s) configured`}>
        <PortalTable
          columns={columns}
          rows={subjects.map((s) => ({ ...s, id: s._id }))}
          loading={tableLoading}
          emptyTitle="No subjects yet"
          emptyMessage="Create your first subject to start building exams."
        />
      </PortalCard>
    </ExamLayout>
  );
};

export default AdminSubjects;
