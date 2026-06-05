import React, { useState } from "react";
import ImageWithBasePath from "../../img/imagewithbasebath";
import { showErrorToast } from "../../utils/toast";

const ImportProductModal = ({ onSubmit, loading = false }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      showErrorToast("Validation Error", "Please select an Excel file to import.");
      return;
    }
    onSubmit?.(file);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  return (
    <div className="modal fade" id="import-product-modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="page-wrapper-new p-0">
            <div className="content">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>Import Products</h4>
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
                  <p className="text-muted small mb-3">
                    Upload an Excel file (.xlsx, .xls). Required columns:{" "}
                    <strong>name</strong>, <strong>batch_number</strong>,{" "}
                    <strong>expiry_date</strong>, <strong>supplier_name</strong>,{" "}
                    <strong>unit_price</strong>, <strong>available_quantity</strong>,{" "}
                    <strong>category</strong> (category name or ID).
                  </p>
                  <div className="col-lg-12">
                    <div className="input-blocks image-upload-down">
                      <label>Upload Excel File</label>
                      <div className="image-upload download">
                        <input
                          type="file"
                          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                          onChange={handleFileChange}
                        />
                        <div className="image-uploads">
                          <ImageWithBasePath
                            src="assets/img/download-img.png"
                            alt="upload"
                          />
                          <h4>
                            {file ? file.name : "Drag and drop a "}
                            {!file && <span>file to upload</span>}
                          </h4>
                        </div>
                      </div>
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
                    <button type="submit" className="btn btn-submit" disabled={loading}>
                      {loading ? "Importing..." : "Import Products"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportProductModal;
