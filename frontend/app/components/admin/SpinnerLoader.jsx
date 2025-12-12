// SpinnerLoader.jsx
import React from "react";

export default function SpinnerLoader() {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-50"
      style={{ zIndex: 1050 }}
    >
      <div
        className="spinner-border text-light"
        role="status"
        style={{ width: "4rem", height: "4rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="mt-3 text-white fs-5 text-center">
        Please wait… we are processing your request, kindly be patient.
      </div>
    </div>
  );
}
