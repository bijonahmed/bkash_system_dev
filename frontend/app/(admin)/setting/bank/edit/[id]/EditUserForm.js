"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function EditUserForm({ id }) {
  const { token, permissions } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: id || "",
    bank_name: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bank/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Updated successfully!");
        router.push("/setting/bank");
      } else if (data.errors) {
        setErrors(data.errors);
        toast.error(Object.values(data.errors).flat().join(" "));
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };

  // Fetch existing bank info
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bank/checkrow/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        const user = resData?.data || {};
        setFormData({
          id: user.id,
          bank_name: user.bank_name ?? "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  // Permission check inside useEffect
  useEffect(() => {
    if (!permissions.includes("edit bank")) {
      router.replace("/dashboard");
    }
  }, [permissions, router]);

  // Set page title
  useEffect(() => {
    document.title = "Bank Edit";
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Bank Edit</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.back();
                    }}
                    className="text-blue-600"
                  >
                    ← Back
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="app-content">
        <div className="container-fluid">
          <div className="row g-4">
            <div className="col-md-12">
              <div className="card card-primary card-outline mb-4">
                <Toaster position="top-right" />
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Bank Name</label>
                      <input
                        type="text"
                        name="bank_name"
                        className={`form-control ${errors.bank_name ? "is-invalid" : ""}`}
                        value={formData.bank_name}
                        onChange={handleChange}
                      />
                      {errors.bank_name && (
                        <div className="invalid-feedback">{errors.bank_name[0]}</div>
                      )}
                    </div>
                  </div>
                  <div className="card-footer text-end">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}