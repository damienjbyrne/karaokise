var fs = require('fs');
var ffmd = require('ffmetadata');
var mime = require('mime');
var count = 0;

/*
function scanDirectory(dirPath, details) {
    var deffered = Promise.defer();

    fs.readdir(dirPath, function(err, files) {
        if (err) {
            return console.error(err);
        }
        files.forEach( function (file){
            var filePath =  dirPath + '/' + file;
            fs.stat(filePath, function (err, stats) {
                if (err) {
                    return console.error(err);
                }

                if ( stats.isDirectory() ) {
                    scanDirectory ( filePath, details )
                        .then(function(){
                            deffered.resolve();
                        });
                } else {
                    count++;
                    var fileType = mime.lookup( filePath );
                    if ( fileType === 'audio/mpeg' ) {
                        ffmd.read( filePath, function(err, data) {
                            if (err) console.error("Error reading file metadata", err);
                            else {
                                details.push({file: filePath, 
                                              id3: data,
                                });
                                console.log("Count: " + details.length);
                            }
                        });
                    }
                }
            });
        });
    });
    return deffered.promise;
}
var details = [];
scanDirectory ( '/home/damien/Music', details)
  .then(function(){
    console.log("Final count: " + details.length);
});
*/

function scanDirectorySync(dirPath, details) {
    var files = fs.readdirSync(dirPath);
    filecount += files.length;
    for(var i in files) {
        var file = files[i];
        var filePath =  dirPath + '/' + file;
        var stats = fs.statSync(filePath);
        if ( stats.isDirectory() ) {
            files -= 1;
            scanDirectorySync ( filePath, details );
        } else {
            var fileType = mime.lookup( filePath );
            if ( fileType === 'audio/mpeg' ) {
                details[filePath] = "null";
                ffmd.read( filePath, function(err, data) {
                    if (err) console.error("Error reading file metadata", err);
                    else {
                        details[filePath] = data;
                    }
                    filecount -= 1;
                });
            } else {
                filecount -= 1;
            }
        }
    }
}

var details = [];
var filecount = 0;
scanDirectorySync ( '/home/damien/Music', details);

while (filecount > 0) {
    console.log(".");
}
console.log(details);

/*
var stuff = [];
stuff.push(["Adding files to array"]);

ffmd.read( '/home/damien/Music/elise.mp3', function(err, data) {
    if (err) console.error("Error reading file metadata", err);
    else console.log(data);
    stuff.push(data);
});

console.log(stuff.length);

var data = {
      Title: "Elise",
      artist: "Damien Byrne",
      album_artist: "The Byrnes",
      album: "Last one",
      genre: "Eclectic",
};
ffmd.write("/home/damien/Music/elise.mp3", data, function(err) {
        if (err) console.error("Error writing metadata", err);
            else console.log("Data written");
});
*/
