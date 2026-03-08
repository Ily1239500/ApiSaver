const fs = require("fs");
const path = require("path");

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const filePath = path.join(process.cwd(), "data", "scripts.json");
    const body = req.body;

    if (!body.name || !body.script || !body.uploader) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

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
