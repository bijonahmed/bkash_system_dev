"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import "../list/transactionFilter.css";
import AddNewModal from "./AddNewModal.jsx";
import useTransactions from "../../../hooks/getTransactions";
import useWallets from "../../../hooks/getWallet";
import useAgents from "../../../hooks/getAgents.js";
import BootstrapPagination from "../../../components/pagination.jsx";
import SpinnerLoader from "../../../components/admin/SpinnerLoader.jsx";
// import "../../../../app/style/loader.css";
import { apiDelete } from "../../../../lib/apiDelete";
import { apiUpdate } from "../../../../lib/apiUpdate";
export default function listPage() {
  const { token, permissions, roles } = useAuth();
  const searchBtnRef = useRef(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { transactionData, depositApproved, loading, totalPages, refetch } =
    useTransactions();
  const [showFilters, setShowFilters] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const title = "Transaction List";
  const contentRef = useRef(null);
  const { walletData, bankrate } = useWallets();

  const { agentData } = useAgents();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [filtersByDay, setFiltersByDay] = useState({ days: "" });

  const handleLogClick = () => {
    try {
      router.push("/report/transaction");
    } catch (err) {
      toast.error("Navigation failed!");
      console.error(err);
    }
  };
  // const [loading, setLoading] = useState(false);
  const handleChange = async (e) => {
    const value = e.target.value;
    setFiltersByDay({ days: value });
    if (!value) return;
    refetch({ filters: { days: value } });
  };
  const handleStatusClick = (item) => {
    setSelectedStatus((item.status || "").toLowerCase());
    setSelectedItem(item);
    // Open Bootstrap modal using JS
    const modalEl = document.getElementById("statusModal");
    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
  };
  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status!");
      return;
    }
    const result = await apiUpdate({
      endpoint: "/transaction/updateStatusForTransaction",
      data: { status: selectedStatus, id: selectedItem.id },
      token: token,
      onSuccess: () => {
        refetch();
        const modalEl = document.getElementById("statusModal");
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        modal.hide();
      },
    });
    if (!result.success) {
      console.error(result.error);
    }
  };
  const timeOptions = [
    { label: "Yesterday (-1)", value: "-1" },
    { label: "Last 7 days (7)", value: "7" },
    { label: "Last 30 days (30)", value: "30" },
  ];
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const deleteTransaction = (transactionId) => {
    apiDelete({
      endpoint: "/transaction/delete",
      id: transactionId,
      token: token,
      onSuccess: () => {
        // Refresh table or remove deleted item from state
        refetch();
      },
    });
  };
  const restoreTransaction = async (transactionId) => {
    if (!confirm("Are you sure you want to restore this transaction?")) return;
    apiDelete({
      endpoint: "/transaction/restoreTransaction",
      id: transactionId,
      token: token,
      onSuccess: () => {
        // Refresh table or update UI
        refetch();
      },
    });
  };
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const pad = (n) => String(n).padStart(2, "0");
    const toISODate = (date) =>
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}`;
    setCreatedFrom(toISODate(yesterday)); // always yesterday
    setCreatedTo(toISODate(today)); // today
  }, []);
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const [filters, setFilters] = useState({
    beneficiaryName: "",
    beneficiaryPhone: "",
    senderName: "",
    accountNo: "",
    transection_status: 1,
    createdFrom: yesterday, // previous date
    createdTo: today, // current date
    paymentMethod: "",
    wallet: "",
    status: "",
    wallet_id: "",
    agent_id: "",
    agent: "",
    limit: 50, // 50 records per page
  });
  // Fetch transactions on page load or filter change
  useEffect(() => {
    refetch({ filters, page: currentPage });
  }, [filters, currentPage, refetch]);
  const filterByTransaction = () => {
    setCurrentPage(1); // reset to first page when filtering
    refetch({ filters, page: 1 });
  };
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  useEffect(() => {
    if (searchBtnRef.current) {
      searchBtnRef.current.click();
    }
  }, []);
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
              <h4 className="mb-0">
                {title}{" "}
              </h4>
            </div>
            <div className="col-sm-6">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb float-sm-end bg-light rounded px-3">
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
                  {permissions.includes("create transaction") && (
                    <li className="breadcrumb-item">
                      <span
                        className="text-success fw-bold hover:underline cursor-pointer"
                        onClick={() => setShowModal(true)}
                      >
                        Add New
                        {/* Modal */}
                      </span>
                    </li>
                  )}
                  <li className="breadcrumb-item">
                    <span
                      className="text-warning fw-bold hover:underline cursor-pointer"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </span>
                  </li>
                  {roles.includes("admin") && (
                    <li className="breadcrumb-item">
                      <span
                        onClick={() => handleLogClick()}
                        className="text-danger fw-bold hover:underline cursor-pointer"
                      >
                        Log
                      </span>
                    </li>
                  )}
                </ol>
              </nav>
            </div>
          </div>
          <AddNewModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={refetch}
          />
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
            {loading && <SpinnerLoader />}
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
                            value={filters.senderName}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                senderName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">Account #</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Account #"
                            value={filters.accountNo}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                accountNo: e.target.value,
                              })
                            }
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
                            value={filters.createdTo}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                createdTo: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">
                            Pay. Method
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
                            <option value="">Pay Method</option>
                            <option value="wallet">Wallet</option>
                            <option value="bank">Bank</option>
                          </select>
                        </div>
                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">Wallet</label>
                          <select
                            className="form-select"
                            value={filters.wallet_id}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                wallet_id: e.target.value,
                              })
                            }
                          >
                            <option value="">Choose Wallet</option>
                            {walletData.map((wallet) => (
                              <option key={wallet.id} value={wallet.id}>
                                {wallet.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-1 mb-1">
                          <label className="mb-0 fw-semibold">Status</label>
                          <select
                            className="form-control"
                            value={filters.status}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="">Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="cancel">Cancel</option>
                          </select>
                        </div>
                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">Agent</label>
                          <select
                            className="form-select"
                            value={filters.agent_id}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                agent_id: e.target.value,
                              })
                            }
                          >
                            <option value="">Choose Agent</option>
                            {agentData.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">
                            Filter by Days
                          </label>
                          <select
                            className="form-select"
                            value={filtersByDay.days}
                            onChange={handleChange}
                          >
                            <option value="">Select Date Range</option>
                            {timeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2 mb-1">
                          <label className="mb-0 fw-semibold">
                            Transation Status
                          </label>
                          <select
                            className="form-control"
                            value={filters.transection_status}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                transection_status: e.target.value,
                              })
                            }
                          >
                            <option value="">Transation Status</option>
                            <option value="1">Active</option>
                            <option value="0">Delete</option>
                          </select>
                        </div>
                        <div className="col-md-1 mb-1 d-flex align-items-end">
                          <button
                            ref={searchBtnRef}
                            className="btn btn-sm btn-primary btn-lg"
                            onClick={filterByTransaction}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <center className="mt-2">
                    {" "}
                    <span className="bg-danger text-white px-2 rounded">
                      Balance: {depositApproved || 0}
                    </span>
                  </center>
                </div>
              )}
              {/* 🔹 Transactions Card */}
              <div className="card-body p-0 mt-2">
                <div className="overflow-auto">
                  <table className="table table-sm table-hover table-bordered table-colorful">
                    <thead>
                      <tr
                        className="table-gradient"
                        style={{ fontSize: "13px" }}
                      >
                        <th
                          className="text-center text-white"
                          style={{ width: "3%" }}
                        >
                          #
                        </th>
                        <th className="text-white" style={{ width: "10%" }}>
                          Agent Name
                        </th>

                        <th className="text-white" style={{ width: "5%" }}>
                          Sender Details
                        </th>
                        <th className="text-white" style={{ width: "10%" }}>
                          Beneficiary Details
                        </th>
                        <th className="text-white" style={{ width: "3%" }}>
                          Status
                        </th>
                        <th className="text-white" style={{ width: "10%" }}>
                          Payment
                        </th>
                        <th className="text-white" style={{ width: "8%" }}>
                          Sending Amount
                        </th>
                        <th className="text-white" style={{ width: "4%" }}>
                          Charges
                        </th>
                        <th className="text-white" style={{ width: "4%" }}>
                          Admin Fee
                        </th>
                        <th className="text-white" style={{ width: "8%" }}>
                          Total Amount
                        </th>
                        <th className="text-white" style={{ width: "4%" }}>
                          Agent Settlement
                        </th>
                        <th className="text-white" style={{ width: "8%" }}>
                          Description
                        </th>
                        <th style={{ width: "4%" }} colSpan={2}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Example row */}
                      {transactionData && transactionData.length > 0 ? (
                        transactionData.map((item, index) => (
                          <tr key={item.id} className="table-row bg-light">
                            {/* or bg-info, bg-warning, bg-success, etc. */}
                            <td>
                              {index + 1 + (currentPage - 1) * filters.limit}
                              {/* {item.id} */}
                            </td>
                            <td>
                              {item.createdBy}
                              <br />
                              <small className="text-muted">
                                {item.created_at}
                              </small>
                            </td>

                            <td>
                              <small>{item.senderName}</small>
                            </td>
                            <td>
                              <small>
                                {item.beneficiaryName} <br />{" "}
                                {item.beneficiaryPhone}
                              </small>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  (item.status || "").toLowerCase() === "paid"
                                    ? "bg-success"
                                    : (item.status || "").toLowerCase() ===
                                      "unpaid"
                                    ? "bg-warning"
                                    : "bg-danger"
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleStatusClick(item)}
                              >
                                {(item.status || "").charAt(0).toUpperCase() +
                                  (item.status || "").slice(1)}
                              </span>
                            </td>
                            <td>
                              {item.paymentMethod == "wallet" ? (
                                <>
                                  <small>
                                    {item.walletName} <br />
                                    Phone #: {item.beneficiaryPhone}
                                  </small>
                                </>
                              ) : item.paymentMethod == "bank" ? (
                                <>
                                  <small>
                                    {" "}
                                    Bank: {item.bankName} <br />
                                    Account #: {item.accountNo}
                                  </small>
                                </>
                              ) : (
                                <>N/A</>
                              )}
                            </td>

                            <td>
                              <small>GBP&nbsp;{item.sendingMoney}</small>
                              <br />
                              {item.paymentMethod == "wallet" ? (
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
                            <td>
                              {" "}
                              <small>GBP&nbsp;{item.charges}</small>
                            </td>
                            <td>
                              {" "}
                              <small>GBP&nbsp;{item.fee}</small>
                            </td>
                            <td>
                              <small>
                                GBP {item.totalAmount} <br /> BDT{" "}
                                {item.receiving_money}
                              </small>
                            </td>
                            <td className="text-center">
                              <small> {item.agentsettlement}</small>
                            </td>
                            <td>
                              <small>{item.description}</small>
                            </td>
                            {permissions.includes("edit transaction") && (
                              <td>
                                <Link
                                  href={`/transaction/edit/${item.id}`}
                                  className="btn btn-warning btn-sm"
                                >
                                  <i className="bi bi-pencil-fill"></i>
                                </Link>
                              </td>
                            )}
                            {permissions.includes("delete transaction") && (
                              <td>
                                {item.transection_status == 1 ? (
                                  <>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => deleteTransaction(item.id)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() =>
                                        restoreTransaction(item.id)
                                      }
                                    >
                                      <i className="bi bi-arrow-counterclockwise"></i>
                                    </button>
                                  </>
                                )}
                              </td>
                            )}
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
                  {/* Pagination Buttons */}
                  <div className="mt-3">
                    <BootstrapPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      goToPage={goToPage}
                    />
                  </div>
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
      {/* Start Modal */}
      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        id="statusModal"
        tabIndex="-1"
        aria-labelledby="statusModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Transaction ID: ({selectedItem?.id || ""})
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {roles == "admin" ? (
                <>
                  <label className="form-label">Select Status</label>
                  <select
                    className="form-select"
                    value={selectedStatus || ""}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="paid">Paid</option>
                    <option value="hold">Hold</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="cancel">Cancel</option>
                    <option value="pending">Pending</option>
                  </select>
                </>
              ) : (
                <>
                  <span className="d-flex justify-content-center text-danger">
                    Permission not allowed
                  </span>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {roles == "admin" && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdateStatus}
                  >
                    Update Status
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* END Modal */}
    </main>
  );
}
