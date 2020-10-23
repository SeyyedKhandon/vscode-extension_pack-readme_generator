const fs = require("fs");
const { execSync } = require("child_process");
const rp = require("request-promise");
const cheerio = require("cheerio");

const baseURL = "https://marketplace.visualstudio.com";
const searchURL = "/items?itemName=";
const extentions = execSync("code --list-extensions")
  .toString()
  .split("\n")
  .filter((e) => e);
console.log("Extentions :\n", extentions);
const extentions_url = extentions.map((ext) => baseURL + searchURL + ext);

const getExtentionInfo = async (url) => {
  const html = await rp(url);
  const title = cheerio(".ux-item-name", html).text();
  const description = cheerio(".ux-item-shortdesc", html).text();
  return { title, description, url };
};
const convertExtInfoToMarkDownFormat = async (url, index) => {
  const info = await getExtentionInfo(url);
  return `- ${index + 1}- [${info.title}](${info.url}) - ${info.description}`;
};
const generateReadMe = async () => {
  const results = await Promise.all(
    extentions_url.map(async (url, index) => {
      try {
        return convertExtInfoToMarkDownFormat(url, index);
      } catch (error) {
        console.log(index, url);
      }
    })
  );
  fs.writeFileSync("./packlist.md", results.join("\r\n\n"));
  console.log("packlist.md has been generated", results);
  return results;
};
console.log("Fetching extentions informations...");
console.log("Please wait...");
generateReadMe();
