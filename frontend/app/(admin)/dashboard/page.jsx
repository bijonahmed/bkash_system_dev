"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext"; // adjust path
import useDashboard from "../../hooks/dashboardLogic"; // adjust path

export default function DashboardPage() {
  const { token, permissions, roles } = useAuth();
  const router = useRouter();
  const { dashboardData, loading } = useDashboard();

  // redirect if no permission
  useEffect(() => {
    if (!permissions?.includes("view dashboard")) {
      router.replace("/dashboard");
    }
  }, [permissions, router]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // safely access fields with defaults
  const transactionAll = dashboardData?.transaction_all ?? 0;
  const depositApproved = dashboardData?.depositApproved ?? 0;
  const agentList = dashboardData?.agentList ?? 0;

  return (
    <main className="app-main">
      <div className="app-content mt-3">
        <div className="container-fluid">
          <div className="row">
            {/* Transaction */}
            <div className="col-lg-2 col-6">
              <div className="small-box text-bg-success">
                <div className="inner">
                  <h3>{transactionAll}</h3>
                  <p>My Transaction</p>
                </div>
                <Link href="/transaction/list" className="small-box-footer text-decoration-none text-white">
                  More info
                </Link>
              </div>
            </div>

            {/* Deposit */}
            <div className="col-lg-2 col-6">
              <div className="small-box text-bg-danger">
                <div className="inner">
                  <h3>{depositApproved}</h3>
                  <p>Agent Deposit</p>
                </div>
                <Link href="/depositrequiest" className="small-box-footer text-decoration-none text-white">
                  More info
                </Link>
              </div>
            </div>

            {/* Admin Only */}
            {roles == "admin" && (
              <>
                {/* Agent List */}
                <div className="col-lg-2 col-6">
                  <div className="small-box text-bg-primary">
                    <div className="inner">
                      <h3>{agentList}</h3>
                      <p>Agent List</p>
                    </div>
                    <Link href="/user" className="small-box-footer text-decoration-none text-white">
                      More info
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

                {/* Additional admin boxes */}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
