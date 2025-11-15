"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import useWallets from "../../../../hooks/getWallet";
import useBank from "../../../../hooks/getBanks";
import getTransactions from "../../../../hooks/getTransactions";
import toast, { Toaster } from "react-hot-toast";
import "../../../../../app/style/loader.css";
import { useRouter, usePathname } from "next/navigation";
import { useParams } from "next/navigation";

const EditNewModal = () => {
  const params = useParams();
  const id = params.id;
  console.log("Editing transaction ID:", params.id);

  const router = useRouter();
  const { token, permissions } = useAuth();
  const [loading, setLoading] = useState(false);
  // const { feesData, loading, refetch } = getFees();
  const { transactionData, refetch } = getTransactions();
  const initialFormData = {
    beneficiaryName: "",
    beneficiaryPhone: "",
    status: "",
    paymentMethod: "",
    wallet_id: "",
    bank_id: "",
    branch_id: "",
    branchCode: "",
    accountNo: "",
    sendingMoney: 0,
    walletrate: 157,
    bankRate: 1,
    receivingMoney: "",
    charges: "",
    fee: "",
    totalAmount: "",
    senderName: "",
    receiving_money: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const resetForm = () => setFormData(initialFormData);
  const { walletData } = useWallets();
  const { bankData } = useBank();
  const [showWallet, setShowWallet] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [transaction, setTransaction] = useState(null);

  // ✅ Automatically toggle Wallet/Bank inputs
  useEffect(() => {
    if (formData.paymentMethod === "wallet") {
      setShowWallet(true);
      setShowBank(false);
    } else if (formData.paymentMethod === "bank") {
      setShowWallet(false);
      setShowBank(true);
    } else {
      setShowWallet(false);
      setShowBank(false);
    }
  }, [formData.paymentMethod]);

  const allowOnlyNumbers = (value) => value.replace(/[^0-9]/g, "");

  const handleChange = async (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "sendingMoney",
      "walletrate",
      "receiving_money",
      "charges",
      "beneficiaryPhone",
    ];

    // ✅ allow only numbers for specific inputs
    const updatedValue = numericFields.includes(name)
      ? allowOnlyNumbers(value)
      : value;
    // update basic field first
    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (name === "charges") {
      const charges = parseFloat(updatedValue || 0);
      const sendingMoney = parseFloat(formData.sendingMoney || 0);
      const fee = parseFloat(formData.fee || 0);

      const total = sendingMoney + fee + charges;

      setFormData((prev) => ({
        ...prev,
        charges: updatedValue,
        totalAmount: total.toString(),
      }));

      return; // prevent API call
    }

    if (name === "bank_id") {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/setting/bankUnderBranch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              bank_id: updatedValue,
            }),
          }
        );

        const data = await res.json();
        setBranchData(data.data || []);
      } catch (error) {
        console.error("Wallet request failed:", error);
      }
    }

    //  handle dynamic calculations and API calls
    if (
      name === "sendingMoney" ||
      name === "bankRate" ||
      name === "walletrate"
    ) {
      const sendingMoney = parseFloat(
        name === "sendingMoney" ? updatedValue : formData.sendingMoney || 0
      );
      const bankRate = parseFloat(formData.bankRate || 0);
      const walletRate = parseFloat(formData.walletrate || 0);

      if (formData.paymentMethod === "bank" && updatedValue) {
        console.log("sending request... by bank");

        const receivingMoney = (sendingMoney * bankRate).toString();

        setFormData((prev) => ({
          ...prev,
          receiving_money: receivingMoney,
        }));

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE}/transaction/walletcalculate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                paymentMethod: formData.paymentMethod,
                receiving_money: receivingMoney,
              }),
            }
          );

          const data = await res.json();

          setFormData((prev) => ({
            ...prev,
            fee: data.fee || 0,
            totalAmount: parseInt(sendingMoney) + parseInt(data.fee || 0),
          }));
        } catch (error) {
          console.error("Wallet request failed:", error);
        }
      } else if (formData.paymentMethod === "wallet" && updatedValue) {
        console.log("sending request... by wallet");
        const receivingMoney = (sendingMoney * walletRate).toString(); // keep full value

        setFormData((prev) => ({
          ...prev,
          receiving_money: receivingMoney,
        }));

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE}/transaction/walletcalculate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                paymentMethod: formData.paymentMethod,
                receiving_money: receivingMoney,
              }),
            }
          );

          const data = await res.json();

          setFormData((prev) => ({
            ...prev,
            fee: data.fee || 0,
            totalAmount: parseInt(sendingMoney) + parseInt(data.fee || 0),
          }));
        } catch (error) {
          console.error("Wallet request failed:", error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/transaction/checkrow/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setTransaction(data);
        console.log("Fetched transaction data:", data.beneficiaryName);
        setFormData({
          beneficiaryName: data?.beneficiaryName || "",
          beneficiaryPhone: data.beneficiaryPhone || "", 
          status: data.status || "",
          paymentMethod: data.payment_method || "", 
          wallet_id: data.wallet_id || "",
          bank_id: data.bank_id || "",
          branch_id: data.branch_id || "",  
          branchCode: data.branch_code || "",
          accountNo: data.account_no || "",
          sendingMoney: data.sending_money || 0,  
          walletrate: data.walletrate || 157,
          bankRate: data.bank_rate || 1,
          receiving_money: data.receiving_money || "",  
          charges: data.charges || "",
          fee: data.fee || "",
          totalAmount: data.total_amount || "", 
          senderName: data.sender_name || "",
          description: data.description || "",
        }); 
        // setDescription(data.description || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // return false; // for testing

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/transaction/create`,
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
        toast.success("Transaction added successfully ✅");
        refetch();
        setFormData(initialFormData); // this rest
        onClose();
        onSuccess(); // ← IMPORTANT: this triggers refetch in parent
      } else {
        if (data.errors) {
          // Laravel validation errors
          Object.values(data.errors).forEach((errorArray) => {
            errorArray.forEach((msg) => toast.error(msg));
          });
        } else {
          toast.error(data.message || "Something went wrong!");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Modal layout
  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        style={{ maxWidth: "1200px", width: "90%" }}
      >
        <div
          className="modal-content"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Add New Entry</h5>

            <button type="button" className="btn-close"></button>
          </div>
          {loading && (
            <div className="loader-overlay">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          ===<pre>{JSON.stringify(transaction, null, 2)}</pre>==
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Beneficiary */}
                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Beneficiary Name</label>
                  <input
                    type="text"
                    name="beneficiaryName"
                    value={formData.beneficiaryName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Beneficiary Phone</label>
                  <input
                    type="text"
                    name="beneficiaryPhone"
                    value={formData.beneficiaryPhone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {/* Status */}
                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="wallet">Wallet</option>
                    <option value="bank">Bank</option>
                  </select>
                </div>

                {/* Wallet Fields */}
                {showWallet && (
                  <div className="col-md-3 mb-2">
                    <label className="mb-0 custom-label">Wallet</label>

                    <select
                      name="wallet_id"
                      className="form-select"
                      value={formData.wallet_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Wallet</option>
                      {walletData.map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>
                          {wallet.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Bank Fields */}
                {showBank && (
                  <>
                    <div className="col-md-3 mb-2">
                      <label className="mb-0 custom-label">Bank</label>
                      <select
                        name="bank_id"
                        className="form-select"
                        value={formData.bank_id}
                        onChange={handleChange}
                      >
                        <option value="">Select bank</option>
                        {bankData.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.bank_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className="mb-0 custom-label">Branch</label>
                      <select
                        name="branch_id"
                        className="form-select"
                        value={formData.branch_id}
                        onChange={(e) => {
                          const id = Number(e.target.value);
                          const selectedBranch = branchData.find(
                            (b) => b.id === id
                          );
                          setFormData({
                            ...formData,
                            branch_id: id,
                            branchCode: selectedBranch
                              ? selectedBranch.branch_code
                              : "",
                          });
                        }}
                      >
                        <option value="">Select Branch</option>
                        {branchData.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.branch_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className="mb-0 custom-label">Routing No.</label>
                      <input
                        type="text"
                        name="branchCode"
                        value={formData.branchCode}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className="mb-0 custom-label">Account #</label>
                      <input
                        type="text"
                        name="accountNo"
                        value={formData.accountNo}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            accountNo: e.target.value,
                          });
                        }}
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className="mb-0 custom-label">Bank Rate</label>
                      <input
                        type="number"
                        name="bankRate"
                        value={formData.bankRate}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </>
                )}

                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">
                    Sending Money (GBP)
                  </label>
                  <input
                    type="text"
                    name="sendingMoney"
                    value={formData.sendingMoney}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                {showWallet && (
                  <div className="col-md-3 mb-2">
                    <label className="mb-0 custom-label">Wallet Rate</label>
                    <input
                      type="text"
                      name="walletrate"
                      value={formData.walletrate}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                )}

                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">
                    Receiving Money (BDT)
                  </label>
                  <input
                    type="text"
                    name="receiving_money"
                    value={formData.receiving_money}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Charges (GBP)</label>
                  <input
                    type="text"
                    name="charges"
                    value={formData.charges}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Admin Fee (GBP)</label>
                  <input
                    type="text"
                    name="fee"
                    value={formData.fee}
                    readOnly
                    className="form-control"
                  />
                </div>

                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">
                    Total Amount (GBP)
                  </label>
                  <input
                    type="text"
                    name="totalAmount"
                    value={formData.totalAmount}
                    readOnly
                    className="form-control"
                  />
                </div>

                {/* Sender & Note */}
                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Sender Name</label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-12 mb-2">
                  <label className="mb-0 custom-label">
                    Description / Note
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={resetForm}
              >
                Reset
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  router.back();
                }}
              >
                Close
              </button>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNewModal;
