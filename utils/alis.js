const cheerio = require('cheerio');
const request = require('request').defaults({ jar: true });

function alis(year) {
  const url = `http://86.57.174.45/alis/EK/do_searh.php?radiodate=simple&valueINP=${year}&tema=ALL&tag=ALL`;
  request(url, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);
      const pageLinks = $('a[href^=\'do_other\']');
      const pageUrls = $(pageLinks).map((i, link) => $(link).attr('href')).toArray();

      const books = [];
      $('.article').each(function () {
        books.push($(this).text());
      });
    } else {
      console.log(error);
    }
  });
}

export default alis;
