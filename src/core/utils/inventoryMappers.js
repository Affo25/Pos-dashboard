const DEFAULT_PRODUCT_IMAGE = "assets/img/products/stock-img-01.png";
const DEFAULT_USER_IMAGE = "assets/img/users/user-08.jpg";

export const formatDisplayDate = (dateValue) => {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getCategoryName = (product) => {
  if (!product?.category) return "—";
  if (typeof product.category === "object") return product.category.name || "—";
  return "—";
};

export const mapProductToListRow = (product) => ({
  id: product._id,
  product: product.name,
  productImage: product.image || DEFAULT_PRODUCT_IMAGE,
  sku: product.sku || "—",
  category: getCategoryName(product),
  brand: product.manufacturer || "—",
  price: `$${Number(product.unit_price || 0).toFixed(2)}`,
  unit: product.medicine_size || "Pc",
  qty: String(product.available_quantity ?? 0),
  createdby: product.created_by?.name || "—",
  img: DEFAULT_USER_IMAGE,
  _raw: product,
});

export const mapCategoryToListRow = (category) => ({
  id: category._id,
  category: category.name,
  categoryslug: slugify(category.name),
  createdon: formatDisplayDate(category.createdAt),
  status: "Active",
  _raw: category,
});

export const mapSubCategoryToListRow = (subCategory, categories = []) => {
  const parent = categories.find(
    (item) => item._id === subCategory.category_id
  );

  return {
    id: subCategory._id,
    logo: DEFAULT_PRODUCT_IMAGE,
    img: DEFAULT_PRODUCT_IMAGE,
    category: subCategory.name,
    parentcategory: parent?.name || subCategory.category_id || "—",
    categorycode: String(subCategory._id || "").slice(-6).toUpperCase(),
    description: subCategory.description || "—",
    createdby: subCategory.created_by?.name || "—",
    status: subCategory.status || "active",
    _raw: subCategory,
  };
};

export const mapProductToStockRow = (product) => ({
  id: product._id,
  Warehouse: product.rack_location || "Main Warehouse",
  Shop: product.manufacturer || "Main Store",
  Product: {
    Name: product.name,
    Image: product.image || DEFAULT_PRODUCT_IMAGE,
  },
  Date: formatDisplayDate(product.updatedAt || product.createdAt),
  Person: {
    Name: product.supplier_name || "—",
    Image: DEFAULT_USER_IMAGE,
  },
  Quantity: product.available_quantity ?? 0,
  _raw: product,
});

export const mapProductToLowStockRow = (product) => ({
  id: product._id,
  img: product.image || DEFAULT_PRODUCT_IMAGE,
  warehouse: product.rack_location || "Main Warehouse",
  store: product.manufacturer || "Main Store",
  product: product.name,
  category: getCategoryName(product),
  sku: product.sku || "—",
  qty: String(product.available_quantity ?? 0),
  qtyalert: String(product.minimum_stock_alert ?? 0),
  _raw: product,
});

export const mapProductToExpiredRow = (product) => ({
  id: product._id,
  img: product.image || DEFAULT_PRODUCT_IMAGE,
  product: product.name,
  sku: product.sku || "—",
  manufactureddate: formatDisplayDate(product.createdAt),
  expireddate: formatDisplayDate(product.expiry_date),
  _raw: product,
});

export const mapProductToTransferRow = (product) => ({
  id: product._id,
  select: false,
  fromWarehouse: product.rack_location || "Main Warehouse",
  toWarehouse: "—",
  noOfProducts: 1,
  quantityTransferred: product.available_quantity ?? 0,
  refNumber: `#${product.sku || String(product._id || "").slice(-6)}`,
  date: formatDisplayDate(product.updatedAt || product.createdAt),
  _raw: product,
});
