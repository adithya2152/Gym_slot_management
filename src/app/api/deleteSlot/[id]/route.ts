import { admin_supabase } from "@/util/supabase";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    // Extract the slot ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop(); // Extract ID from the URL path

    console.log("Param ID:", id);

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { message: "ID is required" },
        { status: 400 }
      );
    }

    // Perform the delete operation
    const { data, error: DeleteError } = await admin_supabase
      .from("gymsync_slots")
      .delete()
      .eq("sid", id);

    console.log("After delete:", data);

    // Handle errors
    if (DeleteError) {
      console.error("Error deleting slot:", DeleteError);
      return NextResponse.json(
        { message: DeleteError.message },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: "Slot deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    if (error instanceof Error) {
      console.error("Unhandled error in DELETE /api/deleteMember/[id]:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
