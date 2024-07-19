import { supabase } from "./src/libs/supabase";

interface postBookBody {
  isbn: string;
  title: string;
  userId: string;
}

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);

    // GET /
    if (url.pathname === "/" && req.method === "GET") {
      return new Response("Hello World");
    }

    // GET /signin
    if (url.pathname === "/signin" && req.method === "GET") {
      const redirectTo = `${url.origin}/signin/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          queryParams: {
            redirectTo: redirectTo
          },
        },
      });

      if (error) {
        return new Response(error.message, { status: 500 });
      }

      const redirectUrl = data.url;
      return Response.redirect(redirectTo, 302);
    }

    // GET /signin/callback
    if (url.pathname === "/signin/callback" && req.method === "GET") {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return new Response(error.message, { status: 500 });
      }

      return new Response(JSON.stringify(data));
    }

    // GET /signout
    if (url.pathname === "/signout" && req.method === "GET") {
      supabase.auth.signOut();
      return Response.redirect(url.origin, 302);
    }

    // GET /books
    if (url.pathname === "/books" && req.method === "GET") {
      const { data, error } = await supabase.from("books").select("*");
      if (error) {
        return new Response(error.message, { status: 500 });
      }

      return new Response(JSON.stringify(data));
    }

    // POST /books
    if (url.pathname === "/books" && req.method === "POST") {
      const body: postBookBody = await req.json();
      if (!body.isbn || !body.title || !body.userId) {
        return new Response("Invalid request body", { status: 400 });
      }

      const { data, error } = await supabase.from("books").insert({
        isbn: body.isbn,
        title: body.title,
        user_id: body.userId,
      }).select("*");

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
