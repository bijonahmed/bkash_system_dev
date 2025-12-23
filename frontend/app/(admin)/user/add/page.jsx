"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";
import useRoles from "../../../hooks/useRoles"; // adjust import path

import Link from "next/link";

export default function UserAddPage() {
  const { token, permissions } = useAuth();
  const [user, setUser] = useState(null);
  const { rolesData, fetchRoles } = useRoles();
  const pathname = usePathname();
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const title = "User Add"; //pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rules_type: "",
    phone: "",
    address: "",
    agentCode: "",
    password: "",
    change_rate: "no",
    password_confirmation: "",
    status: 1,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Conditional validation
    if (parseInt(formData.rules_type) === 2 && !formData.agentCode) {
      setErrors({ agentCode: ["Agent Code is required for Agent role"] });
      toast.error("Agent Code is required for Agent role");
      return; // stop submission
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/users/create`,
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
        toast.success("User add successfully ✅");
        router.push("/user");
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
    fetchRoles();
  }, []);

  if (!permissions.includes("create users")) {
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
                  {/*begin::Body*/}
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && errors.name.length > 0 && (
                        <div className="invalid-feedback">{errors.name[0]}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email address</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.name && errors.email.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.email[0]}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && errors.phone.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.phone[0]}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && errors.password.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.password[0]}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.password_confirmation ? "is-invalid" : ""
                        }`}
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                      />
                      {errors.password_confirmation &&
                        errors.password_confirmation.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.password_confirmation[0]}
                          </div>
                        )}
                    </div>
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
                  </div>
                  {/*end::Body*/}
                  {/*begin::Footer*/}
                  <div className="card-footer text-end">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                  {/*end::Footer*/}
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
    </main>
  );
}
