import { NextResponse } from "next/server";
import { supabase } from "@/util/supabase";

export async function GET()
{
    try {
        
        const {data , error:SelectError} = await supabase
        .from("gymsync_slots")
        .select("*")
    
        if(SelectError)
        {
            console.error("Error in GET /api/slots:", SelectError);
            return new Response(JSON.stringify({ message:SelectError.message}), {status: 500})
        }
        
        return NextResponse.json(data , {status: 200})

    } catch (error) {
        
        console.error("Error in GET /api/slots:", error);
        return new Response(JSON.stringify({ message:"Internal Server Error"}), {status: 500})
    }
}
