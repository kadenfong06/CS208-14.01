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

    // Keep form input after validation errors
    const formData = {
      name: req.query.name || '',
      comment: req.query.comment || ''
    };

    // Handle error from query param
    const errorType = req.query.error;
    let errorMessage = null;

    if (errorType === 'empty') {
      errorMessage = 'Name and comment cannot be empty';
    } else if (errorType === 'toolong') {
      errorMessage = 'Input is too long';
    } else if (errorType === 'server') {
      errorMessage = 'Something went wrong. Please try again.';
    }

    // Grab total number of comments
    req.db.query('SELECT COUNT(*) AS total FROM comments;', (err, countResult) => {
      if (err) {
        console.error('error counting comments:', err);
        return res.render('comments', {
          title: 'Customer Comments',
          comments: [],
          currentPage: 1,
          totalPages: 1,
          error: 'Something went wrong. Please try again.',
          formData: {
            name: '',
            comment: ''
          }
        });
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
            return res.render('comments', {
              title: 'Customer Comments',
              comments: [],
              currentPage: 1,
              totalPages: 1,
              error: 'Something went wrong. Please try again.',
              formData: formData
            });
          }

          // Render page with comments and pagination data
          res.render('comments', { 
            title: 'Customer Comments',
            comments: results,
            currentPage: page,
            totalPages: totalPages,
            error: errorMessage,
            formData: formData
          });
        }
      );
    });

  } catch (error) {
    console.error('server error:', error);
    res.render('comments', {
      title: 'Customer Comments',
      comments: [],
      currentPage: 1,
      totalPages: 1,
      error: 'Something went wrong. Please try again.',
      formData: {
        name: '',
        comment: ''
      }
    });
  }
});

router.post('/create', function (req, res) {
  // Grab form data
  const { name, comment } = req.body;

  // Validation
  if (!name || !comment || name.trim() === '' || comment.trim() === '') {
    return res.redirect(
      `/comments?error=empty&name=${encodeURIComponent(name || '')}&comment=${encodeURIComponent(comment || '')}`
    );
  }

  // Limit length
  if (name.length > 100 || comment.length > 1000) {
    return res.redirect(
      `/comments?error=toolong&name=${encodeURIComponent(name)}&comment=${encodeURIComponent(comment)}`
    );
  }

  // Insert into DB
  const sql = 'INSERT INTO comments (name, comment) VALUES (?, ?)';

  req.db.query(sql, [name.trim(), comment.trim()], function (err) {
    if (err) {
      console.error(err);
      return res.redirect(
        `/comments?error=server&name=${encodeURIComponent(name)}&comment=${encodeURIComponent(comment)}`
      );
    }

    res.redirect('/comments');
  });
});

module.exports = router;