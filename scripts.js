export default function handler(req, res) {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'data', 'scripts.json');
  let scripts = [];
  if (fs.existsSync(filePath)) {
    scripts = JSON.parse(fs.readFileSync(filePath));
  }
  res.status(200).json(scripts);
}
