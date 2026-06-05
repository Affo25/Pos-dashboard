import React from "react";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { API_BASE_URL } from "../../core/api/config";
import { formatDisplayDate } from "../../core/utils/inventoryMappers";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const InvoiceReceiptPreview = ({ sale, settings }) => {
  const design = settings?.invoiceDesign || {};
  const logoSrc = design.logoUrl
    ? `${API_BASE_URL}${design.logoUrl}`
    : "assets/img/logo.png";

  if (!sale) {
    return <p className="text-center text-muted mb-0">Loading invoice...</p>;
  }

  return (
    <>
      <div className="icon-head text-center">
        <ImageWithBasePath src={logoSrc} width={100} height={30} alt="Receipt Logo" />
      </div>
      <div className="text-center info text-center">
        <h6>{design.companyName || "Company"}</h6>
        {design.phone && <p className="mb-0">Phone: {design.phone}</p>}
        {design.email && (
          <p className="mb-0">
            Email: <Link to={`mailto:${design.email}`}>{design.email}</Link>
          </p>
        )}
        {design.address && <p className="mb-0">{design.address}</p>}
      </div>
      <div className="tax-invoice">
        <h6 className="text-center">Tax Invoice</h6>
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="invoice-user-name">
              <span>Name: </span>
              <span>{sale.customer_name || "Walk-in Customer"}</span>
            </div>
            <div className="invoice-user-name">
              <span>Invoice No: </span>
              <span>{sale.invoice_no}</span>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="invoice-user-name">
              <span>Date: </span>
              <span>{formatDisplayDate(sale.sale_date)}</span>
            </div>
            <div className="invoice-user-name">
              <span>Status: </span>
              <span>{sale.status || "—"}</span>
            </div>
          </div>
        </div>
      </div>
      <table className="table-borderless w-100 table-fit">
        <thead>
          <tr>
            <th># Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th className="text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          {(sale.items || []).map((item, index) => (
            <tr key={`${item.product_id || item.product_name}-${index}`}>
              <td>
                {index + 1}. {item.product_name}
              </td>
              <td>{formatMoney(item.unit_price)}</td>
              <td>{item.quantity}</td>
              <td className="text-end">{formatMoney(item.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <p className="mb-0">Subtotal: {formatMoney(sale.total_amount)}</p>
        {sale.discount_amount > 0 && (
          <p className="mb-0 text-danger">
            Discount: -{formatMoney(sale.discount_amount)}
          </p>
        )}
        {sale.tax_amount > 0 && (
          <p className="mb-0">Tax: {formatMoney(sale.tax_amount)}</p>
        )}
        <p className="mb-0">
          <strong>Total: {formatMoney(sale.net_amount)}</strong>
        </p>
        <p className="mb-0">
          Paid: {formatMoney(sale.amount_received ?? sale.amount_paid ?? sale.net_amount)}
        </p>
        {(sale.amount_remaining > 0 || sale.due_amount > 0) && (
          <p className="mb-0 text-danger">
            Due: {formatMoney(sale.amount_remaining ?? sale.due_amount)}
          </p>
        )}
      </div>
      {design.footerText && (
        <p className="text-center mt-3 mb-0">{design.footerText}</p>
      )}
    </>
  );
};

export default InvoiceReceiptPreview;
