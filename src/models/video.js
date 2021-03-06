// vim: set ts=2 sw=2 et tw=80:
const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
  duration: Number,
  link: String,
  thumbnailLink: String,
  start: String,
  end: String
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
