import { supabase } from "@/util/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookies = req.cookies.get("sb_user")?.value;

    let userId = null;

    if (cookies) {
      console.log("Cookies from trainerbooked route:", cookies);
      try {
        userId = JSON.parse(cookies).id; // Ensure JSON parsing is handled safely
      } catch (parseError) {
        console.error("Error parsing cookies:", parseError);
        return NextResponse.json(
          { message: "Invalid cookie format" },
          { status: 400 }
        );
      }
    }

    if (!userId) {
      console.error("User ID not found in cookies");
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    console.log("User ID:", userId);

    const { data, error } = await supabase
      .from("gymsync_members")
      .select("tid")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching member data:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // Check if `tid` is null
    if (!data || !data.tid) {
      console.log("No trainer ID (tid) found for user");
      return NextResponse.json(
        { message: "No trainer is currently assigned to you." },
        { status: 200 } // Returning 200 to indicate a successful response with no assigned trainer
      );
    }

    const { data: trainerData, error: trainerError } = await supabase
      .from("gymsync_trainer")
      .select("*")
      .eq("id", data.tid);

    if (trainerError) {
      console.error("Error fetching trainer data:", trainerError);
      return NextResponse.json(
        { message: trainerError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(trainerData, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error in getTrainer:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
