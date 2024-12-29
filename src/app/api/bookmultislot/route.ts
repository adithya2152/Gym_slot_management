import { supabase } from "@/util/supabase";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const sid = await req.json(); // This should be an array of slot ids
        const cookies = req.cookies.get("sb_user")?.value;

        console.log("slot ids", sid);
        console.log("user id", cookies);

        let userId = null;
  
        if (cookies) {
            console.log("Cookies:", cookies);
            userId = JSON.parse(cookies).id; // Ensure userId is extracted correctly
        }
        
        console.log("user id", userId);

        // Ensure sid is an array (if it's not, convert it)
        const slotIds = Array.isArray(sid) ? sid : [sid];

        
        const { data, error: BookError } = await supabase
            .rpc("book_multiple_slots", { user_id: userId, slot_ids: slotIds });

        console.log("Booking response:", data);
        if (BookError) {
            console.error("Error in POST /api/bookslots:", BookError);
            return new Response(JSON.stringify({ error: BookError.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Slots booked successfully", data }), { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in POST /api/bookslots:", error);
            return new Response(JSON.stringify({ message: error.message }), { status: 500 });
        }
    }
}
