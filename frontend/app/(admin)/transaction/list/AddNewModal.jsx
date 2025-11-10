"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const AddNewModal = ({ show, onClose }) => {
  const { token, permissions } = useAuth();

  // ✅ Form data state
  const [formData, setFormData] = useState({
    beneficiaryName: "",
    beneficiaryPhone: "",
    status: "",
    paymentMethod: "",
    wallet: "",
    bank: "",
    branch: "",
    branchCode: "",
    accountNo: "",
    sendingMoney: "",
    walletRate: "",
    bankRate: "",
    receivingMoney: "",
    charges: "",
    fee: "",
    totalAmount: "",
    senderName: "",
    description: "",
  });

  // ✅ Conditional visibility states
  const [showWallet, setShowWallet] = useState(false);
  const [showBank, setShowBank] = useState(false);

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

  // ✅ Generic handler for all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Auto-calculate fee & totalAmount when sendingMoney/charges change
  useEffect(() => {
    const charges = parseFloat(formData.charges) || 0;
    const sending = parseFloat(formData.sendingMoney) || 0;
    const fee = sending * 0.02; // Example: 2% admin fee
    const total = sending + charges + fee;

    // prevent infinite re-render by updating only if changed
    setFormData((prev) => {
      if (
        prev.fee === fee.toFixed(2) &&
        prev.totalAmount === total.toFixed(2)
      ) {
        return prev;
      }
      return {
        ...prev,
        fee: fee.toFixed(2),
        totalAmount: total.toFixed(2),
      };
    });
  }, [formData.sendingMoney, formData.charges]);

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        // Optionally clear form
        setFormData({
          beneficiaryName: "",
          beneficiaryPhone: "",
          status: "",
          paymentMethod: "",
          wallet: "",
          bank: "",
          branch: "",
          branchCode: "",
          accountNo: "",
          sendingMoney: "",
          walletRate: "",
          bankRate: "",
          receivingMoney: "",
          charges: "",
          fee: "",
          totalAmount: "",
          senderName: "",
          description: "",
        });
        onClose();
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };

  // ✅ Modal layout
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
      tabIndex="-1"
      role="dialog"
    >
      <Toaster />
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        style={{ maxWidth: "1200px", width: "90%" }}
      >
        <div className="modal-content" style={{ maxHeight: "90vh", overflowY: "auto" }}>
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Add New Entry</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

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
                    type="number"
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
                      name="wallet"
                      value={formData.wallet}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Select Wallet</option>
                      <option value="Bkash">Bkash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                    </select>
                  </div>
                )}

                {/* Bank Fields */}
                {showBank && (
                  <>
                    <div className="col-md-3 mb-2">
                      <label className="mb-0 custom-label">Bank</label>
                      <select
                        name="bank"
                        value={formData.bank}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="">Select Bank</option>
                        <option value="UNITED COMMERCIAL BANK LIMITED">
                          UNITED COMMERCIAL BANK LIMITED
                        </option>
                        <option value="UTTARA BANK LIMITED">UTTARA BANK LIMITED</option>
                        <option value="WOORI BANK">WOORI BANK</option>
                      </select>
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className="mb-0 custom-label">Branch</label>
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-3 mb-2">
                      <label className="mb-0 custom-label">Branch Code</label>
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
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </>
                )}

                {/* Amount Section */}
                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Sending Money (GBP)</label>
                  <input
                    type="number"
                    name="sendingMoney"
                    value={formData.sendingMoney}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-3 mb-2">
                  <label className="mb-0 custom-label">Charges (GBP)</label>
                  <input
                    type="number"
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
                  <label className="mb-0 custom-label">Total Amount (GBP)</label>
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
                  <label className="mb-0 custom-label">Description / Note</label>
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
              <button type="button" className="btn btn-secondary" onClick={onClose}>
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
