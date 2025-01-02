import { NextResponse } from "next/server";
import { admin_supabase } from "@/util/supabase";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Extract cookies for user data and role
  const userCookie = req.cookies.get("sb_user")?.value; // Extract user cookie value
  const role = req.cookies.get("role")?.value; // Extract role cookie value

  console.log("User cookie:", userCookie);
  console.log("Role cookie:", role);

  const currPath = req.nextUrl.pathname; // Get the current path

  // Define an array of public routes that do not require authentication
  const publicRoutes = [
    "/member/login",
    "/member/register",
    "/trainer/login",
    "/exercises",
    "/admin/login",
    "/restricted", // Explicitly allow access to the restricted page
  ];

  // If the current route is public, allow the request to proceed without authentication
  if (publicRoutes.includes(currPath)) {
    console.log("Public route accessed:", currPath);
    return NextResponse.next(); // Allow access to public routes
  }

  // If there is no userCookie and the user is on the root page "/", allow them to stay there
  if (!userCookie) {
    if (currPath === "/") {
      console.log("No user cookie; user stays on the landing page.");
      return NextResponse.next(); // Allow access to the root "/"
    }
    // Otherwise, redirect unauthenticated users to the root "/"
    return NextResponse.redirect(new URL("/", req.url));
  } 

  try {
    // Parse the user cookie to extract user data
    const user = JSON.parse(userCookie);

    console.log("Parsed user cookie:", user);

    // If user data is missing or invalid, redirect to the root page
    if (!user) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Verify the user's identity with Supabase admin API
    const { data: authUser, error: authError } = await admin_supabase.auth.admin.getUserById(user.id);

    console.log("Authenticated user:", authUser);
    console.log("Error:", authError);

    // If there's an authentication error or the user is not found, redirect to the restricted page
    if (authError || !authUser) {
      console.error("Authentication error or user not found.");
      return NextResponse.redirect(new URL("/restricted", req.url));
    }

    // Extract the base path (the first segment after "/")
    const basePath = currPath.split("/")[1]; // This splits the path at "/" and takes the first segment
    const extractedPath = `/${basePath}`;

    console.log("Extracted base path:", extractedPath);

    let table = "";// This will hold the table name for querying

    // Check the extracted path to decide which user table to query
    if (extractedPath !== "/") {
      if (extractedPath === "/member") {
        table = "gymsync_members"; // If the path is "/member", query the "gymsync_members" table
      } else if (extractedPath === "/trainer") {
        table = "gymsync_trainer"; // If the path is "/trainer", query the "gymsync_trainer" table
      } else if (extractedPath === "/admin") {
        table = "gymsync_admin"; // If the path is "/admin", query the "gymsync_admin" table
      }

      // Query the respective table for the user
      if (table) {
        const { data, error } = await admin_supabase
          .from(table)
          .select("*")
          .eq("id", user.id)
          .single();

        // If user is not found in the table or there's an error, redirect to the restricted page
        if (!data || error) {
          console.error("User not found in the table or error occurred:", error);
          return NextResponse.redirect(new URL("/restricted", req.url));
        }
      }
    } else {
      // If the user is at the root "/", redirect based on their role
      if (role === "member") {
        return NextResponse.redirect(new URL("/member/home", req.url)); // Redirect member to their home page
      } else if (role === "trainer") {
        return NextResponse.redirect(new URL("/trainer/home", req.url)); // Redirect trainer to their home page
      } else if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/home", req.url)); // Redirect admin to their home page
      }
    }

    // If all checks pass, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);

    // If an error occurs, redirect to the restricted page
    return NextResponse.redirect(new URL("/restricted", req.url));
  }
}

// Specify paths for which the middleware should apply
export const config = {
  matcher: [
    "/home", 
    "/member/:path*",  // Apply middleware to all paths starting with "/member"
    "/trainer/:path*", // Apply middleware to all paths starting with "/trainer"
    "/admin/:path*",   // Apply middleware to all paths starting with "/admin"
    "/",               // Apply middleware to the root "/"
    "/exercises",      // Allow access to exercises page
    "/Adminlogin",   
    "/profile"  // Allow access to admin login page
  ], // Apply middleware to specific routes
};
