const fs = require("fs");
const { execSync } = require("child_process");
const rp = require("request-promise");
const cheerio = require("cheerio");

const baseURL = "https://marketplace.visualstudio.com";
const searchURL = "/items?itemName=";
const extensions = execSync("code --list-extensions")
  .toString()
  .split("\n")
  .filter((e) => e && e !== "SeyyedKhandon.vscode-web-developer-experience");
const extensionPack = `[\n${extensions.map((i) => `"${i}"`).join(",\n")}\n]`;
const extensions_url = extensions.map((ext) => baseURL + searchURL + ext);

const getExtensionInfo = async (url) => {
  const html = await rp(url);
  const title = cheerio(".ux-item-name", html).text();
  const description = cheerio(".ux-item-shortdesc", html).text();
  return { title, description, url };
};
const convertExtInfoToMarkDownFormat = async (url, index) => {
  const info = await getExtensionInfo(url);
  return `- ${index + 1}- [${info.title}](${info.url}) - ${info.description}`;
};
const generateReadMe = async () => {
  const results = await Promise.all(
    extensions_url.map(async (url, index) => {
      try {
        return await convertExtInfoToMarkDownFormat(url, index);
      } catch (error) {
        console.log(index, url);
      }
    })
  );
  fs.writeFileSync("./packlist.md", results.join("\r\n\n"));
  // console.log("packlist.md has been generated", results);
  return results;
};

// console.log("Extensions:\n", extensions);
console.log("*** Generating extensions.json:\n");
fs.writeFileSync("./extensions.json", extensionPack);
console.log("*** Extensions.json Created successfully.\n");
console.log("     Now you can copy all of it and update your");
console.log("     vscode extentions pack's package.json's");
console.log("     'extensionPack' property\n\n");

console.log("Fetching extensions informations...");
console.log("Please wait...");
generateReadMe();
console.log("*** packlist/md Created successfully.\n");
console.log("     Now you can copy all of it and update your");
console.log("     vscode extentions pack's 'Readme.md'\n");
