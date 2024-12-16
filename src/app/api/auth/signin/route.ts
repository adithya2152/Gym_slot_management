import { NextResponse } from "next/server";
import { supabase } from "@/util/supabase";

export async function POST(req: Request) {
    try {
        const credentials = await req.json(); // Correctly parse JSON request body

        const { email, username, password } = credentials;

        if (!email || !username || !password) {
            return new Response(
                JSON.stringify({ error: "All fields are required" }),
                { status: 400 }
            );
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        const user = data.user;

        if (user) {
            const res = NextResponse.json(
                { message: "Login Successful" },
                { status: 200 }
            );

            res.cookies.set(
                "sb_user",
                JSON.stringify({ id: user.id, email: user.email }),
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    path: "/",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 24 * 7,
                }
            );

            return res;
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in POST /api/auth/signin:", error);
            return NextResponse.json(
                { message: "An unexpected error occurred." },
                { status: 500 }
            );
        }
    }
}
