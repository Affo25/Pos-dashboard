import { API_BASE_URL } from "../api/config";
import { apiRequest } from "../api/apiClient";
import {
  flattenPurchaseReturns,
  mapPurchaseOrderToRow,
  mapSaleReturnToRow,
  mapSaleToInvoiceReportRow,
  mapSaleToListRow,
  mapSupplierToRow,
  mapUserToListRow,
} from "../utils/businessMappers";
import { closeBootstrapModal } from "./inventoryAction";

export const setSupplierData = (payload) => ({
  type: "Supplier_data",
  payload,
});

export const setSalesListData = (payload) => ({
  type: "Sales_list_data",
  payload,
});

export const setPurchaseOrdersData = (payload) => ({
  type: "Purchase_orders_data",
  payload,
});

export const setInvoiceReportData = (payload) => ({
  type: "Invoicereport_Data",
  payload,
});

export const setAppSettings = (payload) => ({
  type: "App_settings",
  payload,
});

export const setBusinessLoading = (payload) => ({
  type: "BUSINESS_LOADING",
  payload,
});

const withLoading = async (dispatch, callback) => {
  dispatch(setBusinessLoading(true));
  try {
    return await callback();
  } finally {
    dispatch(setBusinessLoading(false));
  }
};

export const fetchSuppliers = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const suppliers = await apiRequest("/api/suppliers");
    dispatch(setSupplierData(suppliers.map(mapSupplierToRow)));
    return suppliers;
  });

export const createSupplier = (payload) => async (dispatch) => {
  const supplier = await apiRequest("/api/suppliers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchSuppliers());
  return supplier;
};

export const updateSupplier = (id, payload) => async (dispatch) => {
  const supplier = await apiRequest(`/api/suppliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchSuppliers());
  return supplier;
};

export const deleteSupplier = (id) => async (dispatch) => {
  await apiRequest(`/api/suppliers/${id}`, { method: "DELETE" });
  await dispatch(fetchSuppliers());
};

export const fetchSales = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const sales = await apiRequest("/api/sales");
    const rows = sales.map(mapSaleToListRow);
    dispatch(setSalesListData(rows));
    dispatch(setInvoiceReportData(sales.map(mapSaleToInvoiceReportRow)));
    return sales;
  });

export const updateSale = (id, payload) => async (dispatch) => {
  const sale = await apiRequest(`/api/sales/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchSales());
  return sale;
};

export const deleteSale = (id) => async (dispatch) => {
  await apiRequest(`/api/sales/${id}`, { method: "DELETE" });
  await dispatch(fetchSales());
};

export const fetchPurchaseOrders = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const orders = await apiRequest("/api/purchaseOrders");
    dispatch(setPurchaseOrdersData(orders.map(mapPurchaseOrderToRow)));
    return orders;
  });

export const createPurchaseOrder = (payload) => async (dispatch) => {
  const order = await apiRequest("/api/purchaseOrders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchPurchaseOrders());
  return order;
};

export const updatePurchaseOrder = (id, payload) => async (dispatch) => {
  const order = await apiRequest(`/api/purchaseOrders/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchPurchaseOrders());
  return order;
};

export const deletePurchaseOrder = (id) => async (dispatch) => {
  await apiRequest(`/api/purchaseOrders/${id}`, { method: "DELETE" });
  await dispatch(fetchPurchaseOrders());
};

export const fetchSettings = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const response = await apiRequest("/api/settings");
    dispatch(setAppSettings(response.settings || null));
    return response.settings;
  });

export const updateSettings = (invoiceDesign) => async (dispatch) => {
  const response = await apiRequest("/api/settings", {
    method: "PUT",
    body: JSON.stringify({ invoiceDesign }),
  });
  dispatch(setAppSettings(response.settings || null));
  return response.settings;
};

export const uploadInvoiceLogo = (file) => async (dispatch) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/settings/invoice-logo`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Logo upload failed");
  }

  dispatch(setAppSettings(data.settings || null));
  return data;
};

export const setUserListData = (payload) => ({
  type: "Userlist_data",
  payload,
});

export const fetchUsers = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const users = await apiRequest("/api/users");
    dispatch(setUserListData(users.map(mapUserToListRow)));
    return users;
  });

export const createUser = (payload) => async (dispatch) => {
  const user = await apiRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchUsers());
  return user;
};

export const updateUser = (id, payload) => async (dispatch) => {
  const user = await apiRequest(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchUsers());
  return user;
};

export const deleteUser = (id) => async (dispatch) => {
  await apiRequest(`/api/users/${id}`, { method: "DELETE" });
  await dispatch(fetchUsers());
};

export const toggleUserBlock = (id, isBlocked) => async (dispatch) => {
  await apiRequest(`/api/users/${id}/block`, {
    method: "PUT",
    body: JSON.stringify({ is_blocked: isBlocked }),
  });
  await dispatch(fetchUsers());
};

export const setSalesReturnsData = (payload) => ({
  type: "Salesreturns_Data",
  payload,
});

export const setPurchaseReturnsData = (payload) => ({
  type: "Purchase_returns_data",
  payload,
});

export const fetchSaleReturns = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const response = await apiRequest("/api/returns?limit=500");
    const returns = response.returns || response || [];
    dispatch(setSalesReturnsData(returns.map(mapSaleReturnToRow)));
    return returns;
  });

export const createSaleReturn = (payload) => async (dispatch) => {
  const result = await apiRequest("/api/returns", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchSaleReturns());
  await dispatch(fetchSales());
  return result;
};

export const fetchPurchaseReturns = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const orders = await apiRequest("/api/purchaseOrders");
    dispatch(setPurchaseReturnsData(flattenPurchaseReturns(orders)));
    return orders;
  });

export const createPurchaseReturn = (orderId, payload) => async (dispatch) => {
  const result = await apiRequest(`/api/purchaseOrders/${orderId}/returns`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchPurchaseReturns());
  await dispatch(fetchPurchaseOrders());
  return result;
};

export const fetchCustomers = () => async (dispatch) => {
  const customers = await apiRequest("/api/customers");
  dispatch({ type: "customer_data", payload: customers });
  return customers;
};

export const createBilling = (payload) => async (dispatch) => {
  const sale = await apiRequest("/api/sales/billing", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchSales());
  return sale;
};

export const fetchNextInvoiceNumber = () =>
  apiRequest("/api/sales/next-invoice-number");

export const fetchSaleInvoice = (id) => apiRequest(`/api/sales/invoice/${id}`);

export const fetchPurchaseOrderById = (id) =>
  apiRequest(`/api/purchaseOrders/${id}`);

export { closeBootstrapModal };
