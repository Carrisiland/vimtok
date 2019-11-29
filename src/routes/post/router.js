// vim: set ts=2 sw=2 et tw=80:

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../../models/post');
require('../../models/user');
require('../../models/video');
require('../../models/comment');
const Post = mongoose.model('Post');
const Video = mongoose.model('Video');
const { check, validationResult, sanitize } = require('express-validator');
const fetch = require('node-fetch');

const youtubeRegex =
  new RegExp('^(?:(?:(?:https?:\\/\\/)?(?:www\\.)?youtube\\.com\\/watch\\' +
    '?v=)|(?:(?:https?:\\/\\/)?(?:www\\.)?youtu\\.be\\/))([\\w+]{11})$');

const vimeoRegex =
  new RegExp('(http|https)?:\\/\\/(www\\.)?vimeo.com\\/(?:channels\\/' +
    '(?:\\w+\\/)?|groups\\/([^\\/]*)\\/videos\\/|)(\\d+)(?:|\\/\\?)');

const timeRegex = /^(?:(?:(1?\d):)?([0-5]?\d):)?([0-5]\d)$/;

function parseTime(timeString) {
  const match = timeRegex.exec(timeString);
  if (!match) return null;
  match.shift();
  return match.reduce((sum, e) => sum * 60 + (e ? parseInt(e) : 0), 0);
}

router.get('/new', (req, res) => {
  res.render('newVideoForm.html');
});

router.get('/gallery', (req, res) => {
  Post.find({ visibility: 'public' }).populate('user').populate('video')
    .then(posts => { console.log(posts); res.render('gallery.html', { posts }) })
    .catch(err => {
      res.flash('error', err.toString());
      res.status(500).render('gallery.html');
    });
});

router.post('/', [
  sanitize('link').customSanitizer((v, re) => {
    if (re = youtubeRegex.exec(v)) {
      re.videoType = 'youtube';
      return re;
    } else if (re = vimeoRegex.exec(v)) {
      re.videoType = 'vimeo';
      return re;
    } else {
      throw new Error(`${v} is not a valid Youtube/Vimeo link`);
    }
  }),
  check('start').matches(timeRegex),
  check('end').matches(timeRegex),
  check('title').not().isEmpty(),
  check('title').isLength({max: 20})
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      req.flash('error', 'Post submission not valid');
      res.render('newVideoForm.html');
      return;
    }

    const duration = parseTime(req.body.end) - parseTime(req.body.start);
    const match = req.body.link;
    const video = new Video({
      duration: duration,
      link: match[0],
      start: req.body.start,
      end: req.body.end
    });

    console.log(match);
    if (match.videoType == 'youtube') {
      video.thumbnailLink = 'http://i3.ytimg.com/vi/' + match[1] +
        '/hqdefault.jpg';
    } else {
      const info = await
        fetch(`http://vimeo.com/api/v2/video/${match.pop()}.json`)
      const infoJson = await info.json();
      console.log(infoJson);
      video.thumbnailLink = infoJson[0].thumbnail_large;
    }

    await video.save();

    const post = new Post({
      user: req.user,
      title: req.body.title,
      video: video,
      visibility: req.body.visibility,
      description: req.body.description
    });

    const saved = await post.save();
    if (req.user) {
      req.user.posts.push(saved);
      await req.user.save();
    }

    console.log(saved);
    res.redirect('/post/gallery');
  } catch(e) {
    console.log(e);
    req.flash('error', e.toString());
    res.status(500).render('newVideoForm.html');
  }
});

router.get('/:id', (req, res) => {
  console.log(req.params.id)
  const id = req.params.id;
  Post.findById(id)
  .populate("video")
  .populate("comments")
  .populate("upvotes")
  .populate("downvotes")
  .populate("user")
  .populate("title")
  .populate("dateCreated")
  .then(post => {
    res.render('post/view.html', {post});
  });
});

 



// router.get('/');
//
// router.delete('/:postid', (req, res) => {
//
// });

module.exports = router;