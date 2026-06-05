import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { showErrorToast } from "../../utils/toast";

const ReturnPurchaseItemModal = ({ order, onSubmit }) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const productOptions = useMemo(
    () =>
      (order?.items || []).map((item) => ({
        value: item.product_id?._id || item.product_id,
        label: `${item.product_id?.name || item.product_name || "Product"} (ordered: ${item.quantity})`,
        price: item.price,
        max_qty: item.quantity,
      })),
    [order]
  );

  const selectedProduct = productOptions.find((opt) => opt.value === productId);

  useEffect(() => {
    setProductId("");
    setQuantity(1);
    setReason("");
  }, [order]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!order?._id || !productId || !quantity) {
      showErrorToast("Validation Error", "Product and quantity are required.");
      return;
    }

    const maxQty = selectedProduct?.max_qty || 1;
    if (Number(quantity) > maxQty) {
      showErrorToast("Validation Error", `Return quantity cannot exceed ${maxQty}.`);
      return;
    }

    onSubmit?.(order._id, {
      product_id: productId,
      quantity: Number(quantity),
      price: selectedProduct?.price,
      reason,
    });
  };

  return (
    <div className="modal fade" id="return-purchase-item-modal">
      <div className="modal-dialog add-centered">
        <div className="modal-content">
          <div className="page-wrapper p-0 m-0">
            <div className="content p-0">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>Return Purchase Item</h4>
                  {order?.order_number && (
                    <p className="mb-0 text-muted">PO: {order.order_number}</p>
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
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-lg-6 col-sm-6 col-12">
                        <div className="input-blocks">
                          <label className="form-label">Product</label>
                          <Select
                            className="select"
                            options={productOptions}
                            placeholder="Choose Product"
                            value={productOptions.find((opt) => opt.value === productId) || null}
                            onChange={(option) => setProductId(option?.value || "")}
                            isDisabled={!order}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6 col-12">
                        <div className="input-blocks">
                          <label>Quantity</label>
                          <input
                            type="number"
                            min="1"
                            max={selectedProduct?.max_qty || 1}
                            className="form-control"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 col-sm-6 col-12">
                        <div className="input-blocks">
                          <label>Max Returnable</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProduct?.max_qty ?? "—"}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-lg-12 col-sm-12 col-12">
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
                        Submit Return
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

export default ReturnPurchaseItemModal;
