// cheerio for parse html pages
const cheerio = require('cheerio');
// jar for create cookie
const request = require('request').defaults({ jar: true });

// get AllNextPageUrls recursive
function getAllNextUrls(url) {
  const promise = new Promise((resolve, reject) => {
    // array allNextPagesUrls
    const allNextPagesUrls = [];
    // quit recursion
    if (url === 'undefined') return;
    // make request, here need use async or promise
    request(`http://86.57.174.45/alis/EK/${url}`, (err, res, body) => {
      if (!err) {
        // load html
        const $ = cheerio.load(body);
        // get next url page
        const nextPageLink = $('a[id^=\'Agt\']');
        const nextPageUrl = `${$(nextPageLink).attr('href')}`;
        if (nextPageUrl === 'undefined') {
          getAllNextUrls(nextPageUrl);
        } else {
          // make recursive request with next url and push url in array
          getAllNextUrls(nextPageUrl);
          allNextPagesUrls.push(nextPageUrl);
        }
      }
    });
    if (allNextPagesUrls.length) {
      resolve(allNextPagesUrls);
    } else {
      reject('Error');
    }
  });
  return promise;
}
// get all books 2013 years by pageUrls array
function getAllBooks(pageUrls) {
  const promise = new Promise((resolve, reject) => {
    // array all 2013 year books
    const books = [];
    // for each url make request and scrape books
    pageUrls.forEach((elem, i) => {
      request(`http://86.57.174.45/alis/EK/${pageUrls[i]}`, (err, res, body) => {
        // load html page
        const $ = cheerio.load(body);
        // get all books on the page
        $('.article').each(function () {
          books.push($(this).text());
        });
      });
    });
    if (books.length) {
      resolve(books);
    } else {
      reject('Error');
    }
  });
  return promise;
}

// make get request on alis library to get all books 2013 year
function scrapeAlis(query) {
  // make promise
  const promise = new Promise((resolve, reject) => {
    // url consumer defined, in our case 2013 year
    const url = `http://86.57.174.45/alis/EK/do_searh.php?radiodate=simple&valueINP=${query}&tema=ALL&tag=ALL`;
    // make request
    request(url, (error, response, html) => {
      if (!error) {
        // load main html page
        const $ = cheerio.load(html);
        // scrape first page to get first ten url in pagination, then save urls in array
        const pageLinks = $('a[href^=\'do_other\']');
        const pageUrls = $(pageLinks).map((i, link) => $(link).attr('href')).toArray();

        // scrape only last url in pagination,
        const nextPageLink = $('#Agt');
        const nextPageUrl = (`${$(nextPageLink).attr('href')}`);

        // make request on nextPageUrl, for get allNextPagesUrls recursive,
        // then combine pageUrls and allNextPageUrls arrays
        getAllNextUrls(nextPageUrl)
          .then((allNextPagesUrls) => {
            Array.prototype.push.apply(pageUrls, allNextPagesUrls);
          })
          .catch(err => console.log(err));

        // get all books 2013 year and send them to consumer
        getAllBooks(pageUrls)
          .then(books => resolve(books))
          .catch(err => console.log(err));
      } else {
        console.log(error);
      }
    });
    if (query === '') {
      reject('Error: bad request');
    }
  });
  return promise;
}

export default scrapeAlis;
