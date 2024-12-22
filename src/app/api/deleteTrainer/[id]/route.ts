import { admin_supabase } from "@/util/supabase";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params; // Extract the `id` from the route params
        console.log("param ID" , id);

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        const { data, error: DeleteError } = await admin_supabase
            .from("gymsync_trainer")
            .delete()
            .eq("id", id);

        console.log("After delete",data);
        if (DeleteError) {
            console.error("Error deleting member:", DeleteError);
            return NextResponse.json({ message: DeleteError.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Member deleted successfully" }, { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Unhandled error in DELETE /api/deleteMember/[id]:", error);
            return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
    }
}
