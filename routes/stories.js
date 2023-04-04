const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ensureAuth } = require('../middleware/auth');

const Story = require('../models/StoryModel');

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.cookieToken, process.env.SECRET);
    req.body.user = decoded._id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();
    console.log(req.params.id);
    if (!story) {
      return res.render('error/404');
    }

    res.render('stories/show', {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    console.log(req.params.id);
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render('error/404');
    }

    res.render('stories/edit', {
      story,
    });
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    // console.log("Story's ID: ", req.params.id);
    // res.redirect('/dashboard');
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }
    await Story.remove({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

//@desc Search stories by title
//@route GET /stories/search/:query
router.get('/search/:query', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      title: new RegExp(req.query.query, 'i'),
      status: 'public',
    })
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('stories/index', { stories });
  } catch (err) {
    console.log(err);
    res.render('error/404');
  }
});

module.exports = router;
