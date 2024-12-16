"use client";
import Link from "next/link";
import {useState} from "react"
import "../styles/nav.css";

type StyleProps = {
    style: string;
    onSelect:(muscle:string)=>void
};

export default function Hnav(props: StyleProps) {

    const [selectedMuscle, setSelectedMuscle] = useState("");

    const handleChange = (e:React.ChangeEvent<HTMLSelectElement>)=>
    {
        const  SelectedMuscle = e.target.value      
        setSelectedMuscle(SelectedMuscle);  
        props.onSelect(selectedMuscle)

    }
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
                            <select className="dropdown" value={selectedMuscle} onChange={handleChange}>
                                <option value="" disabled>
                                    Select Muscle Type
                                </option>
                                <option value="Any">Show All</option>
                                <option value="abdominals">abdominals</option>
                                <option value="abductors">abductors</option>
                                <option value="adductors">adductors</option>
                                <option value="babicepsck">biceps</option>
                                <option value="calves">calves</option>
                                <option value="chest">chest</option>
                                <option value="forearms">forearms</option>
                                <option value="glutes">glutes</option>
                                <option value="hamstrings">hamstrings</option>
                                <option value="lats">lats</option>
                                <option value="lower_back">lower_back</option>
                                <option value="middle_back">middle_back</option>
                                <option value="neck">neck</option>
                                <option value="quadriceps">quadriceps</option>
                                <option value="traps">traps</option>
                                <option value="triceps">triceps</option>

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
