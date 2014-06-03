var async = require('async');
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
            // remove that initial row from the data array
            dataArray.shift();

            var t = new Transaction();
            
            // create a sample object...
            var row = dataArray[1];
            for(var c=0; c<row.length; c++){
                if(colConfig[c] != null){
                    t[colConfig[c]] = row[c];
                }
            }

            // send some useful things back to the user...
            res.send({
                columns:colConfig,
                rowCount:dataArray.length,
                sample:t
            })
        });
    },

    completeParse: function(req, res){
        var t;
        // dataArray is held in memory - convert it into objects using async...
        async.each(dataArray, function(transaction, callback){
            t = new Transaction();
            t.user = req.user._id;
            // add data into object
            for(var c=0; c<transaction.length; c++){
                if(colConfig[c] != null){
                    t[colConfig[c]] = transaction[c];
                }
            }
            t.save(callback);
        }, function(err) {
            if(err){
                res.json({
                    success: false,
                    error: err
                })
            } else {
                res.json({
                    success:true
                });
            }
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
