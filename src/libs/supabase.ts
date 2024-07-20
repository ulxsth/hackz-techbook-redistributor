import { createBrowserClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { Request, Response } from "express";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not set");
}

const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is not set");
}

export const createClient = (req: Request, res: Response): SupabaseClient => {
  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      detectSessionInUrl: true,
      flowType: "pkce",
    },
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.cookie || "");
      },
      setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.setHeader("Set-Cookie", serializeCookieHeader(name, value, options));
        });
      },
    }
  });
};
