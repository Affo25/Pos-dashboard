import React from "react";
import { Link } from "react-router-dom";

const SalesListRows = ({
  data = [],
  onDelete,
  onPdf,
  onPrint,
  onReturn,
  onViewDetail,
  onEdit,
}) => {
  if (!data.length) {
    return (
      <tr>
        <td colSpan={11} className="text-center">
          No sales found
        </td>
      </tr>
    );
  }

  return data.map((sale) => (
    <tr key={sale.id}>
      <td>
        <label className="checkboxs">
          <input type="checkbox" />
          <span className="checkmarks" />
        </label>
      </td>
      <td>{sale.customer}</td>
      <td>{sale.invoiceNo}</td>
      <td>{sale.saleDate}</td>
      <td>
        <span className="badge badge-bgsuccess">{sale.status}</span>
      </td>
      <td>{sale.grandTotal}</td>
      <td>{sale.paid}</td>
      <td>{sale.due}</td>
      <td>
        <span className="badge badge-linesuccess">{sale.paymentStatus}</span>
      </td>
      <td>{sale.biller}</td>
      <td className="text-center">
        <Link
          className="action-set"
          to="#"
          data-bs-toggle="dropdown"
          aria-expanded="true"
        >
          <i className="fa fa-ellipsis-v" aria-hidden="true" />
        </Link>
        <ul className="dropdown-menu">
          <li>
            <Link
              to="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                onPdf?.(sale);
              }}
            >
              <i data-feather="file-text" className="info-img" />
              Download PDF
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                onPrint?.(sale);
              }}
            >
              <i data-feather="printer" className="info-img" />
              Print Invoice
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                onViewDetail?.(sale);
              }}
            >
              <i data-feather="eye" className="info-img" />
              Sale Detail
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                onEdit?.(sale);
              }}
            >
              <i data-feather="edit" className="info-img" />
              Edit Sale
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                onReturn?.(sale);
              }}
            >
              <i data-feather="rotate-ccw" className="info-img" />
              Return Item
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="dropdown-item confirm-text mb-0"
              onClick={(e) => {
                e.preventDefault();
                onDelete?.(sale);
              }}
            >
              <i data-feather="trash-2" className="info-img" />
              Delete Sale
            </Link>
          </li>
        </ul>
      </td>
    </tr>
  ));
};

export default SalesListRows;
