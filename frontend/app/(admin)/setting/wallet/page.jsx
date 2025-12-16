"use client"; // Required in Next.js App Router for client-side component

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { customStyles } from "../../../components/styles/customDataTable";
import { useAuth } from "../../../context/AuthContext";
import getAgents from "../../../hooks/getAgents";
import getWallets from "../../../hooks/getWallet";
import getWalletAgent from "../../../hooks/getWalletAgent";
import toast, { Toaster } from "react-hot-toast";

export default function UserPage() {
  const router = useRouter();
  const { token, permissions, roles } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Rate List";
  //const title = pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  const { agentData } = getAgents();
  const { walletData, allWalletData } = getWallets();
  const { walletAgentData, refetchAgentWallet } = getWalletAgent();
  const [errors, setErrors] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  const handleDeleteAgent = async (item) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/wallet/deleteAgentRate/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }
      toast.success("Deleted successfully");
      refetchAgentWallet();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/wallet/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }
      toast.success("Deleted successfully");
      // Refresh table / remove deleted row from state
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const fetchWallet = async (
    page = 1,
    pageSize = 10,
    searchQuery = "",
    selectedFilter = statusFilter !== "" ? statusFilter : 1
  ) => {
    setLoading(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/wallet/index?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}&selectedFilter=${selectedFilter}`;
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
      setTotalRows(result.total_records || 0);
    } catch (err) {
      //console.error("Fetch users failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    id: "",
    agent_id: "",
    wallet_id: "",
    amount: "",
    status: 1,
  });

  const handleEdit = (row) => {
    setFormData((prev) => ({
      ...prev,
      id: row.id,
      agent_id: row.agent_id,
      wallet_id: row.wallet_id,
      amount: row.amount,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/wallet/assignWallet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        //setUser(data);
        refetchAgentWallet();

        setFormData({
          id: "",
          agent_id: "",
          wallet_id: "",
          amount: "",
          status: 1,
        });

        if (formData.id) {
          toast.success("Update successfully");
        } else {
          toast.success("Add successfully");
        }
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });

        setErrors(data.errors);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };

  useEffect(() => {
    fetchWallet(page, perPage, search);
  }, [page, perPage, search]);

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Amount", selector: (row) => `BDT ${row.amount}`, sortable: true },
   
    // Only include Actions column if admin
    ...(roles == "admin"
      ? [
         {
      name: "Status",
      selector: (row) => (row.status == 1 ? "Active" : "Inactive"),
      sortable: true,
    },
          {
            name: "Actions",
            cell: (row) => (
              <div className="d-flex gap-2">
                {perms.includes("edit wallet") && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      router.push(`/setting/wallet/edit/${row.id}`)
                    }
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </button>
                )}
                {perms.includes("delete wallet") && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(row.id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
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
              <h3 className="mb-0">{title}</h3>
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
        {/*end::Container*/}
      </div>

      {/*begin::App Content*/}
      <Toaster position="top-right" />
      <div className="app-content">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="card card-primary card-outline mb-4">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "general" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("general")}
                >
                  General Wallet
                </button>
              </li>
              {roles == "admin" && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "assign" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("assign")}
                  >
                    Assign Wallet
                  </button>
                </li>
              )}
            </ul>

            {/* Tab Content */}
            <div className="tab-content p-3">
              {/* General Wallet */}
              {activeTab === "general" && (
                <div className="tab-pane active">
                  <div className="card-header">
                    <div className="card-title w-100">
                      <div className="row g-2 align-items-center">
                        {/* Search input */}
                        <div className="col-12 col-md-6 col-lg-6">
                          <input
                            type="text"
                            placeholder="Search..."
                            className="form-control"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>

                        {/* Status filter */}
                        {roles == "admin" && (
                          <div className="col-4 col-md-4 col-lg-3">
                            <select
                              className="form-control"
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                            >
                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </select>
                          </div>
                        )}

                        {/* Fetch button */}
                        <div className="col-6 col-md-3 col-lg-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary w-100"
                            onClick={() => fetchWallet()}
                          >
                            Fetch
                          </button>
                        </div>

                        {/* Add Wallet button */}
                        <div className="col-6 col-md-3 col-lg-1 ms-auto">
                          {perms.includes("create wallet") &&
                            roles == "admin" && (
                              <button
                                className="btn btn-primary w-100"
                                onClick={() =>
                                  router.push(`/setting/wallet/add`)
                                }
                              >
                                Add New
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DataTable */}
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
              )}

              {/* Assign Wallet */}
              {activeTab === "assign" && (
                <div className="tab-pane active">
                  <div className="row">
                    <div className="col-6">
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "900px" }}
                      >
                        <table className="table table-bordered table-striped">
                          <thead
                            className="table-dark"
                            style={{ position: "sticky", top: 0 }}
                          >
                            <tr>
                              <th>ID</th>
                              <th>Agent Name</th>
                              <th>Wallet Name</th>
                              <th>Amount</th>
                              <th>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {walletAgentData.map((row, index) => (
                              <tr key={row.id}>
                                <td>{index + 1}</td>
                                <td>{row.agent_name}</td>
                                <td>{row.wallet_name}</td>

                                <td>{row.amount}</td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => handleEdit(row)}
                                  >
                                    <i className="bi bi-pencil"></i> Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger me-2"
                                    onClick={() => handleDeleteAgent(row)}
                                  >
                                    <i className="bi bi-trash"></i> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="col-6">
                      <form onSubmit={handleSubmit}>
                        {/*begin::Body*/}
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">Agent</label>
                            <select
                              className={`form-control ${
                                errors.agent_id ? "is-invalid" : ""
                              }`}
                              name="agent_id"
                              value={formData.agent_id}
                              onChange={handleChange}
                            >
                              <option value="">Select Name</option>

                              {agentData.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                  {agent.name}
                                </option>
                              ))}
                            </select>

                            {errors.agent_id && errors.agent_id.length > 0 && (
                              <div className="invalid-feedback">
                                {errors.agent_id[0]}
                              </div>
                            )}
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Wallet</label>
                            <select
                              className={`form-control ${
                                errors.wallet_id ? "is-invalid" : ""
                              }`}
                              name="wallet_id"
                              value={formData.wallet_id}
                              onChange={handleChange}
                            >
                              <option value="">Select Name</option>

                              {allWalletData.map((data) => (
                                <option key={data.id} value={data.id}>
                                  {data.name}
                                </option>
                              ))}
                            </select>

                            {errors.wallet_id &&
                              errors.wallet_id.length > 0 && (
                                <div className="invalid-feedback">
                                  {errors.wallet_id[0]}
                                </div>
                              )}
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Amount</label>
                            <input
                              type="text"
                              className={`form-control ${
                                errors.amount ? "is-invalid" : ""
                              }`}
                              name="amount"
                              value={formData.amount}
                              onChange={handleChange}
                            />
                            {errors.amount && errors.amount.length > 0 && (
                              <div className="invalid-feedback">
                                {errors.amount[0]}
                              </div>
                            )}
                          </div>
                        </div>
                        {/*end::Body*/}
                        {/*begin::Footer*/}
                        <div className="text-end">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                        {/*end::Footer*/}
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*end::Body*/}
        </div>
        {/*end::Row*/}
      </div>
    </main>
  );
}
