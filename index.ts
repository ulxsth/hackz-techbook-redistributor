import { supabase } from "./src/libs/supabase";

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response("Hello World");
    }

    if (url.pathname === "/books") {
      const { data, error } = await supabase.from("books").select("*");
      if (error) {
        return new Response(error.message, { status: 500 });
      }
      
      return new Response(JSON.stringify(data));
    }

    return new Response("Not found", { status: 404 });
  },
});

const url = server.url;
console.log(`Server running at ${url}`);