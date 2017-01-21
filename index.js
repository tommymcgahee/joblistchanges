// TODO

// fix data structure of jobResponse
// diff data for changes
// write query to json file

var request    = require('request'),
    cheerio    = require('cheerio'),
    fs         = require('fs'),
    jobFile,
    jobResponse;

const http     = require('http');
const hostname = '127.0.0.1';
const port     = 3000;

const server   = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // res.write(jobResponse);
    // res.end();
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function finished() {




}

// read previous jobs and store in memory
fs.readFile('jobstash.json', handleFile);

// callback
function handleFile(error, file) {
    if (error) return console.error('There was an error: ' + error);
    jobFile = file.toString();

    // request is nested in fs callback for async
    request({
            url: 'http://usg.hiretouch.com/browse-jobs/all-jobs?&start=1&per=100'
          }, handleResponse);
}

// callback
function handleResponse(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $    = cheerio.load(html),
            jobs = [];
        $('li.job').each(function(i, el) {
            var title = $(this).find('h4 > a').text(),
                desc  = $(this).find('.short_description p:not(:first-child)').text(),
                dept  = $(this).find('.department span').text(),
                loc   = $(this).find('.location span').text(),
                job   = {
                    title: title,
                    description: desc,
                    department: dept,
                    location: loc
                };
                jobs.push(job);
        });
        jobResponse = JSON.stringify(jobs);

        finished();

    } else {
        console.log('There was an error: ' + error);
    }
}

// function scrapeRequest(res) {
//     return request({
//        url: 'http://usg.hiretouch.com/browse-jobs/all-jobs?&start=1&per=100'
//     }, function (error, response, html) {
//           if (!error && response.statusCode == 200) {
//               var $    = cheerio.load(html),
//                   jobs = [];
//               $('li.job').each(function(i, el) {
//                   var title = $(this).find('h4 > a').text(),
//                       desc  = $(this).find('.short_description p:not(:first-child)').text(),
//                       dept  = $(this).find('.department span').text(),
//                       loc   = $(this).find('.location span').text(),
//                       job   = {
//                           title: title,
//                           description: desc,
//                           department: dept,
//                           location: loc
//                       };
//                       jobs.push(job);
//               });
//               // console.log(jobs);
//               res.write( JSON.stringify(jobs) );
//           } else {
//               console.log("We’ve encountered an error: " + error);
//           }
//           res.end();
//     });
// }
