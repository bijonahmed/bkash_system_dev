"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Link from "next/link";

export default function UserAddPage() {
  const { token, permissions } = useAuth();
  const router = useRouter();
  const title = "Request Send";
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

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("payment_method", formData.payment_method);
      data.append("payment_date", formData.payment_date);
      data.append("approval_status", 0);
      data.append("amount_gbp", formData.amount_gbp);
      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/deposit-request/sendDepositRequest`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );
      const text = await response.text();
      const result = text ? JSON.parse(text) : {};
      if (response.status === 422 && result.errors) {
        toast.error(Object.values(result.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
        return;
      }
      if (!response.ok) {
        toast.error(result.message || "Something went wrong!");
        return;
      }
      // ✅ SUCCESS
      toast.success("Deposit request sent successfully");
      setFormData({
        payment_method: "",
        payment_date: "",
        approval_status: "",
        amount_gbp: "",
        attachment: null,
      });
      router.push("/depositrequiest");
      //fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network or server error!");
    }
  };

  if (!permissions.includes("create deposit")) {
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
              <div className="card card-primary card-outline mb-4 px-4">
                {" "}
                {/* px-4 = padding left & right */}
                {/* begin::Form */}
                <Toaster position="top-right" />
                <form onSubmit={handleSubmit}>
                  <div className="modal-body px-3 mt-2">
                    {" "}
                    {/* padding left & right */}
                    <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <select
                        name="payment_method"
                        className="form-control form-control-sm"
                        value={formData.payment_method}
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
                        className="form-control"
                        name="payment_date"
                        value={formData.payment_date}
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
                        className="form-control"
                        name="amount_gbp"
                        value={formData.amount_gbp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount_gbp: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Attachment</label>
                      <input
                        type="file"
                        className="form-control"
                        name="attachment"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attachment: e.target.files[0],
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="modal-footer px-4">
                    {" "}
                    {/* padding left & right */}
                  
                    <button className="btn btn-primary" type="submit">
                      Save
                    </button>
                    <br/>
                  </div>
                    <br/>
                </form>
                {/* end::Form */}
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
