import React, { useEffect, useState } from "react";
import Select from "react-select";
import { showErrorToast } from "../../utils/toast";

const AddPurchaseReturn = ({ purchaseOrders = [], onSubmit }) => {
  const [orderId, setOrderId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const orderOptions = purchaseOrders.map((order) => ({
    value: order.id,
    label: `${order.reference} — ${order.supplier}`,
    _raw: order._raw,
  }));

  const selectedOrder = purchaseOrders.find((order) => order.id === orderId)?._raw;

  const productOptions = (selectedOrder?.items || []).map((item) => ({
    value: item.product_id?._id || item.product_id,
    label: item.product_id?.name || item.product_name || "Product",
    price: item.price,
  }));

  useEffect(() => {
    setProductId("");
  }, [orderId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId || !productId || !quantity) {
      showErrorToast("Validation Error", "Purchase order, product and quantity are required.");
      return;
    }

    const selectedProduct = productOptions.find((opt) => opt.value === productId);

    onSubmit?.(orderId, {
      product_id: productId,
      quantity: Number(quantity),
      price: selectedProduct?.price,
      reason,
    });
  };

  return (
    <div>
      <div className="modal fade" id="add-sales-new">
        <div className="modal-dialog add-centered">
          <div className="modal-content">
            <div className="page-wrapper p-0 m-0">
              <div className="content p-0">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4> Add Purchase Return</h4>
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
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            <label className="form-label">Purchase Order</label>
                            <Select
                              className="select"
                              options={orderOptions}
                              placeholder="Choose Purchase Order"
                              onChange={(option) => setOrderId(option?.value || "")}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-12">
                          <div className="input-blocks">
                            <label className="form-label">Product</label>
                            <Select
                              className="select"
                              options={productOptions}
                              placeholder="Choose Product"
                              value={productOptions.find((opt) => opt.value === productId) || null}
                              onChange={(option) => setProductId(option?.value || "")}
                              isDisabled={!orderId}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="input-blocks">
                            <label>Quantity</label>
                            <input
                              type="number"
                              min="1"
                              className="form-control"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-lg-8 col-sm-6 col-12">
                          <div className="input-blocks">
                            <label>Reason</label>
                            <input
                              type="text"
                              className="form-control"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              placeholder="Return reason"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 text-end">
                        <button
                          type="button"
                          className="btn btn-cancel add-cancel me-3"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-submit add-sale">
                          Submit
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
    </div>
  );
};

export default AddPurchaseReturn;
