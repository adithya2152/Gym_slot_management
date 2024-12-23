import { supabase } from "@/util/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const date = req.nextUrl.searchParams.get("date");
        const time = req.nextUrl.searchParams.get("time");

        console.log("Date:", date);
        console.log("Time:", time);

        if (date) {
            console.log("Received date", date);

            const { data, error: selectDate } = await supabase
                .from("gymsync_slots")
                .select("*")
                .eq("date", date)
                .order("start_time", { ascending: true });

            console.log("Data from server date", data);

            if (selectDate) {
                console.error("Error in GET /api/schedule:", selectDate);
                return NextResponse.json({ message: selectDate.message }, { status: 500 });
            }

            return NextResponse.json(data, { status: 200 });
        } else if (time) {
            console.log("Received time", time);

            const { data, error: selectTime } = await supabase
                .from("gymsync_slots")
                .select("*")
                .eq("start_time", time)
                .order("date", { ascending: true });

            console.log("Data from server time ", data);

            if (selectTime) {
                console.error("Error in GET /api/schedule:", selectTime);
                return NextResponse.json({ message: selectTime.message }, { status: 500 });
            }

            return NextResponse.json(data, { status: 200 });
        } else {
            console.log("No date or time available");

            const { data, error: AllSelectError } = await supabase
                .from("gymsync_slots")
                .select("*")
                .order("date", { ascending: true });

            console.log("Data from server all", data);

            if (AllSelectError) {
                console.error("Error in GET /api/schedule:", AllSelectError);
                return NextResponse.json({ message: AllSelectError.message }, { status: 500 });
            }

            return NextResponse.json(data, { status: 200 });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in GET /api/schedule:", error);
            return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    }
}
