import { supabase } from "@/util/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest)
{
    try {
        
        const cookie = req.cookies.get("sb_user")?.value;

        console.log("User cookie:", cookie);
        
        let userId = null;
        if(cookie)
        {
            console.log("Cookies:", cookie);
            userId = JSON.parse(cookie).id;
        }

        console.log("user id", userId)

        const {data , error} = await supabase
        .from("gymsync_goal")
        .select("*")
        .eq("uid", userId)

        if(error)
        {
            console.error("Error in getGoals:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });


    } catch (error) {
        
        if(error instanceof Error)
        {
            console.error("Error in GET /api/getGoals:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}