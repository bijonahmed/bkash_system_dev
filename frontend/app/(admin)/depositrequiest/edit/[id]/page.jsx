"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useParams } from "next/navigation";

import Link from "next/link";

export default function DepositEditPage() {
  const { token, permissions } = useAuth();
  const router = useRouter();
  const title = "Edit Request Send";
  const params = useParams();
  const { id } = params;

  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/deposit-request/checkrow/${id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      const data = result.data;

      // convert DD-MM-YYYY → YYYY-MM-DD
      let formattedDate = "";
      if (data.payment_date) {
        const parts = data.payment_date.split("-");
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1].padStart(
            2,
            "0"
          )}-${parts[0].padStart(2, "0")}`;
        }
      }

      setFormData((prev) => ({
        ...prev,
        id: data.id ?? "",
        payment_method: data.payment_method?.toLowerCase() ?? "",
        payment_date: formattedDate,
        approval_status: data.approval_status ?? 0,
        amount_gbp: data.amount_gbp ?? "",
        agent_name: data.agent_name ?? "",
        attachment: null,
      }));
    };
    fetchData();
  }, [id]);

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("id", formData.id);
      data.append("approval_status", formData.approval_status);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/deposit-request/depositRequestUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      // Reset form
      setFormData({
        payment_method: "",
        payment_date: "",
        approval_status: "",
        amount_gbp: "",
        attachment: null,
      });
      router.push("/depositrequiest");
    } catch (error) {
      console.error("Error:", error.response || error.message);
    }
  };

  if (!permissions.includes("edit deposit")) {
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
        <div className="container-fluid">
          <div className="row g-4">
            <div className="col-md-12">
              <div className="card card-primary card-outline mb-4 px-4">
                <Toaster position="top-right" />
                <form onSubmit={handleSubmitUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      name="payment_method"
                      className="form-control form-control-sm"
                      disabled
                      value={formData.payment_method || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Method</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Payment Date</label>
                    <input
                      type="date"
                      disabled
                      className="form-control"
                      name="payment_date"
                      value={formData.payment_date || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Amount (GBP)</label>
                    <input
                      type="number"
                      step="0.01"
                      disabled
                      className="form-control"
                      name="amount_gbp"
                      value={formData.amount_gbp || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, amount_gbp: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Approval Status</label>
                    <select
                      className="form-select"
                      name="approval_status"
                      value={formData.approval_status ?? "0"}
                      onChange={handleChange}
                    >
                      <option value="0">Pending</option>
                      <option value="1">Approved</option>
                      <option value="2">Rejected</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-end mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
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
        </div>
      </div>

      {/*end::App Content*/}
    </main>
  );
}
