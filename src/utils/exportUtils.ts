import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
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

export const generateExcel = async (transactions: Transaction[], reportName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Transactions');

  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Transaction ID', key: 'id', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Type', key: 'type', width: 10 },
    { header: 'Vendor', key: 'vendor', width: 20 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Source', key: 'source', width: 15 },
    { header: 'Notes', key: 'notes', width: 25 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ];

  transactions.forEach(t => {
    worksheet.addRow({
      date: format(new Date(t.date), 'dd/MM/yyyy'),
      id: t.id,
      amount: `${t.type === 'income' ? '+' : '-'} K${t.amount.toFixed(2)}`,
      type: t.type,
      vendor: t.vendor,
      category: t.category,
      source: t.source,
      notes: t.notes,
      createdAt: format(new Date(t.createdAt), 'dd/MM/yyyy HH:mm'),
    });
  });

  // Style header
  worksheet.getRow(1).font = { bold: true };

  // Generate buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Financial_Report_${reportName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.xlsx`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};