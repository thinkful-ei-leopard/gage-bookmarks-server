const express = require('express');
const bookmarksRouter = express.Router();
const {bookmarks} = require('../store');
const logger = require('../logger');
const bodyParser = express.json();
const uuid = require('uuid/v4');

bookmarksRouter
  .route('/')
  .get((req, res) => {
    res
      .status(200)
      .send(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const {title, content} = req.body;
    if (!title) {
      logger.error('Title was not provided');
      res
        .status(400)
        .send('Title required');
    }
    if (!content) {
      logger.error('Content was not provided');
      res
        .status(400)
        .send('Content required');
    }

    const id = uuid();
    const newBookmark = {
      id,
      title,
      content
    };

    bookmarks.push(newBookmark);

    logger.info(`New bookmark created ${title} with id ${id}`);
    res
      .status(204)
      .end();
  });

bookmarksRouter
  .route('/:id')
  .get((req, res) => {
    const {id} = req.params;
    const bookmark = bookmarks.find(bm => bm.id == id);
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found`);
      return res
        .status(404)
        .send('Not Found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    //* deletes the bookmark with the given ID
    const {id} = req.params;
    const bookmarkIndex = bookmarks.findIndex(bm => bm.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found`);
      return res
        .status(404)
        .send('Not Found');
    }
    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Card with id ${id} deleted.`);
    res
      .status(204)
      .end();
  });

module.exports = bookmarksRouter;