import PurchasesListRows from './PurchasesListRows';
import {
    closeBootstrapModal,
    createPurchaseOrder,
    createPurchaseReturn,
    deletePurchaseOrder,
    fetchPurchaseOrderById,
    fetchPurchaseOrders,
    fetchSuppliers,
    updatePurchaseOrder,
} from '../../core/redux/businessAction';
import ReturnPurchaseItemModal from '../../core/modals/purchases/returnpurchaseitem';
import { fetchProducts } from '../../core/redux/inventoryAction';
import { showErrorToast, showSuccessToast } from '../../core/utils/toast';
import {
    mapPurchaseRowsToRegisterRecords,
    mapPurchaseToInvoicePayload,
} from '../../core/utils/invoiceMappers';
import {
    handleListPdfPreview,
    handleListPrint,
    handleSingleInvoicePdf,
    handleSingleInvoicePrint,
} from '../../core/utils/printHelpers';
import React, { useEffect, useState } from 'react'
import ImageWithBasePath from '../../core/img/imagewithbasebath'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ChevronUp, Download, Eye, File, Filter, PlusCircle, RotateCcw, Sliders, StopCircle, User } from 'feather-icons-react/build/IconComponents';
import { setToogleHeader } from '../../core/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import AddPurchases from '../../core/modals/purchases/addpurchases';
import ImportPurchases from '../../core/modals/purchases/importpurchases';
import EditPurchases from '../../core/modals/purchases/editpurchases';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const openReturnModal = (modalId) => {
    const el = document.getElementById(modalId);
    if (el && window.bootstrap?.Modal) {
        window.bootstrap.Modal.getOrCreateInstance(el).show();
    }
};

