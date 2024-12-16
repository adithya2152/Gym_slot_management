"use client";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({    
        username: "",
        email: "",
        password: "",
    });
    const router = useRouter();

    const handleLogin = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("/api/auth/signin", credentials, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 200) {
                toast.success("Logged In");
                router.push("/memberhome");
            } else {
                throw new Error(res.data.error || "Unknown error");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("error", error);
                toast.error(error.response?.data?.message || "An error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const isLoginDisabled = !(
        credentials.username &&
        credentials.email &&
        credentials.password
    );

    return (
        <div>
            <h1>Login</h1>
            {loading && <p>Loading ...</p>}
            <form>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={(e) =>
                        setCredentials({ ...credentials, username: e.target.value })
                    }
                    required
                />

                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    name="email"
                    value={credentials.email}
                    onChange={(e) =>
                        setCredentials({ ...credentials, email: e.target.value })
                    }
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                    }
                    required
                />

                <button disabled={isLoginDisabled} onClick={handleLogin}>
                    Login
                </button>

                <p>
                    New User? <a href="/member/register">Register</a>
                </p>
            </form>
            <Toaster />
        </div>
    );
}
