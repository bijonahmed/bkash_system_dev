"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import useSetting from "../../../hooks/getSetting.js";
import useWallets from "../../../hooks/getWallet";
import useAgents from "../../../hooks/getAgents.js";
import useBank from "../../../hooks/getBanks";
import "../../transaction/list/transactionFilter.css";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function GlobalReportPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [selectedAgentName, setSelectedAgentName] = useState(false);

  const { settingData } = useSetting();
  const { walletData } = useWallets();
  const { bankData } = useBank();
  const { agentData } = useAgents();

  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];

  const pathname = usePathname();

  const title = "Agent Statement Report";

  useEffect(() => {
    document.title = title;
  }, [title]);

  const [report, setReportData] = useState([]);

  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    paymentMethod: "",
    wallet_id: "",
    bank_id: "",
    status: "",
    agent_id: "",
  });

  // Toggle Wallet/Bank inputs
  useEffect(() => {
    if (formData.paymentMethod === "wallet") {
      setShowWallet(true);
      setShowBank(false);
    } else if (formData.paymentMethod === "bank") {
      setShowWallet(false);
      setShowBank(true);
    } else {
      setShowWallet(false);
      setShowBank(false);
    }
  }, [formData.paymentMethod]);

  // Form input handler
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "agent_id") {
      const selectedName = e.target.options[e.target.selectedIndex].text;
      console.log("Selected Agent Name:", selectedName);
      setSelectedAgentName(selectedName); // If you want to show on UI
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFilter = async () => {
    if (formData.agent_id == "") {
      toast.error(
        "Please select From date and To date, and also select an agent!"
      );
      return false;
    }

    const query = new URLSearchParams(formData).toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/report/agentReport?${query}`;

    try {
      setLoading(true);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Loading...");
        setReportData(data.data);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Network or server error!");
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals outside JSX
  const totalWalletrate = report
    .reduce((sum, item) => sum + parseFloat(item.walletrate || 0), 0)
    .toFixed(2);

  const totalFee = report
    .reduce((sum, item) => sum + parseFloat(item.fee || 0), 0)
    .toFixed(2);

  const totalReceiving = report
    .reduce((sum, item) => sum + parseFloat(item.receiving_money || 0), 0)
    .toFixed(2);

  const totalDebit = report
    .reduce((sum, item) => sum + parseFloat(item.debit || 0), 0)
    .toFixed(2);

  const totalCredit = report
    .reduce((sum, item) => sum + parseFloat(item.credit || 0), 0)
    .toFixed(2);
  let runningBalance = 0;

  const tableRef = useRef();
  // 🎯 EXCEL EXPORT WITH BORDER, AUTO WIDTH, CLEAN FORMAT
  const exportToExcel = async () => {
    if (!report || report.length === 0) {
      toast.error("No data to export");
      return;
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
      let debitTotal = Number(item.debit || 0) + Number(item.fee || 0);
      let creditTotal = Number(item.credit || 0);
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

      // Add borders
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      // Highlight BANKING row
      if (item.debit === 0) {
        worksheet.mergeCells(`C${row.number}:I${row.number}`);
        row.getCell(3).value = "BANKING";
        row.getCell(3).alignment = { horizontal: "center" };
        row.getCell(3).font = { bold: true, color: { argb: "FF1976D2" } };
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

    // ===== Auto width =====
    worksheet.columns.forEach((col) => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const len = cell.value ? cell.value.toString().length : 10;
        if (len > maxLength) maxLength = len;
      });
      col.width = maxLength + 3;
    });

    // ===== Save File =====
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Agent-Statement.xlsx");
  };

  if (!permissions.includes("view report")) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">{title}</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.back();
                    }}
                  >
                    ← Back
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />

      <div className="app-content">
        <div className="container-fluid">
          <div className="card card-primary card-outline mb-4">
            {/* Filter Form */}
            <div className="card-header">
              <form className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label>Agent</label>
                  <select
                    name="agent_id"
                    className="form-select"
                    value={formData.agent_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">=========Select Agent=========</option>
                    {agentData.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label>From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    className="form-control"
                    value={formData.fromDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label>To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    className="form-control"
                    value={formData.toDate}
                    onChange={handleChange}
                    lang="en-GB"
                  />
                </div>

                <div className="col-md-2 d-none">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    className="form-control"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="">=====All Payment Method=====</option>
                    <option value="wallet">Wallet</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>

                {/* Wallet Dropdown */}
                {showWallet && (
                  <div className="col-md-2 d-none">
                    <label>Wallet</label>
                    <select
                      name="wallet_id"
                      className="form-select"
                      value={formData.wallet_id}
                      onChange={handleChange}
                    >
                      <option value="">===Select===</option>
                      {walletData.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Bank Dropdown */}
                {showBank && (
                  <div className="col-md-2">
                    <label>Bank</label>
                    <select
                      name="bank_id"
                      className="form-select"
                      value={formData.bank_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Bank</option>
                      {bankData.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.bank_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="col-md-1 d-none">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="">===Select===</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </div>

                <div className="col-md-1 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleFilter}
                  >
                    Filter
                  </button>
                </div>
              </form>
            </div>

            {/* Report Table */}
            <div className="card-body">
              <h6 className="fw-bold mb-3 text-dark">{selectedAgentName}</h6>

              <div className="row g-3">
                {/* Number of Transactions */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-3 rounded shadow-sm text-white bg-primary">
                    <div className="d-flex justify-content-between">
                      <span>Number of Transactions:</span>
                      <strong>{report.length}</strong>
                    </div>
                  </div>
                </div>

                {/* Total Fee */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-3 rounded shadow-sm text-white bg-success">
                    <div className="d-flex justify-content-between">
                      <span>Total Fee:</span>
                      <strong>GBP {totalFee} £</strong>
                    </div>
                  </div>
                </div>

                {/* Total Receiving */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-3 rounded shadow-sm text-white bg-info">
                    <div className="d-flex justify-content-between">
                      <span>Total Receiving Amount:</span>
                      <strong>{totalReceiving} BDT</strong>
                    </div>
                  </div>
                </div>

                {/* Total Debit */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-3 rounded shadow-sm text-white bg-warning">
                    <div className="d-flex justify-content-between">
                      <span>Total Debit:</span>
                      <strong>
                        {report
                          .reduce(
                            (sum, item) =>
                              sum +
                              (Number(item.debit || 0) + Number(item.fee || 0)),
                            0
                          )
                          .toFixed(2)}{" "}
                        £
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Total Credit */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-3 rounded shadow-sm text-white bg-danger">
                    <div className="d-flex justify-content-between">
                      <span>Total Credit:</span>
                      <strong>{totalCredit} £</strong>
                    </div>
                  </div>
                </div>

                {/* Final Balance */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="p-3 rounded shadow-sm text-white bg-secondary">
                    <div className="d-flex justify-content-between">
                      <strong>Final Balance:</strong>
                      <strong>
                        {(
                          Number(totalCredit) -
                          report.reduce(
                            (sum, item) =>
                              sum +
                              (Number(item.debit || 0) + Number(item.fee || 0)),
                            0
                          )
                        ).toFixed(2)}{" "}
                        £
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
              {report.length > 0 ? (
                <center>
                  <button
                    onClick={exportToExcel}
                    className="btn btn-success mb-3 mt-2"
                  >
                    Export to Excel
                  </button>
                </center>
              ) : null}
              <div className="table-responsive">
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "200px" }}
                  >
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : (
                  <div className="bg-light rounded shadow-sm mt-2">
                    <div className="overflow-auto">
                      <table
                        className="table table-sm table-hover table-bordered table-colorful"
                        ref={tableRef}
                      >
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            <th>Date</th>
                            <th>Sender</th>
                            <th>Reciver</th>
                            <th className="text-center">Method</th>
                            <th>Mobile</th>
                            <th className="text-end">Agent Rate</th>
                            <th className="text-end">Admin Fee</th>
                            <th className="text-end">Reciving Amount</th>
                            <th className="text-end">Debit (£)</th>
                            <th className="text-end">Credit (£)</th>
                            <th className="text-end">Balance (£)</th>
                          </tr>
                        </thead>

                        <tbody>
                          {report.length > 0 ? (
                            <>
                              {report.map((item, index) => (
                                <tr key={index + 1}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{item.created_at}</td>

                                  {item.debit === 0 ? (
                                    <>
                                      <td
                                        colSpan="7"
                                        className="text-center text-primary fw-bold bg-solid"
                                      >
                                        BANKING
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{item.senderName}</td>
                                      <td>{item.beneficiaryName}</td>
                                      <td className="text-center">
                                        {item.paytMethod}
                                      </td>
                                      <td className="text-center">
                                        {item.beneficiaryPhone}
                                      </td>
                                      <td className="text-end">
                                        {item.walletrate}
                                      </td>
                                      <td className="text-end">{item.fee}</td>
                                      <td className="text-end">
                                        {item.receiving_money}
                                      </td>
                                    </>
                                  )}

                                  {/* Debit */}
                                  <td className="text-end">
                                    {Number(item.debit || 0) +
                                      Number(item.fee || 0)}
                                  </td>

                                  {/* Credit */}
                                  <td className="text-end">
                                    {Number(item.credit || 0)}
                                  </td>

                                  {/* RUNNING BALANCE */}
                                  <td className="text-end">
                                    {(() => {
                                      const debitTotal =
                                        Number(item.debit || 0) +
                                        Number(item.fee || 0);
                                      const creditTotal = Number(
                                        item.credit || 0
                                      );

                                      runningBalance =
                                        runningBalance +
                                        creditTotal -
                                        debitTotal;

                                      return runningBalance.toFixed(2);
                                    })()}
                                  </td>
                                </tr>
                              ))}

                              {/* ==== TOTAL ROW ==== */}
                              <tr className="fw-bold bg-light">
                                <td colSpan="7" className="text-end">
                                  Total →
                                </td>

                                {/* Admin Fee Total */}

                                <td className="text-end">
                                  GBP{" "}
                                  {report.reduce(
                                    (sum, item) => sum + Number(item.fee || 0),
                                    0
                                  )}
                                  £
                                </td>

                                {/* Receiving Amount Total */}
                                <td className="text-end">
                                  {report.reduce(
                                    (sum, item) =>
                                      sum + Number(item.receiving_money || 0),
                                    0
                                  )}{" "}
                                  BDT.
                                </td>

                                {/* Total Debit */}
                                <td className="text-end">
                                  {report
                                    .reduce(
                                      (sum, item) =>
                                        sum +
                                        (Number(item.debit || 0) +
                                          Number(item.fee || 0)),
                                      0
                                    )
                                    .toFixed(2)}{" "}
                                  £
                                </td>

                                {/* Total Credit */}
                                <td className="text-end">
                                  {report.reduce(
                                    (sum, item) =>
                                      sum + Number(item.credit || 0),
                                    0
                                  )}
                                  £
                                </td>

                                {/* FINAL BALANCE */}
                                <td className="text-end">
                                  {runningBalance.toFixed(2)} £
                                </td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td
                                colSpan="11"
                                className="text-center text-muted"
                              >
                                No transactions found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
