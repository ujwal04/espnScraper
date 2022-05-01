let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request=require("request");
const cheerio=require("cheerio");
const allMatchObj=require("./allMatch");
const path = require("path");
const fs=require("fs");
request(url,cb);

function cb(err,res,body){
    if(err){
        console.log("error",err);
    }else{
        handleHTML(body);
    }
}

let iplPath = path.join(__dirname,"IPL");
if (!fs.existsSync(iplPath)) {
  fs.mkdirSync(iplPath);
}

function handleHTML(html){
    let selecTool=cheerio.load(html);
    let anchorElem=selecTool(".ds-block.ds-text-center.ds-uppercase.ds-text-ui-typo-primary");
    // console.log(anchorElem.text());
    let relativeLink=anchorElem.attr("href");
    console.log(relativeLink);
    let fullLink="https://www.espncricinfo.com"+relativeLink;
    // console.log(fullLink);
    allMatchObj.getAllMatch(fullLink);
}
