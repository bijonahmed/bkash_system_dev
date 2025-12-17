"use client"; // Required in Next.js App Router for client-side component
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { customStyles } from "../../components/styles/customDataTable";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import useAgents from "../../hooks/getAgents.js";
export default function DepositRequestPage() {
  const router = useRouter();
  const { token, permissions, roles } = useAuth();
  //console.log("Permissions:", permissions);
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Agent Deposit Request";
  //const title = pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [approvalAmount, setApprovalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { agentData } = useAgents();
  const [formData, setFormData] = useState({
    id: "",
    payment_method: "",
    payment_date: "",
    approval_status: "",
    amount_gbp: "",
    agent_id: "",
    status: "",
    attachment: null,
  });

  const handleLogClick = () => {
    try {
      router.push("/report/deposit/");
    } catch (err) {
      toast.error("Navigation failed!");
      console.error(err);
    }
  };
  const fetchData = async (
    page = 1,
    pageSize = 10,
    searchQuery = "",
    selectedFilter = statusFilter !== "" ? statusFilter : "",
    agent_id = formData.agent_id,
    status = formData.status
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        pageSize,
        searchQuery: searchQuery ?? "",
        selectedFilter: selectedFilter ?? "",
        agent_id: agent_id ?? "",
        status: status ?? "",
      });

      const url = `${
        process.env.NEXT_PUBLIC_API_BASE
      }/deposit-request/index?${params.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let result;
      try {
        result = await res.json();
      } catch (e) {
        result = null;
      }
      if (!res.ok) {
        if (result && result.message) {
          throw new Error(result.message);
        } else {
          throw new Error(`HTTP Error: ${res.status}`);
        }
      }
      setData(result.data || []);
      setApprovalAmount(result.total_approved_amount || 0);
    } catch (err) {
      //console.error("Fetch users failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(page, perPage, search);
  }, [page, perPage, search]);
  useEffect(() => {
    if (selectedRow) {
      setFormData({
        payment_method: selectedRow.payment_method?.toLowerCase() || "",
        payment_date: selectedRow.payment_date || "",
        amount_gbp: selectedRow.amount_gbp || "",
        approval_status: selectedRow.approval_status || "",
        id: selectedRow.id || "",
        attachment: null,
      });
    }
  }, [selectedRow]);
  // Handle text / number / date / select change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

 

  const columns = [
    {
      name: "Agent Name",
      selector: (row) => row.agent_name,
      sortable: true,
    },
    {
      name: "Payment Method",
      selector: (row) => row.payment_method,
      sortable: true,
    },
    {
      name: "Payment Date",
      selector: (row) => row.payment_date,
      sortable: true,
    },
    {
      name: "Approval Status",
      selector: (row) => row.approval_status,
      sortable: true,
      cell: (row) => {
        let statusText = "";
        let badgeClass = "";
        switch (row.approval_status) {
          case 0:
            statusText = "Pending";
            badgeClass = "badge bg-warning text-dark"; // yellow
            break;
          case 1:
            statusText = "Approved";
            badgeClass = "badge bg-success"; // green
            break;
          case 2:
            statusText = "Rejected";
            badgeClass = "badge bg-danger"; // red
            break;
          default:
            statusText = "Unknown";
            badgeClass = "badge bg-secondary"; // gray
        }
        return <span className={badgeClass}>{statusText}</span>;
      },
    },
    {
      name: "Amount GBP",
      selector: (row) => row.amount_gbp,
      sortable: true,
    },
    {
      name: "Attachment",
      selector: (row) => row.attachment,
      sortable: true,
      cell: (row) =>
        row.attachment ? (
          <a
            href={`${row.attachment}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View File
          </a>
        ) : (
          "No File"
        ),
    },
    // Inside your columns array
    ...(roles.includes("admin")
      ? [
          {
            name: "Actions",
            cell: (row) => (
              <div className="d-flex gap-2">
                {perms.includes("edit deposit") && (
                  <Link
                    className="btn btn-sm btn-primary"
                    href={`/depositrequiest/edit/${row.id}`}
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </Link>
                )}
              </div>
            ),
            ignoreRowClick: true,
          },
        ]
      : []),
  ];
  const handlePageChange = (newPage) => setPage(newPage);
  const handlePerRowsChange = (newPerPage) => setPerPage(newPerPage);
  return (
    <main className="app-main" id="main" tabIndex={-1}>
      {/*begin::App Content Header*/}
      <div className="app-content-header">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">
                {title}{" "}
                <span className="text-success">
                  (Approval Amount GBP {approvalAmount})
                </span>
              </h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {title}
                </li>
              </ol>
            </div>
          </div>
          {/*end::Row*/}
        </div>
        {/* Start */}
        {/* END */}
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
                <div className="row g-2 align-items-center">
                  {/* Column 1: Search input */}
                  {/* Status Filter */}
                  {roles.includes("admin") && (
                    <div className="col-md-4">
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
                  )}
                  <div className="col-4 col-md-4 col-lg-4">
                    <select
                      className="form-control"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="0">Pending</option>
                      <option value="1">Approved</option>
                      <option value="2">Rejected</option>
                    </select>
                  </div>
                  {/* Column 2: Fetch button */}
                  <div className="col-6 col-md-3 col-lg-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => fetchData()}
                    >
                      Search
                    </button>
                  </div>
                  {/* Column 3: Add User button */}
                  <div className="col-6 col-md-3 col-lg-1 ms-auto">
                    {perms.includes("create deposit") ? (
                      <Link
                        className="btn btn-primary w-100"
                        href="/depositrequiest/add"
                      >
                        Add New
                      </Link>
                    ) : null}
                    {roles.includes("admin") && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleLogClick()}
                      >
                        Log
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="card-body p-0">
              <DataTable
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                customStyles={customStyles}
              />
            </div>
          </div>
          {/*end::Body*/}
        </div>
        {/*end::Row*/}
      </div>
      {/*end::Container*/}
      
      {/*end::App Content*/}
    </main>
  );
}
