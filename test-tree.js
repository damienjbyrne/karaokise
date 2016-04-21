var fs  = require('fs');
var dir = require('node-dir');
var ffmd = require('ffmetadata');
var mime = require('mime');
var eol = require('os').EOL;
var j2h = require('node-json2html');

function FS_readFiles (paths, cb) {
    var result = [], errors = [], l = paths.length;
    paths.forEach(function (filePath, k) {
        var fileType = mime.lookup( filePath );
        if ( fileType === 'audio/mpeg' ) {
            ffmd.read( filePath, function(err, data) {
                if (err) (errors[k] = err);
                else {
                    //result[filePath] = data;
                    fs.appendFileSync( resultFilePath, '{"filename":"' + filePath +'","id3":'+ JSON.stringify(data) + '}');
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
var initialPath = '/home/damien/Music';
// var initialPath = '/media/damien/Musashi/Karaoke';
var resultFilePath = 'id3s.json';

var transform = JSON.parse(fs.readFileSync("transform.json").toString());


dir.files(initialPath, function(err, files) {
    if (err) throw err;
    files.sort();
    fs.writeFileSync('fileList.txt',JSON.stringify(files));
    fs.writeFileSync(resultFilePath,'[' + eol);
    //console.log(files);
    FS_readFiles(files, function(err, result) {
        fs.appendFileSync(resultFilePath,eol + ']' + eol);
        console.log("Creating html file");
        console.log(transform);
        var JSON_Input = fs.readFileSync(resultFilePath).toString();
        //console.log(JSON_Input);
        fs.writeFileSync('id3s.html', "<table>")
        fs.appendFileSync('id3s.html', j2h.transform(JSON_Input, transform))
        fs.appendFileSync('id3s.html', "</table>")
        console.log("Done");
    });
});
