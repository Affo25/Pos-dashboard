import { brandlistdata } from "../json/brandlistdata";
import { dashboarrecentproductddata } from "../json/dashboarddata";
import { expiredproductdata } from "../json/dashboardexpiredproduct";
import { salestransaction } from "../json/salesdashboardrecenttranscation";
import { unitsdata } from "../json/unitsdata";
import { variantattributesdata } from "../json/variantattributesdata";
import { warrentydata } from "../json/waarrentydata";
import { barcodedata } from "../json/barcodedata";
import { departmentlistdata } from "../json/departmentlistdata";
import { designationdata } from "../json/designationdata";
import { shiftlistdata } from "../json/shiftlistdata";
import { attendenceemployeedata } from "../json/attendence-employeedata";
import { invoicereportdata } from "../json/invoicereportdata";
import { quotationlistdata } from "../json/quotationlistdata";
import { CustomerData } from "../json/customer_data";
import { SupplierData } from "../json/supplier_data";
import { ManageStocksdata } from "../json/managestocks_data";
import { StockTransferData } from "../json/stocktransferdata";
import { userlisadata } from "../json/users";
import { rolesandpermission } from "../json/rolesandpermissiondata";
import { deleteaccountdata } from "../json/deleteaccount";
import { attandanceadmindata } from "../json/attendanceadmindata";
import { leavesadmindata } from "../json/leavesadmin";
import { leavetypedata } from "../json/leavetypedata";
import { leavedata } from "../json/leavesdata";
import { expiredproduct } from "../json/expiredproductdata";
import { lowstockdata } from "../json/lowstockdata";
import { categorylist } from "../json/categorylistdata";
import { subcateorydata } from "../json/subcategorydata";
import { callhistorydata } from "../json/callhistorydata";

const { productlistdata } = require("../json/productlistdata");

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState = {
  auth_user: storedUser ? JSON.parse(storedUser) : null,
  auth_token: storedToken || null,
  auth_loading: false,
  auth_error: null,
  isAuthenticated: Boolean(storedToken),
  product_list: [],
  inventory_loading: false,
  stock_report_summary: null,
  dashboard_recentproduct: dashboarrecentproductddata,
  dashboard_expiredproduct: expiredproductdata,
  saleshdashboard_recenttransaction: salestransaction,
  brand_list: brandlistdata,
  unit_data: unitsdata,
  variantattributes_data: variantattributesdata,
  warranty_data: warrentydata,
  barcode_data: barcodedata,
  departmentlist_data: departmentlistdata,
  designation_data: designationdata,
  shiftlist_data: shiftlistdata,
  attendenceemployee_data: attendenceemployeedata,
  toggle_header: false,
  invoicereport_data: [],
  salesreturns_data: [],
  purchase_returns_data: [],
  quotationlist_data: quotationlistdata,
  customerdata: CustomerData,
  supplierdata: [],
  sales_list_data: [],
  purchase_orders_data: [],
  app_settings: null,
  business_loading: false,
  managestockdata: [],
  stocktransferdata: [],
  userlist_data: [],
  rolesandpermission_data: rolesandpermission,
  deleteaccount_data: deleteaccountdata,
  attendanceadmin_data: attandanceadmindata,
  leavesadmin_data: leavesadmindata,
  leavetypes_data: leavetypedata,
  holiday_data: leavedata,
  expiredproduct_data: [],
  lowstock_data: [],
  categotylist_data: [],
  subcategory_data: [],
  callhistory_data: callhistorydata,
  layoutstyledata: localStorage.getItem("layoutStyling"),
};

export default initialState;
