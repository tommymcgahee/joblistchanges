// TODO

// write query to json file

var request    = require('request'),
    cheerio    = require('cheerio'),
    fs         = require('fs'),
    _          = require('underscore'),
    url        = 'http://usg.hiretouch.com/browse-jobs/all-jobs?&start=1&per=100',
    jobFile,
    jobResponse;

const http     = require('http');
const hostname = '127.0.0.1';
const port     = 3000;
// const server   = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.write(JSON.stringify(jobResponse));
//     res.end();
// });
// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

function areDifferentByProperty(o, n, prop) {
    var oldJobs = o.map( function(x) {
        return x[prop];
    });
    var newJobs = n.map( function(x) {
        return x[prop];
    });

    // var diff    = _.difference(oldJobs, newJobs);
}

fs.readFile('jobstash.json', function(error, file) {                            // read previous jobs
    if (error) return console.error('There was an error: ' + error);
    file.toString();                                                            // turn buffer into string
    jobFile = JSON.parse(file);                                                 // turn string into JS object and save to global var

    request(url, function(error, response, html) {
        if (!error && response.statusCode == 200) {
            var $    = cheerio.load(html),
                jobs = [];
            $('li.job').each(function(i, el) {
                var href  = $(this).find('h4 > a').attr('href'),
                    id    = href.substring( href.indexOf('jobID=') + 6, href.indexOf('&job=') ),
                    title = $(this).find('h4 > a').text(),
                    desc  = $(this).find('.short_description p:not(:first-child)').text(),
                    dept  = $(this).find('.department span').text(),
                    loc   = $(this).find('.location span').text(),
                    job   = {
                        job_id: id,
                        title: title,
                        description: desc,
                        department: dept,
                        location: loc
                    };
                    jobs.push(job);
            });
            jobResponse    = jobs;
            areDifferentByProperty(jobFile, jobResponse, 'job_id');

        } else {
            console.log('There was an error: ' + error);
        }
    });
});
