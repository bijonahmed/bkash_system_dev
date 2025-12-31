"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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

export default function AdminAgentReportPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);
  const [selectedAgentName, setSelectedAgentName] = useState("");

  const { walletData } = useWallets();
  const { bankData } = useBank();
  const { agentData } = useAgents();
  useSetting();

  const tableRef = useRef();

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
    document.title = "Agent Statement Report";
  }, []);

  // if (!permissions.includes("view report")) {
  //   router.replace("/dashboard");
  //   return null;
  // }

  /* =========================
      HANDLERS
     ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "agent_id") {
      const selectedName = e.target.options[e.target.selectedIndex].text;
      setSelectedAgentName(selectedName);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = async () => {
    setLoading(true);
    const result = await apiGet({
      endpoint: "/report/agentReport",
      params: formData,
      token,
    });
    setLoading(false);

    if (result.success) {
      setReport(result.data.data);
    } else {
      toast.error(result.error);
    }
  };

  const downloadStatement = async () => {
    try {
      await exportAgentStatement(report);
      toast.success("Excel exported!");
    } catch (e) {
      toast.error(e.message);
    }
  };

  /* =========================
      SUMMARY (optimized)
     ========================= */
  const summary = useMemo(() => {
    let totalFee = 0;
    let totalDebit = 0;
    let totalCredit = 0;
    let totalReceiving = 0;
    let debitCount = 0;
    let creditCount = 0;

    report.forEach((item) => {
      const debit =
        Number(item?.pr_rate ?? 0) > 0
          ? Number(item?.receiving_money ?? 0) / Number(item?.pr_rate ?? 0) +
            Number(item?.fee ?? 0)
          : 0; //Number(item.debit || 0);
      const fee = Number(item.fee || 0);
      const credit = Number(item.credit || 0);
      const receiving = Number(item.receiving_money || 0);

      totalFee += fee;
      totalDebit += debit;
      totalCredit += credit;
      totalReceiving += receiving;

      if (item.agent_settlement > 0) debitCount++;
      if (credit > 0) creditCount++;
    });

    return {
      totalFee,
      totalDebit,
      totalCredit,
      totalReceiving,
      debitCount,
      creditCount,
    };
  }, [report]);

  /* =========================
      FINAL BALANCE
     ========================= */
  const getFinalBalance = (debit, credit) => {
    const value = debit - credit;
    return credit > debit
      ? `-${Math.abs(value).toFixed(2)}`
      : Math.abs(value).toFixed(2);
  };

  /* =========================
      RUNNING BALANCE
     ========================= */
  const reportWithBalance = useMemo(() => {
    let running = 0;

    return report.map((item) => {
      const debitTotal =
        Number(item?.pr_rate ?? 0) > 0
          ? Number(item?.receiving_money ?? 0) / Number(item?.pr_rate ?? 0) +
            Number(item?.fee ?? 0)
          : 0;

      const creditTotal = Number(item?.credit ?? 0);

      // debit - credit (important)
      const net = debitTotal - creditTotal;

      running += net;

      return {
        ...item,
        runningBalance: Math.abs(running).toFixed(2),
        sign: running < 0 ? "-" : "",
      };
    });
  }, [report]);

  const selectedAgent = agentData.find(
    (ag) => ag.id === Number(formData.agent_id)
  );

  /* =========================
      RENDER
     ========================= */
  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />

      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Agent Statement Report</h3>
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

      <div className="app-content">
        <div className="container-fluid">
          <div className="card card-primary card-outline mb-4">
            {/* FILTER FORM */}
            <div className="card-header">
              <form className="row g-3 align-items-end">
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

                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleFilter}
                  >
                    Search
                  </button>
                </div>

                {report.length > 0 && (
                  <div className="col-md-2 d-none">
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

            {/* AGENT DETAILS + SUMMARY */}
            <div className="card-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <div className="summary-wrapper_side">
                      <div className="card shadow-sm">
                        <div className="card-header fw-bold bg-light">
                          Transaction Summary
                        </div>

                        <div className="card-body">
                          <div className="statement-row d-flex justify-content-between">
                            <span>Number of Transactions</span>
                            <span className="amount">{summary.debitCount}</span>
                          </div>

                          <div className="statement-row d-flex justify-content-between">
                            <span>Total Fee</span>
                            <span className="amount">
                              GBP {summary.totalFee.toFixed(2)} £
                            </span>
                          </div>

                          <div className="statement-row d-flex justify-content-between">
                            <span>Total Receiving Amount</span>
                            <span className="amount">
                              {summary.totalReceiving.toFixed(2)} BDT
                            </span>
                          </div>

                          <div className="statement-row d-flex justify-content-between">
                            <span>
                              Total Debit&nbsp;<b>({summary.debitCount})</b>
                            </span>
                            <span className="amount">
                              {summary.totalDebit.toFixed(2)} £
                            </span>
                          </div>

                          <div className="statement-row d-flex justify-content-between">
                            <span>
                              Total Credit&nbsp;<b>({summary.creditCount})</b>
                            </span>
                            <span className="amount">
                              {summary.totalCredit.toFixed(2)} £
                            </span>
                          </div>

                          <div className="statement-row d-flex justify-content-between fw-bold border-top pt-2">
                            <span>Final Balance</span>
                            <span className="amount text-success">
                              {getFinalBalance(
                                summary.totalDebit,
                                summary.totalCredit
                              )}{" "}
                              £
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABLE */}
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
                          {reportWithBalance.length ? (
                            <>
                              {reportWithBalance.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{item.created_at}</td>

                                  {item.debit === 0 ? (
                                    <td
                                      colSpan="7"
                                      className="text-center text-primary fw-bold bg-solid"
                                    >
                                      BANKING
                                    </td>
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
                                        {item.pr_rate}
                                      </td>
                                      <td className="text-end">{item.fee}</td>
                                      <td className="text-end">
                                        {item.receiving_money}
                                      </td>
                                    </>
                                  )}

                                  <td className="text-end">
                                    {(Number(item?.pr_rate ?? 0) > 0
                                      ? Number(item?.receiving_money ?? 0) /
                                          Number(item?.pr_rate ?? 0) +
                                        Number(item?.fee ?? 0)
                                      : 0
                                    ).toFixed(2)}
                                    {/* {`${Number(
                                      item?.receiving_money ?? 0
                                    ).toFixed(2)} ÷ 
                                  ${Number(item?.pr_rate ?? 0).toFixed(2)} + 
                                  ${Number(item?.fee ?? 0).toFixed(2)} = 
                                  ${(Number(item?.pr_rate ?? 0) > 0
                                    ? Number(item?.receiving_money ?? 0) / Number(item?.pr_rate ?? 0) +
                                      Number(item?.fee ?? 0)
                                    : 0
                                  ).toFixed(2)}`} */}
                                  </td>
                                  <td className="text-end">{item.credit}</td>
                                  <td className="text-end">
                                    {item.sign}
                                    {Math.abs(item.runningBalance).toFixed(2)}
                                  </td>
                                </tr>
                              ))}

                              {/* TOTAL ROW */}
                              <tr className="fw-bold bg-light">
                                <td colSpan="7" className="text-end">
                                  Total →
                                </td>

                                <td className="text-end">
                                  GBP {summary.totalFee.toFixed(2)} £
                                </td>
                                <td className="text-end">
                                  {summary.totalReceiving.toFixed(2)} BDT
                                </td>
                                <td className="text-end">
                                  {summary.totalDebit.toFixed(2)} £
                                </td>
                                <td className="text-end">
                                  {summary.totalCredit.toFixed(2)} £
                                </td>
                                <td className="text-end">
                                  {getFinalBalance(
                                    summary.totalDebit,
                                    summary.totalCredit
                                  )}{" "}
                                  £
                                </td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td
                                colSpan="12"
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
