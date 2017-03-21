import request from 'request';
import cheerio from 'cheerio';
import express from 'express';
import mongoose from 'mongoose';
import { dbUrl } from './etc/config.json';
import './models/Book';

const Book = mongoose.model('Book');

const app = express();

mongoose.connect(dbUrl);

app.get('/scrape', (req, res) => {
  const url = 'http://86.57.174.45/alis/EK/do_searh.php?radiodate=simple&valueINP=2017&tema=ALL&tag=ALL';

  request(url, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);

      $('.article').each(function () {
        const book = new Book({
          title: $(this).text(),
          createdAt: new Date(),
        });
        book.save();
      });
      res.send('Book added');
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    errors: {
      global: 'Api method not found',
    },
  });
});

const server = app.listen(8080, () =>
  console.log('Server is up and running on port localhost:8080'),
);
