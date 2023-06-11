const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Post = require('./models/Post')
const Comment = require('./models/Comment')
require('dotenv').config()

// require('./middleware')(app)

app.use(express.urlencoded({extended : true}))
app.set("view engine", 'ejs')
app.use(cors())




// DATABASE CONNECTION
let DB_STRING_PROD = `mongodb+srv://Dave:Daking1234@cluster0.rogujex.mongodb.net/?retryWrites=true&w=majority"

if(app.get('env') == 'development'){
    DB_STRING = process.env.DB_DEV
}else{
    DB_STRING = DB_STRING_PROD
}
mongoose.connect(DB_STRING, {
    useNewUrlParser: true
})
    .then(() => console.log('Database Successfully Connected'))
    .catch(err => console.log(err))

// app.use('/', require('./routes'))

app.get('/', (req, res) => {
    res.send("Helo")
})

app.get('/register', async (req, res) => {
        const {name, email, password} = req.query
        let errors = []
        if(!name || !email || !password){
            errors.push('Please fill in all Fields')
        }
        if(password.length < 5){
            errors.push('Password is too short')
        }
        if(errors.length > 0){
            res.json({error: errors})
        }else{
            const theUser = await User.findOne({email})
            if(theUser){
                res.json({error: 'User has been registered'})
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = User({
                    name,
                    email,
                    password : hashedPassword
                })
                await newUser.save()
                newUser.password = ''
                res.json({
                    message: 'success', 
                    user: newUser
                })
            }
        }
    })


app.get('/login', async (req, res, next) => {

    const {email, password} = req.query
    
    const theUser = await User.findOne({email})
    if(!theUser){
        res.json({message: 'User with email does not exist'})
    }else{

        bcrypt.compare(password, theUser.password, (err, isMatch) => {
            if(err){
                throw err
            }
            if(isMatch){
                loggedInUser = theUser
                res.json({
                    message: "success",
                    user: theUser._id
                })
                next()
            }else{
                loggedInUser = ''
                res.json({message: 'Password incorrcet'})
                next()
            }
        })
    }
})

app.get('/edit', async(req,res, next) => {

    const {field, value, user} = req.query
    if(field.toLowerCase() == 'name'){
        await User.findByIdAndUpdate(user,{
            name : value
        })
        // loggedInUser.name = value
    }else if(field.toLowerCase() == 'bio'){
        await User.findByIdAndUpdate(user,{
            bio: value
        })
        // loggedInUser.bio = value
    }
})

app.get('/addPost', async (req, res) => {
    const {title, content, contentText,contentHTML, dateCreated, time, user} = req.query
    const newPost = Post({
        title,
        content,
        contentText,
        contentHTML,
        author: user,
        dateCreated,
        time,
    })
    try{
        await newPost.save()
    }catch(e){
        throw e
    }
    res.json({
        message: 'success',
        post: newPost
    })
})

app.get('/editPost', async(req, res) => {
    const {title, content, contentText,contentHTML, dateCreated, time, postID, user} = req.query
    await Post.findOneAndUpdate({_id:postID}, {
        title,
        content,
        contentText,
        contentHTML,
        author: user,
        dateCreated,
        time
    })
    let thePost = await Post.findOne({_id: postID})
    res.json({
        message : 'success',
        post: thePost
    })
})

app.get('/deletePost', async(req, res) => {
    const {id} = req.query
    await Post.findOneAndDelete({_id: id})
    res.json({
        message: 'success'
    })
})

app.get('/allPost', async (req, res) => {
    let allPost = await Post.find()
    res.json({allPost})
})

app.get('/userInfo', async(req, res) => {
    const {id} = req.query
    let theUser = await User.findOne({_id:id})
    if(theUser){
        res.json({
            message : "success",
            user: {
                id : theUser._id,
                name: theUser.name,
                bio: theUser.bio,
                followers: theUser.followers,
                following: theUser.following
            }
        })
    }else{
        res.json({
            message: "Error"
        })
    }
})

app.get('/follow', async(req, res, next) => {
    const {followed, followed_by} = req.query
    const theUser = await User.findOne({_id:followed})
    const theFollowingUser = await User.findOne({_id: followed_by})
    if(theUser.followers.includes(followed_by)){
        theFollowingUser.following -= 1
        await theFollowingUser.save()

        let newFollowers = theUser.followers.filter(value => {
            return String(value) == followed_by ? '' : value
        })
        theUser.followers = newFollowers
        await theUser.save()
        res.json({
            message: 'Already following user',
            followers: newFollowers
        })
    }else{
        theFollowingUser.following += 1 
        await theFollowingUser.save()
        
        theUser.followers.push(followed_by)
        await theUser.save()
        res.json({
            message: "success",
            followers: theUser.followers
        })
    }

})

app.get('/userPosts', async(req, res) => {
    const {id} = req.query
    const userPosts = await Post.find({
        author: id
    })
    res.json({
        message : "success",
        posts: userPosts
    })
})

app.get('/getComments', async(req, res) => {
    const {id} = req.query
    const allComments = await Comment.find({postID: id})
    res.json({
        message: 'success',
        comments: allComments
    })
})

app.get('/getReplies', async(req, res) => {
    const {id} = req.query
    const theReplies = await Comment.find({replyingComment: id})
    res.json({
        message: "success",
        replies: theReplies
    })
})

app.get('/deleteComments', async(req, res) => {
    await Comment.deleteMany()
})

app.get('/comment', async(req, res) => {
    const {text, postID, date, time, user} = req.query
    let newComment = Comment({
        text,
        postID,
        date,
        time,
        user
    })
    await newComment.save()
    res.json({
        message: 'success',
        comment: newComment
    })
})

app.get('/reply', async(req, res) => {
    const {text, postID, date, time, commentID, replyingUser, user} = req.query
    let newReply = Comment({
        text,
        date,
        time,
        postID,
        isReply: true,
        user,
        replyingUser,
        replyingComment: commentID,
        replies : []
    })
    await newReply.save()
    let theComment = await Comment.findOne({_id: commentID})
    await Comment.findOneAndUpdate({_id: commentID},{
        replies: [...theComment.replies, newReply._id]
    })
    res.json({
        message: 'success',
        comment: newReply
    })
})

app.get('/view', async(req, res, next) => {
    const {postID, userID, viewed} = req.query
    let thePost = await Post.findOne({_id: postID})
    if(viewed){
        await Post.findOneAndUpdate({_id: postID}, {
            views: [...thePost.views, userID]
        })
    }
    
})

app.get('/like', async(req, res, next) => {
    const {postID, userID, liked} = req.query
    let thePost = await Post.findOne({_id: postID})
    let updated
    if(liked == 'true'){
        updated = await Post.findOneAndUpdate({_id: postID},{
          likes: thePost.likes.filter((like) => {
            return String(like) === userID ? '' : like
          })
        })
    }else{
        updated = await Post.findOneAndUpdate({_id: postID}, {
            likes: [...thePost.likes, userID]
        })
    }
    res.json({
        message: 'success',
        post: updated
    })
})


const PORT = process.env.PORT || 30
app.listen(PORT, console.log(`App started on PORT ${PORT}`))

module.exports = app
