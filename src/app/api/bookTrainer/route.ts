import { supabase } from "@/util/supabase";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookies = req.cookies.get("sb_user")?.value;
    const { tid } = await req.json(); // Destructure `tid` from the request body

    console.log("tid to be updated", tid);
    let userId = null;

    if (cookies) {
      console.log("Cookies:", cookies);
      userId = JSON.parse(cookies).id;
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401 }
      );
    }

    if (!tid || typeof tid !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid trainer ID" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .rpc("choose_trainer", { user_id: userId, trainer_id: tid });

    if (error) {
      console.error("Error updating database:", error);
      return new Response(
        JSON.stringify({ error: "Database update failed", details: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Training details updated successfully", data }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in POST /api/bookTrainer:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
}
