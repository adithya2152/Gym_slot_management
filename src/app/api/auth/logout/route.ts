import { supabase } from "@/util/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Attempt to sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Create a response to indicate successful logout
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Correctly delete cookies
    response.cookies.delete("sb_user");

    // Optionally, delete more cookies if needed
    response.cookies.delete("role");

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in POST /api/auth/signout:", error);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500,
      });
    }
  }
}
