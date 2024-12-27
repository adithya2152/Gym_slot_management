import { admin_supabase } from "@/util/supabase"

export async function POST(req:Request)
{
    try {
        
        const newmember = await req.json()

        const {username , email , age, weights , height} = newmember

        console.log("username , email , age , weight , height",username , email , age , weights , height)

        if(!username || !email || !age || !weights || !height)
        {
            return new Response(JSON.stringify({ message : "All fields are required" }), {status : 400})
        }


        const {data , error:AuthError} = await admin_supabase.auth.signUp({
            email,
            password : username,
        })

        console.log("AuthError",AuthError)
        if(AuthError )
        {
            return new Response(JSON.stringify({ error : AuthError.message }), {status : 400})
        }

        const user = data.user

        if(user)
        {
            const {error} = await admin_supabase
            .from("gymsync_members")
            .insert([
                {
                    id:user.id,
                    username:username,
                    email:email,
                    age:age,
                    weight:weights,
                    height:height,
                }
            ])

            if(error)
            {
                console.error("Error inserting into gymSync_members:", error);
                return new Response(JSON.stringify({ message : error.message }), {status : 500})
            }

            return new Response(JSON.stringify({ message : "SignUp Success" }), {status : 201})
        }
        


        
    } catch (error) {
        
        if(error instanceof Error)
        {
            console.error("Error in POST /api/insertMember:", error);
            return new Response(JSON.stringify({ message : "Internal Server Error"}), {status : 500})
        }
    }
}