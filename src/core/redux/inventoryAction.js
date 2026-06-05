import { API_BASE_URL } from "../api/config";
import { apiRequest } from "../api/apiClient";
import {
  mapCategoryToListRow,
  mapProductToExpiredRow,
  mapProductToListRow,
  mapProductToLowStockRow,
  mapProductToStockRow,
  mapProductToTransferRow,
  mapSubCategoryToListRow,
} from "../utils/inventoryMappers";

export const setProductList = (payload) => ({
  type: "Product_list",
  payload,
});

export const setCategoryList = (payload) => ({
  type: "Categotylist_data",
  payload,
});

export const setSubCategoryList = (payload) => ({
  type: "Subcategory_data",
  payload,
});

export const setManageStockData = (payload) => ({
  type: "Managestock_data",
  payload,
});

export const setStockTransferData = (payload) => ({
  type: "Stocktransfer_data",
  payload,
});

export const setLowStockData = (payload) => ({
  type: "Lowstock_data",
  payload,
});

export const setExpiredProductData = (payload) => ({
  type: "Expiredproduct_data",
  payload,
});

export const setStockReportSummary = (payload) => ({
  type: "Stock_report_summary",
  payload,
});

export const setInventoryLoading = (payload) => ({
  type: "INVENTORY_LOADING",
  payload,
});

const withLoading = async (dispatch, callback) => {
  dispatch(setInventoryLoading(true));
  try {
    return await callback();
  } finally {
    dispatch(setInventoryLoading(false));
  }
};

export const fetchProducts = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const products = await apiRequest("/api/products");
    dispatch(setProductList(products.map(mapProductToListRow)));
    return products;
  });

export const createProduct = (payload) => async (dispatch) => {
  const product = await apiRequest("/api/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchProducts());
  return product;
};

export const updateProduct = (id, payload) => async (dispatch) => {
  const response = await apiRequest(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchStockReport());
  await dispatch(fetchProducts());
  return response;
};

export const deleteProduct = (id) => async (dispatch) => {
  await apiRequest(`/api/products/${id}`, { method: "DELETE" });
  await dispatch(fetchProducts());
  await dispatch(fetchStockReport());
};

export const importProductsFromExcel = (file) => async (dispatch) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/products/import-excel`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Import failed");
  }

  await dispatch(fetchProducts());
  await dispatch(fetchStockReport());
  return data;
};

export const fetchCategories = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const categories = await apiRequest("/api/categorys");
    dispatch(setCategoryList(categories.map(mapCategoryToListRow)));
    return categories;
  });

export const createCategory = (payload) => async (dispatch) => {
  const category = await apiRequest("/api/categorys", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchCategories());
  return category;
};

export const updateCategory = (id, payload) => async (dispatch) => {
  const category = await apiRequest(`/api/categorys/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchCategories());
  return category;
};

export const deleteCategory = (id) => async (dispatch) => {
  await apiRequest(`/api/categorys/${id}`, { method: "DELETE" });
  await dispatch(fetchCategories());
};

export const fetchSubCategories = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const [subCategories, categories] = await Promise.all([
      apiRequest("/api/subCategorys"),
      apiRequest("/api/categorys"),
    ]);
    dispatch(
      setSubCategoryList(
        subCategories.map((item) =>
          mapSubCategoryToListRow(item, categories)
        )
      )
    );
    return subCategories;
  });

export const createSubCategory = (payload) => async (dispatch) => {
  const subCategory = await apiRequest("/api/subCategorys", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchSubCategories());
  return subCategory;
};

export const updateSubCategory = (id, payload) => async (dispatch) => {
  const subCategory = await apiRequest(`/api/subCategorys/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  await dispatch(fetchSubCategories());
  return subCategory;
};

export const deleteSubCategory = (id) => async (dispatch) => {
  await apiRequest(`/api/subCategorys/${id}`, { method: "DELETE" });
  await dispatch(fetchSubCategories());
};

export const fetchStockReport = () => async (dispatch) =>
  withLoading(dispatch, async () => {
    const report = await apiRequest("/api/products/stock-report");
    const products = report?.products || [];

    const lowStockProducts = products.filter(
      (item) =>
        Number(item.available_quantity) <= Number(item.minimum_stock_alert)
    );
    const expiredProducts = products.filter(
      (item) => item.expiry_date && new Date(item.expiry_date) < new Date()
    );

    dispatch(setStockReportSummary(report?.summary || null));
    dispatch(setManageStockData(products.map(mapProductToStockRow)));
    dispatch(setStockTransferData(products.map(mapProductToTransferRow)));
    dispatch(setLowStockData(lowStockProducts.map(mapProductToLowStockRow)));
    dispatch(
      setExpiredProductData(expiredProducts.map(mapProductToExpiredRow))
    );

    return report;
  });

export const closeBootstrapModal = (modalId) => {
  const modalElement = document.getElementById(modalId);
  if (!modalElement || !window.bootstrap?.Modal) return;
  const instance =
    window.bootstrap.Modal.getInstance(modalElement) ||
    new window.bootstrap.Modal(modalElement);
  instance.hide();
};
