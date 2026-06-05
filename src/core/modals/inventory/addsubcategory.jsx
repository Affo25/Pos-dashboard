import React, { useMemo, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

const AddSubcategory = ({ onSubmit, loading = false }) => {
  const categories = useSelector((state) => state.categotylist_data);
  const [categoryId, setCategoryId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  const categoryOptions = useMemo(
    () =>
      categories.map((item) => ({
        value: item.id,
        label: item.category,
      })),
    [categories]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId || !name.trim()) return;
    await onSubmit({
      category_id: categoryId,
      name: name.trim(),
      description: description.trim(),
      status,
    });
    setCategoryId(null);
    setName("");
    setDescription("");
    setStatus("active");
  };

  return (
    <div>
      <div className="modal fade" id="add-category">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Create Sub Category</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Parent Category</label>
                      <Select
                        className="select"
                        options={categoryOptions}
                        placeholder="Choose Category"
                        value={
                          categoryOptions.find(
                            (item) => item.value === categoryId
                          ) || null
                        }
                        onChange={(option) => setCategoryId(option?.value || null)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3 input-blocks">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="mb-0">
                      <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                        <span className="status-label">Status</span>
                        <input
                          type="checkbox"
                          id="subcategory-add-status"
                          className="check"
                          checked={status === "active"}
                          onChange={(e) =>
                            setStatus(e.target.checked ? "active" : "inactive")
                          }
                        />
                        <label htmlFor="subcategory-add-status" className="checktoggle" />
                      </div>
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-submit"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Subcategory"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubcategory;
