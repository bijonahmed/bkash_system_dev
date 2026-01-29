"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext"; // adjust path
import useDashboard from "../../hooks/dashboardLogic"; // adjust path

export default function DashboardPage() {
  const { token, permissions, roles } = useAuth();
  const router = useRouter();
  const { dashboardData, loading, userData, refetchDashboard } = useDashboard();

  // redirect if no permission
  useEffect(() => {
    refetchDashboard();
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
  const balance = dashboardData?.balance ?? 0;
  const depositApproved_status = dashboardData?.depositApproved_status ?? "";

  const agentbalance = balance;
  const formattedBalance = agentbalance; //Number(agentbalance).toFixed(2); // "965.12" (string)

  return (
    <main className="app-main">
      <div className="app-content mt-3">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-8">
              {/* Transaction */}
              <div className="row g-3">
                <div className="col-6 col-md-4 col-lg-3">
                  <Link
                    href="/transaction/list"
                    className="text-decoration-none"
                  >
                    <div
                      className="small-box cursor-pointer"
                      style={{
                        backgroundColor: "#0e5d4c",
                        color: "#ffffff",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                        borderRadius: "8px",
                      }}
                    >
                      <div className="inner">
                        <h3>{transactionAll}</h3>
                        <p>My Transaction</p>
                      </div>
                      <div className="small-box-footer text-white">
                        More info <i className="fas fa-arrow-circle-right"></i>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Deposit */}
                <div className="col-6 col-md-4 col-lg-3">
                  <Link
                    href="/depositrequiest"
                    className="text-decoration-none"
                  >
                    <div
                      className="small-box cursor-pointer"
                      style={{
                        backgroundColor: "#8b1e3f",
                        color: "#ffffff",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                        borderRadius: "8px",
                      }}
                    >
                      <div className="inner">
                        <h3>{depositApproved}</h3>
                        <p>Deposit {depositApproved_status}</p>
                      </div>
                      <div className="small-box-footer text-white">
                        More info <i className="fas fa-arrow-circle-right"></i>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Balance */}
                <div className="col-6 col-md-4 col-lg-3">
                  <Link
                    href={
                      roles == "admin"
                        ? "/report/allAgentBalance"
                        : "/transaction/list"
                    }
                    className="text-decoration-none"
                  >
                    <div
                      className="small-box cursor-pointer position-relative"
                      style={{
                        backgroundColor: "#1e6f5c",
                        color: "#ffffff",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                        borderRadius: "8px",
                      }}
                    >
                      <div className="inner">
                        <h3>{formattedBalance}</h3>
                        <p>Balance</p>
                      </div>

                      {/* SVG icon */}
                      <svg
                        className="small-box-icon position-absolute top-0 end-0 m-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        width="40"
                        height="40"
                      >
                        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                      </svg>

                      <div className="small-box-footer text-white">
                        More info <i className="bi bi-link-45deg" />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Admin Only */}
                {roles == "admin" && (
                  <div className="col-6 col-md-4 col-lg-3">
                    <Link href="/user" className="text-decoration-none">
                      <div
                        className="small-box cursor-pointer"
                        style={{
                          backgroundColor: "#2c3e50",
                          color: "#ffffff",
                          boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
                          borderRadius: "8px",
                        }}
                      >
                        <div className="inner">
                          <h3>{agentList}</h3>
                          <p>Agent List</p>
                        </div>
                        <div className="small-box-footer text-white">
                          More info{" "}
                          <i className="fas fa-arrow-circle-right"></i>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div
              className="col-12 col-lg-4 gap-2"
              style={{
                backgroundColor: "#0e5d4c",
                color: "white",
                borderRadius: "8px",
                padding: "5px",
              }}
            >
              <ul className="list-unstyled mb-0">
                <li
                  className="d-flex justify-content-between align-items-center py-2 px-3 mb-1 rounded"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    transition: "0.3s",
                  }}
                >
                  <span>ID</span>
                  <span>{userData.id}</span>
                </li>

                {roles == "agent" && (
                  <li
                    className="d-flex justify-content-between align-items-center py-2 px-3 mb-1 rounded"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      transition: "0.3s",
                    }}
                  >
                    <span>Agent Code </span>
                    <span>{userData.agentCode}</span>
                  </li>
                )}
                <li
                  className="d-flex justify-content-between align-items-center py-2 px-3 mb-1 rounded"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    transition: "0.3s",
                  }}
                >
                  <span>Name</span>
                  <span>{userData.name}</span>
                </li>
                <li
                  className="d-flex justify-content-between align-items-center py-2 px-3 mb-1 rounded"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    transition: "0.3s",
                  }}
                >
                  <span>Email</span>
                  <span>{userData.email}</span>
                </li>
                <li
                  className="d-flex justify-content-between align-items-center py-2 px-3 mb-1 rounded"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    transition: "0.3s",
                  }}
                >
                  <span>Phone</span>
                  <span>{userData.phone_number}</span>
                </li>
                <li
                  className="d-flex justify-content-between align-items-center py-2 px-3 mb-1 rounded"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    transition: "0.3s",
                  }}
                >
                  <span>Address</span>
                  <span>{userData.address}</span>
                </li>
                <li
                  className="d-flex justify-content-between align-items-center py-2 px-3 mb-1 rounded"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    transition: "0.3s",
                  }}
                >
                  <span>Roles</span>
                  <span>
                    {userData.roles && userData.roles.length > 0
                      ? userData.roles.map((role) => role.name).join(", ")
                      : "-"}
                  </span>
                </li>
                <li
                  className="d-flex justify-content-between align-items-center py-2 px-3 mb-1 rounded"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    transition: "0.3s",
                  }}
                >
                  <span>Status</span>
                  <span>
                    <span
                      style={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {userData.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
