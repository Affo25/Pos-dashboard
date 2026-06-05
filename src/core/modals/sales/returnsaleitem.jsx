import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { showErrorToast } from "../../utils/toast";

const ReturnSaleItemModal = ({ sale, onSubmit }) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const productOptions = useMemo(
    () =>
      (sale?.items || []).map((item) => ({
        value: item.product_id?._id || item.product_id,
        label: `${item.product_name || "Product"} (sold: ${item.quantity})`,
        unit_price: item.unit_price,
        max_qty: item.quantity,
      })),
    [sale]
  );

  const selectedProduct = productOptions.find((opt) => opt.value === productId);

  useEffect(() => {
    setProductId("");
    setQuantity(1);
    setReason("");
  }, [sale]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sale?._id || !productId || !quantity) {
      showErrorToast("Validation Error", "Product and quantity are required.");
      return;
    }

    const maxQty = selectedProduct?.max_qty || 1;
    if (Number(quantity) > maxQty) {
      showErrorToast("Validation Error", `Return quantity cannot exceed ${maxQty}.`);
      return;
    }

    onSubmit?.({
      sale_id: sale._id,
      items: [
        {
          product_id: productId,
          quantity: Number(quantity),
          unit_price: selectedProduct?.unit_price,
          reason,
        },
      ],
      reason,
    });
  };

  return (
    <div className="modal fade" id="return-sale-item-modal">
      <div className="modal-dialog add-centered">
        <div className="modal-content">
          <div className="page-wrapper p-0 m-0">
            <div className="content p-0">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>Return Sale Item</h4>
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
                            isDisabled={!sale}
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

export default ReturnSaleItemModal;
