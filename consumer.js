import scrapeAlis from './utils/alis';

/* i how consumer alis script, want to get all book 2013 year and then show them in console.log,
in the future i want to save books in database */
scrapeAlis(2013).then(books => console.log(books));
