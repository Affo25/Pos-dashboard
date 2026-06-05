import { ChevronUp, RotateCcw } from 'feather-icons-react/build/IconComponents'
import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { setToogleHeader } from '../../../core/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import SettingsSideBar from '../settingssidebar';
import { fetchPrinters } from '../../../core/api/printApi';
import { showErrorToast, showSuccessToast } from '../../../core/utils/toast';
import { getStoredPrinter } from '../../../core/utils/printHelpers';

const PrinterSettings = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const [printers, setPrinters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [defaultPrinter, setDefaultPrinter] = useState(getStoredPrinter());

    const loadPrinters = async () => {
        setLoading(true);
        try {
            const response = await fetchPrinters();
            setPrinters(response.printers || []);
        } catch (error) {
            showErrorToast('Load Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrinters();
    }, []);

    const handleSetDefault = (name) => {
        localStorage.setItem('default_printer', name);
        setDefaultPrinter(name);
        showSuccessToast('Default Printer', `${name} set as default.`);
    };

    const renderRefreshTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>Refresh</Tooltip>
    );
    const renderCollapseTooltip = (props) => (
        <Tooltip id="collapse-tooltip" {...props}>Collapse</Tooltip>
    );

    return (
        <div>
            <div className="page-wrapper">
                <div className="content settings-content">
                    <div className="page-header settings-pg-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Settings</h4>
                                <h6>Manage your settings on portal</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                                    <Link to="#" onClick={(e) => { e.preventDefault(); loadPrinters(); }}>
                                        <RotateCcw />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                            <li>
                                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                    <Link
                                        id="collapse-header"
                                        className={data ? "active" : ""}
                                        onClick={() => dispatch(setToogleHeader(!data))}
                                        to="#"
                                    >
                                        <ChevronUp />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="settings-wrapper d-flex">
                                <SettingsSideBar />
                                <div className="settings-page-wrap w-50">
                                    <div className="setting-title">
                                        <h4>Printer Settings</h4>
                                        <p className="text-muted">
                                            Select the default Windows printer for invoices and POS receipts.
                                        </p>
                                    </div>
                                    <div className="card table-list-card">
                                        <div className="card-body">
                                            {loading ? (
                                                <p>Loading printers...</p>
                                            ) : !printers.length ? (
                                                <p>No printers found. Ensure backend can access Windows printers.</p>
                                            ) : (
                                                <div className="table-responsive">
                                                    <table className="table datanew">
                                                        <thead>
                                                            <tr>
                                                                <th>Printer Name</th>
                                                                <th>Driver</th>
                                                                <th>Status</th>
                                                                <th>Default</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {printers.map((printer) => (
                                                                <tr key={printer.name}>
                                                                    <td>{printer.name}</td>
                                                                    <td>{printer.driver || '—'}</td>
                                                                    <td>{printer.status || '—'}</td>
                                                                    <td>
                                                                        {defaultPrinter === printer.name ? (
                                                                            <span className="badge badge-linesuccess">Default</span>
                                                                        ) : (
                                                                            '—'
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-primary"
                                                                            onClick={() => handleSetDefault(printer.name)}
                                                                        >
                                                                            Set Default
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrinterSettings;