const PurchasesList = () => {
    const dispatch = useDispatch();
    const purchaseOrders = useSelector((state) => state.purchase_orders_data);
    const businessLoading = useSelector((state) => state.business_loading);
    const [editPurchase, setEditPurchase] = useState(null);
    const [returnPurchase, setReturnPurchase] = useState(null);
    const [savingPurchase, setSavingPurchase] = useState(false);
    const MySwal = withReactContent(Swal);

    const handlePdfPreview = () => {
        handleListPdfPreview({
            records: mapPurchaseRowsToRegisterRecords(purchaseOrders),
            subtitle: 'Purchase Order Register',
        });
    };

    const handlePrint = () => {
        handleListPrint({
            records: mapPurchaseRowsToRegisterRecords(purchaseOrders),
            subtitle: 'Purchase Order Register',
        });
    };

    const handleRowPdf = async (order) => {
        try {
            const po = await fetchPurchaseOrderById(order.id);
            await handleSingleInvoicePdf(
                mapPurchaseToInvoicePayload(po),
                'purchase_order_a4'
            );
        } catch (error) {
            showErrorToast('PDF Failed', error.message);
        }
    };

    const handleRowPrint = async (order) => {
        try {
            const po = await fetchPurchaseOrderById(order.id);
            await handleSingleInvoicePrint(
                mapPurchaseToInvoicePayload(po),
                'purchase_order_a4'
            );
        } catch (error) {
            showErrorToast('Print Failed', error.message);
        }
    };

    const handleReturnPurchase = async (order) => {
        try {
            const fullOrder = await fetchPurchaseOrderById(order.id);
            setReturnPurchase(fullOrder);
            openBootstrapModal('return-purchase-item-modal');
        } catch (error) {
            showErrorToast('Load Failed', error.message);
        }
    };

    const handleEditPurchase = async (order) => {
        try {
            const fullOrder = await fetchPurchaseOrderById(order.id);
            setEditPurchase(fullOrder);
            openBootstrapModal('edit-units');
        } catch (error) {
            showErrorToast('Load Failed', error.message);
        }
    };

    const handleSubmitEditPurchase = async (payload) => {
        if (!editPurchase?._id) return;
        setSavingPurchase(true);
        try {
            await dispatch(updatePurchaseOrder(editPurchase._id, payload));
            closeBootstrapModal('edit-units');
            showSuccessToast('Purchase Updated', 'Purchase order updated successfully.');
            setEditPurchase(null);
        } catch (error) {
            showErrorToast('Update Failed', error.message);
        } finally {
            setSavingPurchase(false);
        }
    };

    const handleSubmitPurchaseReturn = async (orderId, payload) => {
        try {
            await dispatch(createPurchaseReturn(orderId, payload));
            closeBootstrapModal('return-purchase-item-modal');
            showSuccessToast('Return Created', 'Purchase return saved successfully.');
            setReturnPurchase(null);
        } catch (error) {
            showErrorToast('Return Failed', error.message);
        }
    };

    const handleCreatePurchase = async (payload) => {
        try {
            await dispatch(createPurchaseOrder(payload));
            closeBootstrapModal('add-units');
            showSuccessToast('Purchase Created', 'Purchase order saved successfully.');
        } catch (error) {
            showErrorToast('Create Failed', error.message);
        }
    };

    useEffect(() => {
        dispatch(fetchPurchaseOrders());
        dispatch(fetchSuppliers());
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDeletePurchase = (order) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to revert this!',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await dispatch(deletePurchaseOrder(order.id));
                    showSuccessToast('Deleted', 'Purchase order removed successfully.');
                } catch (error) {
                    showErrorToast('Delete Failed', error.message);
                }
            }
        });
    };

    const data = useSelector((state) => state.toggle_header);

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const toggleFilterVisibility = () => {
        setIsFilterVisible((prevVisibility) => !prevVisibility);
    };
    const oldandlatestvalue = [
        { value: 'date', label: 'Sort by Date' },
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
    ];

    const suppliername = [
        { value: 'chooseSupplier', label: 'Choose Supplier Name' },
        { value: 'apexComputers', label: 'Apex Computers' },
        { value: 'beatsHeadphones', label: 'Beats Headphones' },
        { value: 'dazzleShoes', label: 'Dazzle Shoes' },
        { value: 'bestAccessories', label: 'Best Accessories' },
      ];
      const status = [
        { value: 'chooseStatus', label: 'Choose Status' },
        { value: 'received', label: 'Received' },
        { value: 'ordered', label: 'Ordered' },
        { value: 'pending', label: 'Pending' },
      ];
      const refrencecode = [
        { value: 'enterReference', label: 'Enter Reference' },
        { value: 'PT001', label: 'PT001' },
        { value: 'PT002', label: 'PT002' },
        { value: 'PT003', label: 'PT003' },
      ];
      const paymentstatus = [
        { value: 'choosePaymentStatus', label: 'Choose Payment Status' },
        { value: 'paid', label: 'Paid' },
        { value: 'partial', label: 'Partial' },
        { value: 'unpaid', label: 'Unpaid' },
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
    );
    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header transfer">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Purchase List</h4>
                                <h6>Manage your purchases</h6>
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
                                    <Link to="#" onClick={(e) => { e.preventDefault(); dispatch(fetchPurchaseOrders()); }}>
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
                        <div className="d-flex purchase-pg-btn">
                            <div className="page-btn">
                                <Link
                                    to="#"
                                    className="btn btn-added"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add-units"
                                >
                                    
                                    <PlusCircle className="me-2"/> 
                                    Add New Purchase
                                </Link>
                            </div>
                            <div className="page-btn import">
                                <Link
                                    to="#"
                                    className="btn btn-added color"
                                    data-bs-toggle="modal"
                                    data-bs-target="#view-notes"
                                >
                                  
                                    <Download  className="me-2"/>
                                    Import Purchase
                                </Link>
                            </div>
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
                                        <div className="col-lg-2 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <User className="info-img"/>
                                                <Select options={suppliername} className="select" placeholder="Choose Supplier Name" />

                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <StopCircle  className="info-img"/>
                                                <Select options={status} className="select" placeholder="Choose Status" />

                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <File className="info-img"/>
                                                <Select options={refrencecode} className="select" placeholder="Enter Reference" />

                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <i className="fas fa-money-bill info-img" />
                                                <Select options={paymentstatus} className="select" placeholder="Choose Payment Status" />

                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-6 col-12 ms-auto">
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
                            <div className="table-responsive product-list">
                                <table className="table  datanew list">
                                    <thead>
                                        <tr>
                                            <th className="no-sort">
                                                <label className="checkboxs">
                                                    <input type="checkbox" id="select-all" />
                                                    <span className="checkmarks" />
                                                </label>
                                            </th>
                                            <th>Supplier Name</th>
                                            <th>Reference</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Grand Total</th>
                                            <th>Paid</th>
                                            <th>Due</th>
                                            <th>Created by</th>
                                            <th className="no-sort">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <PurchasesListRows
                                            data={purchaseOrders}
                                            onDelete={handleDeletePurchase}
                                            onEdit={handleEditPurchase}
                                            onPdf={handleRowPdf}
                                            onPrint={handleRowPrint}
                                            onReturn={handleReturnPurchase}
                                        />
</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* /product list */}
                </div>
            </div>
        <AddPurchases onSubmit={handleCreatePurchase} loading={businessLoading} />
        <ImportPurchases />
        <EditPurchases
            order={editPurchase}
            onSubmit={handleSubmitEditPurchase}
            loading={savingPurchase}
        />
        <ReturnPurchaseItemModal
            order={returnPurchase}
            onSubmit={handleSubmitPurchaseReturn}
        />
        </div>
    )
}

export default PurchasesList
