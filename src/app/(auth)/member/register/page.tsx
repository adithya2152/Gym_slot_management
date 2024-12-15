"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
 

type Credentials = {
    username: string;
    email: string;
    age: string;
    weight: string;
    height: string;
};

export default function Register() {
    const [credentials, setCredentials] = useState<Credentials>({
        username: "",
        email: "",
        age: "",
        weight: "",
        height: "",
    });
    const [password, setPassword] = useState<string>("");
    const [confPassword, setConfPassword] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [genOtp, setGenOtp] = useState<string>("");
    const [isSent, setIsSent] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    function validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function generateOtp(): Promise<{ otp: string; hashedOtp: string }> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = 10;
        const hashedOtp = await bcrypt.hash(otp, salt);
        setGenOtp(hashedOtp);
        return { otp, hashedOtp };
    }

    const handleVerify = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        if (!validateEmail(credentials.email)) {
            toast.error("Invalid email format");
            setIsLoading(false);
            return;
        }

        const { otp } = await generateOtp();

        try {
            const response = await axios.post("/api/sendmail", {
                email: credentials.email,
                otp,
            });

            if (response.status === 200) {
                setIsSent(true);
                toast.success("OTP sent successfully");
            } else {
                throw new Error(response.data.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            toast.error("Failed to send OTP");
            setIsSent(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();

        const match = await bcrypt.compare(otp, genOtp);
        if (match) {
            toast.success("OTP verified successfully");
            setIsVerified(true);
        } else {
            toast.error("Invalid OTP");
            resetForm();
        }
    };

    const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();

        if (password !== confPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const salt = 10;
            const hashedPassword = await bcrypt.hash(password, salt);

            const response = await axios.post(
                "/api/auth/signup",
                { credentials, password: hashedPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                toast.success("User registered successfully");
                router.push("/memberhome");
            } else {
                throw new Error(response.data.message || "Unknown error");
            }
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.log(err);
            toast.error(err.response?.data?.message || "An error occurred");
          }
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = (): void => {
        setCredentials({ username: "", email: "", age: "", weight: "", height: "" });
        setOtp("");
        setGenOtp("");
        setIsSent(false);
        setIsVerified(false);
        setPassword("");
        setConfPassword("");
    };

    const isRegisterDisabled = !(
        credentials.username &&
        credentials.email &&
        credentials.age &&
        credentials.weight &&
        credentials.height &&
        isVerified &&
        password &&
        confPassword
    );

    return (
        <div className="register-container">
            {isLoading && <p>Loading...</p>}
            <form>
                <h1>Register</h1>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                />

                <label htmlFor="age">Age</label>
                <input
                    type="number"
                    name="age"
                    value={credentials.age}
                    onChange={(e) => setCredentials({ ...credentials, age: e.target.value })}
                    required
                />

                <label htmlFor="weight">Weight</label>
                <input
                    type="number"
                    name="weight"
                    value={credentials.weight}
                    onChange={(e) => setCredentials({ ...credentials, weight: e.target.value })}
                    required
                />

                <label htmlFor="height">Height</label>
                <input
                    type="number"
                    name="height"
                    value={credentials.height}
                    onChange={(e) => setCredentials({ ...credentials, height: e.target.value })}
                    required
                />

                <label htmlFor="email">Email</label>
                <div className="email">
                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                    />
                    <button disabled={!credentials.email} onClick={handleVerify} type="button">
                        {isSent ? "Resend" : "Send OTP"}
                    </button>
                </div>

                {isSent && (
                    <div>
                        <label htmlFor="otp">OTP</label>
                        <div>
                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                required
                            />
                            <button disabled={!otp} onClick={handleConfirm} type="button">
                                Verify
                            </button>
                        </div>
                    </div>
                )}

                {isVerified && (
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />

                        <label htmlFor="confPassword">Confirm Password</label>
                        <input
                            type="password"
                            name="confPassword"
                            value={confPassword}
                            onChange={(e) => setConfPassword(e.target.value)}
                            placeholder="Confirm password"
                            required
                        />

                        <button
                            disabled={isRegisterDisabled}
                            onClick={handleRegister}
                            type="button"
                        >
                            Register
                        </button>
                    </div>
                )}

                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
            <Toaster />
        </div>
    );
}
