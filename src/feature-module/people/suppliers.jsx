import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../core/breadcrumbs";
import { Link } from "react-router-dom";
import { Filter, Sliders, Edit, Eye, Trash2 } from "react-feather";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SupplierModal from "../../core/modals/peoples/supplierModal";
import {
  closeBootstrapModal,
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  updateSupplier,
} from "../../core/redux/businessAction";
import { showErrorToast, showSuccessToast } from "../../core/utils/toast";

const Suppliers = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.supplierdata);
  const businessLoading = useSelector((state) => state.business_loading);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const MySwal = withReactContent(Swal);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleCreateSupplier = async (payload) => {
    try {
      await dispatch(createSupplier(payload));
      closeBootstrapModal("add-units");
      showSuccessToast("Supplier Created", "Supplier added successfully.");
    } catch (error) {
      showErrorToast("Create Failed", error.message);
    }
  };

  const handleUpdateSupplier = async (id, payload) => {
    try {
      await dispatch(updateSupplier(id, payload));
      closeBootstrapModal("edit-units");
      showSuccessToast("Supplier Updated", "Supplier saved successfully.");
    } catch (error) {
      showErrorToast("Update Failed", error.message);
    }
  };

  const showConfirmationAlert = (record) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteSupplier(record.id));
          showSuccessToast("Deleted", "Supplier removed successfully.");
        } catch (error) {
          showErrorToast("Delete Failed", error.message);
        }
      }
    });
  };

  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "140923", label: "14 09 23" },
    { value: "110923", label: "11 09 23" },
  ];

  const columns = [
    {
      render: () => (
        <label className="checkboxs">
          <input type="checkbox" />
          <span className="checkmarks" />
        </label>
      ),
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      render: (text, record) => (
        <span className="productimgname">
          <Link to="#" className="product-img stock-img">
            <ImageWithBasePath alt="" src={record.image} />
          </Link>
          <Link to="#">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.supplierName.length - b.supplierName.length,
    },
    {
      title: "Code",
      dataIndex: "code",
      sorter: (a, b) => a.code.length - b.code.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: (a, b) => a.country.length - b.country.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <td className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" to="#">
              <Eye className="feather-view" />
            </Link>
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-units"
              onClick={() => setSelectedSupplier(record)}
            >
              <Edit className="feather-edit" />
            </Link>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={(e) => {
                e.preventDefault();
                showConfirmationAlert(record);
              }}
            >
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </td>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Suppliers"
          subtitle="Manage your suppliers"
          addButton="Add New Supplier"
        />
        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control form-control-sm formsearch"
                  />
                  <Link to="#" className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
                </div>
              </div>
              <div className="search-path">
                <Link
                  className={`btn btn-filter ${isFilterVisible ? "setclose" : ""}`}
                  onClick={toggleFilterVisibility}
                >
                  <Filter className="filter-icon" />
                  <span>
                    <Sliders className="info-img" />
                  </span>
                </Link>
              </div>
              <div className="form-sort">
                <Sliders className="info-img" />
                <Select className="select" options={options} />
              </div>
            </div>
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={data}
                loading={businessLoading}
                rowKey={(record) => record.id}
              />
            </div>
          </div>
        </div>
      </div>
      <SupplierModal
        selectedSupplier={selectedSupplier}
        onCreate={handleCreateSupplier}
        onUpdate={handleUpdateSupplier}
        loading={businessLoading}
      />
    </div>
  );
};

export default Suppliers;
