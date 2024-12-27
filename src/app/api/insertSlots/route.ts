import { supabase } from "@/util/supabase";

export async function POST(req: Request) {
  try {
    const Formdata = await req.json();

    console.log("Form data in server:", Formdata);

    // Validate the incoming form data
    if (!Formdata.data.date || !Formdata.data.start_time || !Formdata.data.end_time || !Formdata.data.max_alloc) {
      return new Response(
        JSON.stringify({ message: "Missing required fields in form data" }),
        { status: 400 }
      );
    }

    const { data, error: InsertError } = await supabase
      .from("gymsync_slots")    
      .insert([
        {
          date: Formdata.data.date,
          start_time: Formdata.data.start_time,
          end_time: Formdata.data.end_time,
          max_alloc: Formdata.data.max_alloc,
        },
      ]);

    if (InsertError) {
      console.error("Error in POST /api/insertSlots:", InsertError);
      return new Response(
        JSON.stringify({ message: InsertError.message }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ message: "Slot inserted successfully", data }), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in POST /api/insertSlots:",  error);
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
}
