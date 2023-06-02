const mongoose = require('mongoose')

const ReplySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    replies:{
        type: [mongoose.SchemaTypes.ObjectId],
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

const Reply = mongoose.model('Reply', ReplySchema)
module.exports = {ReplySchema ,Reply}
