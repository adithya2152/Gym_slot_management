import { supabase } from "@/util/supabase";
import { NextResponse } from "next/server";

export async function POST(req:Request)
{
    try {
        
        const SlotData = await req.json()

        const {start_date , end_date , slot_count , first_start_time , slot_duration , max_alloc} = SlotData

        console.log("start_date , end_date , slot_count , first_start_time , slot_duration , max_alloc",start_date , end_date , slot_count , first_start_time , slot_duration , max_alloc)

        // Validate the incoming slot data
        if (!start_date || !end_date || !slot_count || !first_start_time || !slot_duration || !max_alloc) {
            
            return new Response(
                JSON.stringify({ message: "Missing required fields in slot data" }),
                { status: 400 }
            );
        }

        const {data , error:InsertError} = await supabase
        .rpc("add_multiple_slots" , {start_date:start_date, end_date:end_date , slot_count:slot_count , first_start_time:first_start_time,slot_duration:slot_duration , max_alloc:max_alloc})


        if(InsertError)
        {
            console.error("Error in POST /api/insertmultislot:", InsertError);
            return new Response(JSON.stringify({ message: InsertError.message }), {status: 500})
        }

        return NextResponse.json(data , {status:201})
    } catch (error) {
     
        if(error instanceof Error)
        {
            console.error("Error in POST /api/insertmultislot:", error);
            return new Response(JSON.stringify({ message: "Internal Server Error"}), {status: 500})
        }
    }
}