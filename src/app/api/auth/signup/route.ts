import { NextResponse } from "next/server";
import { supabase } from "@/util/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { credentials , password } = body;

    const {email} =  credentials
    // Validate input
    if (!email || !password || !email) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }   

    console.log(email, password)

    // Use supabase.auth.signUp for user signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const user = data.user;

    if (user) {
      // Construct an absolute URL for redirection
      const response = NextResponse.json(
        { message: "Signup successful! " },
        { status: 201 }
      );
      // Set sb_user cookie
      response.cookies.set("sb_user", JSON.stringify({ id: user.id, email: user.email }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    }

    return NextResponse.json(
      { message: "Signup successful! " },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in POST /api/auth/signup:", err);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
