"use client"; // Required in Next.js App Router for client-side component

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function UserPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];

  const pathname = usePathname();
  const title = "Deposit Log Report";
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const [report, setReportData] = useState([]);

  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilter = async () => {
    const query = new URLSearchParams(formData).toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/report/getByReportDeposit?${query}`;

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
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    } finally {
      setLoading(false);
    }

    // your filter logic here
  };

  if (!permissions.includes("view deposit")) {
    router.replace("/dashboard");
    return false;
  }

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      {/*begin::App Content Header*/}
      <div className="app-content-header">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">{title}</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.back();
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    ← Back
                  </a>
                </li>
              </ol>
            </div>
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>

      {/*begin::App Content*/}
      <Toaster position="top-right" />
      <div className="app-content">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="card card-primary card-outline mb-4">
            {/* Header */}

            <div className="card-header">
              <div className="card-title w-100">
                <form className="row g-3 align-items-end mt-3">
                  <div className="col-md-4">
                    <label
                      htmlFor="fromDate"
                      className="form-label fw-semibold"
                    >
                      From Date
                    </label>
                    <input
                      type="date"
                      id="fromDate"
                      name="fromDate"
                      className="form-control"
                      value={formData.fromDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="toDate" className="form-label fw-semibold">
                      To Date
                    </label>
                    <input
                      type="date"
                      id="toDate"
                      name="toDate"
                      className="form-control"
                      value={formData.toDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={handleFilter}
                    >
                      <i className="fa-solid fa-filter me-2"></i> Filter
                    </button>
                  </div>
                </form>

                <div className="row g-2 align-items-center">
                  {/* Column 3: Add User button */}
                  <div className="col-6 col-md-3 col-lg-1 ms-auto">
                    {/* {perms.includes("create fee") ? (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => setShowModal(true)}
                      >
                        Add New
                      </button>
                    ) : null}{" "} */}
                  </div>
                </div>
              </div>

              {/* Start */}

              <div className="card-body p-0">
                Deposit Report
                <div className="table-responsive">
                  {loading ? (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ minHeight: "200px" }}
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-light p-3 rounded shadow-sm">
                      <table className="table table-sm table-hover table-bordered align-middle mb-0">
                        <thead className="table-primary text-center">
                          <tr>
                            <th>#</th>
                            <th>Agent Name</th>
                            <th>Payment Method</th>
                            <th>Approval Status</th>
                            <th>Amount GBP</th>
                            <th>Created By</th>
                            <th>Update By</th>
                            <th>Update At</th>
                            <th>Types</th>
                          </tr>
                        </thead>

                        <tbody>
                          {report.length === 0 ? (
                            <tr>
                              <td
                                colSpan="9"
                                className="text-center text-secondary py-3"
                              >
                                No records found.
                              </td>
                            </tr>
                          ) : (
                            report.map((depositrpt, index) => {
                              // Example: row background based on index
                              const rowBgColor =
                                index % 2 === 0 ? "#f8f9fa" : "#e9ecef"; // light gray shades

                              return (
                                <tr
                                  key={index + 1}
                                  style={{ backgroundColor: rowBgColor }}
                                >
                                  <td className="text-center">{index + 1}</td>
                                  <td
                                    className="text-center"
                                    style={{ backgroundColor: "#fff3cd" }}
                                  >
                                    {depositrpt.agent_name}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ backgroundColor: "#d1ecf1" }}
                                  >
                                    {depositrpt.payment_method}
                                  </td>
                                  <td className="text-center">
                                    <span
                                      className={`badge me-1 ${
                                        depositrpt.approval_status === 1
                                          ? "bg-success"
                                          : depositrpt.approval_status === 2
                                          ? "bg-danger"
                                          : "bg-warning text-dark"
                                      }`}
                                    >
                                      {depositrpt.approval_status === 1
                                        ? "Approved"
                                        : depositrpt.approval_status === 2
                                        ? "Rejected"
                                        : "Pending"}
                                    </span>

                                    {depositrpt.paymentMethod === "Wallet" &&
                                    depositrpt.walletTypeName
                                      ? depositrpt.walletTypeName
                                      : ""}
                                  </td>

                                  <td className="text-end">
                                    {depositrpt.amount_gbp}
                                  </td>
                                  <td className="text-center">
                                    {depositrpt.created_by}
                                  </td>
                                  <td className="text-center">
                                    {depositrpt.update_by}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ backgroundColor: "#f5c6cb" }}
                                  >
                                    {new Date(
                                      depositrpt.updated_at
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ backgroundColor: "#c3e6cb" }}
                                  >
                                    {depositrpt.type}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* END */}
            </div>
          </div>
          {/*end::Body*/}
        </div>
        {/*end::Row*/}
      </div>
    </main>
  );
}
