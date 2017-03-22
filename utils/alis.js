import request from 'request';
import cheerio from 'cheerio';

function alis(year) {
  request(`http://86.57.174.45/alis/EK/do_searh.php?radiodate=simple&valueINP=${year}&tema=ALL&tag=ALL`, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);
      const links = $('a[href^=\'do_other\']');
      const urls = [];
      $(links).each((i, link) => {
        urls.push(`${$(link).attr('href')}`);
      });

      const books = [];
      urls.forEach((elem, i) => {
        request(`http://86.57.174.45/alis/EK/${urls[i]}`, (err, res, body) => {
          if (!err) {
            const $ = cheerio.load(body);
            $('.article').each(function () {
              books.push($(this).text());
            });
            console.log(books.length);
          }
        });
      });
    }
  });
}

alis(2013);

export default alis;
