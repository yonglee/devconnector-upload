const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const path = require('path');

const auth = require('../../middleware/auth');

// bring models
const User = require('../../Models/User');
const Profile = require('../../Models/Profile');
const Post = require('../../Models/Post');
const mongoose = require('mongoose');
const resize = require('../../functions/resize');

const dir = 'uploads';

router.post('/upload', auth, async (req, res) => {
  const image1 = req.files.image1;
  const image2 = req.files.image2;
  var images1 = [];
  var images2 = [];
  var string = '';

  console.log(req.body.name);

  if (image1) {
    const extName = image1.name.split('.').slice(-1)[0];

    const images1 = await resize(image1.data, extName);
    console.log('in main', images1);
  }
  if (image2) {
    const extName = image2.name.split('.').slice(-1)[0];
    const images2 = await resize(image2.data, extName);
    console.log('images2', images2);
  }

  res.status(200).json({ msg: 'file received!!!' });
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [
    auth,
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const image1 = req.files.image1;
      const image2 = req.files.image2;
      var images1 = [];
      var images2 = [];
      var string = '';

      if (image1) {
        const extName = image1.name.split('.').slice(-1)[0];

        images1 = await resize(image1.data, extName);
      }
      if (image2) {
        const extName = image2.name.split('.').slice(-1)[0];
        images2 = await resize(image2.data, extName);
      }
      console.log('in main', images1);
      console.log('images2', images2);

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
        before: {
          thumbnail: images1[0],
          largeImage: images1[1]
        },
        after: {
          thumbnail: images1[0],
          largeImage: images1[1]
        }
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:post_id
// @desc    Get post by post_id
// @access  Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:post_id
// @desc    Like a post
// @access  Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    // send bad request if user sends wrong id as parameter
    if (!mongoose.Types.ObjectId.isValid(req.params.post_id)) {
      return res.status(400).json({ msg: 'Bad Request' });
    }

    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    // send bad request if user sends wrong id as parameter
    if (!mongoose.Types.ObjectId.isValid(req.params.post_id)) {
      return res.status(400).json({ msg: 'Bad Request' });
    }

    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/:post_id/comment
// @desc    Comment on a post
// @access  Private
router.post(
  '/:post_id/comment',
  [
    auth,
    check('text', 'Text is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.post_id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/posts/:post_id/comment/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/:post_id/comment/:comment_id', auth, async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.post_id);
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not Authorized' });
    }

    // Remove Index
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.status(200).send(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
