import { NextResponse } from "next/server";
import { supabase } from "@/util/supabase"; // Adjust path based on your project

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("gymsync_slots")
      .select("isBooked");

    if (error) {
      console.error("Error fetching slots:", error);
      return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
