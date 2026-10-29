// Split a title into words for the reveal; words wrapped in *asterisks* get the accent colour.
export function words(title: string) {
  const out: { w: string; accent: boolean }[] = [];
  let accent = false;
  for (const raw of title.split(" ")) {
    const opens = raw.startsWith("*");
    const closes = raw.endsWith("*") || raw.endsWith("*.") || raw.endsWith("*?");
    if (opens) accent = true;
    out.push({ w: raw.replace(/\*/g, ""), accent });
    if (closes) accent = false;
  }
  return out;
}
