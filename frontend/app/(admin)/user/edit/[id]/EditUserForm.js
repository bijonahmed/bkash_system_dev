// EditUserForm.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext"; // adjust path
import { usePathname } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useRoles from "../../../../hooks/useRoles"; // adjust import path
import { Modal } from "bootstrap";

export default function EditUserForm({ id }) {
  const { token, permissions } = useAuth();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingS, setLoading] = useState(false);
  const router = useRouter();
  const { rolesData, loading, fetchRoles } = useRoles();

  const [formData, setFormData] = useState({
    id: id || "",
    email: user?.email || "",
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    address: user?.address || "",
    agentCode: user?.agentCode || "",
    status: user?.status || "",
    change_rate: user?.change_rate || "",
    rules_type: user?.role_type || 1,
  });
  const [passwordData, setPasswordData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };
  const closeChangePasswordModal = () => {
    const modalEl = document.getElementById("changePasswordModal");

    if (modalEl) {
      modalEl.classList.remove("show");
      modalEl.style.display = "none";
      modalEl.setAttribute("aria-hidden", "true");
    }

    // remove backdrop
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

    // restore body scroll
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };
  /* ================= CHANGE PASSWORD ================= */
  const handlePasswordSubmit = async () => {
    if (passwordData.new_password.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/users/changePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: formData.id,
            password: passwordData.new_password,
          }),
        }
      );

      if (res.ok) {
        closeChangePasswordModal();
        toast.success("Password updated successfully");
        setPasswordData({ new_password: "", confirm_password: "" });
        router.push("/user");
      } else {
        toast.error("Failed to update password");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/users/update`,
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
        setUser(data);
        toast.success("User updated successfully ");
        router.push("/user");
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join(" ")); // show backend validation errors
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/checkUserrow/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data?.data || {};
        setFormData({
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "", // ensure string, not undefined
          phone: user.phone_number ?? "",
          address: user.address ?? "",
          change_rate: user?.change_rate || "",
          agentCode: user.agentCode ?? "",
          status: user.status ?? "",
          rules_type: user.role_type ?? 1,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const pathname = usePathname();
  const title = "User Edit";
  //const title = pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  if (!permissions.includes("edit users")) {
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

                <li className="breadcrumb-item" aria-current="page">
                  <a
                    href="#"
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#changePasswordModal"
                  >
                    🔐 Change Password
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
      <div className="app-content">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="row g-4">
            {/*begin::Col*/}
            <div className="col-md-12">
              {/*begin::Quick Example*/}
              <div className="card card-primary card-outline mb-4">
                {/*begin::Form*/}
                <Toaster position="top-right" />
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name?.length > 0 && (
                        <div className="invalid-feedback">{errors.name[0]}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email address</label>
                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        value={formData.email ?? ""} // fallback if undefined
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        className={`form-control ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        value={formData.phone ?? ""}
                        onChange={handleChange}
                      />
                      {errors.phone?.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.phone[0]}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    {parseInt(formData.rules_type) === 2 && (
                      <div className="mb-3">
                        <label className="form-label">Role Type</label>
                        <select
                          className={`form-control ${
                            errors.rules_type ? "is-invalid" : ""
                          }`}
                          name="rules_type"
                          value={formData.rules_type}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Role --</option>
                          {rolesData.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>

                        {errors.rules_type && errors.rules_type.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.rules_type[0]}
                          </div>
                        )}
                      </div>
                    )}
                    {parseInt(formData.rules_type) === 2 && (
                      <>
                        <div className="mb-3 mt-3">
                          <label htmlFor="agentCode" className="form-label">
                            Agent Code
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.agentCode ? "is-invalid" : ""
                            }`}
                            id="agentCode"
                            name="agentCode"
                            value={formData.agentCode || ""}
                            onChange={handleChange}
                            placeholder="Enter Agent Code"
                          />
                          {errors.agentCode && errors.agentCode.length > 0 && (
                            <div className="invalid-feedback">
                              {errors.agentCode[0]}
                            </div>
                          )}
                        </div>

                        <div className="mb-3 mt-3">
                          <label htmlFor="agentCode" className="form-label">
                            Change Rate
                          </label>
                          <select
                            className={`form-control`}
                            name="change_rate"
                            value={formData.change_rate}
                            onChange={handleChange}
                          >
                            <option value="">-- Select --</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className={`form-control ${
                          errors.status ? "is-invalid" : ""
                        }`}
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Status --</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>

                      {errors.status && errors.status.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.status[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer text-end">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
                {/*end::Form*/}
              </div>
              {/*end::Quick Example*/}
            </div>
            {/*end::Col*/}
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>
      {/*end::App Content*/}

      <div className="modal fade" id="changePasswordModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Change Password</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-3">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePasswordSubmit}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
