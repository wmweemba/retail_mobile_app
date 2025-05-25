import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Transaction } from '../types';
import { format } from 'date-fns';

export const generatePDF = (transactions: Transaction[], reportName: string) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Financial Report', 14, 15);
  
  doc.setFontSize(12);
  doc.text(`Report: ${reportName}`, 14, 25);
  doc.text(`Generated: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 32);
  
  // Add table
  const tableData = transactions.map(t => [
    format(new Date(t.date), 'dd/MM/yyyy'),
    t.id,
    `${t.type === 'income' ? '+' : '-'} K${t.amount.toFixed(2)}`,
    t.type,
    t.vendor,
    t.category,
    t.source
  ]);
  
  doc.autoTable({
    head: [['Date', 'ID', 'Amount', 'Type', 'Vendor', 'Category', 'Source']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`Financial_Report_${reportName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

export const generateExcel = (transactions: Transaction[], reportName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    transactions.map(t => ({
      Date: format(new Date(t.date), 'dd/MM/yyyy'),
      'Transaction ID': t.id,
      Amount: `${t.type === 'income' ? '+' : '-'} K${t.amount.toFixed(2)}`,
      Type: t.type,
      Vendor: t.vendor,
      Category: t.category,
      Source: t.source,
      Notes: t.notes,
      'Created At': format(new Date(t.createdAt), 'dd/MM/yyyy HH:mm')
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  // Save the Excel file
  XLSX.writeFile(workbook, `Financial_Report_${reportName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.xlsx`);
};