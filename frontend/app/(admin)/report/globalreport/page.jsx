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
  const { settingData } = useSetting();
  const { walletData } = useWallets();
  const { bankData } = useBank();
  const { agentData } = useAgents();
  const pathname = usePathname();
  const title = "Global Report";
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
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


  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFilter = async () => {
    const query = new URLSearchParams(formData).toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/report/getGlobalReport?${query}`;
    try {
      setLoading(true);
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Loading...");
        setReportData(data.data);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch {
      toast.error("Network or server error!");
    } finally {
      setLoading(false);
    }
  };
  // 📌 TABLE REF HERE — IMPORTANT
  const tableRef = useRef();
  // 🎯 EXCEL EXPORT WITH BORDER, AUTO WIDTH, CLEAN FORMAT
  const exportToExcel = async () => {
    if (!tableRef.current) {
      toast.error("No table to export");
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");
    const table = tableRef.current;
    const rows = Array.from(table.querySelectorAll("tr"));
    rows.forEach((tr, rowIndex) => {
      const cells = Array.from(tr.querySelectorAll("th,td"));
      const rowValues = cells.map((cell) => {
        const text = cell.innerText.trim();
        const number = Number(text.replace(/,/g, ""));
        return isFinite(number) && text !== "" ? number : text;
      });
      const excelRow = worksheet.addRow(rowValues);
      // Header formatting
      if (rowIndex === 0) {
        excelRow.eachCell((cell) => {
          cell.font = { bold: true };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEFEFEF" },
          };
        });
      }
      // Add borders for ALL cells
      excelRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
    // Auto column width
    worksheet.columns.forEach((col) => {
      let maxWidth = 10;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const len = cell.value ? cell.value.toString().length : 10;
        if (len > maxWidth) maxWidth = len;
      });
      col.width = maxWidth + 3;
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Global-Report.xlsx");
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
                <div className="col-md-2">
                  <label>From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    className="form-control"
                    value={formData.fromDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2">
                  <label>To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    className="form-control"
                    value={formData.toDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    className="form-control"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="">===Select===</option>
                    <option value="wallet">Wallet</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>
                {showWallet && (
                  <div className="col-md-2">
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
                {showBank && (
                  <div className="col-md-2">
                    <label>Bank</label>
                    <select
                      name="bank_id"
                      className="form-select"
                      value={formData.bank_id}
                      onChange={handleChange}
                    >
                      <option value="">===Select===</option>
                      {bankData.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.bank_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="col-md-1">
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
                <div className="col-md-2">
                  <label>Agent</label>
                  <select
                    name="agent_id"
                    className="form-select"
                    value={formData.agent_id}
                    onChange={handleChange}
                  >
                    <option value="">=========Select=========</option>
                    {agentData.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
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
            {report.length > 0 ? (
              <center>
                <button
                  onClick={exportToExcel}
                  className="btn btn-success mb-3"
                >
                  Export to Excel
                </button>
              </center>
            ) : null}
            {/* TABLE SECTION */}
            <div className="card-body">
              {/* <h6 className="fw-bold mb-3 text-dark">{title}</h6> */}
              <div className="table-responsive bg-light p-3 rounded shadow-sm">
                <table
                  ref={tableRef}
                  className="table table-sm table-hover table-bordered table-colorful"
                  border="1"
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Agent Name</th>
                      <th>Agent Code</th>
                      <th>Method</th>
                      <th>Buying Rate</th>
                      <th>Agent Rate</th>
                      <th>Receiving Amount</th>
                      <th>Admin Fee</th>
                      <th>Agent Settlement</th>
                      <th>Our Profit</th>
                      <th>Deposit Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.length > 0 ? (
                      <>
                        {report.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.created_at}</td>
                            <td>{item.agentName}</td>
                            <td>{item.agentCode}</td>
                            <td>{item.paymentMethod}</td>
                            <td>{item.buyingRate}</td>
                            <td>{item.walletrate}</td>
                            <td>{item.receiving_money}</td>
                            <td>{item.fee}</td>
                            <td>{Number(item.agentsettlement || 0).toFixed(2)}</td>
                            <td>{item.ourProfit}</td>
                            <td>{item.deposit_balance}</td>
                          </tr>
                        ))}
                        {/* TOTAL ROW */}
                        <tr className="fw-bold bg-light">
                          <td colSpan="5" className="text-end">
                            Total →
                          </td>
                          <td>
                            {report.reduce(
                              (sum, i) => sum + Number(i.buyingRate || 0),
                              0
                            )}
                          </td>
                          <td>
                            {report.reduce(
                              (sum, i) => sum + Number(i.walletrate || 0),
                              0
                            )}
                          </td>
                          <td>
                            {report.reduce(
                              (sum, i) => sum + Number(i.receiving_money || 0),
                              0
                            )}
                          </td>
                          <td>
                            {report.reduce(
                              (sum, i) => sum + Number(i.fee || 0),
                              0
                            )}
                          </td>
                          <td>
                      {report
    .reduce((sum, i) => sum + Number(i.agentsettlement || 0), 0)
    .toFixed(2)}
                          </td>
                          <td>
                            {report.reduce(
                              (sum, i) => sum + Number(i.ourProfit || 0),
                              0
                            )}
                          </td>
                          <td></td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center text-muted">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
