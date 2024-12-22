import { supabase } from "@/util/supabase";
import { NextResponse } from "next/server";

export async function GET()
{
    try {
        
        const {data , error:SelectError} = await supabase
        .from("gymsync_members")
        .select("*")
        
        console.log("Data from server",data)

        if(SelectError )
        {
            console.error("Error in GET /api/getMembers:", SelectError);
           
            return new Response(JSON.stringify({ message:SelectError.message}), {status: 500})
        }
        
        return NextResponse.json(data, {status: 200})

    } catch (error) {
        
        if(error instanceof Error)
        {
            console.error("Error in GET /api/getMembers:", error);
            return new Response(JSON.stringify({ message: "Internal Server Error"}), {status: 500})
        }
    }   
}