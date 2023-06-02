const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    postID: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    replies:{
        type: [mongoose.SchemaTypes.ObjectId],
        required: false
    },
    isReply: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    replyingUser: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    replyingComment: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

const Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment
