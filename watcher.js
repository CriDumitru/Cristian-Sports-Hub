const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
 
const folder = __dirname;
let timeout = null;
 
console.log("👀 Monitorizez modificari in:", folder);
console.log("💡 Orice fisier salvat va fi publicat automat in ~30 sec.\n");
 
fs.watch(folder, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  if (filename.includes(".git")) return;
 
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log(`📝 Modificare detectata: ${filename}`);
    try {
      execSync("git add .", { cwd: folder });
      execSync(`git commit -m "auto-update: ${filename}"`, { cwd: folder });
      execSync("git push", { cwd: folder });
      console.log("✅ Publicat cu succes!\n");
    } catch (e) {
      // Daca nu sunt modificari noi, git commit returneaza eroare - ignoram
      console.log("ℹ️  Nicio modificare noua de publicat.\n");
    }
  }, 3000); // asteapta 3 secunde dupa ultima salvare
});