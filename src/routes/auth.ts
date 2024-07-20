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

  var { data, error } = await supabase.auth.exchangeCodeForSession(code as string);
  if (error) {
    return res.status(500).send(error);
  }

  const userId = data.user?.id;
  const accessToken = data.session?.access_token;
  if (!userId || !accessToken) {
    return res.status(500).send("No user ID or access token");
  }

  res.cookie("user_id", userId);
  res.cookie("access_token", accessToken);
  res.redirect("/");
});

router.get("/signout", async (req: Request, res: Response) => {
  const supabase = createClient(req, res);
  await supabase.auth.signOut();
  
  res.clearCookie("user_id");
  res.clearCookie("access_token");
  res.redirect("/");
});
