import { NextResponse } from "next/server";
import {supabase} from "@/util/supabase";


export async function POST(req: Request)
{
  try {

    const body = await req.json();

    const {credentials , password} = body
    const {username , age , weight , email , height} = credentials

    console.log(username , password , height , email , height ,age)

    if(!username || !password || !age || !weight || !email || !height )
    {
      return new NextResponse(
        JSON.stringify({error: "All fields are required"}),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const {data , error} = await supabase.auth.signUp({
      email,
      password,
    });

    if(error)
    {
      return NextResponse.json({message: error.message} ,{status:400});
    }

    const user = data.user
    
    if(user)
      {


        const{error:insertError} = await supabase
        .from('gymsync_members')    
        .insert([
          {
            user_id:user.id,
            username:username,
            email:email,
            age:age,
            weight:weight,
            height:height,
          }
      ])

      console.log(insertError)  
      
      if(insertError)
        {
          console.error("Error inserting into gymSync_members:", error);
          return NextResponse.json({message: "Error inserting into gymSync_members."}, {status:500});
        }
        
        
      const res = NextResponse.json({message:"SignUp Success"} , {status:201});
      res.cookies.set("sb_user" , JSON.stringify({id:user.id , email:user.email}),
      {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        path:"/",
        sameSite:"strict",
        maxAge:60*60*24*7,
      });
      res.cookies.set("role","member",
        {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        }
    )


      return res
    }


  } catch (error) {
    if(error instanceof Error) {
    console.error("Error in POST /api/auth/signup:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
    }
  }
}