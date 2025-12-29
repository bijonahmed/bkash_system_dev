"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import useWallets from "../../../hooks/getWallet";
import useSetting from "../../../hooks/getSetting.js";
import useBank from "../../../hooks/getBanks";
import getTransactions from "../../../hooks/getTransactions";
import useTranSactionAutoCoplete from "../../../hooks/getTranAutocomplete";
import permissionCheckRate from "../../../hooks/checkedRate";
import toast from "react-hot-toast";
import "../../../../app/style/loader.css";
import { apiPost } from "../../../../lib/apiPost";

const AddNewModal = ({ show, onClose, onSuccess }) => {
  const { token, permissions, roles } = useAuth();
  const { transactionData, refetch } = getTransactions();
  const { checkedRate } = permissionCheckRate();
  const { settingData } = useSetting();
  const { walletData, bankrate, refetchWallet } = useWallets();
  const [loading, setLoading] = useState(false);
  const [mobile_number, setMobileNumber] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showBank, setShowBank] = useState(false);
  const [branchData, setBranchData] = useState([]);
  const { autcompleteData } = useTranSactionAutoCoplete(mobile_number);
  //console.log("Autocm" + autcompleteData);

  const { bankData } = useBank();

  const [formData, setFormData] = useState({
    beneficiaryName: "",
    beneficiaryPhone: "",
    status: "",
    paymentMethod: "",
    wallet_id: "",
    bank_id: "",
    branch_id: "",
    branchCode: "",
    accountNo: "",
    sendingMoney: "",
    walletrate: "",
    bankRate: bankrate || 1,
    receiving_money: "",
    charges: "",
    fee: "",
    totalAmount: "",
    senderName: "",
    description: "",
  });

  useEffect(() => {
    if (!show) resetForm();
  }, [show]);

  useEffect(() => {
    refetchWallet();
    setFormData((prev) => ({ ...prev, bankRate: bankrate || 1 }));
  }, [bankrate]);

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

  const resetForm = () => {
    setFormData({
      beneficiaryName: "",
      beneficiaryPhone: "",
      status: "",
      paymentMethod: "",
      wallet_id: "",
      bank_id: "",
      branch_id: "",
      branchCode: "",
      accountNo: "",
      sendingMoney: "",
      walletrate: "",
      bankRate: bankrate || 1,
      receiving_money: "",
      charges: "",
      fee: "",
      totalAmount: "",
      senderName: "",
      description: "",
    });
  };

  const allowOnlyNumbers = (value) => {
    // Remove anything except digits and dot
    let cleaned = value.replace(/[^0-9.]/g, "");
    const firstDotIndex = cleaned.indexOf(".");
    if (firstDotIndex !== -1) {
      const beforeDot = cleaned.slice(0, firstDotIndex + 1);
      const afterDot = cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
      cleaned = beforeDot + afterDot;
    }
    return cleaned;
  };

  const handleSelect = (item) => {
    console.log("item" + item);
    setFormData((prev) => ({
      ...prev,
      beneficiaryPhone: item.beneficiaryPhone,
      beneficiaryName: item.beneficiaryName,
      senderName: item.senderName,
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "sendingMoney",
      "walletrate",
      "receiving_money",
      "bankRate",
      "charges",
    ];

    const updatedValue = numericFields.includes(name)
      ? allowOnlyNumbers(value)
      : value;

    // 1️⃣ Synchronous state update for form fields
    setFormData((prev) => {
      const newState = { ...prev, [name]: updatedValue };

      const sendingMoney = Number(
        name === "sendingMoney" ? updatedValue : prev.sendingMoney || 0
      );
      const receivingMoney = Number(
        name === "receiving_money" ? updatedValue : prev.receiving_money || 0
      );
      const walletRate = Number(
        name === "walletrate" ? updatedValue : prev.walletrate || 0
      );
      const bankRate = Number(prev.bankRate || 1);
      const charges = Number(
        name === "charges" ? updatedValue : prev.charges || 0
      );
      const fee = Number(prev.fee || 0);

      // Wallet calculation
      if (prev.paymentMethod === "wallet") {
        if (name === "sendingMoney" || name === "walletrate")
          newState.receiving_money = (sendingMoney * walletRate).toFixed(2);
        if (name === "receiving_money")
          // console.log("--receiving_money-------" + name + "value" + value);
          newState.sendingMoney = (receivingMoney / walletRate).toFixed(2);
        handlewalletCalculate();
      }

      // Bank calculation
      if (prev.paymentMethod === "bank") {
        if (name === "sendingMoney" || name === "bankRate")
          newState.receiving_money = (sendingMoney * bankRate).toFixed(2);
        if (name === "receiving_money")
          newState.sendingMoney = (receivingMoney / bankRate).toFixed(2);
      }

      // Update total
      newState.totalAmount = (sendingMoney + fee + charges).toFixed(2);

      return newState;
    });

    // 2️⃣ Beneficiary autocomplete
    if (name === "beneficiaryPhone") {
      setMobileNumber(value);
      if (value.length >= 1) {
        const filtered = autcompleteData.filter(
          (item) =>
            item.beneficiaryPhone.includes(value) ||
            item.beneficiaryName.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 10));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }

    // 3️⃣ Load branches if bank_id changes
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
      } catch (err) {
        console.error("Branch loading failed:", err);
      }
    }

    // 4️⃣ Bank fee & total calculation (async)
    if (
      formData.paymentMethod === "bank" &&
      ["sendingMoney", "bankRate", "receiving_money"].includes(name)
    ) {
      try {
        const receiving =
          name === "receiving_money"
            ? Number(updatedValue)
            : Number(formData.sendingMoney || 0) *
            Number(formData.bankRate || 1);

        const { success, data, messages } = await apiPost(
          "/transaction/walletcalculate",
          { paymentMethod: "bank", receiving_money: receiving },
          token,
          "POST"
        );

        if (success) {
          setFormData((prev) => ({
            ...prev,
            fee: Number(data.fee || 0),
            totalAmount: Number(
              Number(prev.sendingMoney || 0) + Number(data.fee || 0)
            ).toFixed(2),
          }));
        } else {
          messages.forEach((msg) => toast.error(msg));
        }
      } catch (err) {
        console.error("Bank fee calculation failed:", err);
        toast.error("Failed to calculate bank fee");
      }
    }


    const handlewalletCalculate = async () => {
      try {
        const sendingMoney = Number(formData.sendingMoney || 0);
        const walletRate = Number(formData.walletrate || 1);

        const receiving =
          name === "receiving_money"
            ? Number(updatedValue)
            : sendingMoney * walletRate;

        const { success, data, messages } = await apiPost(
          "/transaction/walletcalculate",
          { paymentMethod: "wallet", receiving_money: receiving },
          token,
          "POST"
        );
        // console.log("API Data:", data); // ✅ এখানে ঠিক আছে
        if (success) {
          const newSending =
            name === "receiving_money" ? receiving / walletRate : sendingMoney;

          setFormData((prev) => ({
            ...prev,
            sendingMoney: parseFloat(newSending.toFixed(2)),
            //    receiving_money: parseFloat(receiving.toFixed(2)),
            fee: Number(data?.fee || 0),
            totalAmount: (
              newSending + Number(data?.fee || 0)
            ).toFixed(2),
          }));
        } else {
          messages?.forEach((msg) => toast.error(msg));
        }
      } catch (err) {
        console.error("Wallet fee calculation failed:", err);
        toast.error("Failed to calculate wallet fee");
      }
    };
    /*
     if (
       formData.paymentMethod === "wallet" &&
       ["sendingMoney", "walletrate", "receiving_money"].includes(name)
     ) {
       try {
         const sendingMoney = Number(formData.sendingMoney || 0);
         const walletRate = Number(formData.walletrate || 1);
         const receiving =
           name === "receiving_money"
             ? Number(updatedValue)
             : sendingMoney * walletRate;
 
         const { success, data, messages } = await apiPost(
           "/transaction/walletcalculate",
           { paymentMethod: "wallet", receiving_money: receiving },
           token,
           "POST"
         );
 
         if (success) {
           const newSending =
             name === "receiving_money" ? receiving / walletRate : sendingMoney;
           setFormData((prev) => ({
             ...prev,
             sendingMoney: parseFloat(newSending.toFixed(2)),
             receiving_money: parseFloat(receiving.toFixed(2)),
             fee: Number(data.fee || 0),
             totalAmount: (newSending + Number(data.fee || 0)).toFixed(2),
           }));
         } else {
           messages.forEach((msg) => toast.error(msg));
         }
       } catch (err) {
         console.error("Wallet fee calculation failed:", err);
         toast.error("Failed to calculate wallet fee");
       }
     }
       */
  };

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
        resetForm();
        onClose();
        onSuccess();
      } else {
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

  useEffect(() => {
    const calculateWalletRate = async () => {
      if (!selectedWallet) return;
      try {
        const res = await apiPost(
          "/wallet/walletcalculateCheck",
          { wallet_id: formData.wallet_id },
          token
        );
        const walletrate = Number(res?.data?.walletrate ?? 0);
        setFormData((prev) => ({ ...prev, walletrate }));
      } catch (err) {
        console.error("Error fetching wallet rate:", err);
      }
    };
    calculateWalletRate();
  }, [selectedWallet]);

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
                  {/* <input
                    type="text"
                    name="beneficiaryPhone"
                    value={formData.beneficiaryPhone}
                    onChange={handleChange}
                    className="form-control"
                  /> */}

                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      name="beneficiaryPhone"
                      value={formData.beneficiaryPhone}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter mobile number"
                      autoComplete="off"
                    />

                    {showSuggestions && suggestions.length > 0 && (
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          border: "1px solid #ccc",
                          position: "absolute",
                          width: "100%",
                          maxHeight: "200px",
                          overflowY: "auto",
                          backgroundColor: "#fff",
                          zIndex: 1000,
                        }}
                      >
                        {suggestions.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            style={{ padding: "8px", cursor: "pointer" }}
                          >
                            {item.beneficiaryPhone} - {item.beneficiaryName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
                        disabled={!checkedRate || checkedRate.changeRate !== "yes"}
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
                      disabled={
                        (checkedRate && checkedRate.changeRate) !== "yes"
                      }
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
