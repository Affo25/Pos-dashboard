import React from "react";
import { CheckCircle } from "react-feather";
import InvoiceReceiptPreview from "./InvoiceReceiptPreview";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const PosInvoiceModal = ({
  sale,
  settings,
  onPrint,
  onPdf,
  onNextOrder,
}) => {
  if (!sale) return null;

  return (
    <>
      <div
        className="modal fade modal-default"
        id="payment-completed"
        aria-labelledby="payment-completed"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <div className="icon-head">
                <CheckCircle className="feather-40 text-success" />
              </div>
              <h4>Payment Completed</h4>
              <p className="mb-1">Invoice: <strong>{sale.invoice_no}</strong></p>
              <p className="mb-0">
                Total: <strong>{formatMoney(sale.net_amount)}</strong>
              </p>
              <p className="mb-0 mt-2">
                Do you want to preview or print the receipt?
              </p>
              <div className="modal-footer d-sm-flex justify-content-between flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-primary flex-fill"
                  data-bs-toggle="modal"
                  data-bs-target="#print-receipt"
                >
                  View Receipt
                </button>
                <button
                  type="button"
                  className="btn btn-info flex-fill"
                  onClick={onPdf}
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  className="btn btn-warning flex-fill"
                  onClick={onPrint}
                >
                  Print
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-fill"
                  onClick={onNextOrder}
                >
                  Next Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade modal-default"
        id="print-receipt"
        aria-labelledby="print-receipt"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="d-flex justify-content-end p-2 gap-2">
              <button type="button" className="btn btn-sm btn-primary" onClick={onPdf}>
                PDF
              </button>
              <button type="button" className="btn btn-sm btn-info" onClick={onPrint}>
                Print
              </button>
              <button
                type="button"
                className="close p-0"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <InvoiceReceiptPreview sale={sale} settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PosInvoiceModal;
