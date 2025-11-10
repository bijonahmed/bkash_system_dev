"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import "../list/transactionFilter.css";
import AddNewModal from "./AddNewModal.jsx";

export default function SettingPage() {
  const { token, permissions } = useAuth();
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
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
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setCreatedFrom(today);
    setCreatedTo(today);
  }, []);

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(
      (tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl)
    );
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true); // Always start loader before fetch

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/setting/settingrow`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // add only if token exists
          },
        }
      );

      const data = await res.json();
      console.log("Fetched Setting Data:", data);

      if (!res.ok) {
        console.error(
          "Server responded with error:",
          data?.message || "Unknown error"
        );
        return;
      }

      const info = data?.data || {}; // safe fallback

      setUser(info); // ✅ Store only the data part, not wrapper
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center py-5"></p>;
  }

  if (!permissions.includes("create rate")) {
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
          <AddNewModal show={showModal} onClose={() => setShowModal(false)} />
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
            {/*begin::Form*/}
            {/* Optional CSS for smooth slide */}

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
                        <div className="col-md-3 mb-3">
                          <label className="mb-0 fw-semibold">
                            Beneficiary Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Beneficiary Name"
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="mb-0 fw-semibold">
                            Beneficiary Phone #
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Phone #"
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="mb-0 fw-semibold">
                            Sender Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Sender Name"
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="mb-0 fw-semibold">Account #</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Account #"
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="mb-0 fw-semibold">
                            Created From
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            value={createdFrom}
                            onChange={(e) => setCreatedFrom(e.target.value)}
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="mb-0 fw-semibold">Created To</label>
                          <input
                            type="date"
                            className="form-control"
                            value={createdTo}
                            onChange={(e) => setCreatedTo(e.target.value)}
                          />
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="mb-0 fw-semibold">
                            Payment Method
                          </label>
                          <select className="form-control">
                            <option value="">Choose Payment Method</option>
                            <option value="wallet">Wallet</option>
                            <option value="bank">Bank</option>
                          </select>
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="mb-0 fw-semibold">Wallet</label>
                          <select className="form-control">
                            <option value="">Choose Wallet</option>
                            <option value="Bkash">Bkash</option>
                            <option value="Nagad">Nagad</option>
                            <option value="Rocket">Rocket</option>
                          </select>
                        </div>

                        <div className="col-md-3 mb-3">
                          <label className="mb-0 fw-semibold">Status</label>
                          <select className="form-control">
                            <option value="">Choose Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="cancel">Cancel</option>
                          </select>
                        </div>

                        <div className="col-md-3 mb-3">
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

                        <div className="col-md-3 mb-3 d-flex align-items-end">
                          <button className="btn btn-sm btn-secondary me-2">
                            Reset
                          </button>
                          <button className="btn btn-sm btn-primary">
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
                <div className="overflow-auto">
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
                          Balance: -610.00
                        </td>
                      </tr>

                      {/* Example row */}
                      <tr className="table-row bg-light">
                        {/* or bg-info, bg-warning, bg-success, etc. */}
                        <td>1</td>
                        <td>
                          SHAHPORAN BUSINESS CENTER LTD <br />
                          (SHAHUKLNO21) <br />
                          <small className="text-muted">
                            Nov 10, 2025 03:16 PM
                          </small>
                        </td>
                        <td>
                          parul akter <br /> 01779832879
                        </td>
                        <td>
                          akter <br />
                          <span className="badge bg-primary">Wallet</span>
                        </td>
                        <td>
                          <span className="badge bg-warning">UnPaid</span>
                        </td>
                        <td>
                          Name: Bkash <br />
                          Phone #: 01779832879
                        </td>
                        <td
                          data-bs-toggle="tooltip"
                          data-bs-html="true"
                          title={`Sending Amount: GBP 123.42\nCompany Rate: GBP 1 = BDT 158.00\nAgent Rate: GBP 1 = BDT 158.00`}
                        >
                          GBP 123.42 <br /> GBP 1 = BDT 158.00 (PR) <br /> GBP 1
                          = BDT 158.00 (CR)
                        </td>
                        <td>GBP 0.00</td>
                        <td>GBP 2.50</td>
                        <td
                          data-bs-toggle="tooltip"
                          data-bs-html="true"
                          title={`Sending Amount: GBP 123.42\nCharges: GBP 0.00\nAdmin Fee: GBP 2.50\nTotal Pay Amount: GBP 125.92\nReceiving Amount: BDT 19,500.00`}
                        >
                          GBP 125.92 <br /> BDT 19,500.00
                        </td>
                        <td>GBP 125.92</td>
                        <td></td>
                        <td>
                          <a
                            href="/transactions/3022/edit"
                            className="btn btn-warning btn-sm"
                          >
                            <i className="bi bi-pencil-fill"></i> Edit
                          </a>
                        </td>
                      </tr>
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
