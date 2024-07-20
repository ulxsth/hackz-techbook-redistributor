import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not set");
}

const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is not set");
}

export const createClient = (req: Request, res: Response) => {
  const cookieStore = {
    getAll() {
      return parseCookieHeader(req.headers.get("cookie") || "");
    },

    setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
      cookiesToSet.forEach(({ name, value, options }) => {
        res.headers.append("Set-Cookie", serializeCookieHeader(name, value, options));
      });
    },
  };

  return createServerClient(supabaseUrl, supabaseKey, { cookies: cookieStore });
};
