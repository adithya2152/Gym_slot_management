import { NextResponse } from "next/server";
import { supabase } from "@/util/supabase";

export async function POST(req:Request)
{
    try {
        
        const credentials  = await req.json()
        const {email, username , password  } = credentials;

        if(!email || !username || !password)
        {
            return new Response(JSON.stringify({ error : "All fields are required" }), {status : 400})
        }

        console.log(email, username, password)

        const { data, error } = await supabase 
        .from("gymsync_admin")
        .select("*")
        .eq("name", username)
        .eq("email", email)
        .single()

        console.log(data)
        console.log(error)

        if(error ||!data) {
            return new Response(JSON.stringify({ error : "User not a Admin" }), {status : 404})
    
        }

        const { data:authdata, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            return new Response(
                JSON.stringify({ message: authError.message || "Invalid credentials" }),
                { status: 401 }
            );
        }

        // Step 3: Set a secure cookie with user session info
        const user = authdata.user;

        const res = NextResponse.json(
            { message: "Login Successful" },
            { status: 200 }
        );

        res.cookies.set(
            "sb_user",
            JSON.stringify({ id: user.id, email: user.email }),
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Secure in production
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            }
        );
        res.cookies.set("role","admin",
            {
                httpOnly:true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7,
            }
        )

        return res;

    } catch (error) {
        console.error("Error in POST /api/auth/trainersignin:", error);
        return new Response(
            JSON.stringify({ message: "An unexpected error occurred." }),
            { status: 500 }
        );
    }
}