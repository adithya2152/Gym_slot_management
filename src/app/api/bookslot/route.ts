import { supabase } from "@/util/supabase";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest)
{
    try {

        const sid = await req.json()
        const cookies = await req.cookies.get("sb_user")?.value;

        console.log("slot id", sid)
        console.log("user id", cookies)
        let userId = null;
  
        if (cookies) {
          console.log("Cookies:", cookies);
          userId = JSON.parse(cookies).id; // Ensure userId is extracted correctly
        }
        
        console.log("user id", userId)

        
        const {error:BookError} = await supabase
        .rpc("book_slot" , {user_id:userId , slot_id:sid} )

        console.log("booked slot", BookError)

        if(BookError)
        {
            console.error("Error in POST /api/bookslot:", BookError);
            return new Response(JSON.stringify({ error: BookError.message }), {status: 500})
        }
        return NextResponse.json({message:"Slot Booked Successfully"}, {status: 200})


    } catch (error) {
        
        if(error instanceof Error)
        {
            console.error("Error in POST /api/bookslot:", error);
            return new Response(JSON.stringify({ message: error.message }), {status: 500})
        }
    }
}