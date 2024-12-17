"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import "../../login-register.css"
 
export default function Register() {
  const [credentials, setcredentials] = useState({
    username: "",
    age: "",
    weight: "",
    email: "",
    height: "",
  });

  const [password, setpassword] = useState("");
  const [conf_pass, setConfPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [genotp, setgenotp] = useState("");
  const router = useRouter();
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const genOtp = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = await bcrypt.hash(otp, 10);
    setgenotp(hash);
    return { otp, hash };
  };

  const handleVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail) {
      toast.error("Invalid Email");
      setLoading(false);
    }

    const { otp } = await genOtp();
    try {
      const res = await axios.post("/api/sendmail", {
        email: credentials.email,
        otp: otp,
      });

      if (res.status === 200) {
        setIsOtpSent(true);
        toast.success("Otp sent successfully");
      } else {
        throw new Error(res.data.error || "Unknown error");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send mail");
      setIsOtpSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const match = await bcrypt.compare(otp, genotp);

    if (match) {
      toast.success("Verified Otp successfully");
      setIsOtpVerified(true);
    } else {
      toast.error("Invalid Otp");
    }
  };

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (password != conf_pass) {
      toast.error("password do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/auth/signup",
        {
          credentials,  
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        toast.success("Registered Successfully");
        router.push("/memberhome");
      } else {
        throw new Error(res.data.error || "Unknown error");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const isRegisterDisabled = !(
    credentials.username && 
    credentials.age &&
    credentials.weight &&
    credentials.height &&
    isOtpVerified &&
    password &&
    conf_pass
);

  return (
    <div className="login-reg-container">
      <div className="login-box">
        <h1>Register</h1>
        {loading && <div className="loader"></div>}
        <form className="login-form-container">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={(e) =>
              setcredentials({ ...credentials, username: e.target.value })
            }
            required
          />

          <label htmlFor="age">Age</label>
          <input
            type="number"
            name="age"
            value={credentials.age}
            onChange={(e) =>
              setcredentials({ ...credentials, age: e.target.value })
            }
            required
          />

          <label htmlFor="weight"> Weight</label>
          <input
            type="number"
            name="weight"
            value={credentials.weight}
            onChange={(e) =>
              setcredentials({ ...credentials, weight: e.target.value })
            }
            required
          />

          <label htmlFor="height">Height</label>
          <input
            type="text"
            name="height"
            value={credentials.height}
            onChange={(e) =>
              setcredentials({ ...credentials, height: e.target.value })
            }
            required
          />

          <label htmlFor="email">Email</label>
          <div className="email">
            <input
              type="text"
              name="email"
              value={credentials.email}
              onChange={(e) =>
                setcredentials({ ...credentials, email: e.target.value })
              }
              required
            />
            <button disabled={!credentials.email} onClick={handleVerify}>
              {!isOtpSent ? "Send Otp" : "Resend"}
            </button>
          </div>

          {isOtpSent && (
            <div className="otp">
              <label htmlFor="otp">Otp</label>
              <input
                type="number"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button disabled={!otp} onClick={handleVerifyOtp}>
                Verify
              </button>
            </div>
          )}

          {isOtpVerified && (
            <div className="password-container">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
              />
              
              <label htmlFor="conf_pass">Confirm Password</label>
              <input
                type="password"
                name="conf_pass"
                value={conf_pass}
                onChange={(e) => setConfPass(e.target.value)}
                required
              />

              <button disabled={isRegisterDisabled} onClick={handleRegister}>
                Register
              </button>
            </div>
          )}

          <p>
              Already have an account? <a href="/member/login">Login</a>

          </p>
        </form>
        <Toaster />
      </div>
    </div>
  );
}
