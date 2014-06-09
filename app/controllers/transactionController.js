var async = require('async');
var Transaction = require('../models/Transaction');
var fs = require('fs');
var csvParser = require('fast-csv');
var dataArray;
var colConfig;

module.exports = {
    test: function(req, res) {
        	
        Transaction.find({}, null, {sort: {date: 1}}, function(err, data) {
            res.json(data);
        });

    },

    // parses CVS to array and converts first item into object
    initialParse: function(req, res) {
        
        fs.readFile(req.files.statement.path, function (err, data) {

            // remove that initial row from the data array
            dataArray = [];

            // TODO ideally would only parse sample here rather than whole thing
            csvParser.fromString(data, {headers: false, ignoreEmpty: true})
             .on("record", function(data){
                // stick it in the array
                dataArray.push(data);
             })
             .on("end", function(count){
                
                // all done so stick header row into col config then remove...
                colConfig = getColConfig(dataArray[0]);
                dataArray.shift();

                var ta = [];
                var tm;

                // TODO what if thre are less than 5 items?
                for(var i=0; i<5; i++){
                    tm = new Transaction();                
                    populateTransactionModel(tm, dataArray[i]);
                    ta.push(tm);
                }
     
                // send some useful things back to the user...
                res.send({
                    columns:colConfig,
                    rowCount:count,
                    sample:ta
                })
             });
        });
    },

    completeParse: function(req, res){
        var t;
        // dataArray is held in memory - convert it into objects using async...
        // TODO can we feedback conversion to the front end?
        async.each(dataArray, function(transaction, callback){
            console.log(transaction);
            tm = new Transaction();
            tm.user = req.user._id;
            populateTransactionModel(tm, transaction);
            tm.save(callback);
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

// extracts data from array and parses into transaction model
function populateTransactionModel(tm, t){
    for(var i=0; i<t.length; i++){
        if(colConfig[i] != null){
            switch(colConfig[i]){
                case 'value':
                    if(t[i].charAt(0) === '-'){
                        tm['debit'] = t[i].substr(1);
                    } else {
                        tm['credit'] = t[i];
                    }
                    break;
                case 'date':
                    var splitDate = t[i].split('/');
                    // don't forget months as zero indexed :-)
                    tm['date'] = new Date(splitDate[2], splitDate[1]-1, splitDate[0]);
                    break;
                default:
                    tm[colConfig[i]] = t[i];
            }
        }
    }
}

// convert header row from from CSV into config array
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
        } else if(s.toLowerCase().indexOf("val") != -1){ // Natwest uses single field which we will convert to credit / debit
            na.push("value");
        } else if(s.toLowerCase().indexOf("credit") != -1){
            na.push("credit");
        } else if(s.toLowerCase().indexOf("debit") != -1){
            na.push("debit");
        } else if(s.toLowerCase().indexOf("bal") != -1){
            na.push("balance");
        } else {
            na.push(null);
        }
    }
    return na;
}