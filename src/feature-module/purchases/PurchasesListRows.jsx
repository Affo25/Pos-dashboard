import React from "react";
import { Link } from "react-router-dom";
import { Eye, RotateCcw, Trash2 } from "react-feather";

const PurchasesListRows = ({ data = [], onDelete, onEdit, onPdf, onPrint, onReturn }) => {
  if (!data.length) {
    return (
      <tr>
        <td colSpan={10} className="text-center">
          No purchase orders found
        </td>
      </tr>
    );
  }

  return data.map((order) => (
    <tr key={order.id}>
      <td>
        <label className="checkboxs">
          <input type="checkbox" />
          <span className="checkmarks" />
        </label>
      </td>
      <td>{order.supplier}</td>
      <td>{order.reference}</td>
      <td>{order.orderDate}</td>
      <td>
        <span className="badges status-badge">{order.status}</span>
      </td>
      <td>{order.grandTotal}</td>
      <td>{order.paid}</td>
      <td>{order.due}</td>
      <td>{order.createdBy}</td>
      <td className="action-table-data">
        <div className="edit-delete-action">
          <Link
            className="me-2 p-2"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              onPdf?.(order);
            }}
          >
            <Eye className="action-eye" />
          </Link>
          <Link
            className="me-2 p-2"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              onPrint?.(order);
            }}
          >
            <i data-feather="printer" className="feather-printer" />
          </Link>
          <Link
            className="me-2 p-2"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              onEdit?.(order);
            }}
          >
            <i data-feather="edit" className="feather-edit" />
          </Link>
          <Link
            className="me-2 p-2"
            to="#"
            title="Return Item"
            onClick={(e) => {
              e.preventDefault();
              onReturn?.(order);
            }}
          >
            <RotateCcw className="feather-rotate-ccw" />
          </Link>
          <Link
            className="confirm-text p-2"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              onDelete?.(order);
            }}
          >
            <Trash2 className="feather-trash-2" />
          </Link>
        </div>
      </td>
    </tr>
  ));
};

export default PurchasesListRows;
