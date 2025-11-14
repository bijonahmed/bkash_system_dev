"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import "../list/transactionFilter.css";
import AddNewModal from "./AddNewModal.jsx";
import getTransactions from "../../../hooks/getTransactions";
import "../../../../app/style/loader.css";

export default function listPage() {
  const { token, permissions } = useAuth();

  const router = useRouter();
  const [showFilters, setShowFilters] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const title = "Transaction List";
  const contentRef = useRef(null);

  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  useEffect(() => {
    const today = new Date();

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Format to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split("T")[0];

    setCreatedFrom(formatDate(yesterday));
    setCreatedTo(formatDate(today));
  }, []);

  if (!permissions.includes("create rate")) {
    router.replace("/dashboard");
    return false;
  }

  const filterByTransaction = () => {
    refetch();
  };

  const [filters, setFilters] = useState({
    beneficiaryName: "",
    beneficiaryPhone: "",
    senderName: "",
    accountNo: "",
    createdFrom: "",
    createdTo: "",
    paymentMethod: "",
    wallet: "",
    status: "",
    agent: "",
  });
  const { transactionData, refetch, loading } = getTransactions(filters);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      {/*begin::App Content Header*/}
      <div className="app-content-header">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="row">
            <div className="col-sm-6">
              <h4 className="mb-0">{title}</h4>
            </div>
            <div className="col-sm-6">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb float-sm-end bg-light rounded px-3 py-2 shadow-sm">
                  <li className="breadcrumb-item">
                    <Link
                      href="/dashboard"
                      className="text-primary fw-bold hover:underline"
                    >
                      Home
                    </Link>
                  </li>

                  <li className="breadcrumb-item">
                    <span
                      onClick={() => router.back()}
                      className="text-info fw-bold hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      ← Back
                    </span>
                  </li>

                  <li className="breadcrumb-item">
                    <span
                      className="text-success fw-bold hover:underline cursor-pointer"
                      onClick={() => setShowModal(true)}
                    >
                      Add New
                      {/* Modal */}
                    </span>
                  </li>

                  <li className="breadcrumb-item">
                    <span
                      className="text-warning fw-bold hover:underline cursor-pointer"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* Modal rendered outside <span>/<li> */}
          <AddNewModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={refetch}
          />
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>

      {/*begin::App Content*/}
      <div className="app-content">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <Toaster position="top-right" />
          <div className="row g-4">
            {/*begin::Col*/}
            {loading && (
              <div className="loader-overlay">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div className="col-lg-12">
              {showFilters && (
                <div
                  ref={contentRef}
                  className={`card-collapse ${showFilters ? "show" : ""}`}
                >
                  <div
                    className="card shadow-sm"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <div
                      className="card-header d-flex justify-content-between align-items-center"
                      style={{ backgroundColor: "#007bff", color: "#fff" }}
                    >
                      <h5 className="card-title m-0">Search Filters</h5>
                      <div className="card-tools">
                        <button
                          type="button"
                          className="btn btn-tool text-white"
                          title="Collapse"
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="row">
                        {/* Input Fields */}
                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">
                            Beneficiary Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Beneficiary Name"
                            value={filters.beneficiaryName}
                            onChange={(e) =>
                              handleFilterChange(
                                "beneficiaryName",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">
                            Beneficiary Phone #
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Phone #"
                            value={filters.beneficiaryPhone}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                beneficiaryPhone: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">
                            Sender Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Sender Name"
                          />
                        </div>

                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">Account #</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Account #"
                          />
                        </div>

                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">
                            Created From
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            value={filters.createdFrom}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                createdFrom: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">Created To</label>
                          <input
                            type="date"
                            className="form-control"
                            value={createdTo}
                            onChange={(e) => setCreatedTo(e.target.value)}
                          />
                        </div>

                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">
                            Payment Method
                          </label>
                          <select
                            className="form-control"
                            value={filters.paymentMethod}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                paymentMethod: e.target.value,
                              })
                            }
                          >
                            <option value="">Choose Payment Method</option>
                            <option value="wallet">Wallet</option>
                            <option value="bank">Bank</option>
                          </select>
                        </div>

                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">Wallet</label>
                          <select className="form-control">
                            <option value="">Choose Wallet</option>
                            <option value="Bkash">Bkash</option>
                            <option value="Nagad">Nagad</option>
                            <option value="Rocket">Rocket</option>
                          </select>
                        </div>

                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">Status</label>
                          <select className="form-control">
                            <option value="">Choose Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="cancel">Cancel</option>
                          </select>
                        </div>

                        <div className="col-md-3 mb-1">
                          <label className="mb-0 fw-semibold">Agent</label>
                          <select className="form-control">
                            <option value="">Select Agent</option>
                            <option value="47">JAHER AND SONS LIMITED</option>
                            <option value="46">
                              SHAHPORAN BUSINESS CENTER LTD
                            </option>
                            <option value="45">EHAN SERVICE LIMITED</option>
                            {/* add more agents dynamically if needed */}
                          </select>
                        </div>

                        <div className="col-md-3 mb-1 d-flex align-items-end">
                          <button
                            className="btn btn-sm btn-primary btn-lg"
                            onClick={filterByTransaction}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🔹 Transactions Card */}
              <div className="card-body p-0 mt-2">
                <div className="overflow-auto-">
                  <table className="table table-sm table-hover table-bordered table-colorful">
                    <thead>
                      <tr className="table-gradient">
                        <th className="text-center text-white">#</th>
                        <th className="text-white">Created By</th>
                        <th className="text-white">Beneficiary Detail</th>
                        <th className="text-white">Sender Detail</th>
                        <th className="text-white">Paid at</th>
                        <th className="text-white">Payment Details</th>
                        <th className="text-white">Sending Amount</th>
                        <th className="text-white">Charges</th>
                        <th className="text-white">Admin Fee</th>
                        <th className="text-white">Total Amount</th>
                        <th className="text-white">Agent Settlement</th>
                        <th className="text-white">Description</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="balance-row">
                        <td
                          colSpan="12"
                          className="text-end fw-bold text-danger"
                        >
                          Balance: 0000.00
                        </td>
                      </tr>

                      {/* Example row */}

                      {transactionData && transactionData.length > 0 ? (
                        transactionData.map((item, index) => (
                          <tr key={item.id} className="table-row bg-light">
                            {/* or bg-info, bg-warning, bg-success, etc. */}
                            <td>{index + 1}</td>
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
                              {item.senderName} <br />
                              <span
                                className={`badge ${
                                  item.paymentMethod.toLowerCase() === "bank"
                                    ? "bg-primary"
                                    : "bg-danger"
                                }`}
                              >
                                {item.paymentMethod.charAt(0).toUpperCase() +
                                  item.paymentMethod.slice(1)}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  item.status.toLowerCase() === "paid"
                                    ? "bg-success"
                                    : item.status.toLowerCase() === "unpaid"
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
                              GBP&nbsp;{item.sendingMoney}
                              <br />
                              {item.paytMethod === "wallet" ? (
                                <>
                                  GBP 1 = BDT {item.walletrate} (PR)
                                  <br />
                                  GBP 1 = BDT {item.walletrate} (CR) <br />
                                </>
                              ) : (
                                <>
                                  GBP 1 = BDT {item.bankRate} (PR)
                                  <br />
                                  GBP 1 = BDT {item.bankRate} (CR) <br />
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
                            <td>
                              <a
                                href="/transactions/3022/edit"
                                className="btn btn-warning btn-sm"
                              >
                                <i className="bi bi-pencil-fill"></i> Edit
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="13" className="text-center text-muted">
                            No transactions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/*end::Form*/}
            {/*end::Col*/}
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>
      {/*end::App Content*/}
    </main>
  );
}
