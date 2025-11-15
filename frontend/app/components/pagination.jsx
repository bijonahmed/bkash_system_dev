"use client";

export default function BootstrapPagination({
  currentPage,
  totalPages,
  goToPage,
}) {
  const pageNumbers = [];

  // Show first 2, last 2, and current ±1
  for (let i = 1; i <= totalPages; i++) {
    if (
      i <= 2 ||
      i > totalPages - 2 ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (
      (i === 3 && currentPage > 4) ||
      (i === totalPages - 2 && currentPage < totalPages - 3)
    ) {
      pageNumbers.push("ellipsis-" + i);
    }
  }

  // Inline styles
  const styles = {
    pageLink: {
      minWidth: "40px",
      margin: "0 3px",
      padding: "6px 12px",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#007bff",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      backgroundColor: "#ffffff",
      color: "#007bff",
    },
    activeLink: {
      backgroundColor: "#007bff",
      color: "#ffffff",
      fontWeight: "bold",
    },
    disabledLink: {
      backgroundColor: "#e9ecef",
      color: "#6c757d",
      cursor: "not-allowed",
      borderColor: "#dee2e6",
    },
    prevNext: {
      backgroundColor: "#17a2b8",
      color: "#ffffff",
      fontWeight: "bold",
    },
    ellipsis: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "default",
      color: "#6c757d",
    },
  };

  // Hover effect
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "#007bff";
    e.target.style.color = "#ffffff";
  };

  const handleMouseLeave = (e, active) => {
    if (!active) {
      e.target.style.backgroundColor = "#ffffff";
      e.target.style.color = "#007bff";
    }
  };

  return (
    <nav>
      <ul
        style={{
          display: "flex",
          justifyContent: "center",
          listStyle: "none",
          padding: 0,
        }}
      >
        {/* Previous */}
        <li style={{ margin: "0 3px" }}>
          <button
            style={
              currentPage === 1
                ? { ...styles.pageLink, ...styles.disabledLink }
                : { ...styles.pageLink, ...styles.prevNext }
            }
            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((num, idx) =>
          typeof num === "number" ? (
            <li key={idx} style={{ margin: "0 3px" }}>
              <button
                style={
                  currentPage === num
                    ? { ...styles.pageLink, ...styles.activeLink }
                    : styles.pageLink
                }
                onClick={() => goToPage(num)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={(e) => handleMouseLeave(e, currentPage === num)}
              >
                {num}
              </button>
            </li>
          ) : (
            <li key={idx} style={{ margin: "0 3px" }}>
              <span style={styles.ellipsis}>...</span>
            </li>
          )
        )}

        {/* Next */}
        <li style={{ margin: "0 3px" }}>
          <button
            style={
              currentPage === totalPages
                ? { ...styles.pageLink, ...styles.disabledLink }
                : { ...styles.pageLink, ...styles.prevNext }
            }
            onClick={() =>
              currentPage < totalPages && goToPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
