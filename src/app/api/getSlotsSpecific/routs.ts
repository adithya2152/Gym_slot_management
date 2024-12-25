import { supabase } from "@/util/supabase";
import { NextResponse } from "next/server";
import { parse } from "cookie"; // For parsing cookies

export async function GET(req: Request) {
  try {
    // Extract cookies from the request headers
    const cookies = req.headers.get("cookie");
    const parsedCookies = cookies ? parse(cookies) : {};
    const userId = parsedCookies.sb_user; 

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "User not authenticated" }), { status: 401 });
    }

    // Fetch slots where the current user has not booked yet
    const { data: slots, error } = await supabase
      .from("gymsync_slots")
      .select("sid, date, start_time, end_time, max_alloc, booked")
      .not("sid", "in", supabase
        .from("gymsync_bookings")
        .select("sid")
        .eq("uid", userId));  // Filter out slots already booked by the user

    if (error) {
      console.error("Error fetching slots:", error);
      return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
    }

    return NextResponse.json(slots, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/getAvailableSlots:", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
