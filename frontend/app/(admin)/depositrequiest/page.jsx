"use client";
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
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Agent Deposit Request";

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
    status = formData.status,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      params.append("page", String(page ?? 1));
      params.append("pageSize", String(pageSize ?? 10));

      if (searchQuery) params.append("searchQuery", searchQuery);
      if (selectedFilter) params.append("selectedFilter", selectedFilter);
      if (agent_id) params.append("agent_id", String(agent_id));
      if (status) params.append("status", String(status));

      const url = `${process.env.NEXT_PUBLIC_API_BASE}/deposit-request/index?${params.toString()}`;

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
      // FIX: setTotalRows is correctly inside fetchData where result is defined
      setTotalRows(
        result.total ||
          result.totalRows ||
          result.total_count ||
          result.count ||
          result.meta?.total ||
          0,
      );
      setApprovalAmount(result.total_approved_amount || 0);
    } catch (err) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
            badgeClass = "badge bg-warning text-dark";
            break;
          case 1:
            statusText = "Approved";
            badgeClass = "badge bg-success";
            break;
          case 2:
            statusText = "Rejected";
            badgeClass = "badge bg-danger";
            break;
          default:
            statusText = "Unknown";
            badgeClass = "badge bg-secondary";
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchData(newPage, perPage, search);
  };

  const handlePerRowsChange = (newPerPage, currentPage) => {
    setPerPage(newPerPage);
    setPage(currentPage);
    fetchData(currentPage, newPerPage, search);
  };

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <div className="app-content-header">
        <div className="container-fluid">
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
        </div>
      </div>

      <Toaster position="top-right" />

      <div className="app-content">
        <div className="container-fluid">
          <div className="card card-primary card-outline mb-4">
            <div className="card-header">
              <div className="card-title w-100">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  {roles.includes("admin") && (
                    <select
                      name="agent_id"
                      className="form-select"
                      style={{ width: "200px" }}
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
                  )}

                  <select
                    className="form-select"
                    style={{ width: "180px" }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="0">Pending</option>
                    <option value="1">Approved</option>
                    <option value="2">Rejected</option>
                  </select>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setPage(1);
                      fetchData(1, perPage, search);
                    }}
                  >
                    Search
                  </button>

                  <div className="ms-auto d-flex gap-2">
                    {perms.includes("create deposit") && (
                      <Link
                        className="btn btn-primary"
                        href="/depositrequiest/add"
                      >
                        Add New
                      </Link>
                    )}
                    {roles.includes("admin") && (
                      <button
                        className="btn btn-danger"
                        onClick={handleLogClick}
                      >
                        Log
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <DataTable
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationRowsPerPageOptions={[
                  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600,
                  650, 700, 750, 800, 850, 900, 950, 1000, 1200, 1500, 2000,
                ]}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
