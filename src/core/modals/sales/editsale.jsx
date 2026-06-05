import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import Select from "react-select";
import { showErrorToast } from "../../utils/toast";

const statusOptions = [
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
  { value: "partially_returned", label: "Partially Returned" },
];

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const EditSaleModal = ({ sale, onSubmit, loading = false }) => {
  const [customerName, setCustomerName] = useState("");
  const [saleDate, setSaleDate] = useState(new Date());
  const [status, setStatus] = useState("completed");
  const [discountAmount, setDiscountAmount] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [amountReceived, setAmountReceived] = useState("");

  useEffect(() => {
    if (!sale) return;
    setCustomerName(sale.customer_name || "");
    setSaleDate(sale.sale_date ? new Date(sale.sale_date) : new Date());
    setStatus(sale.status || "completed");
    setDiscountAmount(String(sale.discount_amount ?? 0));
    setTaxAmount(String(sale.tax_amount ?? 0));
    setAmountReceived(String(sale.amount_received ?? 0));
  }, [sale]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sale?._id) {
      showErrorToast("Validation Error", "No sale selected.");
      return;
    }

    onSubmit?.({
      customer_name: customerName.trim(),
      sale_date: saleDate,
      status,
      discount_amount: Number(discountAmount || 0),
      tax_amount: Number(taxAmount || 0),
      amount_received: Number(amountReceived || 0),
    });
  };

  return (
    <div className="modal fade" id="edit-sales-new">
      <div className="modal-dialog modal-dialog-centered modal-lg edit-sales-modal">
        <div className="modal-content">
          <div className="page-wrapper-new p-0">
            <div className="content">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>Edit Sale</h4>
                  {sale?.invoice_no && (
                    <p className="mb-0 text-muted">Invoice: {sale.invoice_no}</p>
                  )}
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
                  <div className="row">
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Customer Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          disabled={!sale}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Sale Date</label>
                        <DatePicker
                          selected={saleDate}
                          onChange={setSaleDate}
                          className="filterdatepicker form-control"
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Status</label>
                        <Select
                          className="select"
                          options={statusOptions}
                          value={statusOptions.find((opt) => opt.value === status) || null}
                          onChange={(option) => setStatus(option?.value || "completed")}
                          isDisabled={!sale}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Discount</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Tax</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={taxAmount}
                          onChange={(e) => setTaxAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Amount Received</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={amountReceived}
                          onChange={(e) => setAmountReceived(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <h6 className="mt-3 mb-2">Order Items</h6>
                  <div className="table-responsive">
                    <table className="table datanew">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Discount</th>
                          <th>Tax</th>
                          <th>Line Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(sale?.items || []).length ? (
                          sale.items.map((item, index) => (
                            <tr key={`${item.product_id}-${index}`}>
                              <td>{item.product_name || "—"}</td>
                              <td>{item.quantity}</td>
                              <td>{formatMoney(item.unit_price)}</td>
                              <td>{formatMoney(item.discount)}</td>
                              <td>{formatMoney(item.tax)}</td>
                              <td>{formatMoney(item.line_total)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center">
                              No items
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {sale && (
                    <div className="text-end mb-3">
                      <p className="mb-0">Subtotal: {formatMoney(sale.total_amount)}</p>
                      <p className="mb-0">
                        <strong>Net Total: {formatMoney(sale.net_amount)}</strong>
                      </p>
                    </div>
                  )}

                  <div className="modal-footer-btn">
                    <button
                      type="button"
                      className="btn btn-cancel me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-submit" disabled={loading || !sale}>
                      {loading ? "Saving..." : "Update Sale"}
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

export default EditSaleModal;
