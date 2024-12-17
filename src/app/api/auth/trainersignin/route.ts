import { NextResponse } from "next/server";
import { supabase } from "@/util/supabase"; // Ensure correct path to your Supabase client

export async function POST(req: Request) {
    try {
        // Parse the request body
        const credentials = await req.json();
        const { email, username, password } = credentials;

        // Validate input fields
        if (!email || !username || !password) {
            return new Response(
                JSON.stringify({ message: "All fields are required" }),
                { status: 400 }
            );
        }

        console.log(email, username, password)
        // Step 1: Check if the user exists in the 'gymsync_trainer' table with email and username
        const { data: userData, error: userError } = await supabase
            .from("gymsync_trainer")
            .select("*")
            .eq("Trainer_name", username)
            .eq("email", email);

        console.log(userData)
        console.log(userError)  
        if (userError || !userData?.length) {
            return new Response(
                JSON.stringify({ message: "User not a Trainer" }),
                { status: 404 }
            );
        }

        // Step 2: Authenticate the user with Supabase's signInWithPassword
        const { data, error: authError } = await supabase.auth.signInWithPassword({
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
        const user = data.user;

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

        return res;

    } catch (error) {
        // Log and return unexpected server errors
        console.error("Error in POST /api/auth/trainersignin:", error);
        return new Response(
            JSON.stringify({ message: "An unexpected error occurred." }),
            { status: 500 }
        );
    }
}
