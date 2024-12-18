"use client";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RestrictedPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error("You do not have access to this resource.", {
      style: {
        background: "#f44336",
        color: "#fff",
        fontWeight: "bold",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "16px",
      },
    });
  }, []);

  const handleRedirect = () => {
    router.push("/"); // Navigate to the home page
  };

  return (
    <div className="restricted-container">
      <Toaster /> {/* Add Toaster here */}
      <h2 className="restricted-title">Access Denied</h2>
      <p className="restricted-message">
        You are not authorized to view this page. Please contact support if
        you believe this is a mistake.
      </p>
      <button onClick={handleRedirect} className="restricted-button">
        Go to Home
      </button>

      <style jsx>{`
        .restricted-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f4f4f4;
          text-align: center;
        }

        .restricted-title {
          font-size: 2rem;
          font-weight: bold;
          color: #d32f2f;
        }

        .restricted-message {
          margin: 20px 0;
          font-size: 1.1rem;
          color: #333;
        }

        .restricted-button {
          background-color: #1976d2;
          color: white;
          font-size: 1.1rem;
          padding: 12px 24px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .restricted-button:hover {
          background-color: #1565c0;
        }
      `}</style>
    </div>
  );
}
