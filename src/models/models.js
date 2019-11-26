// vim: set ts=2 sw=2 et tw=80:

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  user: {type: String},
  title: { type: String, required: true },
  dateCreated: { type: Date, required: true, default: Date.now },
  comments: {type: String},
  upvotes: {type: Number, default: 1},
  downvotes: {type: Number, default: 0},
  // TODO: video: ???
});

const Favorite = mongoose.model('Favorite', schema);
