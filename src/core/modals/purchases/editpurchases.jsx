import { DatePicker } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { showErrorToast } from "../../utils/toast";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const EditPurchases = ({ order, onSubmit, loading = false }) => {
  const suppliers = useSelector((state) => state.supplierdata);

  const [supplierId, setSupplierId] = useState(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState("pending");
  const [amountPaid, setAmountPaid] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([]);

  const supplierOptions = useMemo(
    () =>
      suppliers.map((item) => ({
        value: item.id,
        label: item.supplierName,
      })),
    [suppliers]
  );

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "received", label: "Received" },
    { value: "cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    if (!order) return;

    const supplierValue = order.supplier_id?._id || order.supplier_id || null;
    setSupplierId(supplierValue);
    setOrderNumber(order.order_number || "");
    setStatus(order.status || "pending");
    setAmountPaid(String(order.amount_paid ?? 0));
    setSelectedDate(order.order_date ? new Date(order.order_date) : new Date());
    setItems(
      (order.items || []).map((item) => ({
        product_id: item.product_id?._id || item.product_id,
        product_name:
          item.product_id?.name || item.product_name || "Product",
        quantity: String(item.quantity ?? ""),
        price: String(item.price ?? ""),
      }))
    );
  }, [order]);

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order?._id || !supplierId) {
      showErrorToast("Validation Error", "Supplier is required.");
      return;
    }

    const parsedItems = items
      .map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity),
        price: Number(item.price),
      }))
      .filter((item) => item.product_id && item.quantity > 0);

    if (!parsedItems.length) {
      showErrorToast("Validation Error", "At least one valid item is required.");
      return;
    }

    await onSubmit?.({
      supplier_id: supplierId,
      order_number: orderNumber.trim() || undefined,
      order_date: selectedDate,
      items: parsedItems,
      amount_paid: Number(amountPaid || 0),
      status,
    });
  };

  return (
    <div className="modal fade" id="edit-units">
      <div className="modal-dialog purchase modal-dialog-centered stock-adjust-modal modal-lg">
        <div className="modal-content">
          <div className="page-wrapper-new p-0">
            <div className="content">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>Edit Purchase</h4>
                  {order?.order_number && (
                    <p className="mb-0 text-muted">Reference: {order.order_number}</p>
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
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="input-blocks add-product">
                        <label>Supplier Name</label>
                        <Select
                          options={supplierOptions}
                          className="select"
                          placeholder="Choose"
                          value={
                            supplierOptions.find(
                              (item) => item.value === supplierId
                            ) || null
                          }
                          onChange={(option) =>
                            setSupplierId(option?.value || null)
                          }
                          isDisabled={!order}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="input-blocks">
                        <label>Purchase Date</label>
                        <DatePicker
                          selected={selectedDate}
                          onChange={setSelectedDate}
                          className="filterdatepicker form-control"
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="input-blocks">
                        <label>Reference No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="input-blocks">
                        <label>Status</label>
                        <Select
                          options={statusOptions}
                          className="select"
                          value={
                            statusOptions.find((item) => item.value === status) ||
                            null
                          }
                          onChange={(option) =>
                            setStatus(option?.value || "pending")
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12">
                      <div className="input-blocks">
                        <label>Amount Paid</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(e.target.value)}
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
                          <th>Price</th>
                          <th>Line Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length ? (
                          items.map((item, index) => (
                            <tr key={`${item.product_id}-${index}`}>
                              <td>{item.product_name}</td>
                              <td>
                                <input
                                  type="number"
                                  min="1"
                                  className="form-control form-control-sm"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleItemChange(index, "quantity", e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="form-control form-control-sm"
                                  value={item.price}
                                  onChange={(e) =>
                                    handleItemChange(index, "price", e.target.value)
                                  }
                                />
                              </td>
                              <td>
                                {formatMoney(
                                  Number(item.quantity || 0) * Number(item.price || 0)
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">
                              No items
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {order && (
                    <div className="text-end mb-3">
                      <p className="mb-0">
                        Grand Total:{" "}
                        {formatMoney(order.net_total ?? order.order_total)}
                      </p>
                      <p className="mb-0">
                        Due: {formatMoney(order.amount_remaining)}
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
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={loading || !order}
                    >
                      {loading ? "Saving..." : "Update Purchase"}
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

export default EditPurchases;
