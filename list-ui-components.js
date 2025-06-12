const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "services", "frontend", "src", "pages");
const uiDir = path.join(__dirname, "services", "frontend", "src", "components", "ui");

let allImports = new Set();

function findUiImports(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const regex = /from\s+["'][./]+components\/ui\/([a-zA-Z0-9-_]+)["']/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    allImports.add(match[1]);
  }
}

if (fs.existsSync(srcDir)) {
  fs.readdirSync(srcDir)
    .filter(f => f.endsWith(".jsx") || f.endsWith(".js"))
    .forEach(f => findUiImports(path.join(srcDir, f)));
} else {
  console.log("Không tìm thấy thư mục pages:", srcDir);
  process.exit(1);
}

console.log("Các file cần có:");
allImports.forEach(name => {
  const exists =
    fs.existsSync(path.join(uiDir, name + ".jsx")) ||
    fs.existsSync(path.join(uiDir, name + ".js")) ||
    fs.existsSync(path.join(uiDir, name, "index.jsx"));
  console.log(
    exists ? `✓ ${name}` : `✗ ${name} (chưa có file, cần bổ sung)`
  );
});
