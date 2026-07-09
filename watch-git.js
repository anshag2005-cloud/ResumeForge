const { watch } = require('fs');
const { exec } = require('child_process');
const path = require('path');

const GIT_PATH = '"C:\\Program Files\\Git\\cmd\\git.exe"';

let debounceTimeout = null;

const runGit = () => {
  console.log(`[${new Date().toLocaleTimeString()}] Change detected. Preparing auto-push...`);
  
  exec(`${GIT_PATH} add .`, (err) => {
    if (err) {
      console.error("Git add failed:", err.message);
      return;
    }
    
    exec(`${GIT_PATH} commit -m "Auto-commit: Saved modifications"`, (err, stdout) => {
      // If there is nothing to commit, skip pushing
      if (stdout.includes("nothing to commit")) {
        console.log("No changes to commit.");
        return;
      }
      
      exec(`${GIT_PATH} push origin main`, (err, stdout, stderr) => {
        if (err) {
          console.error("Git push failed:", err.message);
          return;
        }
        console.log(`[${new Date().toLocaleTimeString()}] ✓ Successfully pushed changes to GitHub!`);
      });
    });
  });
};

const ignoredPatterns = [
  /\.git/,
  /node_modules/,
  /\.next/,
  /uploads/,
  /\.env/,
  /package-lock\.json/,
  /watch-git\.js/
];

console.log("ResumeForge Auto-Push Daemon Started.");
console.log("Watching workspace files for changes (ignoring node_modules, .next, .git, etc.)...");

watch('./', { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  
  const isIgnored = ignoredPatterns.some(pattern => pattern.test(filename));
  if (isIgnored) return;
  
  console.log(`Change detected in: ${filename}`);
  
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(runGit, 5000); // Wait 5 seconds after last save to prevent rapid commits
});
