import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function exportAgentStatement(report) {
  if (!report || report.length === 0) {
    throw new Error("No data to export");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Agent Statement");

  // ===== Header Row =====
  const headers = [
    "#",
    "Date",
    "Sender",
    "Receiver",
    "Method",
    "Mobile",
    "Agent Rate",
    "Admin Fee",
    "Receiving Amount",
    "Debit (£)",
    "Credit (£)",
    "Balance (£)",
  ];

  const headerRow = worksheet.addRow(headers);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1976D2" }, // Blue header
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // ===== Data Rows =====
  let runningBalance = 0;

  report.forEach((item, index) => {
    const debitTotal = Number(item.debit || 0) + Number(item.fee || 0);
    const creditTotal = Number(item.credit || 0);

    runningBalance += creditTotal - debitTotal;

    const rowValues = [
      index + 1,
      item.created_at,
      item.debit === 0 ? "" : item.senderName,
      item.debit === 0 ? "" : item.beneficiaryName,
      item.debit === 0 ? "" : item.paytMethod,
      item.debit === 0 ? "" : item.beneficiaryPhone,
      item.debit === 0 ? "" : item.walletrate,
      item.debit === 0 ? "" : item.fee,
      item.debit === 0 ? "" : item.receiving_money,
      debitTotal || 0,
      creditTotal || 0,
      runningBalance.toFixed(2),
    ];

    const row = worksheet.addRow(rowValues);

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Highlight BANKING rows
    if (item.debit === 0) {
      worksheet.mergeCells(`C${row.number}:I${row.number}`);

      row.getCell(3).value = "BANKING";
      row.getCell(3).font = { bold: true, color: { argb: "FF1976D2" } };
      row.getCell(3).alignment = { horizontal: "center" };

      for (let i = 1; i <= headers.length; i++) {
        row.getCell(i).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFBBDEFB" },
        };
      }
    }
  });

  // ===== Totals Row =====
  const totalDebit = report.reduce(
    (sum, item) => sum + Number(item.debit || 0) + Number(item.fee || 0),
    0
  );
  const totalCredit = report.reduce(
    (sum, item) => sum + Number(item.credit || 0),
    0
  );
  const totalFee = report.reduce(
    (sum, item) => sum + Number(item.fee || 0),
    0
  );
  const totalReceiving = report.reduce(
    (sum, item) => sum + Number(item.receiving_money || 0),
    0
  );

  const totalRow = worksheet.addRow([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    totalFee,
    totalReceiving,
    totalDebit.toFixed(2),
    totalCredit,
    runningBalance.toFixed(2),
  ]);

  totalRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEEEEEE" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // ===== Auto Column Width =====
  worksheet.columns.forEach((col) => {
    let maxLength = 12;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const len = cell.value ? cell.value.toString().length : 12;
      if (len > maxLength) maxLength = len;
    });
    col.width = maxLength + 3;
  });

  // ===== Download File =====
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Agent-Statement.xlsx");

  return true;
}