import Hnav from "../components/hnav";
import Link from "next/link";
import "@/styles/main.css";

export default function Home() {
  return (
    <div>
      <Hnav style ="main" />
      <section className="first-section">
        <h1>Welcome to GymSync</h1>
        <p>
          Your ultimate fitness partner. Book slots, find trainers, and access a
          world of workouts.
        </p>
        <p>Transform your body, mind, and spirit.</p>
        <Link className="button" href={"/exercises"}>
          Explore Exercises
        </Link>
      </section>

      <div className="sign">
        <section className="member-section">
          <h2>I am a Member</h2>
          <Link className="button" href={"/member/login"}>Member Login</Link>
        </section>


        <section className="trainer-section">
          <h2>I am a Trainer</h2>
          <Link  className="button" href={"/trainer/login"}>Trainer Login</Link>
        </section>
      </div>

      <section className="signup-section">
        <h2>New User?</h2>
        <Link className="button" href={"/member/register"}>Sign Up</Link>
      </section>

      <footer>
        <p>&copy; 2023 GymSync. All rights reserved.</p>
        <p>Privacy Policy | Terms of Service</p>
        <p>Contact us: 123-456-7890</p>
      </footer>
    </div>
  );
}
