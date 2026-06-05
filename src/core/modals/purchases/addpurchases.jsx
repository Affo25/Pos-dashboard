import { DatePicker } from "antd";
import React, { useMemo, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

const AddPurchases = ({ onSubmit, loading = false }) => {
  const suppliers = useSelector((state) => state.supplierdata);
  const products = useSelector((state) => state.product_list);

  const [supplierId, setSupplierId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState("pending");
  const [amountPaid, setAmountPaid] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const supplierOptions = useMemo(
    () =>
      suppliers.map((item) => ({
        value: item.id,
        label: item.supplierName,
      })),
    [suppliers]
  );

  const productOptions = useMemo(
    () =>
      products.map((item) => ({
        value: item.id,
        label: item.product,
      })),
    [products]
  );

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "received", label: "Received" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId || !productId || !quantity || !price) return;

    await onSubmit({
      supplier_id: supplierId,
      order_number: orderNumber.trim() || undefined,
      order_date: selectedDate,
      items: [
        {
          product_id: productId,
          quantity: Number(quantity),
          price: Number(price),
        },
      ],
      amount_paid: Number(amountPaid || 0),
      status,
    });

    setSupplierId(null);
    setProductId(null);
    setQuantity("");
    setPrice("");
    setOrderNumber("");
    setStatus("pending");
    setAmountPaid("");
    setSelectedDate(new Date());
  };

  return (
    <div>
      <div className="modal fade" id="add-units">
        <div className="modal-dialog purchase modal-dialog-centered stock-adjust-modal">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add Purchase</h4>
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
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Purchase Date</label>
                          <DatePicker
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            className="filterdatepicker"
                            dateFormat="dd-MM-yyyy"
                            placeholder="Choose Date"
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Product Name</label>
                          <Select
                            options={productOptions}
                            className="select"
                            placeholder="Choose"
                            value={
                              productOptions.find(
                                (item) => item.value === productId
                              ) || null
                            }
                            onChange={(option) =>
                              setProductId(option?.value || null)
                            }
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
                          <label>Quantity</label>
                          <input
                            type="number"
                            className="form-control"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Price</label>
                          <input
                            type="number"
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="input-blocks">
                          <label>Amount Paid</label>
                          <input
                            type="number"
                            className="form-control"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
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
                              statusOptions.find(
                                (item) => item.value === status
                              ) || null
                            }
                            onChange={(option) =>
                              setStatus(option?.value || "pending")
                            }
                          />
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
                      <button
                        type="submit"
                        className="btn btn-submit"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Submit"}
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

export default AddPurchases;
