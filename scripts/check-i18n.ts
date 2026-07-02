// import fs from "fs";
// import path from "path";

// const SRC_DIR = path.join(process.cwd(), "src");
// const AR_FILE = path.join(process.cwd(), "messages", "ar.json");
// const EN_FILE = path.join(process.cwd(), "messages", "en.json");

// function flatten(obj: any, prefix = ""): string[] {
//   const result: string[] = [];

//   for (const key of Object.keys(obj)) {
//     const fullKey = prefix ? `${prefix}.${key}` : key;

//     if (
//       typeof obj[key] === "object" &&
//       obj[key] !== null &&
//       !Array.isArray(obj[key])
//     ) {
//       result.push(...flatten(obj[key], fullKey));
//     } else {
//       result.push(fullKey);
//     }
//   }

//   return result;
// }

// function walk(dir: string): string[] {
//   const files: string[] = [];

//   for (const entry of fs.readdirSync(dir)) {
//     const fullPath = path.join(dir, entry);

//     if (fs.statSync(fullPath).isDirectory()) {
//       files.push(...walk(fullPath));
//     } else if (
//       fullPath.endsWith(".ts") ||
//       fullPath.endsWith(".tsx")
//     ) {
//       files.push(fullPath);
//     }
//   }

//   return files;
// }

// const ar = JSON.parse(fs.readFileSync(AR_FILE, "utf8"));
// const en = JSON.parse(fs.readFileSync(EN_FILE, "utf8"));

// const translationKeys = new Set([
//   ...flatten(ar),
//   ...flatten(en),
// ]);

// const files = walk(SRC_DIR);

// const missing: {
//   file: string;
//   key: string;
// }[] = [];

// for (const file of files) {
//   const content = fs.readFileSync(file, "utf8");

//   const namespaceMatch =
//     content.match(
//       /useTranslations\(\s*["'`]([^"'`]+)["'`]\s*\)/
//     ) ||
//     content.match(
//       /getTranslations\(\s*["'`]([^"'`]+)["'`]\s*\)/
//     );

//   const namespace = namespaceMatch?.[1];

//   const regex =
//     /\bt\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

//   let match;

//   while ((match = regex.exec(content)) !== null) {
//     const rawKey = match[1];

//     const fullKey =
//       rawKey.includes(".")
//         ? rawKey
//         : namespace
//         ? `${namespace}.${rawKey}`
//         : rawKey;

//     if (!translationKeys.has(fullKey)) {
//       missing.push({
//         file: path.relative(process.cwd(), file),
//         key: fullKey,
//       });
//     }
//   }
// }

// if (missing.length === 0) {
//   console.log(
//     "✅ No missing translation keys found."
//   );
//   process.exit(0);
// }

// console.error(
//   `❌ Found ${missing.length} missing translation keys:\n`
// );

// for (const item of missing) {
//   console.error(
//     `${item.key}\n   -> ${item.file}`
//   );
// }

// process.exit(1);
