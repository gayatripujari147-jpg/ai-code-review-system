import React, { useState } from "react";
import axios from "axios";

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [improvedCode, setImprovedCode] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);
      setReview("");
      setImprovedCode("");
      setScore(null);

      const res = await axios.post("http://localhost:5000/review", {
        code: code,
      });

      setScore(res.data.score);
      setReview(res.data.review);
      setImprovedCode(res.data.improvedCode || "");

    } catch (error) {
      setReview("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!improvedCode) return;

    navigator.clipboard.writeText(improvedCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚀 AI Code Review System</h2>

        <textarea
          rows="12"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={handleReview} style={styles.button}>
          {loading ? "Reviewing..." : "Review Code"}
        </button>

        {loading && <div style={styles.spinner}></div>}

        {score && (
          <div style={styles.scoreBox}>
            ⭐ Code Score: {score}/10
          </div>
        )}

        {review && (
          <>
            <h3 style={{ marginTop: "20px" }}>Review:</h3>
            <pre style={styles.result}>{review}</pre>
          </>
        )}

        {improvedCode && (
          <>
            <h3 style={{ marginTop: "20px" }}>Improved Code:</h3>
            <pre style={styles.result}>{improvedCode}</pre>

            <button onClick={handleCopy} style={styles.copyButton}>
              {copied ? "Copied ✅" : "Copy Improved Code"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "900px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#2a5298",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  scoreBox: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#e6f4ea",
    borderRadius: "8px",
    fontWeight: "bold",
    textAlign: "center",
  },
  result: {
    backgroundColor: "#f4f6f8",
    padding: "15px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    overflowX: "auto",
  },
  copyButton: {
    marginTop: "10px",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  spinner: {
    margin: "15px auto",
    width: "35px",
    height: "35px",
    border: "4px solid #ccc",
    borderTop: "4px solid #2a5298",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default App;