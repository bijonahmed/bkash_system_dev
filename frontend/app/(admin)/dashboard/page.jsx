"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext"; // adjust path
import useDashboardLogic from "../../hooks/dashboardLogic";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, permissions, roles } = useAuth();
  const router = useRouter();
  const { dashbaordData } = useDashboardLogic();

  return (
    <>
      <main className="app-main">
        {/*begin::App Content Header {user.name}*/}
        {/*begin::App Content*/}
        <div className="app-content mt-3">
          {/*begin::Container*/}
          <div className="container-fluid">
            {/*begin::Row*/}
            <div className="row">
              {/*begin::Col*/}
              {/*end::Col*/}

              
                <div className="col-lg-2 col-6">
                  {/*begin::Small Box Widget 2*/}
                  <div className="small-box text-bg-success">
                    <div className="inner">
                      <h3>{dashbaordData.transaction_all  || 0}</h3>
                      <p>My Transaction</p>
                    </div>
                    <svg
                      className="small-box-icon"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                    </svg>
                    <Link
                      href="/transaction/list"
                      className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                    >
                      More info <i className="bi bi-link-45deg" />
                    </Link>
                  </div>
                  {/*end::Small Box Widget 2*/}
                </div>
             

              {roles == "admin" && (
                <>
                  
                  <div className="col-lg-2 col-6">
                    <div className="small-box text-bg-primary">
                      <div className="inner">
                        <h3>{dashbaordData.agentList || 0}</h3>
                        <p>Agent List</p>
                      </div>
                      <svg
                        className="small-box-icon"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                      </svg>
                      <Link
                        href="/user"
                        className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                      >
                        More info <i className="bi bi-link-45deg" />
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-2 col-6">
                    <div className="small-box text-bg-danger">
                      <div className="inner">
                        <h3>01</h3>
                        <p>Deposit</p>
                      </div>
                      <svg
                        className="small-box-icon"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                      </svg>
                      <Link
                        href="#"
                        className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                      >
                        More info <i className="bi bi-link-45deg" />
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-2 col-6">
                    <div className="small-box text-bg-success">
                      <div className="inner">
                        <h3>01</h3>
                        <p>Report</p>
                      </div>
                      <svg
                        className="small-box-icon"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                      </svg>
                      <Link
                        href="#"
                        className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                      >
                        More info <i className="bi bi-link-45deg" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/*end::Container*/}
        </div>
        {/*end::App Content*/}
      </main>
    </>
  );
}
