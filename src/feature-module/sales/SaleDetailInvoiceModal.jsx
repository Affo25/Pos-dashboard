import React from "react";
import InvoiceReceiptPreview from "./InvoiceReceiptPreview";

const SaleDetailInvoiceModal = ({ sale, settings, onPdf, onPrint }) => (
  <div className="modal fade" id="sales-details-new">
    <div className="modal-dialog modal-dialog-centered modal-lg sales-details-modal">
      <div className="modal-content">
        <div className="modal-header border-0 pb-0">
          <div className="page-title">
            <h4>Sale Detail: {sale?.invoice_no || "—"}</h4>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={onPdf}
              disabled={!sale}
            >
              PDF
            </button>
            <button
              type="button"
              className="btn btn-sm btn-info"
              onClick={onPrint}
              disabled={!sale}
            >
              Print
            </button>
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
        <div className="modal-body">
          <InvoiceReceiptPreview sale={sale} settings={settings} />
        </div>
      </div>
    </div>
  </div>
);

export default SaleDetailInvoiceModal;
