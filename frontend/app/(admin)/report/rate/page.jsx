"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";

import Link from "next/link";

export default function SettingPage() {
  const { token, permissions } = useAuth();
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const title = "Log Report Rate";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const [formData, setFormData] = useState({
    sending_currency: user?.sending_currency || "",
    receiving_currency: user?.receiving_currency || "",
    exchange_rate_wallet: user?.exchange_rate_wallet || "",
    exchange_rate_bank: user?.exchange_rate_bank || "",
    update_by: user?.update_by || "",
    update_date: user?.update_date || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [report, setReportData] = useState([]);
  
  

  const fetchData = async () => {
    try {
      setLoading(true); // Always start loader before fetch

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/report/getByReportRate`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // add only if token exists
          },
        }
      );

      const data = await res.json();
      // console.log("Fetched Setting Data:", data);

      if (!res.ok) {
        console.error(
          "Server responded with error:",
          data?.message || "Unknown error"
        );
        return;
      }

      const info = data?.data || {}; // safe fallback

      setUser(info); // ✅ Store only the data part, not wrapper
      setFormData({
        sending_currency: info.sending_currency || "",
        receiving_currency: info.receiving_currency || "",
        exchange_rate_wallet: info.exchange_rate_wallet || "",
        exchange_rate_bank: info.exchange_rate_bank || "",
        update_by: info?.update_by || "",
        update_date: info?.update_date || "",
      });
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center py-5"></p>;
  }

  if (!permissions.includes("create rate")) {
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

                {/*begin::Body*/}
                <div className="card-body">
                  <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Sending Currency</label>
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="sending_currency"
                          value={formData.sending_currency}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Exchange Rate (Wallet)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          disabled
                          name="exchange_rate_wallet"
                          value={formData.exchange_rate_wallet}
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Receiving Currency</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled
                          name="receiving_currency"
                          value={formData.receiving_currency}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          Exchange Rate (Bank)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          disabled
                          name="exchange_rate_bank"
                          value={formData.exchange_rate_bank}
                        />
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-dark text-white rounded">
                      <h5 className="text-info mb-2">
                        <i className="fa-solid fa-user-edit me-2"></i>
                        Last update by :{" "}
                        <span className="fw-semibold">
                          {formData.update_by}
                        </span>
                      </h5>
                      <h6 className="text-warning">
                        <i className="fa-regular fa-calendar-days me-2"></i>
                        Last update Date :{" "}
                        <span className="fw-semibold">
                          {formData.update_date}
                        </span>
                      </h6>
                    </div>
                  </div>
                </div>

                {/*end::Body*/}
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
