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
import { exportAgentExcel } from "../../../../lib/exportExcel";
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

  const title = "All Agent Statement";

  useEffect(() => {
    document.title = title;
  }, [title]);

  const [report, setReportData] = useState([]);

  const [formData, setFormData] = useState({
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
    setLoading(true);
    const query = new URLSearchParams(formData).toString();
    try {
      const result = await apiGet({
        endpoint: "/report/allAgentReport",
        params: query,
        token: token,
      });

      if (result.success) {
        toast.success("Loading...");
        setReportData(result.data.data); // Use result.data, not undefined 'data'
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [token]);

  const tableRef = useRef();
  // 🎯 EXCEL EXPORT WITH BORDER, AUTO WIDTH, CLEAN FORMAT
  const downloadExcel = async () => {
    try {
      await exportAgentExcel(report, "agent_list");
      toast.success("Excel exported!");
    } catch (error) {
      toast.error(error.message);
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
            <div className="card-header">
              <form className="row g-3 align-items-end">
                {/* Agent Select */}
                <div className="col-md-6">
                  <label>Agent</label>
                  <select
                    name="agent_id"
                    className="form-select"
                    value={formData.agent_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">All Agent</option>
                    {agentData.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Button */}
                <div className="col-md-2 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleFilter}
                  >
                    Filter
                  </button>
                </div>

                {/* Export Button - show only if report has data */}
                {report.length > 0 && (
                  <div className="col-md-2 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={downloadExcel}
                    >
                      Export to Excel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Report Table */}
            <div className="card-body">
              <h6 className="fw-bold mb-3 text-dark">{selectedAgentName}</h6>

              <div className="table-responsive">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : (
                  <div className="bg-light rounded shadow-sm">
                    <div className="overflow-auto">
                      <table
                        className="table table-sm table-hover table-bordered table-colorful"
                        ref={tableRef}
                      >
                        <thead>
                          <tr>
                            <th className="text-center">#</th>
                            <th>Agent Name</th>
                            <th>Agent Code</th>
                            <th>Balance</th>
                          </tr>
                        </thead>

                        <tbody>
                          {report.length > 0 ? (
                            <>
                              {report.map((item, index) => (
                                <tr key={index + 1}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{item.agent_name}</td>
                                  <td>{item.agentCode}</td>
                                  <td className="text-center">
                                    {item.balance}
                                  </td>
                                </tr>
                              ))}
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
