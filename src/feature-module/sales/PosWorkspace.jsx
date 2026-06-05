import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { RefreshCcw, RotateCw, ShoppingCart } from "feather-icons-react/build/IconComponents";
import { Search, Trash2 } from "react-feather";
import PlusCircle from "feather-icons-react/build/IconComponents/PlusCircle";
import MinusCircle from "feather-icons-react/build/IconComponents/MinusCircle";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  closeBootstrapModal,
  fetchCategories,
  fetchProducts,
} from "../../core/redux/inventoryAction";
import {
  createBilling,
  fetchCustomers,
  fetchSettings,
} from "../../core/redux/businessAction";
import { showErrorToast, showSuccessToast } from "../../core/utils/toast";
import { mapSaleToInvoicePayload } from "../../core/utils/invoiceMappers";
import {
  handleSingleInvoicePdf,
  handleSingleInvoicePrint,
} from "../../core/utils/printHelpers";
import PosInvoiceModal from "./PosInvoiceModal";

const DEFAULT_PRODUCT_IMAGE = "assets/img/products/pos-product-01.png";
const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const openModal = (id) => {
  const el = document.getElementById(id);
  if (!el || !window.bootstrap?.Modal) return;
  window.bootstrap.Modal.getOrCreateInstance(el).show();
};

