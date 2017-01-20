var request    = require('request'),
    cheerio    = require('cheerio');

const http     = require('http');
const hostname = '127.0.0.1';
const port     = 3000;
const server   = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');

    request({
       url: 'http://usg.hiretouch.com/browse-jobs/all-jobs?&start=1&per=100'
    }, function (error, response, html) {
          if (!error && response.statusCode == 200) {
              var $    = cheerio.load(html),
                  jobs = [];
              $('li.job').each(function(i, element) {
                  var title = $(this).children('h4').children('a').text(),
                      desc  = $(this).children('.short_description').children('#field_for_short_description').children('.wysiwyg').children('p:last-child').text(),
                      dept  = $(this).children('.department').children('#field_for_department').text(),
                      loc   = $(this).children('.location').children('#field_for_location').text(),
                      job   = {
                          title: title,
                          description: desc,
                          department: dept,
                          location: loc
                      };
                      jobs.push(job);
              });
              // console.log(jobs);
              res.write( JSON.stringify(jobs) );
          } else {
              console.log("We’ve encountered an error: " + error);
          }
          res.end();
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
