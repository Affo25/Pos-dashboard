import { Upload } from 'feather-icons-react/build/IconComponents'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import SettingsSideBar from '../settingssidebar'
import ImageWithBasePath from '../../../core/img/imagewithbasebath'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSettings, updateSettings, uploadInvoiceLogo } from '../../../core/redux/businessAction'
import { API_BASE_URL } from '../../../core/api/config'
import { showErrorToast, showSuccessToast } from '../../../core/utils/toast'

const TEMPLATE_OPTIONS = [
    { value: 'report_a4', label: 'A4 Invoice (Report)' },
    { value: 'a4_80mm_strip', label: 'A4 + 80mm Strip' },
    { value: 'pos_receipt', label: 'POS Receipt (80mm)' },
    { value: 'restaurant_80mm', label: 'Restaurant 80mm' },
];

const POS_LAYOUT_OPTIONS = [
    { value: 'tabular', label: 'Tabular' },
    { value: 'gridview', label: 'Grid View' },
];

const InvoiceSettings = () => {
    const dispatch = useDispatch();
    const appSettings = useSelector((state) => state.app_settings);
    const businessLoading = useSelector((state) => state.business_loading);
    const design = appSettings?.invoiceDesign || {};

    const [footerText, setFooterText] = useState('');
    const [headerText, setHeaderText] = useState('');
    const [template, setTemplate] = useState('a4_80mm_strip');
    const [primaryColor, setPrimaryColor] = useState('#2563eb');
    const [secondaryColor, setSecondaryColor] = useState('#1a3a34');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gstin, setGstin] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [receiptPoweredBy, setReceiptPoweredBy] = useState('');
    const [receiptWebsite, setReceiptWebsite] = useState('');
    const [posLayout, setPosLayout] = useState('tabular');

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    useEffect(() => {
        setFooterText(design.footerText || '');
        setHeaderText(design.tagline || '');
        setTemplate(design.template || 'a4_80mm_strip');
        setPrimaryColor(design.primaryColor || '#2563eb');
        setSecondaryColor(design.secondaryColor || '#1a3a34');
        setCompanyName(design.companyName || '');
        setEmail(design.email || '');
        setPhone(design.phone || '');
        setAddress(design.address || '');
        setGstin(design.gstin || '');
        setRegNumber(design.regNumber || '');
        setReceiptPoweredBy(design.receiptPoweredBy || '');
        setReceiptWebsite(design.receiptWebsite || '');
        setPosLayout(design.posLayout || 'tabular');
    }, [appSettings]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateSettings({
                footerText,
                tagline: headerText,
                template,
                primaryColor,
                secondaryColor,
                companyName,
                email,
                phone,
                address,
                gstin,
                regNumber,
                receiptPoweredBy,
                receiptWebsite,
                posLayout,
            }));
            showSuccessToast('Settings Saved', 'Invoice settings updated successfully.');
        } catch (error) {
            showErrorToast('Save Failed', error.message);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await dispatch(uploadInvoiceLogo(file));
            showSuccessToast('Logo Uploaded', 'Invoice logo updated successfully.');
        } catch (error) {
            showErrorToast('Upload Failed', error.message);
        }
    };

    const logoSrc = design.logoUrl
        ? `${API_BASE_URL}${design.logoUrl}`
        : 'assets/img/logo-small.png';

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
                                <Link to="#" onClick={(e) => { e.preventDefault(); dispatch(fetchSettings()); }}>
                                    <i data-feather="rotate-ccw" className="feather-rotate-ccw" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="settings-wrapper d-flex">
                                <SettingsSideBar />
                                <div className="settings-page-wrap">
                                    <form onSubmit={handleSave}>
                                        <div className="setting-title">
                                            <h4>Invoice Settings</h4>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-7">
                                                <div className="company-info border-0">
                                                    <ul className="logo-company">
                                                        <li>
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <div className="logo-info me-0 mb-3 mb-md-0">
                                                                        <h6>Invoice Logo</h6>
                                                                        <p>Upload logo displayed on invoices and POS receipts.</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="profile-pic-upload mb-0 me-0">
                                                                        <div className="image-upload mb-0">
                                                                            <input type="file" accept="image/*" onChange={handleLogoUpload} />
                                                                            <div className="image-uploads">
                                                                                <h4><Upload /> Upload Photo</h4>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <ImageWithBasePath src={logoSrc} alt="Logo" />
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>

                                                    <div className="localization-info">
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Company Name</h6></div>
                                                            <div className="col-sm-8">
                                                                <input className="form-control" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Email</h6></div>
                                                            <div className="col-sm-8">
                                                                <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Phone</h6></div>
                                                            <div className="col-sm-8">
                                                                <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Address</h6></div>
                                                            <div className="col-sm-8">
                                                                <textarea className="form-control" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>GSTIN</h6></div>
                                                            <div className="col-sm-8">
                                                                <input className="form-control" value={gstin} onChange={(e) => setGstin(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Registration No.</h6></div>
                                                            <div className="col-sm-8">
                                                                <input className="form-control" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Invoice Template</h6></div>
                                                            <div className="col-sm-8">
                                                                <Select
                                                                    className="select"
                                                                    options={TEMPLATE_OPTIONS}
                                                                    value={TEMPLATE_OPTIONS.find((opt) => opt.value === template)}
                                                                    onChange={(opt) => setTemplate(opt?.value || 'a4_80mm_strip')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>POS Layout</h6></div>
                                                            <div className="col-sm-8">
                                                                <Select
                                                                    className="select"
                                                                    options={POS_LAYOUT_OPTIONS}
                                                                    value={POS_LAYOUT_OPTIONS.find((opt) => opt.value === posLayout)}
                                                                    onChange={(opt) => setPosLayout(opt?.value || 'tabular')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Primary Color</h6></div>
                                                            <div className="col-sm-8">
                                                                <input type="color" className="form-control form-control-color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Secondary Color</h6></div>
                                                            <div className="col-sm-8">
                                                                <input type="color" className="form-control form-control-color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col-sm-4"><h6>Header Terms</h6></div>
                                                            <div className="col-sm-8">
                                                                <textarea className="form-control" rows={3} value={headerText} onChange={(e) => setHeaderText(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col-sm-4"><h6>Footer Terms</h6></div>
                                                            <div className="col-sm-8">
                                                                <textarea className="form-control" rows={3} value={footerText} onChange={(e) => setFooterText(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Receipt Powered By</h6></div>
                                                            <div className="col-sm-8">
                                                                <input className="form-control" value={receiptPoweredBy} onChange={(e) => setReceiptPoweredBy(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="row align-items-center mb-3">
                                                            <div className="col-sm-4"><h6>Receipt Website</h6></div>
                                                            <div className="col-sm-8">
                                                                <input className="form-control" value={receiptWebsite} onChange={(e) => setReceiptWebsite(e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-5">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="mb-3">Invoice Preview</h5>
                                                        <div className="text-center mb-3">
                                                            <ImageWithBasePath src={logoSrc} width={80} alt="preview logo" />
                                                        </div>
                                                        <div className="text-center">
                                                            <h6 style={{ color: primaryColor }}>{companyName || 'Company Name'}</h6>
                                                            <p className="mb-0 small">{headerText || 'Tagline'}</p>
                                                            <p className="mb-0 small">{address || 'Address'}</p>
                                                            <p className="mb-0 small">{phone && `Phone: ${phone}`}</p>
                                                            <p className="mb-0 small">{email && `Email: ${email}`}</p>
                                                            {gstin && <p className="mb-0 small">GSTIN: {gstin}</p>}
                                                            {regNumber && <p className="mb-0 small">Reg: {regNumber}</p>}
                                                        </div>
                                                        <hr />
                                                        <table className="table table-sm table-borderless mb-2">
                                                            <tbody>
                                                                <tr>
                                                                    <td>Sample Product</td>
                                                                    <td className="text-end">$10.00</td>
                                                                </tr>
                                                                <tr>
                                                                    <td><strong>Total</strong></td>
                                                                    <td className="text-end"><strong>$10.00</strong></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <p className="text-center small mb-0" style={{ color: secondaryColor }}>
                                                            {footerText || 'Thank you for your business!'}
                                                        </p>
                                                        {receiptPoweredBy && (
                                                            <p className="text-center small mb-0 mt-2">{receiptPoweredBy}</p>
                                                        )}
                                                        {receiptWebsite && (
                                                            <p className="text-center small mb-0">{receiptWebsite}</p>
                                                        )}
                                                        <p className="text-muted small text-center mt-3 mb-0">
                                                            Template: {template}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer-btn">
                                            <button type="submit" className="btn btn-submit" disabled={businessLoading}>
                                                {businessLoading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceSettings
