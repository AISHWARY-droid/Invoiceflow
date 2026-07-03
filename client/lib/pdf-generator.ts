import { jsPDF } from "jspdf";

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  date: string;
  dueDate: string;
}

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export function generateInvoicePDF(
  invoice: Invoice,
  clientInfo: ClientInfo,
  businessInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Set default font
  doc.setFont("helvetica");

  // Header - Company Logo/Name
  doc.setFontSize(24);
  doc.setTextColor(30, 58, 138); // Blue color
  doc.text("INVOICE", 20, yPosition);

  // Invoice number and date
  doc.setFontSize(10);
  doc.setTextColor(100);
  yPosition += 12;
  doc.text(`Invoice #: ${invoice.number}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, yPosition);
  yPosition += 6;
  doc.text(
    `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
    20,
    yPosition
  );

  // Business Info (if provided)
  if (businessInfo?.name) {
    yPosition += 12;
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Bill From:", 20, yPosition);
    yPosition += 6;
    doc.setFontSize(10);
    doc.text(businessInfo.name, 20, yPosition);
    if (businessInfo.email) {
      yPosition += 5;
      doc.text(`Email: ${businessInfo.email}`, 20, yPosition);
    }
    if (businessInfo.phone) {
      yPosition += 5;
      doc.text(`Phone: ${businessInfo.phone}`, 20, yPosition);
    }
  }

  // Client Info
  yPosition += 12;
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("Bill To:", 20, yPosition);
  yPosition += 6;
  doc.setFontSize(10);
  doc.text(clientInfo.name, 20, yPosition);
  yPosition += 5;
  doc.text(`Email: ${clientInfo.email}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Phone: ${clientInfo.phone}`, 20, yPosition);
  if (clientInfo.company) {
    yPosition += 5;
    doc.text(`Company: ${clientInfo.company}`, 20, yPosition);
  }

  // Items Table
  yPosition += 15;

  // Table header
  const tableTop = yPosition;
  doc.setFillColor(217, 223, 238); // Light blue
  doc.rect(20, tableTop, pageWidth - 40, 8, "F");

  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text("Description", 25, tableTop + 6);
  doc.text("Amount", pageWidth - 35, tableTop + 6, { align: "right" });

  // Items
  yPosition = tableTop + 12;
  doc.setTextColor(0);
  doc.setFontSize(10);

  // Single line item for the invoice
  doc.text("Professional Services", 25, yPosition);
  doc.text(`$${invoice.amount.toLocaleString()}`, pageWidth - 25, yPosition, {
    align: "right",
  });

  // Totals section
  yPosition += 15;
  const totalBoxX = pageWidth - 70;
  const totalBoxWidth = 50;

  // Subtotal
  doc.setFontSize(9);
  doc.text("Subtotal:", totalBoxX, yPosition);
  doc.text(`$${invoice.amount.toLocaleString()}`, pageWidth - 20, yPosition, {
    align: "right",
  });

  // Tax (for demonstration, 0%)
  yPosition += 6;
  doc.text("Tax (0%):", totalBoxX, yPosition);
  doc.text("$0.00", pageWidth - 20, yPosition, { align: "right" });

  // Total
  yPosition += 8;
  doc.setFillColor(30, 58, 138);
  doc.rect(totalBoxX - 5, yPosition - 4, totalBoxWidth + 10, 10, "F");

  doc.setFontSize(11);
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", totalBoxX, yPosition + 1);
  doc.text(`$${invoice.amount.toLocaleString()}`, pageWidth - 20, yPosition + 1, {
    align: "right",
  });

  // Status
  yPosition += 20;
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  const statusText = `Status: ${invoice.status.toUpperCase()}`;
  const statusColor =
    invoice.status === "paid"
      ? { r: 34, g: 197, b: 94 }
      : invoice.status === "overdue"
        ? { r: 220, g: 38, b: 38 }
        : { r: 59, g: 130, b: 246 };
  doc.setTextColor(statusColor.r, statusColor.g, statusColor.b);
  doc.text(statusText, 20, yPosition);

  // Notes/Footer
  yPosition = pageHeight - 30;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "Thank you for your business!",
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );
  yPosition += 5;
  doc.text(
    "Payment terms are due upon receipt.",
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );

  // Footer
  yPosition += 8;
  doc.setTextColor(200);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );

  return doc;
}

export function downloadInvoicePDF(
  invoice: Invoice,
  clientInfo: ClientInfo,
  businessInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }
) {
  const doc = generateInvoicePDF(invoice, clientInfo, businessInfo);
  doc.save(`${invoice.number}.pdf`);
}
