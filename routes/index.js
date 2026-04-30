var express = require('express');
var router = express.Router();

// Homepage route
router.get('/', function(req, res) {
  // Just render the landing page, no database stuff here anymore
  res.render('landing', { title: 'Downtown Donuts' });
});

// Menu page route
router.get('/menu', function(req, res) {
  // Menu page
  res.render('menu', { title: 'Menu' });
});

// About page route
router.get('/about', function(req, res) {
  // About page
  res.render('about', { title: 'About Us' });
});

router.get('/comments', function(req, res) {
  try {
    // Grab all comments from DB starting with the latest first
    req.db.query('SELECT * FROM comments ORDER BY created_at DESC;', (err, results) => {
      if (err) {
        console.error('error fetching comments:', err);
        return res.status(500).send('error fetching comments');
      }

      // Send comments to pug
      res.render('comments', { 
        title: 'Customer Comments',
        comments: results 
      });
    });
  } catch (error) {
    console.error('server error:', error);
    res.status(500).send('server error');
  }
});

router.post('/create', function (req, res) {
  // Grab form data
  const { name, comment } = req.body;

  // Validation making sure user didn't submit something empty or just spaces
  if (!name || !comment || name.trim() === '' || comment.trim() === '') {
    console.log('invalid input');
    return res.status(400).send('Name and comment are required');
  }

  // Limit length
  if (name.length > 100 || comment.length > 1000) {
    console.log('input too long');
    return res.status(400).send('Input too long');
  }

  try {
    // Insert into comments table
    req.db.query(
      'INSERT INTO comments (name, comment) VALUES (?, ?);',
      [name.trim(), comment.trim()],
      (err, results) => {
        if (err) {
          console.error('error saving comment:', err);
          return res.status(500).send('error saving comment');
        }

        console.log('comment saved:', results);

        // Redirect back to comments page
        res.redirect('/comments');
      }
    );
  } catch (error) {
    console.error('server error:', error);
    res.status(500).send('server error');
  }
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo:');
    }
});

module.exports = router;