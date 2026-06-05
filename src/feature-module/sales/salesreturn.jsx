import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../core/img/imagewithbasebath'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ChevronUp, PlusCircle, RotateCcw, Sliders, StopCircle, User } from 'feather-icons-react/build/IconComponents';
import { setToogleHeader } from '../../core/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Zap } from 'react-feather';
import Select from 'react-select';
import Table from '../../core/pagination/datatable'
import AddSalesReturns from '../../core/modals/sales/addsalesreturns';
import {
  closeBootstrapModal,
  createSaleReturn,
  fetchSaleReturns,
  fetchSales,
} from '../../core/redux/businessAction';
import { showErrorToast, showSuccessToast } from '../../core/utils/toast';
import {
  mapSaleReturnRowsToRegisterRecords,
  mapSaleReturnToInvoicePayload,
} from '../../core/utils/invoiceMappers';
import {
  handleListPdfPreview,
  handleListPrint,
  handleSingleInvoicePdf,
  handleSingleInvoicePrint,
} from '../../core/utils/printHelpers';

const SalesReturn = () => {

  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const dataSource = useSelector((state) => state.salesreturns_data);
  const salesList = useSelector((state) => state.sales_list_data);
  const businessLoading = useSelector((state) => state.business_loading);

  useEffect(() => {
    dispatch(fetchSaleReturns());
    dispatch(fetchSales());
  }, [dispatch]);

  const handleCreateReturn = async (payload) => {
    try {
      await dispatch(createSaleReturn(payload));
      closeBootstrapModal('add-sales-new');
      showSuccessToast('Return Created', 'Sales return saved successfully.');
    } catch (error) {
      showErrorToast('Create Failed', error.message);
    }
  };

  const handlePdfPreview = () => {
    handleListPdfPreview({
      records: mapSaleReturnRowsToRegisterRecords(dataSource),
      subtitle: 'Sales Return Register',
    });
  };

  const handlePrint = () => {
    handleListPrint({
      records: mapSaleReturnRowsToRegisterRecords(dataSource),
      subtitle: 'Sales Return Register',
    });
  };

  const handleRowPdf = (record) => {
    handleSingleInvoicePdf(mapSaleReturnToInvoicePayload(record._raw));
  };

  const handleRowPrint = (record) => {
    handleSingleInvoicePrint(mapSaleReturnToInvoicePayload(record._raw));
  };

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };
  const oldandlatestvalue = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];
  const customer = [
    { value: 'Choose Customer', label: 'Choose Customer' },
    { value: 'Thomas', label: 'Thomas' },
    { value: 'James', label: 'James' },
    { value: 'Beverly', label: 'Beverly' },
  ];
  const status = [
    { value: 'Choose Status', label: 'Choose Status' },
    { value: 'Received', label: 'Received' },
    { value: 'Pending', label: 'Pending' },
  ];
  const paymentstatus = [
    { value: 'Choose Payment Status', label: 'Choose Payment Status' },
    { value: 'Unpaid', label: 'Unpaid' },
    { value: 'Paids', label: 'Paids' },
  ];

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  )
  const columns = [

    {
      title: "Product Name",
      dataIndex: "productname",
      render: (text, record) => (
        <div className="productimgname">
          <Link to="#" className="product-img" />
          <ImageWithBasePath alt="img" src={record.img} />
          <Link to="#" className='ms-2'>{text}</Link>

        </div>
      ),
      sorter: (a, b) => a.productname.length - b.productname.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date.length - b.date.length,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      sorter: (a, b) => a.customer.length - b.customer.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div>
          {text === "Received" && (
            <span className="badges bg-lightgreen">{text}</span>
          )}
          {text === "Pending" && (
            <span className="badges bg-lightred">{text}</span>
          )}
          {text === "Ordered" && (
            <span className="badges bg-lightyellow">{text}</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Grand Total ($)",
      dataIndex: "grandtotal",
      sorter: (a, b) => a.grandtotal.length - b.grandtotal.length,
    },
    {
      title: "Paid",
      dataIndex: "paid",
      sorter: (a, b) => a.paid.length - b.paid.length,
    },
    {
      title: "Due ($)",
      dataIndex: "due",
      sorter: (a, b) => a.due.length - b.due.length,
    },
    {
      title: "paymentstatus",
      dataIndex: "paymentstatus",
      render: (text) => (
        <div>
          {text === "Paid" && (
            <span className="badges bg-lightgreen">{text}</span>
          )}
          {text === "Unpaid" && (
            <span className="badges bg-lightred">{text}</span>
          )}
          {text === "Partial" && (
            <span className="badges bg-lightyellow">{text}</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.paymentstatus.length - b.paymentstatus.length,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" to="#" onClick={(e) => { e.preventDefault(); handleRowPdf(record); }}>
              <i data-feather="file-text" className="feather-file-text"></i>
            </Link>
            <Link className="me-2 p-2" to="#" onClick={(e) => { e.preventDefault(); handleRowPrint(record); }}>
              <i data-feather="printer" className="feather-printer"></i>
            </Link>
          </div>
        </div>
      )
    },
  ]
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Sales Return List</h4>
                <h6>Manage your Returns</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link to="#" onClick={(e) => { e.preventDefault(); handlePdfPreview(); }}>
                    <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>

                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <i data-feather="printer" className="feather-printer" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>

                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <RotateCcw />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>

                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    className={data ? "active" : ""}
                    onClick={() => { dispatch(setToogleHeader(!data)) }}
                  >
                    <ChevronUp />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
            <div className="page-btn">
              <Link
                to="#"
                className="btn btn-added"
                data-bs-toggle="modal"
                data-bs-target="#add-sales-new"
              >
                <PlusCircle className="me-2" />
                Add New Sales Return
              </Link>
            </div>
          </div>
          {/* /product list */}
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
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
                <div className="search-path">
                  <Link className={`btn btn-filter ${isFilterVisible ? "setclose" : ""}`} id="filter_search">
                    <Filter
                      className="filter-icon"
                      onClick={toggleFilterVisibility}
                    />
                    <span onClick={toggleFilterVisibility}>
                      <ImageWithBasePath src="assets/img/icons/closes.svg" alt="img" />
                    </span>
                  </Link>
                </div>
                <div className="form-sort">
                  <Sliders className="info-img" />
                  <Select
                    className="select"
                    options={oldandlatestvalue}
                    placeholder="Newest"
                  />
                </div>
              </div>
              {/* /Filter */}
              <div
                className={`card${isFilterVisible ? ' visible' : ''}`}
                id="filter_inputs"
                style={{ display: isFilterVisible ? 'block' : 'none' }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <User className="info-img" />

                        <Select
                          className="select"
                          options={customer}
                          placeholder="Choose Brand"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <Zap className="info-img" />

                        <Select
                          className="select"
                          options={status}
                          placeholder="Choose Brand"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">

                        <StopCircle className="info-img" />

                        <Select
                          className="select"
                          options={paymentstatus}
                          placeholder="Choose Brand"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                      <div className="input-blocks">
                        <Link className="btn btn-filters ms-auto">
                          {" "}
                          <i data-feather="search" className="feather-search" />{" "}
                          Search{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table columns={columns} dataSource={dataSource} loading={businessLoading} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <AddSalesReturns sales={salesList} onSubmit={handleCreateReturn} />
    </div>
  )
}

export default SalesReturn
