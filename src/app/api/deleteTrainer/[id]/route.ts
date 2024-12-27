import { admin_supabase } from "@/util/supabase";
import { NextResponse, NextRequest } from "next/server";

// DELETE handler for dynamic route [id]
export async function DELETE(request: NextRequest) {
    try {
        // Extract `id` from the dynamic route parameter
        const { pathname } = request.nextUrl;
        const id = pathname.split('/').pop(); // Extract the ID from the URL

        console.log("param ID", id);

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        const {error:autherror} = await admin_supabase.auth.admin.deleteUser(id)

        if(autherror)
            {
            return NextResponse.json({ message: autherror.message }, { status: 500 });
        }
        

        const { data, error: DeleteError } = await admin_supabase
            .from("gymsync_trainer")
            .delete()
            .eq("id", id);

        console.log("After delete", data);
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
