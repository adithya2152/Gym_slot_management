import { NextResponse } from "next/server";
import { supabase } from "@/util/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("gymsync_bookings")  
      .select("*");

    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
