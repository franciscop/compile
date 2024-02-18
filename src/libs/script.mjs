import fs from "fs/promises";

let out = "";

const files = await fs.readdir("./src/libs/");
const defs = files.filter((f) => /\.d\.ts$/.test(f));
for (let file of defs) {
  const src = "./src/libs/" + file;
  const content = await fs.readFile(src, "utf-8");
  const escaped = content.replaceAll(/\$\{/g, "\\${").replaceAll(/\`/g, "\\`");
  const dst = src.replace(/\.d\.ts/, ".d.js");
  await fs.writeFile(dst, `export default \`${escaped}\`;`, "utf-8");
  // /lib.d.ts -> lib_d_ts
  const name = file.replace(/\W/g, "_");
  console.log(`import ${name} from "./${file.replace(/\.d\.ts/, ".d.js")}";`);
  out += `  "/${file}": ${name},\n`;
}

console.log();

console.log(`export default {\n${out} }`);
