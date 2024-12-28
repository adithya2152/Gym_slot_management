import { supabase } from "@/util/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookies = req.cookies.get("sb_user")?.value;
    let userId = null;

    if (cookies) {
      console.log("Cookies:", cookies);
      userId = JSON.parse(cookies).id;
    }

    const date = req.nextUrl.searchParams.get("date");
    const time = req.nextUrl.searchParams.get("time");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "User not authenticated" }),
        { status: 401 }
      );
    }

    console.log("Received date:", date);
    console.log("Received time:", time);

    // Step 1: Fetch already booked slot IDs for the user
    const { data: bookedSlots, error: bookedError } = await supabase
      .from("gymsync_bookings")
      .select("sid")
      .eq("uid", userId);

    if (bookedError) {
      console.error("Error fetching booked slots:", bookedError);
      return new NextResponse(
        JSON.stringify({ message: bookedError.message }),
        { status: 500 }
      );
    }

    // Ensure bookedSlotIds is an array, even if no slots are booked
    const bookedSlotIds = bookedSlots ? bookedSlots.map((booking) => booking.sid) : [];

    console.log("Booked Slot IDs:", bookedSlotIds);

    // Step 2: Fetch available slots
    let query = supabase
      .from("gymsync_slots")
      .select("sid, date, start_time, end_time, max_alloc, booked");

    if (date) {
      console.log("Filtering slots by date:", date);
      query = query.eq("date", date);
    } else if (time) {
      console.log("Filtering slots by time:", time);
      query = query.eq("start_time", time);
    }

    if (bookedSlotIds.length > 0) {
      query = query.not("sid", "in", `(${bookedSlotIds.join(",")})`);
    }
    

    console.log("Formatted Booked Slot IDs:", `(${bookedSlotIds.join(",")})`);
 
    

    const { data: availableSlots, error: slotsError } = await query;

    if (slotsError) {
      console.error("Error fetching slots:", slotsError);
      return new NextResponse(
        JSON.stringify({ message: slotsError.message }),
        { status: 500 }
      );
    }

    return NextResponse.json(availableSlots, { status: 200 });
  } catch (error) {
    console.error("Error in GET /member/bookSlots:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}