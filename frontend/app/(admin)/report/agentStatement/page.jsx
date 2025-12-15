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
import { exportAgentStatement } from "../../../../lib/agentStatement";
import { apiGet } from "../../../../lib/apiGet";

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
    if (!formData.agent_id) {
      toast.error("Please select agent!");
      return;
    }

    const result = await apiGet({
      endpoint: "/report/agentReport",
      params: formData,
      token: token,
    });

    if (result.success) {
      toast.success("Loading...");
      setReportData(result.data.data);
    } else {
      toast.error(result.error);
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
  const downloadStatement = async () => {
    try {
      await exportAgentStatement(report);
      toast.success("Excel exported!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const selectedAgent = agentData.find(
    (ag) => ag.id === Number(formData.agent_id)
  );

  const transactionCount = report.filter(
    (item) => Number(item.debit) !== 0
  ).length;

  const creditTransactionCount = report.filter(
    (item) => Number(item.credit) !== 0
  ).length;

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
                  >
                    <option value="">All Agent</option>
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
                  />
                </div>

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

                {/* Filter Button */}
                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleFilter}
                  >
                    Filter
                  </button>
                </div>

                {/* Export Button INLINE */}
                {report.length > 0 && (
                  <div className="col-md-2">
                    <button
                      type="button"
                      onClick={downloadStatement}
                      className="btn btn-success w-100"
                    >
                      Export Excel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Report Table */}
            <div className="card-body">
              <div className="container-fluid">
                <div className="row">
                  {/* LEFT SIDE — Agent Details */}
                  <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm">
                      <div className="card-header fw-bold bg-light">
                        Agent Details
                      </div>
                      <div className="card-body">
                        {selectedAgent ? (
                          <>
                            <span>
                              <strong>Name:</strong> {selectedAgent.name}
                              <br />
                            </span>
                            <span>
                              <strong>Agent Code:</strong>{" "}
                              {selectedAgent.agentCode}
                              <br />
                            </span>
                            <span>
                              <strong>Phone:</strong>{" "}
                              {selectedAgent.phone_number || "N/A"}
                              <br />
                            </span>
                            <span>
                              <strong>Email:</strong>{" "}
                              {selectedAgent.email || "N/A"}
                              <br />
                            </span>
                          </>
                        ) : (
                          <p className="text-muted mb-0">All Agents Selected</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE — Summary */}
                  <div className="col-md-6 col-lg-5 offset-lg-2">
                    <div className="summary-wrapper_side">
                      <div className="card shadow-sm">
                        <div className="card-header fw-bold bg-light">
                          Transaction Summary
                        </div>

                        <div className="card-body">
                          <div className="statement-row d-flex justify-content-between">
                            <span>Number of Transactions</span>
                            <span className="amount">{transactionCount}</span>
                          </div>

                          <div className="statement-row d-flex justify-content-between">
                            <span>Total Fee</span>
                            <span className="amount">GBP {totalFee} £</span>
                          </div>

                          <div className="statement-row d-flex justify-content-between">
                            <span>Total Receiving Amount</span>
                            <span className="amount">{totalReceiving} BDT</span>
                          </div>

                          <div className="statement-row d-flex justify-content-between">
                            <span>
                              Total Debit&nbsp;<b>({transactionCount})</b>
                            </span>
                            <span className="amount">
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
                            </span>
                          </div>

                          <div className="statement-row d-flex justify-content-between">
                            <span>Total Credit&nbsp;<b>({creditTransactionCount})</b></span>
                            <span className="amount">{totalCredit} £</span>
                          </div>

                          <div className="statement-row d-flex justify-content-between fw-bold border-top pt-2">
                            <span>Final Balance</span>
                            <span className="amount text-success">
                              {(
                                Number(totalCredit) -
                                report.reduce(
                                  (sum, item) =>
                                    sum +
                                    (Number(item.debit || 0) +
                                      Number(item.fee || 0)),
                                  0
                                )
                              ).toFixed(2)}{" "}
                              £
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
                                        <small>{item.walletrate_name}</small>
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
                                    {(
                                      Number(item.debit || 0) +
                                      Number(item.fee || 0)
                                    ).toFixed(2)}
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
