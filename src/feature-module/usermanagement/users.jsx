import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
    createUser,
    deleteUser,
    getAllUsers,
    mapUserToListRow,
    updateUser,
} from '../../core/api/userApi';
import { showErrorToast, showSuccessToast } from '../../core/utils/toast';
import { isAdminRole } from '../../core/utils/authHelpers';
import { closeBootstrapModal } from '../../core/utils/modal';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { ChevronUp, RotateCcw } from 'feather-icons-react/build/IconComponents';
import { setToogleHeader } from '../../core/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, PlusCircle, Sliders, StopCircle, User, Zap } from 'react-feather';
import Select from 'react-select';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Table from '../../core/pagination/datatable'
import AddUsers from '../../core/modals/usermanagement/addusers';
import EditUser from '../../core/modals/usermanagement/edituser';


const Users = () => {
    const navigate = useNavigate();
    const authUser = useSelector((state) => state.auth_user);

    const oldandlatestvalue = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
    ];
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];
    const roleOptions = [
        { value: 'all', label: 'All Roles' },
        { value: 'superAdmin', label: 'Super Admin' },
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'client', label: 'Client' },
    ];

    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllUsers();
            const rows = (response.data || []).map(mapUserToListRow);
            setUsers(rows);
        } catch (error) {
            showErrorToast('Load Failed', error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAdminRole(authUser?.user_type)) {
            navigate('/');
            return;
        }
        loadUsers();
    }, [authUser, navigate, loadUsers]);

    if (!isAdminRole(authUser?.user_type)) {
        return null;
    }

    const canManageSuperAdmin = authUser?.user_type === 'superAdmin';

    const handleCreateUser = async (payload) => {
        try {
            await createUser(payload);
            closeBootstrapModal('add-units');
            showSuccessToast('User Created', 'User added successfully.');
            await loadUsers();
        } catch (error) {
            showErrorToast('Create Failed', error.message);
        }
    };

    const handleUpdateUser = async (id, payload) => {
        try {
            await updateUser(id, payload);
            closeBootstrapModal('edit-units');
            showSuccessToast('User Updated', 'User saved successfully.');
            await loadUsers();
        } catch (error) {
            showErrorToast('Update Failed', error.message);
        }
    };

    const dataSource = useMemo(() => {
        let rows = [...users];

        if (searchText.trim()) {
            const query = searchText.trim().toLowerCase();
            rows = rows.filter(
                (row) =>
                    row.username.toLowerCase().includes(query) ||
                    row.email.toLowerCase().includes(query) ||
                    row.phone.toLowerCase().includes(query) ||
                    row.role.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'all') {
            rows = rows.filter(
                (row) => row._raw?.status?.toLowerCase() === statusFilter
            );
        }

        if (roleFilter !== 'all') {
            rows = rows.filter((row) => row._raw?.user_type === roleFilter);
        }

        rows.sort((a, b) => {
            const aDate = new Date(a._raw?.created_at || 0).getTime();
            const bDate = new Date(b._raw?.created_at || 0).getTime();
            return sortOrder === 'oldest' ? aDate - bDate : bDate - aDate;
        });

        return rows;
    }, [users, searchText, statusFilter, roleFilter, sortOrder]);

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
    )

    const columns = [

        {
            title: "User Name",
            dataIndex: "username",
            render: (text, record) => (
                <span className="userimgname">
                    <Link to="#" className="userslist-img bg-img">
                        <ImageWithBasePath alt="" src={record.img} />
                    </Link>
                    <div>
                    <Link to="#">{text}</Link>
                    </div>
                </span>
            ),
            sorter: (a, b) => a.username.localeCompare(b.username),
        },

        {
            title: "Phone",
            dataIndex: "phone",
            sorter: (a, b) => a.phone.localeCompare(b.phone),
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Role",
            dataIndex: "role",
            sorter: (a, b) => a.role.localeCompare(b.role),
        },
        {
            title: "Created On",
            dataIndex: "createdon",
            sorter: (a, b) =>
                new Date(a._raw?.created_at || 0) - new Date(b._raw?.created_at || 0),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => (
                <div>
                  {text === "Active" && (
                    <span className="badge badge-linesuccess">{text}</span>
                  )}
                  {text === "Inactive" && (
                    <span className="badge badge-linedanger">{text}</span>
                  )}
                  
                </div>
              ),
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <td className="action-table-data">
                    <div className="edit-delete-action">
                        
                        <Link className="me-2 p-2" to="#">
                            <i data-feather="eye" className="feather feather-eye action-eye"></i>
                        </Link>
                        <Link
                            className="me-2 p-2"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-units"
                            onClick={() => setSelectedUser(record)}
                        >
                            <i data-feather="edit" className="feather-edit"></i>
                        </Link>
                        <Link className="confirm-text p-2" to="#"  >
                            <i
                                data-feather="trash-2"
                                className="feather-trash-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    showConfirmationAlert(record);
                                }}
                            ></i>
                        </Link>
                    </div>
                </td>
            )
        },
    ]
    const MySwal = withReactContent(Swal);

    const showConfirmationAlert = (record) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            showCancelButton: true,
            confirmButtonColor: '#00ff00',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonColor: '#ff0000',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser(record.id);
                    showSuccessToast('Deleted', 'User removed successfully.');
                    await loadUsers();
                } catch (error) {
                    showErrorToast('Delete Failed', error.message);
                }
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
                                <h4>User List</h4>
                                <h6>Manage Your Users</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
                            <li>
                                <OverlayTrigger placement="top" overlay={renderTooltip}>
                                    <Link>
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

                                    <Link
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            loadUsers();
                                        }}
                                    >
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
                            <a
                                to="#"
                                className="btn btn-added"
                                data-bs-toggle="modal"
                                data-bs-target="#add-units"
                            >
                                <PlusCircle className="me-2" />
                                Add New User
                            </a>
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
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
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
                                        value={oldandlatestvalue.find((o) => o.value === sortOrder)}
                                        onChange={(option) => setSortOrder(option?.value || 'newest')}
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
                                                    options={users.map((u) => ({
                                                        value: u.id,
                                                        label: u.username,
                                                    }))}
                                                    placeholder="Choose Name"
                                                    onChange={(option) =>
                                                        setSearchText(option?.label || '')
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <StopCircle className="info-img" />

                                                <Select
                                                    className="select"
                                                    options={statusOptions}
                                                    placeholder="Choose Status"
                                                    value={statusOptions.find((o) => o.value === statusFilter)}
                                                    onChange={(option) =>
                                                        setStatusFilter(option?.value || 'all')
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <Zap className="info-img" />

                                                <Select
                                                    className="select"
                                                    options={roleOptions}
                                                    placeholder="Choose Role"
                                                    value={roleOptions.find((o) => o.value === roleFilter)}
                                                    onChange={(option) =>
                                                        setRoleFilter(option?.value || 'all')
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6 col-12">
                                            <div className="input-blocks">
                                                <a
                                                    className="btn btn-filters ms-auto"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                >
                                                    {" "}
                                                    <i data-feather="search" className="feather-search" />{" "}
                                                    Search{" "}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Filter */}
                            <div className="table-responsive">
                                <Table columns={columns} dataSource={dataSource} loading={loading} />

                            </div>
                        </div>
                    </div>
                    {/* /product list */}
                </div>
            </div>
        <AddUsers
            onSubmit={handleCreateUser}
            loading={loading}
            allowSuperAdmin={canManageSuperAdmin}
        />
        <EditUser
            selectedUser={selectedUser}
            onSubmit={handleUpdateUser}
            loading={loading}
            allowSuperAdmin={canManageSuperAdmin}
        />
        </div>
    )
}

export default Users
