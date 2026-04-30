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
    // Pagination setup
    const limit = 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    // Grab total number of comments
    req.db.query('SELECT COUNT(*) AS total FROM comments;', (err, countResult) => {
      if (err) {
        console.error('error counting comments:', err);
        return res.status(500).send('error counting comments');
      }

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      // Grab paginated comments from DB
      req.db.query(
        'SELECT * FROM comments ORDER BY created_at DESC LIMIT ? OFFSET ?;',
        [limit, offset],
        (err, results) => {
          if (err) {
            console.error('error fetching comments:', err);
            return res.status(500).send('error fetching comments');
          }

          // Render page with comments and pagination data
          res.render('comments', { 
            title: 'Customer Comments',
            comments: results,
            currentPage: page,
            totalPages: totalPages
          });
        }
      );
    });

  } catch (error) {
    console.error('server error:', error);
    res.status(500).send('server error');
  }
});

router.post('/create', function (req, res) {
  // Grab form data
  const { name, comment } = req.body;

  // Validation
  if (!name || !comment || name.trim() === '' || comment.trim() === '') {
    console.log('invalid input');
    return res.status(400).send('Name and comment are required');
  }

  // Limit length
  if (name.length > 100 || comment.length > 1000) {
    console.log('input too long');
    return res.status(400).send('Input too long');
  }

  // Insert into DB
  const sql = 'INSERT INTO comments (name, comment) VALUES (?, ?)';

  req.db.query(sql, [name.trim(), comment.trim()], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    res.redirect('/comments');
  });
});

module.exports = router;