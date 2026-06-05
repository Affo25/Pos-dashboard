import {
  fetchPrinters,
  previewInvoicePdf,
  previewSalesRegisterPdf,
  printInvoice,
  printSalesRegister,
} from "../api/printApi";
import { showErrorToast, showSuccessToast } from "./toast";

export const openPdfBlob = (blob) => {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

export const getStoredPrinter = () => localStorage.getItem("default_printer") || "";

export const resolvePrinter = async () => {
  const stored = getStoredPrinter();
  if (stored) return stored;

  try {
    const { printers } = await fetchPrinters();
    if (printers?.length) {
      return printers[0].name;
    }
  } catch {
    /* no printers available */
  }

  return "";
};

export const previewInvoice = async (invoice, template = "report_a4") => {
  const blob = await previewInvoicePdf(invoice, template);
  openPdfBlob(blob);
};

export const sendInvoiceToPrinter = async (invoice, template = "report_a4") => {
  const printer = await resolvePrinter();
  if (!printer) {
    throw new Error("No printer found. Configure one in Printer Settings.");
  }
  await printInvoice(invoice, printer, template);
  return printer;
};

export const previewRegister = async (records, subtitle) => {
  const blob = await previewSalesRegisterPdf({
    records,
    subtitle,
    generated_at: new Date().toISOString(),
  });
  openPdfBlob(blob);
};

export const sendRegisterToPrinter = async (records, subtitle) => {
  const printer = await resolvePrinter();
  if (!printer) {
    throw new Error("No printer found. Configure one in Printer Settings.");
  }
  await printSalesRegister({
    records,
    subtitle,
    generated_at: new Date().toISOString(),
    printer,
  });
  return printer;
};

export const handleListPdfPreview = async ({
  records,
  subtitle,
  invoicePayload,
  template = "report_a4",
}) => {
  try {
    if (invoicePayload) {
      await previewInvoice(invoicePayload, template);
    } else {
      await previewRegister(records, subtitle);
    }
  } catch (error) {
    showErrorToast("PDF Failed", error.message);
  }
};

export const handleListPrint = async ({
  records,
  subtitle,
  invoicePayload,
  template = "report_a4",
}) => {
  try {
    const printer = invoicePayload
      ? await sendInvoiceToPrinter(invoicePayload, template)
      : await sendRegisterToPrinter(records, subtitle);
    showSuccessToast("Printed", `Sent to ${printer}`);
  } catch (error) {
    showErrorToast("Print Failed", error.message);
  }
};

export const handleSingleInvoicePdf = async (invoice, template = "report_a4") => {
  try {
    await previewInvoice(invoice, template);
  } catch (error) {
    showErrorToast("PDF Failed", error.message);
  }
};

export const handleSingleInvoicePrint = async (invoice, template = "report_a4") => {
  try {
    const printer = await sendInvoiceToPrinter(invoice, template);
    showSuccessToast("Printed", `Sent to ${printer}`);
  } catch (error) {
    showErrorToast("Print Failed", error.message);
  }
};