const PosWorkspace = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product_list);
  const categories = useSelector((state) => state.categotylist_data);
  const customers = useSelector((state) => state.customerdata);
  const appSettings = useSelector((state) => state.app_settings);
  const inventoryLoading = useSelector((state) => state.inventory_loading);
  const businessLoading = useSelector((state) => state.business_loading);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState({
    value: "",
    label: "Walk-in Customer",
  });
  const [orderNote, setOrderNote] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [completedSale, setCompletedSale] = useState(null);
  const [processing, setProcessing] = useState(false);

  const customerOptions = useMemo(
    () => [
      { value: "", label: "Walk-in Customer" },
      ...(Array.isArray(customers) ? customers : []).map((customer) => ({
        value: customer._id,
        label: customer.name || customer.email || "Customer",
      })),
    ],
    [customers]
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSettings());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const catId = product._raw?.category?._id || product._raw?.category;
      const matchesCategory =
        selectedCategory === "all" || String(catId) === String(selectedCategory);
      if (!matchesCategory) return false;
      if (!query) return true;
      const name = String(product.product || "").toLowerCase();
      const sku = String(product.sku || "").toLowerCase();
      return name.includes(query) || sku.includes(query);
    });
  }, [products, selectedCategory, searchQuery]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const total = subtotal;

  const addToCart = (product) => {
    const raw = product._raw || product;
    const available = Number(raw.available_quantity ?? 0);
    if (available <= 0) {
      showErrorToast("Out of Stock", `${raw.name} is not available.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((line) => line.product_id === product.id);
      if (existing) {
        if (existing.quantity >= available) {
          showErrorToast("Stock Limit", `Only ${available} units available.`);
          return prev;
        }
        return prev.map((line) =>
          line.product_id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: raw.name || product.product,
          sku: raw.sku || product.sku,
          image: raw.image || product.img || DEFAULT_PRODUCT_IMAGE,
          unit_price: Number(raw.unit_price || raw.selling_price || 0),
          max_qty: available,
          quantity: 1,
        },
      ];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.product_id !== productId) return line;
          const nextQty = line.quantity + delta;
          if (nextQty <= 0) return null;
          if (nextQty > line.max_qty) {
            showErrorToast("Stock Limit", `Only ${line.max_qty} units available.`);
            return line;
          }
          return { ...line, quantity: nextQty };
        })
        .filter(Boolean)
    );
  };

  const removeLine = (productId) => {
    setCart((prev) => prev.filter((line) => line.product_id !== productId));
  };

  const resetOrder = () => {
    setCart([]);
    setPaymentMethod("cash");
    setOrderNote("");
    setSelectedCustomer({ value: "", label: "Walk-in Customer" });
    setSearchQuery("");
    setCompletedSale(null);
  };

  const getInvoiceTemplate = () =>
    appSettings?.invoiceDesign?.template || "pos_receipt";

  const handleReceiptPdf = async () => {
    if (!completedSale) return;
    await handleSingleInvoicePdf(
      mapSaleToInvoicePayload(completedSale),
      getInvoiceTemplate()
    );
  };

  const handleReceiptPrint = async () => {
    if (!completedSale) return;
    await handleSingleInvoicePrint(
      mapSaleToInvoicePayload(completedSale),
      getInvoiceTemplate()
    );
  };

  const handleNextOrder = () => {
    closeBootstrapModal("payment-completed");
    closeBootstrapModal("print-receipt");
    resetOrder();
  };

  const handlePayment = async () => {
    if (!cart.length) {
      showErrorToast("Empty Cart", "Add at least one product.");
      return;
    }

    setProcessing(true);
    try {
      const billingPayload = {
        items: cart.map((line) => ({
          product_id: line.product_id,
          quantity: line.quantity,
          unit_price: line.unit_price,
        })),
        amount_received: total,
        payment_method: paymentMethod,
        payment_mode: paymentMethod,
        payment_notes: orderNote.trim(),
      };

      if (selectedCustomer?.value) {
        billingPayload.customer_id = selectedCustomer.value;
      } else {
        billingPayload.customer_name = "Walk-in Customer";
      }

      const sale = await dispatch(createBilling(billingPayload));
      setCompletedSale(sale);
      showSuccessToast("Payment Completed", `Invoice ${sale.invoice_no} created.`);
      openModal("payment-completed");
      await dispatch(fetchProducts());
    } catch (error) {
      showErrorToast("Payment Failed", error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="page-wrapper pos-pg-wrapper ms-0">
        <div className="content pos-design p-0">
          <div className="btn-row d-sm-flex align-items-center">
            <Link to="/sales-list" className="btn btn-secondary mb-xs-3">
              <span className="me-1 d-flex align-items-center">
                <ShoppingCart className="feather-16" />
              </span>
              View Orders
            </Link>
            <Link to="#" className="btn btn-info" onClick={(e) => { e.preventDefault(); resetOrder(); }}>
              <span className="me-1 d-flex align-items-center">
                <RotateCw className="feather-16" />
              </span>
              Reset
            </Link>
            <Link to="/invoice-report" className="btn btn-primary">
              <span className="me-1 d-flex align-items-center">
                <RefreshCcw className="feather-16" />
              </span>
              Invoices
            </Link>
          </div>

          <div className="row align-items-start pos-wrapper">
            <div className="col-md-12 col-lg-8">
              <div className="pos-categories tabs_wrapper">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <div>
                    <h5 className="mb-1">Products</h5>
                    <p className="mb-0">Search items or filter by category</p>
                  </div>
                  <div className="search-set" style={{ minWidth: 280 }}>
                    <div className="search-input">
                      <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        className="form-control form-control-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Link to="#" className="btn btn-searchset" onClick={(e) => e.preventDefault()}>
                        <Search className="feather-search" size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedCategory === "all" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All ({products.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`btn btn-sm ${selectedCategory === cat.id ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pos-products">
                <div className="tabs_container">
                  <div className="tab_content active">
                    {inventoryLoading ? (
                      <p className="p-3">Loading products...</p>
                    ) : !filteredProducts.length ? (
                      <p className="p-3">No products match your search.</p>
                    ) : (
                      <div className="row">
                        {filteredProducts.map((product) => (
                          <div className="col-sm-6 col-md-4 col-lg-3 col-xl-3" key={product.id}>
                            <div
                              className="product-info card"
                              onClick={() => addToCart(product)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === "Enter" && addToCart(product)}
                            >
                              <Link to="#" className="pro-img" onClick={(e) => e.preventDefault()}>
                                <ImageWithBasePath
                                  src={product.productImage || DEFAULT_PRODUCT_IMAGE}
                                  alt={product.product}
                                />
                              </Link>
                              <h6 className="cat-name">
                                <Link to="#" onClick={(e) => e.preventDefault()}>
                                  {product.product}
                                </Link>
                              </h6>
                              <h6 className="product-name">
                                <Link to="#" onClick={(e) => e.preventDefault()}>
                                  {product.sku}
                                </Link>
                              </h6>
                              <div className="d-flex justify-content-between price">
                                <span>Qty: {product._raw?.available_quantity ?? 0}</span>
                                <span>{product.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-lg-4 ps-0">
              <aside className="product-order-list">
                <div className="head d-flex align-items-center justify-content-between w-100">
                  <div>
                    <h5>Order List</h5>
                    <span>{cart.length} item(s)</span>
                  </div>
                  <Link
                    to="#"
                    className="confirm-text"
                    onClick={(e) => {
                      e.preventDefault();
                      resetOrder();
                    }}
                  >
                    <Trash2 className="feather-16 text-danger me-1" />
                  </Link>
                </div>

                <div className="customer-info block-section">
                  <h6>Customer Information</h6>
                  <div className="input-block">
                    <label className="form-label">Choose Customer</label>
                    <Select
                      className="select"
                      options={customerOptions}
                      value={selectedCustomer}
                      onChange={(option) =>
                        setSelectedCustomer(
                          option || { value: "", label: "Walk-in Customer" }
                        )
                      }
                      placeholder="Choose Customer"
                    />
                  </div>
                  <div className="input-block mb-0">
                    <label className="form-label">Order Note</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Add a note for this order..."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                    />
                  </div>
                </div>

                <div className="product-added block-section">
                  <div className="head-text d-flex align-items-center justify-content-between">
                    <h6 className="d-flex align-items-center mb-0">
                      Product Added<span className="count">{cart.length}</span>
                    </h6>
                    <Link
                      to="#"
                      className="d-flex align-items-center text-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        setCart([]);
                      }}
                    >
                      Clear all
                    </Link>
                  </div>
                  <div className="product-wrap">
                    {!cart.length && (
                      <p className="text-muted mb-0">Click a product to add it to the cart.</p>
                    )}
                    {cart.map((line) => (
                      <div
                        className="product-list d-flex align-items-center justify-content-between"
                        key={line.product_id}
                      >
                        <div className="d-flex align-items-center product-info">
                          <Link to="#" className="img-bg">
                            <ImageWithBasePath src={line.image} alt={line.product_name} />
                          </Link>
                          <div className="info">
                            <span>{line.sku || "—"}</span>
                            <h6><Link to="#">{line.product_name}</Link></h6>
                            <p>{formatMoney(line.unit_price)}</p>
                          </div>
                        </div>
                        <div className="qty-item text-center">
                          <Link
                            to="#"
                            className="dec d-flex justify-content-center align-items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              updateQty(line.product_id, -1);
                            }}
                          >
                            <MinusCircle className="feather-14" />
                          </Link>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={line.quantity}
                            readOnly
                          />
                          <Link
                            to="#"
                            className="inc d-flex justify-content-center align-items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              updateQty(line.product_id, 1);
                            }}
                          >
                            <PlusCircle className="feather-14" />
                          </Link>
                        </div>
                        <div className="d-flex align-items-center action">
                          <Link
                            className="btn-icon delete-icon confirm-text"
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              removeLine(line.product_id);
                            }}
                          >
                            <Trash2 className="feather-14" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="block-section">
                  <div className="order-total">
                    <table className="table table-responsive table-borderless">
                      <tbody>
                        <tr>
                          <td>Sub Total</td>
                          <td className="text-end">{formatMoney(subtotal)}</td>
                        </tr>
                        <tr>
                          <td>Total</td>
                          <td className="text-end">{formatMoney(total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="block-section payment-method">
                  <h6>Payment Method</h6>
                  <div className="row d-flex align-items-center justify-content-center methods">
                    {[
                      { id: "cash", label: "Cash", icon: "cash-pay.svg" },
                      { id: "card", label: "Debit Card", icon: "credit-card.svg" },
                      { id: "scan", label: "Scan", icon: "qr-scan.svg" },
                    ].map((method) => (
                      <div className="col-md-6 col-lg-4 item" key={method.id}>
                        <div className={`default-cover ${paymentMethod === method.id ? "active" : ""}`}>
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPaymentMethod(method.id);
                            }}
                          >
                            <ImageWithBasePath
                              src={`assets/img/icons/${method.icon}`}
                              alt={method.label}
                            />
                            <span>{method.label}</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-grid btn-block">
                  <Link className="btn btn-secondary" to="#">
                    Grand Total : {formatMoney(total)}
                  </Link>
                </div>
                <div className="d-grid">
                  <Link
                    to="#"
                    className="btn btn-success btn-icon"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!processing && !businessLoading) handlePayment();
                    }}
                  >
                    {processing || businessLoading ? "Processing..." : "Payment"}
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <PosInvoiceModal
        sale={completedSale}
        settings={appSettings}
        onPdf={handleReceiptPdf}
        onPrint={handleReceiptPrint}
        onNextOrder={handleNextOrder}
      />
    </div>
  );
};

export default PosWorkspace;
