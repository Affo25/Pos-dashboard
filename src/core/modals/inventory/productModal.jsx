import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { DatePicker } from "antd";
import { showErrorToast } from "../../utils/toast";

const ProductFormModal = ({
  mode = "add",
  product,
  categories = [],
  onSubmit,
  loading = false,
}) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [minimumStockAlert, setMinimumStockAlert] = useState("");
  const [supplierName, setSupplierName] = useState("General Supplier");
  const [batchNumber, setBatchNumber] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [rackLocation, setRackLocation] = useState("");
  const [status, setStatus] = useState("active");
  const [expiryDate, setExpiryDate] = useState(new Date());

  const categoryOptions = useMemo(
    () =>
      categories.map((item) => ({
        value: item.id,
        label: item.category,
      })),
    [categories]
  );

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  useEffect(() => {
    if (mode === "edit" && product) {
      const raw = product._raw || product;
      setName(raw.name || "");
      setSku(raw.sku || "");
      setCategoryId(raw.category?._id || raw.category || null);
      setAvailableQuantity(String(raw.available_quantity ?? ""));
      setUnitPrice(String(raw.unit_price ?? ""));
      setMinimumStockAlert(String(raw.minimum_stock_alert ?? ""));
      setSupplierName(raw.supplier_name || "General Supplier");
      setBatchNumber(raw.batch_number || "");
      setManufacturer(raw.manufacturer || "");
      setRackLocation(raw.rack_location || "");
      setStatus(raw.status || "active");
      setExpiryDate(raw.expiry_date ? new Date(raw.expiry_date) : new Date());
      return;
    }

    setName("");
    setSku("");
    setCategoryId(null);
    setAvailableQuantity("");
    setUnitPrice("");
    setMinimumStockAlert("");
    setSupplierName("General Supplier");
    setBatchNumber("");
    setManufacturer("");
    setRackLocation("");
    setStatus("active");
    setExpiryDate(new Date());
  }, [mode, product]);

  const buildPayload = () => ({
    name: name.trim(),
    sku: sku.trim() || undefined,
    category: categoryId,
    available_quantity: Number(availableQuantity),
    unit_price: Number(unitPrice),
    minimum_stock_alert: Number(minimumStockAlert || 0),
    supplier_name: supplierName.trim() || "General Supplier",
    batch_number: batchNumber.trim() || `BATCH-${Date.now()}`,
    expiry_date: expiryDate,
    manufacturer: manufacturer.trim() || undefined,
    rack_location: rackLocation.trim() || undefined,
    status,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || !availableQuantity || !unitPrice) {
      showErrorToast(
        "Validation Error",
        "Product name, category, quantity and price are required."
      );
      return;
    }

    onSubmit?.(buildPayload());
  };

  const title = mode === "edit" ? "Edit Product" : "Add Product";

  return (
    <div className="modal fade" id="product-form-modal">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="page-wrapper-new p-0">
            <div className="content">
              <div className="modal-header border-0 custom-modal-header">
                <div className="page-title">
                  <h4>{title}</h4>
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
                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Product Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>SKU</label>
                        <input
                          type="text"
                          className="form-control"
                          value={sku}
                          onChange={(e) => setSku(e.target.value)}
                          placeholder="Auto-generated if empty"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Category *</label>
                        <Select
                          className="select"
                          options={categoryOptions}
                          placeholder="Choose Category"
                          value={
                            categoryOptions.find((opt) => opt.value === categoryId) ||
                            null
                          }
                          onChange={(option) => setCategoryId(option?.value || null)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Supplier Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={supplierName}
                          onChange={(e) => setSupplierName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Quantity *</label>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={availableQuantity}
                          onChange={(e) => setAvailableQuantity(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Unit Price *</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={unitPrice}
                          onChange={(e) => setUnitPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Min Stock Alert</label>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={minimumStockAlert}
                          onChange={(e) => setMinimumStockAlert(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Batch Number *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={batchNumber}
                          onChange={(e) => setBatchNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Expiry Date *</label>
                        <DatePicker
                          selected={expiryDate}
                          onChange={setExpiryDate}
                          className="form-control"
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
                          value={statusOptions.find((opt) => opt.value === status)}
                          onChange={(option) => setStatus(option?.value || "active")}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Manufacturer</label>
                        <input
                          type="text"
                          className="form-control"
                          value={manufacturer}
                          onChange={(e) => setManufacturer(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-6 col-12">
                      <div className="input-blocks">
                        <label>Rack Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={rackLocation}
                          onChange={(e) => setRackLocation(e.target.value)}
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
                    <button type="submit" className="btn btn-submit" disabled={loading}>
                      {loading
                        ? "Saving..."
                        : mode === "edit"
                          ? "Update Product"
                          : "Create Product"}
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

export default ProductFormModal;
