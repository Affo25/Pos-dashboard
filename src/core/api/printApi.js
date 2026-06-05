import { API_BASE_URL } from "./config";
import { apiRequest } from "./apiClient";

const getToken = () => localStorage.getItem("token");

const authHeaders = (extra = {}) => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

const parseError = async (response) => {
  try {
    const data = await response.json();
    return data?.error || data?.message || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

export const fetchPrinters = () => apiRequest("/api/print/printers");

export const previewInvoicePdf = async (invoice, template = "report_a4") => {
  const response = await fetch(`${API_BASE_URL}/api/print/preview`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({ invoice, template }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.blob();
};

export const printInvoice = async (invoice, printer, template = "report_a4") => {
  const response = await fetch(`${API_BASE_URL}/api/print/invoice`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({ invoice, printer, template }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Print failed");
  }

  return data;
};

export const previewSalesRegisterPdf = async ({
  records,
  subtitle,
  generated_at,
}) => {
  const response = await fetch(`${API_BASE_URL}/api/print/sales-register/preview`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({ records, subtitle, generated_at }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.blob();
};

export const printSalesRegister = async ({
  records,
  subtitle,
  generated_at,
  printer,
}) => {
  const response = await fetch(`${API_BASE_URL}/api/print/sales-register/print`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
    body: JSON.stringify({ records, subtitle, generated_at, printer }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Print failed");
  }

  return data;
};
