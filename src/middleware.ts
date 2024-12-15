 import { NextResponse } from "next/server";
import {admin_supabase} from "@/util/supabase";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const userCookie = req.cookies.get("sb_user");

  console.log("usr user cookie", userCookie);
  if (!userCookie) {
    // If the user cookie is missing, redirect to login
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Parse the user cookie
    const user = JSON.parse(userCookie.value);

    console.log("user cook" , user)

    if (!user) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    
    const { data: authUser, error } = await admin_supabase.auth.admin.getUserById(user.id);

    console.log("auth user", authUser);
    console.log("error", error);

    if (error || !authUser) {
      return NextResponse.redirect(new URL("/", req.url));
    } 

    // User is valid; allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/", req.url));

  }
}

// Specify paths for which the middleware should apply
export const config = {
  matcher: ["/home", "/memberhome"],
};
