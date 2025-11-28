// EditUserForm.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../../context/AuthContext"; // adjust path
import { usePathname } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useBanks from "../../../../../hooks/getBanks"; // adjust import path

export default function EditBranchForm({ id }) {
  const { token, permissions } = useAuth();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingS, setLoading] = useState(false);
  const router = useRouter();
  const { bankData } = useBanks();

  const [formData, setFormData] = useState({
    id: id || "",
    bank_id: user?.bank_id || "",
    branch_name: user?.branch_name || "",
    branch_code: user?.branch_code || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/branch/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, //
          },
          body: JSON.stringify({ ...formData }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        toast.success("updated successfully"); //
        router.push("/setting/branch");
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
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/branch/checkrow/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data?.data || {};
        setFormData({
          id: user.id, //
          bank_id: user.bank_id ?? "",
          branch_name: user.branch_name ?? "", // ensure string, not undefined
          branch_code: user.branch_code ?? "",
          phone: user.phone ?? "",
          address: user.address ?? "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id,token]);

  const pathname = usePathname();
  const title = "Branch Edit";
  //const title = pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  if (!permissions.includes("edit branch")) {
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
                      <label className="form-label">Bank</label>
                      <select
                        className={`form-control ${
                          errors.bank_id ? "is-invalid" : ""
                        }`}
                        name="bank_id"
                        value={formData.bank_id}
                        onChange={handleChange}
                      >
                        <option value="">-- Select --</option>
                        {bankData.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.bank_name}
                          </option>
                        ))}
                      </select>

                      {errors.bank_id && errors.bank_id.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.bank_id[0]}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Branch Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.branch_name ? "is-invalid" : ""
                        }`}
                        name="branch_name"
                        value={formData.branch_name}
                        onChange={handleChange}
                      />
                      {errors.branch_name && errors.branch_name.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.branch_name[0]}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Routing No.</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.branch_code ? "is-invalid" : ""
                        }`}
                        name="branch_code"
                        value={formData.branch_code}
                        onChange={handleChange}
                      />
                      {errors.branch_code && errors.branch_code.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.branch_code[0]}
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
