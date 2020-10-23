const {execSync} = require('child_process');
const rp = require('request-promise');
const cheerio = require('cheerio');
const baseURL = 'https://marketplace.visualstudio.com';
const searchURL = '/items?itemName=';
const extentions = execSync('code --list-extensions').toString().split("\n");
const extentions_url = extentions.map(ext=>baseURL+searchURL+ext);
const fs = require('fs');

const getExtentionInfo = async (url) => {
    const html = await rp(url);
    const title= cheerio('.ux-item-name', html).text()
    const description= cheerio('.ux-item-shortdesc', html).text()
    return {title,description,url};
  };
const generateReadMe = async()=>{
    var results = await Promise.all(extentions_url.map(async (url, index)=>
    {
        try {
            const info = await getExtentionInfo(url)
        return `- ${index+1}- [${info.title}](${info.url}) - ${info.description}`;
        } catch (error) {
            console.log( index, url)
        }
    }));
    
    console.log("generateReadMe -> results", results)
    fs.writeFileSync('./packlist.md', results.join("\r\n\n"));
}
generateReadMe();
