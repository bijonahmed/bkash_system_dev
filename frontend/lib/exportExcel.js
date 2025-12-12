import ExcelJS from "exceljs";

export async function exportAgentExcel(report, fileName = "agent_statement") {
  if (!report || report.length === 0) {
    throw new Error("No data to export");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Agent List");

  // Headers
  const headers = ["#", "Agent Name", "Agent Code", "Agent Phone", "Balance"];
  worksheet.addRow(headers);

  // Header style
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Data rows
  report.forEach((item, index) => {
    worksheet.addRow([
      index + 1,
      item.agent_name,
      item.agentCode,
      item.phone_number,
      item.balance,
    ]);
  });

  // Border for each cell
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Auto width
  worksheet.columns.forEach((column) => {
    let maxLength = 15;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const length = cell.value ? cell.value.toString().length : 0;
      if (length > maxLength) maxLength = length;
    });
    column.width = maxLength + 2;
  });

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);

  return true;
}
