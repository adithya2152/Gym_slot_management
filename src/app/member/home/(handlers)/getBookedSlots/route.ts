import { supabase } from "@/util/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest)
{
    try {
        
        const cookies= req.cookies.get("sb_user")?.value;

        console.log("Cookies:", cookies);
        
        let userId = null;
  
        if (cookies) {
          console.log("Cookies:", cookies);
          userId = JSON.parse(cookies).id;  
        }
        
        console.log("user id", userId)

        const {data:bookingData , error} = await supabase
        .from("gymsync_bookings")
        .select("sid")
        .eq("uid", userId)

        if(error)
        {
            console.error("Error in getBookedSlots:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        if(bookingData)
        {
            const {data:Slot , error:SlotsError}= await supabase
            .from("gymsync_slots")
            .select("sid, date , start_time, end_time ")
            .in("sid", bookingData.map((slot) => slot.sid))

            if(SlotsError)
            {
                console.error("Error in getBookedSlots:", SlotsError);
                return NextResponse.json({ message: SlotsError.message }, { status: 500 });
            }
            return NextResponse.json(Slot, { status: 200 });
        }
        else
        {
            return NextResponse.json({ message:"No Booked Slots" }, { status: 400 });
        }
        
    } catch (error) {
        
        if(error instanceof Error)
            {
                console.error("Error in GET /api/getBookedSlots:", error);
                return NextResponse.json({ message: error.message }, { status: 500})
            }

    }

}