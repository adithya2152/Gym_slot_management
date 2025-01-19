 
import { supabase } from "@/util/supabase";
import { NextResponse } from "next/server";
export  async function GET( ) {
 
  try {
    const { count, error } = await supabase
      .from("gymsync_members")  
      .select("*", { count: "exact", head: true }); // Count the rows without fetching the data

    if (error) {
      console.error("Error fetching member count:", error);
      return NextResponse.json({ error: "Failed to fetch member count" }, { status: 500 });
    }

    return NextResponse.json({count} , { status: 200 });
  } catch (err) {
    console.error("Unexpected error fetching member count:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
