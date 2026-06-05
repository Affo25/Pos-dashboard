import React, { useEffect, useState } from "react";
import Select from "react-select";
import { showErrorToast } from "../../utils/toast";

const AddSalesReturns = ({ sales = [], onSubmit }) => {
  const [saleId, setSaleId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const saleOptions = sales.map((sale) => ({
    value: sale.id,
    label: `${sale.invoiceNo} — ${sale.customer}`,
    _raw: sale._raw,
  }));

  const selectedSale = sales.find((sale) => sale.id === saleId)?._raw;

  const productOptions = (selectedSale?.items || []).map((item) => ({
    value: item.product_id,
    label: item.product_name || "Product",
    unit_price: item.unit_price,
  }));

  useEffect(() => {
    setProductId("");
  }, [saleId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!saleId || !productId || !quantity) {
      showErrorToast("Validation Error", "Sale, product and quantity are required.");
      return;
    }

    onSubmit?.({
      sale_id: saleId,
      items: [
        {
          product_id: productId,
          quantity: Number(quantity),
          reason,
        },
      ],
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
                    <h4> Add Sales Return</h4>
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
                            <label className="form-label">Sale / Invoice</label>
                            <Select
                              className="select"
                              options={saleOptions}
                              placeholder="Choose Sale"
                              onChange={(option) => setSaleId(option?.value || "")}
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
                              isDisabled={!saleId}
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

export default AddSalesReturns;
