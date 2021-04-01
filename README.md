# vscode-generate-readme-for-your-extension-packs

generate packlist.md which contains title/description/url of your installed vscode extensions, so that you can easily use this in your vscode extension pack like below examples:

https://github.com/SeyyedKhandon/vscode-web-developer-experience/blob/main/README.md

## Run 
If you don't have [node.js](https://nodejs.org/en/), first download and install the latest version. then run
1. `node index.js`


## Generate Package

You can customize this pack via forking and changing it in the `package.json` and use these instructions to generate a new one:
>you have to install `vsce` via
 `npm install -g vsce`. 
 then:

1. `vsce package`
2. `vsce publish`