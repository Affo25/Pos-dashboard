const parseMoney = (value) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
};

const mapLineItems = (items = []) =>
  items.map((item) => ({
    product_name: item.product_name || item.name || "—",
    quantity: Number(item.quantity || 0),
    unit_price: Number(item.unit_price ?? item.price ?? 0),
    discount: Number(item.discount || 0),
    tax: Number(item.tax || 0),
    line_total: Number(
      item.line_total ??
        (item.quantity || 0) * (item.unit_price ?? item.price ?? 0)
    ),
  }));

export const mapSaleToInvoicePayload = (sale) => ({
  invoice_no: sale.invoice_no || "—",
  customer_name: sale.customer_name || "Walk-in",
  sale_date: sale.sale_date || sale.createdAt,
  items: mapLineItems(sale.items),
  total_amount: Number(sale.total_amount || 0),
  discount_amount: Number(sale.discount_amount || 0),
  tax_amount: Number(sale.tax_amount || 0),
  returned_total: Number(sale.total_return_amount || 0),
  net_amount: Number(sale.net_amount || 0),
  amount_paid: Number(sale.amount_received || 0),
  amount_remaining: Math.max(
    0,
    Number(sale.net_amount || 0) - Number(sale.amount_received || 0)
  ),
  document_title: "INVOICE",
});

export const mapPurchaseToInvoicePayload = (order) => {
  const items = (order.items || []).map((item) => ({
    product_name: item.product_id?.name || item.product_name || "—",
    quantity: Number(item.quantity || 0),
    unit_price: Number(item.price || 0),
    line_total: Number(item.quantity || 0) * Number(item.price || 0),
  }));

  const total = items.reduce((sum, item) => sum + item.line_total, 0);
  const paid = Number(order.amount_paid || 0);
  const net = Number(order.net_total ?? order.order_total ?? total);

  return {
    invoice_no: order.order_number || "—",
    document_type: "purchase_order",
    document_title: "PURCHASE ORDER",
    customer_name: order.supplier_name || order.supplier_id?.name || "—",
    sale_date: order.order_date || order.createdAt,
    items,
    total_amount: total,
    net_amount: net,
    amount_paid: paid,
    amount_remaining: Math.max(0, net - paid),
  };
};

export const mapSaleReturnToInvoicePayload = (returnRecord) => {
  const productName =
    returnRecord.product_id?.name || returnRecord.product_name || "—";
  const qty = Number(returnRecord.quantity || 0);
  const price = Number(returnRecord.unit_price || 0);
  const refund = Number(returnRecord.refund_amount || qty * price);

  return {
    invoice_no: `SR-${String(returnRecord._id || "").slice(-6).toUpperCase()}`,
    document_title: "SALES RETURN",
    customer_name: returnRecord.sale_id?.customer_name || "—",
    sale_date: returnRecord.return_date || returnRecord.createdAt,
    items: [
      {
        product_name: productName,
        quantity: qty,
        unit_price: price,
        line_total: refund,
      },
    ],
    total_amount: refund,
    net_amount: refund,
    amount_paid: 0,
    amount_remaining: refund,
    notes: returnRecord.reason || "",
  };
};

export const mapPurchaseReturnToInvoicePayload = (order, returnItem) => {
  const qty = Number(returnItem.quantity || 0);
  const price = Number(returnItem.price || 0);
  const total = qty * price;

  return {
    invoice_no: `PR-${String(returnItem._id || "").slice(-6).toUpperCase()}`,
    document_type: "purchase_order",
    document_title: "PURCHASE RETURN",
    customer_name: order.supplier_name || "—",
    sale_date: returnItem.return_date || returnItem.createdAt,
    items: [
      {
        product_name: returnItem.product_id?.name || "—",
        quantity: qty,
        unit_price: price,
        line_total: total,
      },
    ],
    total_amount: total,
    net_amount: total,
    amount_paid: 0,
    amount_remaining: total,
    notes: returnItem.reason || "",
  };
};

export const mapStockRowsToInvoicePayload = (rows = []) => {
  const items = rows.map((row) => {
    const raw = row._raw || {};
    const qty = Number(row.Quantity ?? raw.available_quantity ?? 0);
    const price = Number(raw.unit_price || raw.selling_price || 0);

    return {
      product_name: row.Product?.Name || raw.name || "—",
      quantity: qty,
      unit_price: price,
      line_total: qty * price,
    };
  });

  const total = items.reduce((sum, item) => sum + item.line_total, 0);

  return {
    invoice_no: `STK-${new Date().toISOString().slice(0, 10)}`,
    document_title: "STOCK REPORT",
    customer_name: "Inventory Summary",
    sale_date: new Date(),
    items,
    total_amount: total,
    net_amount: total,
    amount_paid: 0,
    amount_remaining: 0,
  };
};

export const mapSaleRowsToRegisterRecords = (rows = []) =>
  rows.map((row) => ({
    invoice_no: row.invoiceNo || row.invoiceno || "—",
    customer_name: row.customer || "—",
    date_label: row.saleDate || row.duedate || "—",
    total_amount: parseMoney(row.grandTotal || row.amount),
    net_amount: parseMoney(row.grandTotal || row.amount),
    status: row.status || row.paymentStatus || "—",
  }));

export const mapPurchaseRowsToRegisterRecords = (rows = []) =>
  rows.map((row) => ({
    invoice_no: row.reference || "—",
    customer_name: row.supplier || "—",
    date_label: row.orderDate || "—",
    total_amount: parseMoney(row.grandTotal),
    net_amount: parseMoney(row.grandTotal),
    status: row.status || row.paymentStatus || "—",
  }));

export const mapSaleReturnRowsToRegisterRecords = (rows = []) =>
  rows.map((row) => ({
    invoice_no: `SR-${String(row.id || "").slice(-6).toUpperCase()}`,
    customer_name: row.customer || "—",
    date_label: row.date || "—",
    total_amount: parseMoney(row.grandtotal),
    net_amount: parseMoney(row.grandtotal),
    status: row.status || "—",
  }));

export const mapPurchaseReturnRowsToRegisterRecords = (rows = []) =>
  rows.map((row) => ({
    invoice_no: row.reference || "—",
    customer_name: row.supplier || "—",
    date_label: row.date || "—",
    total_amount: parseMoney(row.grandTotal),
    net_amount: parseMoney(row.grandTotal),
    status: row.status || "—",
  }));
