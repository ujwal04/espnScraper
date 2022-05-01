

const request=require("request");
const cheerio=require("cheerio");
const path = require("path");
const fs=require("fs");
const xlsx=require("xlsx");

function getInfoFromScorecard(url){
    // console.log(url);
    request(url,cb);
}
function cb(err,res,body) {
    if (err) {
        console.log(err);
    }
    else if (res.statusCode == 404) {
      console.log("Page not found");
    }
    else {
      // console.log("Page found");
        getMatchDetails(body);
    }
}
function getMatchDetails(html){
    let selecTool=cheerio.load(html)
    //1. get venue
    //2. get date
    let desc=selecTool(".ds-px-4.ds-py-3.ds-border-b.ds-border-line div div div");
    // console.log(desc.text());
    let descArr=desc.text().split(",");
    // console.log(descArr);
    let dateOfMatch=descArr[2];
    let venueOfMatch=descArr[1];
    console.log(dateOfMatch);
    console.log(venueOfMatch);
    //3. get result
    let matchResEle=selecTool(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title");
    let matchResult=matchResEle.text();
    console.log(matchResult);
    //4. get team names
    let teamNames=selecTool(".ds-grow>.ds-py-3>.ds-text-tight-s.ds-font-bold.ds-uppercase");
    // console.log(teamNames.text());
    let teamsArr=teamNames.text().split("INNINGS");
    let teamA=teamsArr[0];
    let teamB=teamsArr[1];
    // console.log(teamA);
    // console.log(teamB);
    //5. get innings
    let allBatsmenTable=selecTool(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table tbody");
    // console.log(allBatsmenTable.length);
    // htmlString="";
    // console.log(allBatsmenRows.text());
    //ds-text-ui-typo
    for(let i=0;i<allBatsmenTable.length;i++){
        // htmlString+=selecTool(allBatsmenTable[i]).html();
        
        // let allColms=selecTool(allBatsmenRows[i]).find("td");
        // console.log(allColms.text());
        // break;

        let allRows=selecTool(allBatsmenTable[i]).find("tr");
        // console.log(allRows.text());
        if (i == 1) {
            let temp = teamA;
            teamA = teamB;
            teamB = temp;
          }
          console.log(teamA);
          console.log(teamB);

        for(let i=0;i<allRows.length;i++){
            let row=selecTool(allRows[i]);
            let firstColmnOfRow=row.find("td")[6];

            if(selecTool(firstColmnOfRow).hasClass("ds-min-w-max")){
                // console.log("inside");
                // let playerName=selecTool(row.find("td")[0]).text().trim();
                // let pn = selecTool(row.find("td")[0]).text().split("");
                let pn = selecTool(row.find("td")[0]).text();
                // console.log(pn);
                // console.log(pn.join(""));
                let playerName = "";
                //Determines whether an array includes a certain element, returning true or false as appropriate.
                if (pn.includes("(")) {
                // playerName = pn.join("").split("(")[0];
                playerName = pn.split("(")[0];
                // console.log(playerName);
                } else if (pn.includes("†")) {
                // playerName = pn.join("").split("†")[0];
                playerName = pn.split("†")[0];
                // console.log(playerName);
                // } else playerName = pn.join("");
                } else playerName = pn;
                //playerName = "hello"; //†
                // console.log(playerName);
                let runs=selecTool(row.find("td")[2]).text();
                let balls=selecTool(row.find("td")[3]).text();
                let numberOf4=selecTool(row.find("td")[5]).text();
                let numberOf6=selecTool(row.find("td")[6]).text();
                let sr=selecTool(row.find("td")[7]).text();

                console.log(`playerName --> ${playerName} runsScored --> ${runs} ballsPlayed --> ${balls} numberOfFours --> ${numberOf4} numberOfSixes --> ${numberOf6} strikeRate --> ${sr}`);

                processInformation(dateOfMatch,venueOfMatch,matchResult,teamA,teamB,playerName,runs,balls,numberOf4,numberOf6,sr);

                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            }
        }

    }
    function processInformation(dateOfMatch,venueOfMatch,matchResult,teamA,teamB,playerName,runs,balls,numberOf4,numberOf6,sr){
        let teamNamePath = path.join(__dirname, "IPL", teamA);

        if (!fs.existsSync(teamNamePath)){
        fs.mkdirSync(teamNamePath);
        }
        let playerPath=path.join(teamNamePath,playerName+".xlsx");
        let content=excelReader(playerPath,playerName);

        let playerObj={
            dateOfMatch,
            venueOfMatch,
            matchResult,
            teamA,
            teamB,
            playerName,
            runs,
            balls,
            numberOf4,
            numberOf6,
            sr
        }
        content.push(playerObj);
        excelWriter(playerPath,content,playerName);

    }
    // console.log(htmlString);
}

function excelReader(playerPath,sheetName){
    if(!fs.existsSync(playerPath)){
        return[];
    }
    let workBook=xlsx.readFile(playerPath);
    let excelData=workBook.Sheets[sheetName];
    let playerObj=xlsx.utils.sheet_to_json(excelData);
    return playerObj

}

function excelWriter(playerPath,jsObject,sheetName){
    let newWorkBook=xlsx.utils.book_new();
    let newWorkSheet=xlsx.utils.json_to_sheet(jsObject);
    xlsx.utils.book_append_sheet(newWorkBook,newWorkSheet,sheetName);
    xlsx.writeFile(newWorkBook,playerPath);

}
module.exports={
    gifs:getInfoFromScorecard
};
