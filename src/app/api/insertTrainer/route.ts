import { admin_supabase } from "@/util/supabase";

export async function POST(req:Request)
{
    try{

        const newTrainer = await req.json()

        const {Trainer_name , email , age , weight , height , max_mem} = newTrainer

        console.log("Trainer_name , email , age , weight , height , max_mem",Trainer_name , email , age , weight , height , max_mem)

        if(!Trainer_name || !email || !age || !weight || !height || !max_mem)
        {
            return new Response(JSON.stringify({ message : "All fields are required" }), {status : 400})
        }


        const {data , error:AuthError} = await admin_supabase.auth.signUp({
            email,
            password : Trainer_name,
        })

        console.log("AuthError",AuthError)


        if(AuthError )
            {
                return new Response(JSON.stringify({ error : AuthError.message }), {status : 400})
            }

        const user = data.user
        if(user)
        {
            const {error:InsertError} = await admin_supabase
            .from("gymsync_trainer")
            .insert([
              {
                id: user.id,
                Trainer_name: Trainer_name,
                email: email,
                age: age,
                weight: weight,
                height: height,
                max_alloc: max_mem,
              },
            ]);
            console.log("InsertError",InsertError)
            if(InsertError)
                {
                    return new Response(JSON.stringify({ error : "Failed to insert into gymSync_trainer" }), {status : 500})
                }

            return new Response(JSON.stringify({ message : "Trainer added successfully" }), {status : 201})
        }

    }
    catch(error){
        if(error instanceof Error)
        {
            console.error("Error in POST /api/insertTrainer:", error);
            return new Response(JSON.stringify({ message: "Internal Server Error"}), {status: 500})
        }
    }
}