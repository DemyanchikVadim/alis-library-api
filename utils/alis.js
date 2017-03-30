const cheerio = require('cheerio');
const request = require('request').defaults({ jar: true });

const START_URL = 'http://86.57.174.45/alis/EK/do_searh.php?radiodate=simple&valueINP=2016&tema=ALL&tag=ALL';

function getPage(url, callback) {
  request(url, (err, response, body) => {
    if (err) {
      console.log(err);
      return;
    }
    callback(null, body);
  });
}

function run(fn, q) {
  if (q.length === 0) {
    console.log('end of queue');
    return;
  }

  console.log(`running fn for ${q[0]}`);
  fn(q[0], (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const $ = cheerio.load(data);
    const nextPageLink = $('#Agt');
    const nextPageUrl = (`${$(nextPageLink).attr('href')}`);
    const remainingQueue = q.slice(1);

    if (nextPageUrl !== 'undefined') {
      remainingQueue.push(`http://86.57.174.45/alis/EK/${nextPageUrl}`);
    } else {
      console.log('end of queue');
      return;
    }

    run(fn, remainingQueue);
  });
}

run(getPage, [START_URL]);
