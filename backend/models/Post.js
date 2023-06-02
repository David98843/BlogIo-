const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentText: {
        type: String,
        required: true
    },
    contentHTML : {
        type: String,
        required: true
    },
    author:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    likes: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true
    },
    views: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true
    },
    image: {
        type: String,
        required: false
    },
    dateCreated: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post