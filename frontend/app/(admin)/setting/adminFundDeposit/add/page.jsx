"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function UserAddPage() {
  const { token, permissions } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const title = "Admin Fund Deposit";

  // Page title update
  useEffect(() => {
    document.title = title;
  }, []);

  // Redirect if no permission
  useEffect(() => {
    if (!permissions.includes("create bank")) {
      router.replace("/dashboard");
    }
  }, [permissions, router]);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    deposit_by: "",
    buying_rate: "",
    deposit_amount: "",
    reason: "",
    status: 1,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/adminFundDeposit/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Added successfully!");
        router.push("/setting/adminFundDeposit");
      } else if (data.errors) {
        setErrors(data.errors);
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

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">{title}</h3>
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
                    className="text-blue-600 hover:underline"
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
                    {/* Deposit By */}
                    <div className="mb-3">
                      <label className="form-label">Deposit By</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.deposit_by ? "is-invalid" : ""
                        }`}
                        name="deposit_by"
                        value={formData.deposit_by}
                        onChange={handleChange}
                      />
                      {errors.deposit_by && (
                        <div className="invalid-feedback">
                          {errors.deposit_by[0]}
                        </div>
                      )}
                    </div>

                    {/* Buying Rate */}
                    <div className="mb-3">
                      <label className="form-label">Buying Rate</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.buying_rate ? "is-invalid" : ""
                        }`}
                        name="buying_rate"
                        value={formData.buying_rate}
                        onChange={handleChange}
                      />
                      {errors.buying_rate && (
                        <div className="invalid-feedback">
                          {errors.buying_rate[0]}
                        </div>
                      )}
                    </div>

                    {/* Deposit Amount */}
                    <div className="mb-3">
                      <label className="form-label">Deposit Amount</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.deposit_amount ? "is-invalid" : ""
                        }`}
                        name="deposit_amount"
                        value={formData.deposit_amount}
                        onChange={handleChange}
                      />
                      {errors.deposit_amount && (
                        <div className="invalid-feedback">
                          {errors.deposit_amount[0]}
                        </div>
                      )}
                    </div>

                    {/* Reason */}
                    <div className="mb-3">
                      <label className="form-label">Reason</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.reason ? "is-invalid" : ""
                        }`}
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                      />
                      {errors.reason && (
                        <div className="invalid-feedback">
                          {errors.reason[0]}
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

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}