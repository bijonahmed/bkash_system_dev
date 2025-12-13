"use client"; // Required in Next.js App Router for client-side component
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import BootstrapPagination from "../../../components/pagination.jsx";
export default function UserPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Transaction Report";
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
  const [currentPage, setCurrentPage] = useState(1);
  // Fetch transactions on page load or filter change
  const filterByTransaction = () => {
    setCurrentPage(1); // reset to first page when filtering
    refetch({ filters, page: 1 });
  };
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  const handleFilter = async () => {
    const query = new URLSearchParams(formData).toString();
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/report/getTransactionReport?${query}`;
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
  if (!permissions.includes("view transaction")) {
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
                      <div className="overflow-auto table-wrapper">
                        <table className="table table-sm table-hover table-bordered table-colorful">
                          <thead className="table-gradient">
                            <tr>
                              <th style={{ width: "3%" }}>#</th>
                              <th style={{ width: "15%" }}>Agent Name</th>
                              <th style={{ width: "15%" }}>
                                Beneficiary Details
                              </th>
                              <th style={{ width: "15%" }}>Sender Details</th>
                              <th style={{ width: "5%" }}>Status</th>
                              <th style={{ width: "15%" }}>Payment Method</th>
                              <th
                                style={{ width: "8%" }}
                                className="text-center"
                              >
                                Sending Amount
                              </th>
                              <th
                                style={{ width: "4%" }}
                                className="text-center"
                              >
                                Charges
                              </th>
                              <th
                                style={{ width: "4%" }}
                                className="text-center"
                              >
                                Admin Fee
                              </th>
                              <th
                                style={{ width: "4%" }}
                                className="text-center"
                              >
                                Total Amount
                              </th>
                              <th style={{ width: "4%" }}>Agent Settlement</th>
                              <th style={{ width: "8%" }}>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Example row */}
                            {report && report.length > 0 ? (
                              report.map((item, index) => (
                                <tr
                                  key={item.id}
                                  className="table-row bg-light"
                                >
                                  {/* or bg-info, bg-warning, bg-success, etc. */}
                                  <td>{item.id}</td>
                                  <td>
                                    {item.createdBy}
                                    <br />
                                    <small className="text-muted">
                                      {item.created_at}
                                    </small>
                                  </td>
                                  <td>
                                    {item.beneficiaryName} <br />{" "}
                                    {item.beneficiaryPhone}
                                  </td>
                                  <td>
                                    {item.senderName}
                                    <br />
                                    <span
                                      className={`badge ${
                                        item.paymentMethod.toLowerCase() ===
                                        "bank"
                                          ? "bg-primary"
                                          : "bg-danger"
                                      }`}
                                    >
                                      {item.paymentMethod
                                        .charAt(0)
                                        .toUpperCase() +
                                        item.paymentMethod.slice(1)}
                                      {item?.paymentMethod?.toLowerCase() ===
                                      "wallet" ? (
                                        <>&nbsp;({item.walletName})</>
                                      ) : (
                                        <>&nbsp;({item.bankName})</>
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        item.status.toLowerCase() === "paid"
                                          ? "bg-success"
                                          : item.status.toLowerCase() ===
                                            "unpaid"
                                          ? "bg-warning"
                                          : "bg-danger"
                                      }`}
                                    >
                                      {item.status.charAt(0).toUpperCase() +
                                        item.status.slice(1)}
                                    </span>
                                  </td>
                                  <td>
                                    {item.paytMethod === "wallet" ? (
                                      <>
                                        Name: {item.walletName} <br />
                                        Phone #: {item.beneficiaryPhone}
                                      </>
                                    ) : (
                                      <>
                                        Bank Name: {item.bankName} <br />
                                        Branch Name: {item.branchName} <br />
                                        Branch Code: {item.branchCode} <br />
                                        Account #: {item.accountNo}
                                      </>
                                    )}
                                  </td>
                                  <td>
                                    <small>GBP&nbsp;{item.sendingMoney}</small>
                                    <br />
                                    {item.paytMethod === "wallet" ? (
                                      <>
                                        <small>
                                          GBP 1 = BDT {item.walletrate} (PR)
                                        </small>
                                        <br />
                                        <small>
                                          {" "}
                                          GBP 1 = BDT {item.walletrate} (CR)
                                        </small>{" "}
                                        <br />
                                      </>
                                    ) : (
                                      <>
                                        <small>
                                          {" "}
                                          GBP 1 = BDT {item.bankRate} (PR)
                                        </small>
                                        <br />
                                        <small>
                                          GBP 1 = BDT {item.bankRate} (CR){" "}
                                        </small>{" "}
                                        <br />
                                      </>
                                    )}
                                  </td>
                                  <td>GBP&nbsp;{item.charges}</td>
                                  <td>GBP&nbsp;{item.fee}</td>
                                  <td>
                                    GBP {item.totalAmount} <br /> BDT{" "}
                                    {item.receiving_money}
                                  </td>
                                  <td className="text-center">
                                    {item.agentsettlement}
                                  </td>
                                  <td>{item.description}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="13"
                                  className="text-center text-muted"
                                >
                                  No transactions found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        {/* Pagination Buttons */}
                      </div>
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
