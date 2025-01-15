import { supabase } from "@/util/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookies = req.cookies.get("sb_user")?.value;
    let userId = null;

    if (cookies) {
      userId = JSON.parse(cookies).id;
    }

    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    console.log("User ID:", userId);

    // Check if the user has already booked a trainer
    const { data: trainer, error } = await supabase
      .from("gymsync_members") // Assuming 'gymsync_members' tracks user-trainer assignments
      .select("tid")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error in GET /api/getTrainers:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // Respond with the trainer ID (null if not booked)
    return NextResponse.json({ tid: trainer?.tid || null });
  } catch (error) {
    console.error("Unexpected error in GET /api/getTrainers:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
