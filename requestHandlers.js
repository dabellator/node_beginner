var querystring = require('querystring');
var fs = require('fs');
var formidable = require('formidable');

function start(res) {
  console.log('Request handler "Start" was called.');

  var body = '<html>' +
    '<head>'+
    '<meta http-equiv="Content-Type"'+
    'content="text/html; charset=UTF=8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload">'+
    //'<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(body);
  res.end();
}

function upload(res, req) {
  console.log('Request handler "upload" was called.');

  var form = new formidable.IncomingForm();
  console.log('about to parse');
  form.parse(req, function(err, fields, files) {
    console.log('parsing done');

    fs.rename(files.upload.path, '/tmp/test.png', function(err) {
      if (err) {
        fs.unlink('/tmp/test.png');
        fs.rename(files.upload.path, '/tmp/test.png');
      }
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('received image: <br/>');
    res.write('<img src="/show" />');
    res.end()
  });
}

function show(res) {
  console.log('Request handler \'show\' was called.');
  res.writeHead(200, {'Content-Type': 'image/png'});
  fs.createReadStream('/tmp/test.png').pipe(res);
}

module.exports = {
  start: start,
  upload: upload,
  show: show
};

