import express from "express";
import { Request, Response } from "express";
import { createClient } from "../libs/supabase";

export const router = express.Router();

router.get("/signin", async (req: Request, res: Response) => {
  const supabase = createClient(req, res);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${req.headers.origin}/auth/callback`,
    },
  });
  if (error) {
    return res.status(500).send(error);
  }

  const url = data.url;
  if (!url) {
    return res.status(500).send("No URL");
  }

  res.redirect(url);
});

router.get("/signin/callback", async (req: Request, res: Response) => {
  const supabase = createClient(req, res);
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No code");
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code as string);
  if (error) {
    return res.status(500).send(error);
  }

  res.send(data);
});

router.get("/signout", async (req: Request, res: Response) => {
  const supabase = createClient(req, res);
  await supabase.auth.signOut();
  res.redirect("/");
});
