"use client";
import Link from "next/link";
import "../styles/nav.css";

type StyleProps = {
    style: string;
};

export default function Hnav(props: StyleProps) {
    return (
        <div>
            <nav>
                {props.style === "exercise" ? (
                    <>
                        <div className="nav-left">
                            <Link className="header" href="/home">
                                <h1>Gymsync</h1>
                            </Link>
                        </div>

                        <div className="nav-center">
                            <Link className="exercises" href="/exercises">
                                Exercises
                            </Link>
                        </div>

                        <div className="nav-right">
                            <select className="dropdown" defaultValue="">
                                <option value="" disabled>
                                    Select Muscle Type
                                </option>
                                <option value="arms">Arms</option>
                                <option value="legs">Legs</option>
                                <option value="chest">Chest</option>
                                <option value="back">Back</option>
                            </select>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="nav-left">
                            <Link className="header" href="/home">
                                <h1>Gymsync</h1>
                            </Link>
                        </div>
                        <div className="nav-right">
                            <Link href="/AdminLogin" className="login">
                                Admin Login
                            </Link>
                        </div>
                    </>
                )}
            </nav>
        </div>
    );
}
