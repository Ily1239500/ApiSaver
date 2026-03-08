import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = {};

  try {
    // Read raw data from request
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString();
    body = JSON.parse(rawBody); // parse JSON manually
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (!body.name || !body.script || !body.uploader) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const filePath = path.join(dataDir, "scripts.json");
  let scripts = [];
  if (fs.existsSync(filePath)) {
    scripts = JSON.parse(fs.readFileSync(filePath));
  }

  scripts.push({
    name: body.name,
    script: body.script,
    gameId: body.gameId,
    gameName: body.gameName,
    uploader: body.uploader,
    userId: body.userId,
    date: new Date().toISOString()
  });

  fs.writeFileSync(filePath, JSON.stringify(scripts, null, 2));

  res.status(200).json({ success: true });
}
