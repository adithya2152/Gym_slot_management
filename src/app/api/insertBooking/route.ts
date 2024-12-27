import { supabase } from "@/util/supabase";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest)
{
    try {
        const sid = await req.json()

        const cookies = req.cookies.get("sb_user")?.value;

        console.log("slot id", sid)
        console.log("user id", cookies)
        let userId = null;
  
        if (cookies) {
          console.log("Cookies:", cookies);
          userId = JSON.parse(cookies).id; // Ensure userId is extracted correctly
        }
        
        console.log("user id", userId)

        const {data , error:InsertError} = await supabase
        .from("gymsync_bookings")
        .insert([
          {
            uid: userId,    
            sid: sid,
          },
        ]);

        console.log("After insert", data);
        if(InsertError)
        {
            console.error("Error in POST /api/insertBooking:", InsertError);
            return new Response(JSON.stringify({ message: InsertError.message }), {status: 500})
        }
        return new Response(JSON.stringify(data), {status: 201})

    } catch (error) {
        
        if(error instanceof Error)
        {
            console.error("Error in POST /api/insertBooking:", error);
            return new Response(JSON.stringify({ message: "Internal Server Error"}), {status: 500})
        }
    }
}