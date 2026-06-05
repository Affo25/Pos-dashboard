import React, { useEffect, useState } from 'react'
import ImageWithBasePath from '../../core/img/imagewithbasebath'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { setToogleHeader } from '../../core/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronUp, PlusCircle, RotateCcw, Sliders, StopCircle } from 'feather-icons-react/build/IconComponents';
import { Filter } from 'react-feather';
import Select from 'react-select';
import { DatePicker } from 'antd';
import AddPurchaseReturn from '../../core/modals/purchases/addpurchasereturn';
import {
    closeBootstrapModal,
    createPurchaseReturn,
    fetchPurchaseOrders,
    fetchPurchaseReturns,
} from '../../core/redux/businessAction';
import { showErrorToast, showSuccessToast } from '../../core/utils/toast';
import {
    mapPurchaseReturnRowsToRegisterRecords,
    mapPurchaseReturnToInvoicePayload,
} from '../../core/utils/invoiceMappers';
import {
    handleListPdfPreview,
    handleListPrint,
    handleSingleInvoicePdf,
    handleSingleInvoicePrint,
} from '../../core/utils/printHelpers';

const PurchaseReturns = () => {

    const oldandlatestvalue = [
        { value: 'date', label: 'Sort by Date' },
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
    ];
    const supplier = [
        { value: 'chooseSupplier', label: 'Choose Supplier' },
        { value: 'apexComputers', label: 'Apex Computers' },
        { value: 'modernAutomobile', label: 'Modern Automobile' },
        { value: 'aimInfotech', label: 'AIM Infotech' },
      ];
      const supplierlist = [
        { value: 'chooseSupplier', label: 'Choose Supplier' },
        { value: 'apexComputers', label: 'Apex Computers' },
        { value: 'modernAutomobile', label: 'Modern Automobile' },
        { value: 'aimInfotech', label: 'AIM Infotech' },
      ];
    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const returnData = useSelector((state) => state.purchase_returns_data);
    const purchaseOrders = useSelector((state) => state.purchase_orders_data);
    const businessLoading = useSelector((state) => state.business_loading);

    useEffect(() => {
        dispatch(fetchPurchaseReturns());
        dispatch(fetchPurchaseOrders());
    }, [dispatch]);

    const handleCreateReturn = async (orderId, payload) => {
        try {
            await dispatch(createPurchaseReturn(orderId, payload));
            closeBootstrapModal('add-sales-new');
            showSuccessToast('Return Created', 'Purchase return saved successfully.');
        } catch (error) {
            showErrorToast('Create Failed', error.message);
        }
    };

    const handlePdfPreview = () => {
        handleListPdfPreview({
            records: mapPurchaseReturnRowsToRegisterRecords(returnData),
            subtitle: 'Purchase Return Register',
        });
    };

    const handlePrint = () => {
        handleListPrint({
            records: mapPurchaseReturnRowsToRegisterRecords(returnData),
            subtitle: 'Purchase Return Register',
        });
    };

    const handleRowPdf = (row) => {
        const { order, returnItem } = row._raw;
        handleSingleInvoicePdf(
            mapPurchaseReturnToInvoicePayload(order, returnItem),
            'purchase_order_a4'
        );
    };

    const handleRowPrint = (row) => {
        const { order, returnItem } = row._raw;
        handleSingleInvoicePrint(
            mapPurchaseReturnToInvoicePayload(order, returnItem),
            'purchase_order_a4'
        );
    };

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const toggleFilterVisibility = () => {
        setIsFilterVisible((prevVisibility) => !prevVisibility);
    };

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
    );
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {

                MySwal.fire({
                    title: 'Deleted!',
                    text: 'Your file has been deleted.',
                    className: "btn btn-success",
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                });
            } else {
                MySwal.close();
            }

        });
    };
    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Purchase Return List</h4>
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
                                    <Link to="#" onClick={(e) => { e.preventDefault(); handlePrint(); }}>
                                        <i data-feather="printer" className="feather-printer" />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                                    <Link to="#" onClick={(e) => { e.preventDefault(); dispatch(fetchPurchaseReturns()); }}>
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
                                 <PlusCircle className="me-2"/>
                                Add Purchase Return
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
                                className={`card${isFilterVisible ? " visible" : ""}`}
                                id="filter_inputs"
                                style={{ display: isFilterVisible ? "block" : "none" }}
                            >
                                <div className="card-body pb-0">
                                    <div className="row">
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <i data-feather="calendar" className="info-img" />
                                                <div className="input-groupicon">
                                                <DatePicker
                                                selected={selectedDate}
                                                onChange={handleDateChange}
                                                type="date"
                                                className="filterdatepicker"
                                                dateFormat="dd-MM-yyyy"
                                                placeholder='Choose Date'
                                            />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <StopCircle  className="info-img"/>
                                                <Select options={supplier} className="select" placeholder="Choose Supplier" />

                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <i data-feather="stop-circle" className="info-img" />
                                                <Select options={supplierlist} className="select" placeholder="Choose Supplier" />

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
                                <table className="table datanew">
                                    <thead>
                                        <tr>
                                            <th>
                                                <label className="checkboxs">
                                                    <input type="checkbox" id="select-all" />
                                                    <span className="checkmarks" />
                                                </label>
                                            </th>
                                            <th>Image</th>
                                            <th>Date</th>
                                            <th>Supplier</th>
                                            <th>Reference</th>
                                            <th>Status</th>
                                            <th>Grand Total ($)</th>
                                            <th>Paid ($)</th>
                                            <th>Due ($)</th>
                                            <th>Payment Status</th>
                                            <th className="no-sort">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!returnData.length ? (
                                            <tr>
                                                <td colSpan={11} className="text-center">
                                                    {businessLoading ? 'Loading...' : 'No purchase returns found'}
                                                </td>
                                            </tr>
                                        ) : returnData.map((row) => (
                                            <tr key={row.id}>
                                                <td>
                                                    <label className="checkboxs">
                                                        <input type="checkbox" />
                                                        <span className="checkmarks" />
                                                    </label>
                                                </td>
                                                <td>
                                                    <Link className="product-img" to="#">
                                                        <ImageWithBasePath src={row.img} alt="product" />
                                                    </Link>
                                                </td>
                                                <td>{row.date}</td>
                                                <td>{row.supplier}</td>
                                                <td>{row.reference}</td>
                                                <td>
                                                    <span className="badges bg-lightgreen">{row.status}</span>
                                                </td>
                                                <td>{row.grandTotal}</td>
                                                <td>{row.paid}</td>
                                                <td>{row.due}</td>
                                                <td>
                                                    <span className="badges bg-lightred">{row.paymentStatus}</span>
                                                </td>
                                                <td className="action-table-data">
                                                    <div className="edit-delete-action">
                                                        <Link className="me-2 p-2" to="#" onClick={(e) => { e.preventDefault(); handleRowPdf(row); }}>
                                                            <i data-feather="file-text" className="feather-file-text" />
                                                        </Link>
                                                        <Link className="me-2 p-2" to="#" onClick={(e) => { e.preventDefault(); handleRowPrint(row); }}>
                                                            <i data-feather="printer" className="feather-printer" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* /product list */}
                </div>
            </div>
            <AddPurchaseReturn purchaseOrders={purchaseOrders} onSubmit={handleCreateReturn} />
            
        </div>
    )
}

export default PurchaseReturns
