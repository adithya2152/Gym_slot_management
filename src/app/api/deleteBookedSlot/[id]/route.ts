import { supabase } from "@/util/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest)
{
    try {
        
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop(); // Extract the ID from the URL

        const cookie = req.cookies.get("sb_user")?.value;
        console.log("User cookie:", cookie);
        let userId = null;
        if(cookie)
            userId = JSON.parse(cookie).id;

        console.log("user id", userId)
        console.log("param ID:", id);

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        const {data , error:DeleteError} = await supabase
        .rpc("delete_booking", {user_id:userId , slot_id:id})

        console.log("After delete:", data);
        if(DeleteError)
        {
            console.error("Error deleting booking:", DeleteError);
            return NextResponse.json({ message: DeleteError.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 });

        
    } catch (error) {
        
        if(error instanceof Error)
        {
            console.error("Error in DELETE /api/cancelBooking/[id]:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}