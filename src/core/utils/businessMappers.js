import { formatDisplayDate } from "./inventoryMappers";

const DEFAULT_SUPPLIER_IMAGE = "assets/img/supplier/supplier-01.png";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const getPaymentStatus = (paid, total) => {
  const paidAmount = Number(paid || 0);
  const totalAmount = Number(total || 0);
  if (paidAmount <= 0) return "Unpaid";
  if (paidAmount >= totalAmount) return "Paid";
  return "Partial";
};

export const mapSupplierToRow = (supplier, index = 0) => ({
  id: supplier._id,
  supplierName: supplier.name,
  code: String(supplier._id || "").slice(-6).toUpperCase(),
  email: supplier.email || "—",
  phone: supplier.phone || "—",
  country: supplier.address || "—",
  image: DEFAULT_SUPPLIER_IMAGE,
  _raw: supplier,
});

export const mapSaleToListRow = (sale) => {
  const paid = sale.amount_received ?? 0;
  const total = sale.net_amount ?? 0;
  const due = Math.max(0, total - paid);

  return {
    id: sale._id,
    customer: sale.customer_name || "Walk-in",
    invoiceNo: sale.invoice_no || "—",
    saleDate: formatDisplayDate(sale.sale_date),
    status: sale.status || "completed",
    grandTotal: formatMoney(total),
    paid: formatMoney(paid),
    due: formatMoney(due),
    paymentStatus: getPaymentStatus(paid, total),
    biller: sale.created_by?.name || "—",
    _raw: sale,
  };
};

export const mapSaleToInvoiceReportRow = (sale) => {
  const paid = sale.amount_received ?? 0;
  const total = sale.net_amount ?? 0;
  const due = Math.max(0, total - paid);

  return {
    id: sale._id,
    invoiceno: sale.invoice_no || "—",
    customer: sale.customer_name || "Walk-in",
    duedate: formatDisplayDate(sale.sale_date),
    amount: formatMoney(total),
    paid: formatMoney(paid),
    amountdue: formatMoney(due),
    status: getPaymentStatus(paid, total),
    _raw: sale,
  };
};

const USER_ROLE_LABELS = {
  superAdmin: "Super Admin",
  admin: "Admin",
  user: "User",
};

const USER_IMAGES = [
  "assets/img/users/user-15.jpg",
  "assets/img/users/user-16.jpg",
  "assets/img/users/user-17.jpg",
  "assets/img/users/user-18.jpg",
  "assets/img/users/user-19.jpg",
];

export const mapUserToListRow = (user, index = 0) => ({
  id: user._id,
  img: USER_IMAGES[index % USER_IMAGES.length],
  username: user.name || "—",
  phone: user.phone || "—",
  email: user.email || "—",
  role: USER_ROLE_LABELS[user.user_type] || user.user_type || "—",
  createdon: formatDisplayDate(user.createdAt),
  status: user.status === "active" ? "Active" : "Inactive",
  _raw: user,
});

const DEFAULT_RETURN_IMAGE = "assets/img/products/product1.jpg";

export const mapSaleReturnToRow = (returnRecord) => {
  const refund = Number(returnRecord.refund_amount || 0);
  const statusLabel =
    returnRecord.status === "approved"
      ? "Received"
      : returnRecord.status === "rejected"
        ? "Rejected"
        : "Pending";

  return {
    id: returnRecord._id,
    img: DEFAULT_RETURN_IMAGE,
    productname: returnRecord.product_id?.name || "—",
    date: formatDisplayDate(returnRecord.return_date || returnRecord.createdAt),
    customer: returnRecord.sale_id?.customer_name || "—",
    status: statusLabel,
    grandtotal: formatMoney(refund),
    paid: formatMoney(0),
    due: formatMoney(refund),
    paymentstatus: "Unpaid",
    _raw: returnRecord,
  };
};

export const mapPurchaseReturnToRow = (order, returnItem) => {
  const qty = Number(returnItem.quantity || 0);
  const price = Number(returnItem.price || 0);
  const total = qty * price;

  return {
    id: returnItem._id || `${order._id}-${returnItem.product_id}`,
    orderId: order._id,
    img: DEFAULT_RETURN_IMAGE,
    date: formatDisplayDate(returnItem.return_date || returnItem.createdAt),
    supplier: order.supplier_name || order.supplier_id?.name || "—",
    reference: order.order_number || "—",
    status: "Received",
    grandTotal: formatMoney(total),
    paid: formatMoney(0),
    due: formatMoney(total),
    paymentStatus: "Unpaid",
    productName: returnItem.product_id?.name || "—",
    quantity: qty,
    _raw: { order, returnItem },
  };
};

export const flattenPurchaseReturns = (orders = []) => {
  const rows = [];
  orders.forEach((order) => {
    (order.returns || []).forEach((returnItem) => {
      rows.push(mapPurchaseReturnToRow(order, returnItem));
    });
  });
  return rows;
};

export const mapPurchaseOrderToRow = (order) => {
  const total = order.net_total ?? order.order_total ?? 0;
  const paid = order.amount_paid ?? 0;
  const due = order.amount_remaining ?? Math.max(0, total - paid);

  return {
    id: order._id,
    supplier: order.supplier_name || order.supplier_id?.name || "—",
    reference: order.order_number || "—",
    orderDate: formatDisplayDate(order.order_date),
    status: order.status || "pending",
    grandTotal: formatMoney(total),
    paid: formatMoney(paid),
    due: formatMoney(due),
    paymentStatus: getPaymentStatus(paid, total),
    createdBy: order.created_by?.name || "—",
    _raw: order,
  };
};
