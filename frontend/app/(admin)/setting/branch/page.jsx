"use client"; // Required in Next.js App Router for client-side component

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { customStyles } from "../../../components/styles/customDataTable";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import useRoles from "../../../hooks/useRoles"; // adjust import path

export default function UserPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const { rolesData, fetchRoles } = useRoles();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Branch List";
  const [statusFilter, setStatusFilter] = useState("");
  const [rules_type, setRulesType] = useState("");
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  //const title = pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/users/delete/${id}`,
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

  const fetchUsers = async (
    page = 1,
    pageSize = 10,
    searchQuery = "",
    selectedFilter = statusFilter !== "" ? statusFilter : 1,
    selectRulesType = rules_type !== "" ? rules_type : ""
  ) => {
    setLoading(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/branch/index?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}&selectedFilter=${selectedFilter}&selectRulesType=${selectRulesType}`;
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

  useEffect(() => {
    fetchUsers(page, perPage, search);
  }, [page, perPage, search]);

  const columns = [
    {
      name: "Bank Name",
      selector: (row) => row.bank_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: () => true, // always applies
          style: {
            backgroundColor: "#e6f7ff",
            color: "#000",
          },
        },
      ],
    },
    {
      name: "Branch Name",
      selector: (row) => row.branch_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: () => true,
          style: {
            backgroundColor: "#fff0f6",
            color: "#000",
          },
        },
      ],
    },
    {
      name: "Routing No.",
      selector: (row) => row.branch_code,
      sortable: true,
      conditionalCellStyles: [
        {
          when: () => true,
          style: {
            backgroundColor: "#fff0f6",
            color: "#000",
          },
        },
      ],
    },
   
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          {perms.includes("edit branch") && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => router.push(`/setting/branch/edit/${row.id}`)}
            >
              <i className="bi bi-pencil"></i> Edit
            </button>
          )}
          {perms.includes("delete branch") && (
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
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.id === 4, // condition
      style: {
        backgroundColor: "#bebebdff",
        color: "black", // optional, to make text visible
      },
    },
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
            {/* Header */}
            <div className="card-header">
              <div className="card-title w-100">
                <div className="row g-2 align-items-center">
                  {/* Column 1: Search input */}
                  <div className="col-12 col-md-6 col-lg-6">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <div className="col-4 col-md-3 col-lg-3">
                    <select
                      className="form-control"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                  {/* Column 2: Fetch button */}
                  <div className="col-6 col-md-3 col-lg-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => fetchUsers()}
                    >
                      Fetch
                    </button>
                  </div>

                  {/* Column 3: Add User button */}
                  <div className="col-6 col-md-3 col-lg-1 ms-auto">
                    {perms.includes("create users") ? (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => router.push(`/setting/branch/add`)}
                      >
                        Add New
                      </button>
                    ) : null}{" "}
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
                conditionalRowStyles={conditionalRowStyles}
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
