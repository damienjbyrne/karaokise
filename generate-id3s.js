var fs  = require('fs');
var dir = require('node-dir');
var ffmd = require('ffmetadata');
var mime = require('mime');
var eol = require('os').EOL;

function FS_readFiles (paths, cb) {
    var result = [], errors = [], l = paths.length;
    paths.forEach(function (filePath, k) {
        var fileType = mime.lookup( filePath );
        if ( fileType === 'audio/mpeg' ) {
            ffmd.read( filePath, function(err, id3data) {
                if (err) (errors[k] = err);
                else {
                    //result[filePath] = id3data;
                    //fs.appendFileSync( resultFilePath, '{"filename":"' + filePath +'","id3":'+ JSON.stringify(id3data) + '}');
                    if (id3data.hasOwnProperty('title') && id3data.hasOwnProperty('artist')) {
                        var record = '{"filename":"' + filePath + '","artist":"' + id3data.artist + '","title":"' + id3data.title + '"}';
                        fs.appendFileSync( resultFilePath, record);
                    }
                }
                --l;
                if(l < 1) {
                    cb(err, result);
                } else {
                    fs.appendFileSync( resultFilePath, ',' + eol);
                }
            });
        } else {
            --l;
        }
    });
}

//var initialPath = '/home/damien/Music/Gilbert\ and\ Sullivan';
//var initialPath = '/home/damien/Music';
var initialPath = '/home/damienb/Music';
// var initialPath = '/media/damien/Musashi/Karaoke';
var resultFilePath = 'id3s.json';

dir.files(initialPath, function(err, files) {
    if (err) throw err;
    files.sort();
    fs.writeFileSync('fileList.txt',JSON.stringify(files));
    fs.writeFileSync(resultFilePath,'var values = [' + eol);
    //console.log(files);
    FS_readFiles(files, function(err, result) {
        fs.appendFileSync(resultFilePath,eol + '];' + eol);
        console.log("Done");
    });
});
