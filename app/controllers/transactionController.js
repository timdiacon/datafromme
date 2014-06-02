var Transaction = require('../models/Transaction');
var fs = require('fs');
var dataArray;
var colConfig;

module.exports = {
    index: function(req, res) {
        	
        Transaction.find({}, function(err, data) {
            res.json(data);
        });

    },

    // parses CVS to array and converts first item into object
    initialParse: function(req, res) {
        fs.readFile(req.files.statement.path, function (err, data) {
            // convert csv into array and setup column config
            dataArray = CSVToArray(data);
            colConfig = getColConfig(dataArray[0]);            
            // var t = new Transaction();
            
            // // convert first item
            // var row = dataArray[1];
            // for(var c=0; c<row.length; c++){
            //     if(colConfig[c] != null){
            //         t[colConfig[c]] = row[c];
            //     }
            // }
            var sample = [];
            var row = dataArray[1];
            for(var c=0; c<row.length; c++){
                if(colConfig[c] != null){
                    sample.push(row[c]);
                }
            }
            // send some useful things back to the user...
            res.send({
                columns:colConfig,
                rowCount:dataArray.length,
                sample:sample
            })
        });
    },

    completeParse: function(req, res){
        console.log(dataArray);
        res.json({
            it:"worked"
        });
    }

};

function getColConfig(a){
    var na = [];
    for(var i=0; i<a.length; i++){
        s = a[i];
        if(s.toLowerCase().indexOf("date") != -1){
            na.push("date");
        } else if(s.toLowerCase().indexOf("type") != -1){
            na.push("type");
        } else if(s.toLowerCase().indexOf("desc") != -1){
            na.push("description");
        } else if(s.toLowerCase().indexOf("val") != -1){
            na.push("value");
        } else if(s.toLowerCase().indexOf("debit") != -1){
            na.push("value");
        } else if(s.toLowerCase().indexOf("bal") != -1){
            na.push("balance");
        } else {
            na.push(null);
        }
    }
    return na;
}

function CSVToArray( strData, strDelimiter ){
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
                                (
                                 // Delimiters.
                                 "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                                 
                                 // Quoted fields.
                                 "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                                 
                                 // Standard fields.
                                 "([^\"\\" + strDelimiter + "\\r\\n]*))"
                                 ),
                                "gi"
                                );
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec( strData )){
        var strMatchedDelimiter = arrMatches[ 1 ];
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){
            arrData.push( [] );
        }
        if (arrMatches[ 2 ]){
            var strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ),"\"");
        } else {
            var strMatchedValue = arrMatches[ 3 ];
            
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return arrData;
}
