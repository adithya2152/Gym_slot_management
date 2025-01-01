import { supabase } from "@/util/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const cookie = req.cookies.get("sb_user")?.value;
        const role = req.cookies.get("role")?.value;

        console.log("Cookies:", cookie);
        console.log("Role cookie:", role);

        if (!cookie || !role) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }

        let userId = null;
        if (cookie) {
            try {
                userId = JSON.parse(cookie).id;
            } catch (parseError) {
                console.error("Error parsing sb_user cookie:", parseError);
                return new Response(JSON.stringify({ message: "Invalid cookie format" }), {
                    status: 400,
                });
            }
        }

        if (role === "member") {
            const { data: MemberData, error: MemberError } = await supabase
                .from("gymsync_members")
                .select("*")
                .eq("id", userId)
                .single();

            if (MemberError) {
                console.error("Error fetching member profile:", MemberError);
                return NextResponse.json({ message: MemberError.message }, { status: 500 });
            }
            return NextResponse.json({MemberData , role}, { status: 200 });
        } else if (role === "trainer") {
            const { data: TrainerData, error: TrainerError } = await supabase
                .from("gymsync_trainer")
                .select("*")
                .eq("id", userId)
                .single();

            if (TrainerError) {
                console.error("Error fetching trainer profile:", TrainerError);
                return NextResponse.json({ message: TrainerError.message }, { status: 500 });
            }
            return NextResponse.json(TrainerData, { status: 200 });
        } else if (role === "admin") {
            const { data: AdminData, error: AdminError } = await supabase
                .from("gymsync_admin")
                .select("*")
                .eq("id", userId)
                .single();

            if (AdminError) {
                console.error("Error fetching admin profile:", AdminError);
                return NextResponse.json({ message: AdminError.message }, { status: 500 });
            }
            return NextResponse.json({AdminData , role}, { status: 200 });
        } else {
            console.error("Invalid role:", role);
            return new Response(JSON.stringify({ message: "Invalid role" }), {
                status: 400,
            });
        }
    } catch (error) {
        console.error("Error in GET /api/getProfile:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
