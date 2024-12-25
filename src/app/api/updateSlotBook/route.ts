import { supabase } from "@/util/supabase"
import { NextResponse } from "next/server";

export async function PUT(req: Request )
{
    try {
        const sid = await req.json()
        console.log("sid recieved ", sid)

        const {data , error:UpdateError} = await supabase
        .rpc("increment_booked" , {slot_id : sid})

        console.log("success", data)
        if(UpdateError)
        {
            console.error("Error in PUT /api/updateSlotBook:", UpdateError);
            return new Response(JSON.stringify({ message: UpdateError.message }), {status: 500})
        }

        return NextResponse.json(data, {status: 200})

    } catch (error) {
        console.error("Error in PUT /api/updateSlotBook:", error);
        return new Response(JSON.stringify({ message:"Internal Server Error"}), {status: 500})
    }   


}