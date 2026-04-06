import type { Context } from "https://edge.netlify.com";

export default async function auth(request: Request, context: Context) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  // Check for valid auth cookie
  const hasAuth = cookie.split(";").some((c) => {
    const [name, value] = c.trim().split("=");
    return name === "portfolio_auth" && value === "authenticated";
  });

  if (hasAuth) {
    return context.next();
  }

  // Redirect to unlock page with the original URL as redirect param
  const unlockUrl = new URL("/unlock", request.url);
  unlockUrl.searchParams.set("redirect", url.pathname);
  return Response.redirect(unlockUrl.toString(), 302);
}
