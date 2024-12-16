"use client"
// import Hnav from "@/components/hnav"
import {useEffect , useState} from "react"
import Exercise_Card from "@/components/exer_card";
import axios from "axios"

interface Exercises {
    name: string;
  type: string;
  muscle: string;
  equipment: string
  difficulty: string;
  instructions: string;
}
export default function Exercises()
{

    const [exercises, setExercises] = useState<Exercises[]>([])
    const [loading , setloading]  = useState(false)
    const [error , setError] = useState(null)
    useEffect(() => {
        
        const get_exercises = async()=>
        {
            setloading(true)
            try {
               const res = await  axios.get("https://api.api-ninjas.com/v1/exercises?muscle=",
                    {
                        headers: {
                            "X-Api-Key": "7Ys/hwZU4JHiw6PnKKkGGQ==zIo1cUyFvUzXW8f8",
                        },
                    }   
                )
                
                if(res.status === 200)
                {
                    setExercises(res.data)
                }
                else
                {
                    throw new Error("Error fetching exercises")
                }
            } catch (error) {
                if(axios.isAxiosError(error))
                {
                    setError(error.response?.data?.message || "An error occurred")
                }
                 console.error(error)
                 setloading(false)
            }
            finally
            {
                setloading(false)
                setError(null)
            }
        }
        get_exercises()
    }, [])
    return(
        <div>
            {/* <Hnav style = "exercise" /> */}
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}

            {exercises.map((exer, index) => (
                <Exercise_Card key={index} {...exer} />
            ))}
        </div>
    )
}
