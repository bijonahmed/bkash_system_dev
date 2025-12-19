"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import useWallets from "../../../hooks/getWallet";
import useSetting from "../../../hooks/getSetting.js";
import useBank from "../../../hooks/getBanks";
import getTransactions from "../../../hooks/getTransactions";
import toast, { Toaster } from "react-hot-toast";
import "../../../../app/style/loader.css";
import { apiPost } from "../../../../lib/apiPost";

const AddNewModal = ({ show, onClose, onSuccess }) => {
  const { token, permissions, roles } = useAuth();
  const [loading, setLoading] = useState(false);
  const { transactionData, refetch } = getTransactions();
  const { settingData } = useSetting();
  const [walletRate, setWalletRate] = useState("");
  const [receiving, setReceiving] = useState("");
  const { walletData, bankrate, refetchWallet } = useWallets();
  //console.log("bankrate :-----", bankrate);

  useEffect(() => {
    if (!show) setFormData(initialFormData);
  }, [show]);

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
    walletrate: "",
    bankRate: bankrate,
    receivingMoney: "",
    charges: 0,
    fee: "",
    totalAmount: "",
    senderName: "",
    receiving_money: "",
    description: "",
  };

  useEffect(() => {
    refetchWallet();
    setFormData((prev) => ({
      ...prev,
      bankRate: bankrate || 1,
    }));
  }, [bankrate]);

  const { bankData } = useBank();
  const [showWallet, setShowWallet] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const resetForm = () => setFormData(initialFormData);

  // Automatically toggle Wallet/Bank inputs
  useEffect(() => {
    if (formData.paymentMethod === "wallet") {
      setFormData((prev) => ({
        ...prev,
        walletrate: settingData?.exchange_rate_wallet || "",
        bankRate: settingData?.exchange_rate_bank || bankrate,
      }));

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
      "bankRate",
      "charges",
      "beneficiaryPhone",
    ];

    // allow only numbers
    const updatedValue = numericFields.includes(name)
      ? allowOnlyNumbers(value)
      : value;

    // update this field immediately
    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // ===== Charges Calculation =====
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
      return;
    }

    // ===== Branch Load  =====
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
            body: JSON.stringify({ bank_id: updatedValue }),
          }
        );

        const data = await res.json();
        setBranchData(data.data || []);
      } catch (error) {
        console.error("Branch loading failed:", error);
      }
    }

    // Normalize numeric values
    const sendingMoney =
      name === "sendingMoney"
        ? Number(updatedValue)
        : Number(formData.sendingMoney || 0);

    const receivingMoneyInput =
      name === "receiving_money"
        ? Number(updatedValue)
        : Number(formData.receiving_money || 0);

    const bankRate = Number(formData.bankRate || 0);
    const walletRate = Number(formData.walletrate || 0);

    // ======================
    //  BANK CALCULATION
    // ======================
    if (
      formData.paymentMethod === "bank" &&
      (name === "sendingMoney" || name === "bankRate")
    ) {
      const receiving = (sendingMoney * bankRate).toString();
      setFormData((prev) => ({
        ...prev,
        receiving_money: receiving,
      }));

      // fee API call
      try {
        const { success, data, messages } = await apiPost(
          "/transaction/walletcalculate",
          { paymentMethod: "bank", receiving_money: receiving },
          token,
          "POST"
        );
        if (success) {
          console.log("Response fee:", data.fee);
          setFormData((prev) => ({
            ...prev,
            fee: data.fee || 0,
            totalAmount:
              parseFloat(sendingMoney || 0) + (parseFloat(data.fee) || 0),
          }));
        } else {
          messages.forEach((msg) => toast.error(msg));
        }
      } catch (err) {
        console.error("Fee calc failed:", err);
        toast.error("Failed to calculate fee");
      }

      return;
    }

    if (formData.paymentMethod === "bank" && name === "receiving_money") {
      const newReceiving = parseFloat(value) || 0;
      const sending = bankRate ? (newReceiving / bankRate).toString() : "0";

      // update sendingMoney
      setFormData((prev) => ({
        ...prev,
        sendingMoney: sending,
      }));

      // fee API call
      try {
        const { success, data, messages } = await apiPost(
          "/transaction/walletcalculate",
          {
            paymentMethod: "bank", // "bank" or "wallet"
            receiving_money: newReceiving,
          },
          token, // your auth token
          "POST"
        );

        if (success) {
          console.log("Response fee:", data.fee);
          setFormData((prev) => ({
            ...prev,
            fee: data.fee || 0,
            totalAmount: parseFloat(sending || 0) + (parseFloat(data.fee) || 0),
          }));
        } else {
          // Show any backend validation or custom errors
          messages.forEach((msg) => toast.error(msg));
        }
      } catch (err) {
        console.error("Fee calc failed:", err);
        toast.error("Failed to calculate fee");
      }
     
      return;
    }

    if (formData.paymentMethod === "wallet") {
      let newSending = sendingMoney;
      let newReceiving = receivingMoneyInput;

      if (name === "sendingMoney") {
        newReceiving = sendingMoney ? sendingMoney * walletRate : "";
      }

      if (name === "receiving_money") {
        newSending = receivingMoneyInput
          ? receivingMoneyInput / walletRate
          : "";
      }

      // update two-way result
      setFormData((prev) => ({
        ...prev,
        sendingMoney:
          newSending !== "" ? Math.floor(newSending * 100) / 100 : "",
        receiving_money:
          newReceiving !== "" ? Math.floor(newReceiving * 100) / 100 : "",
      }));
      try {
        const { success, data, messages } = await apiPost(
          "/transaction/walletcalculate",
          {
            paymentMethod: "wallet",
            receiving_money: newReceiving,
          },
          token, // your auth token
          "POST"
        );

        if (success) {
          setFormData((prev) => ({
            ...prev,
            fee: data.fee || 0,
            totalAmount: (
              Math.floor((Number(newSending) + Number(data.fee || 0)) * 100) /
              100
            ).toFixed(2),
          }));
        } else {
          // Show backend validation or custom errors
          messages.forEach((msg) => toast.error(msg));
        }
      } catch (err) {
        console.error("Wallet fee calc failed:", err);
        toast.error("Failed to calculate wallet fee");
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, messages } = await apiPost(
        "/transaction/create",
        formData,
        token
      );

      if (success) {
        toast.success("Transaction added successfully");
        refetch();
        setFormData(initialFormData);
        onClose();
        onSuccess();
      } else {
        // Show all errors
        messages.forEach((msg) => toast.error(msg));
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error!");
    } finally {
      setLoading(false);
    }
  };

  const selectedWallet = walletData.find(
    (wallet) => wallet.id.toString() === formData.wallet_id
  );

  // Watch for wallet change
  useEffect(() => {
    const calculateWalletRate = async () => {
      if (!selectedWallet) return;
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/wallet/walletcalculateCheck`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              wallet_id: formData.wallet_id,
            }),
          }
        );

        const data = await res.json();
        console.log("response: walletrate amount: " + data.walletrate);

        setFormData((prev) => ({
          ...prev,
          walletrate: data.walletrate,
        }));
      } catch (err) {
        console.error("Error fetching wallet rate:", err);
      } finally {
        setLoading(false);
      }
    };

    calculateWalletRate();
  }, [selectedWallet, receiving, token]); // run when selectedWallet changes

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
      tabIndex="-1"
      role="dialog"
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

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {loading && (
            <div className="loader-overlay">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

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
                {roles == "admin" && (
                  <>
                    <div className="col-md-3 mb-2">
                      <label className="mb-0 custom-label">Status</label>
                      <select
                        name="status"
                        style={{
                          appearance: "menulist", // keep native dropdown arrow
                          WebkitAppearance: "menulist",
                          MozAppearance: "menulist",
                          backgroundColor: "white", // optional
                        }}
                        value={formData.status}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="">Select Status</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="hold">Hold</option>
                        <option value="cancel">Cancel</option>
                      </select>
                    </div>
                  </>
                )}

                {/* <pre>{JSON.stringify(bankData, null, 2)}</pre> */}
                {/* Payment Method */}
                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Payment Method</label>
                  <select
                    style={{
                      appearance: "menulist", // keep native dropdown arrow
                      WebkitAppearance: "menulist",
                      MozAppearance: "menulist",
                      backgroundColor: "white", // optional
                    }}
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
                        disabled={loading} // optional: disable while loading
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
                        type="text"
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
                onClick={onClose}
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

export default AddNewModal;
