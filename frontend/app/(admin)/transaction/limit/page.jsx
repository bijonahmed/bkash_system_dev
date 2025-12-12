"use client"; // Required in Next.js App Router for client-side component

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import useWallets from "../../../hooks/getWallet";
import useLimits from "../../../hooks/getLimits";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function UserPage() {
  const router = useRouter();
  const { token, permissions, roles } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Limit";
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const { walletData } = useWallets();
  const { limitData, loading, refetch } = useLimits();

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    paymentMethod: "",
    walletType: "",
    maxLimit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async (limit) => {
    const selectedLimit = limitData.find((item) => item.id === limit) || limit;
    setFormData({
      paymentMethod: selectedLimit.paymentMethod || "",
      walletType: selectedLimit.walletTypeId || "", // make sure this matches your walletType field
      maxLimit: selectedLimit.maxLimit || "",
      id: selectedLimit.id, // keep id for updating
    });

    // Open the modal
    setShowModal(true);
  };

  const handleDelete = async () => {
    toast.error("This system not allowed delete.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = formData.id
      ? `${process.env.NEXT_PUBLIC_API_BASE}/setting/updateLimit/${formData.id}`
      : `${process.env.NEXT_PUBLIC_API_BASE}/setting/createLimit`;

    try {
      const res = await fetch(url, {
        method: formData.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          formData.id ? "Updated successfully" : "Added successfully"
        );
        setShowModal(false);
        setFormData({
          paymentMethod: "",
          walletType: "",
          maxLimit: "",
          id: null,
        });
        refetch();
        // Refresh your limitData here
        // useLimits();
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
    }
  };

  const handleLogClick = () => {
    try {
      router.push("/report/limit/");
    } catch (err) {
      toast.error("Navigation failed!");
      console.error(err);
    }
  };

  if (!permissions.includes("view limit")) {
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
                <div className="row g-2 align-items-center">
                  {/* Column 3: Add User button */}
                  <div className="col-6 col-md-3 col-lg-2 ms-auto d-flex justify-content-end gap-2">
                    {perms.includes("create limit") && (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowModal(true)}
                        >
                          Add New
                        </button>
                        {roles == "admin" && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleLogClick()}
                          >
                            Log
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Start */}

              <div className="card-body p-0">
                Limit List
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
                    <table className="table table-sm table-hover table-bordered align-middle mb-0">
                      <thead className="table-primary text-center">
                        <tr>
                          <th style={{ width: "5%" }}>#</th>
                          <th style={{ width: "40%" }}>
                            <i className="fa-solid fa-credit-card me-1" />
                            Payment Method
                          </th>
                          <th style={{ width: "20%" }} className="text-end">
                            <i className="fa-solid fa-wallet me-1" />
                            Max Receive Limit (BDT)
                          </th>
                          <th style={{ width: "15%" }}>
                            <i className="fa-solid fa-user-tie me-1" />
                            Created By
                          </th>
                          <th style={{ width: "15%" }}>
                            <i className="fa-solid fa-calendar-days me-1" />
                            Created At
                          </th>
                          <th style={{ width: "5%" }}>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {limitData.length === 0 ? (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center text-secondary py-3"
                            >
                              No records found.
                            </td>
                          </tr>
                        ) : (
                          limitData.map((limit, index) => {
                            const rowBgClass =
                              index % 3 === 0
                                ? "bg-light"
                                : index % 3 === 1
                                ? "bg-white"
                                : "bg-secondary bg-opacity-10";

                            return (
                              <tr key={limit.id} className={rowBgClass}>
                                <td className="text-center">{index + 1}</td>

                                <td>
                                  <span
                                    className={`badge me-1 ${
                                      limit.paymentMethod === "Bank"
                                        ? "bg-success"
                                        : limit.paymentMethod === "Wallet"
                                        ? "bg-info text-dark"
                                        : "bg-warning text-dark"
                                    }`}
                                  >
                                    {limit.paymentMethod}
                                  </span>
                                  {limit.paymentMethod === "Wallet" &&
                                  limit.walletTypeName
                                    ? limit.walletTypeName
                                    : ""}
                                </td>

                                <td
                                  className={`text-end ${
                                    Number(limit.maxLimit) > 50000
                                      ? "text-danger"
                                      : Number(limit.maxLimit) > 30000
                                      ? "text-warning"
                                      : "text-success"
                                  }`}
                                >
                                  {Number(limit.maxLimit).toLocaleString()}
                                </td>

                                <td className="fw-semibold">
                                  {limit.created_by_name}
                                </td>

                                <td className="text-center text-secondary">
                                  {new Date(
                                    limit.created_at
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  })}
                                </td>

                                <td className="text-center">
                                  <div className="d-flex gap-1 justify-content-center">
                                    {perms.includes("edit limit") && (
                                      <button
                                        type="button"
                                        className="btn btn-info btn-sm"
                                        title="Edit"
                                        onClick={() => handleEdit(limit)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                    )}

                                    {perms.includes("delete limit") && (
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        title="Delete"
                                        onClick={() => handleDelete(limit.id)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* END */}
            </div>
          </div>
          {/*end::Body*/}
        </div>
        {/*end::Row*/}

        {/* Bootstrap Modal */}
        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">Add New Payment Method</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {/* Payment Method Dropdown */}
                    <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <select
                        name="paymentMethod"
                        className="form-select"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Method</option>
                        <option value="Wallet">Wallet</option>
                        <option value="Bank">Bank</option>
                      </select>
                    </div>

                    {/* Wallet Dropdown (Visible only if Wallet is chosen) */}
                    {formData.paymentMethod === "Wallet" && (
                      <div className="mb-3">
                        <label className="form-label">Wallet Type</label>
                        <select
                          name="walletType"
                          className="form-select"
                          value={formData.walletType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Wallet</option>
                          {walletData.map((wallet) => (
                            <option key={wallet.id} value={wallet.id}>
                              {wallet.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Max Receive Limit */}
                    <div className="mb-3">
                      <label className="form-label">
                        Max Receive Limit (BDT)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="maxLimit"
                        value={formData.maxLimit}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
