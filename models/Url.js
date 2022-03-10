const mongoose = require('mongoose')
const { Schema } = mongoose
const { nanoid } = require('nanoid')

const urlSchema = new Schema({
  originURL: {
    type: String,
    unique: true,
    required: true,
  },
  shortURL: {
    type: String,
    unique: true,
    required: true,
    default: nanoid(6),
  },
})

const Url = mongoose.model('Url', urlSchema)

module.exports = Url
