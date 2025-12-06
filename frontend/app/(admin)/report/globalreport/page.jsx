"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import useSetting from "../../../hooks/getSetting.js";
import useWallets from "../../../hooks/getWallet";
import useAgents from "../../../hooks/getAgents.js";
import useBank from "../../../hooks/getBanks";

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

  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];

  const pathname = usePathname();

  const title = "Global Report";

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

                {/* Wallet Dropdown */}
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

            {/* Report Table */}
            <div className="card-body">
              <h6 className="fw-bold mb-3 text-dark">{title}</h6>

              <div className="table-responsive">
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "200px" }}
                  >
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : (
                  <div className="bg-light p-3 rounded shadow-sm">
                    <div className="overflow-auto">
                      <table className="table table-sm table-bordered table-hover">
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            <th>Date</th>
                            <th>Agent Name</th>
                            <th>Agent Code</th>
                            <th>Method</th>
                            <th className="text-center">Buying Rate</th>
                            <th className="text-center">Agent Rate</th>
                            <th className="text-center">Receiving Amount</th>
                            <th className="text-center">Admin Fee</th>
                            <th className="text-center">Total Collection</th>
                            <th className="text-center">Agent Settlement</th>
                            <th className="text-center">Our Profit</th>
                            <th className="text-center">Deposit Balance</th>
                          </tr>
                        </thead>

                        <tbody>
                          {report.length > 0 ? (
                            <>
                              {report.map((item, index) => (
                                <tr key={item.id}>
                                  <td className="text-center">{item.id}</td>
                                  <td>{item.created_at}</td>
                                  <td>{item.agentName}</td>
                                  <td>{item.agentCode}</td>
                                  <td>{item.paymentMethod}</td>

                                  <td className="text-center">
                                    {item.buyingRate}
                                  </td>
                                  <td className="text-center">
                                    {item.walletrate}
                                  </td>
                                  <td className="text-center">
                                    {item.receiving_money}
                                  </td>
                                  <td className="text-center">
                                    {item.fee}
                                  </td>
                                 
                                  <td className="text-center">
                                    {item.totalCollection}
                                  </td>

                                  <td className="text-center">
                                    {item.agentsettlement}
                                  </td>
                                
                                  <td className="text-center">
                                    {item.ourProfit}
                                  </td>
                                  <td className="text-center">
                                    {item.deposit_balance}
                                  </td>
                                </tr>
                              ))}

                              {/* TOTAL ROW */}
                              <tr className="fw-bold bg-light">
                                <td colSpan="6" className="text-end">
                                  Total →
                                </td>

                                <td className="text-center">
                                  {report.reduce(
                                    (sum, i) => sum + Number(i.ourCharge || 0),
                                    0
                                  )}
                                </td>
                                <td className="text-center">
                                  {report.reduce(
                                    (sum, i) =>
                                      sum + Number(i.dailyChargeProfit || 0),
                                    0
                                  )}
                                </td>
                                <td className="text-center">
                                  {report.reduce(
                                    (sum, i) =>
                                      sum + Number(i.totalCollection || 0),
                                    0
                                  )}
                                </td>

                                <td className="text-center">
                                  {report.reduce(
                                    (sum, i) =>
                                      sum + Number(i.agentSettlement || 0),
                                    0
                                  )}
                                </td>
                                <td className="text-center">
                                  {report.reduce(
                                    (sum, i) =>
                                      sum + Number(i.ourSettlement || 0),
                                    0
                                  )}
                                </td>
                                <td className="text-center">
                                  {report.reduce(
                                    (sum, i) => sum + Number(i.ourProfit || 0),
                                    0
                                  )}
                                </td>
                                <td className="text-center">
                                  {report.reduce(
                                    (sum, i) =>
                                      sum + Number(i.depositBalance || 0),
                                    0
                                  )}
                                </td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td
                                colSpan="15"
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
