let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const request=require("request");
const cheerio=require("cheerio");
const{gifs}=require("./scorecards");

// const getScorecardObj=require("./scorecards");
function getAllMatch(url){
    request(url,cb);
}


function cb(err,res,body){
    if(err){
        console.log("error",err);
    }else{
        extractAllMatchHTML(body);
    }
}


function extractAllMatchHTML(html){
    let selecTool=cheerio.load(html);
    let scorecardElemArr=selecTool(".ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent>span:nth-last-child(2)>a");
    // console.log(scorecardElemArr.text());
    for (let i = 0; i < scorecardElemArr.length; i++){
        let scorecardLink = selecTool(scorecardElemArr[i]).attr("href");
        // console.log(i + 1 + ") " + scorecardLink);
        let fullLink = "https://www.espncricinfo.com" + scorecardLink;
        gifs(fullLink);
        // getScorecardObj.gifs(fullLink);
        // break;


    }
}

module.exports = {
    getAllMatch: getAllMatch
};