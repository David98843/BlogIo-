const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Post = require('./models/Post')
const Comment = require('./models/Comment')
const express = require("express")
const multer = require('multer')
const path = require('path')
const passport = require('passport')
const router = express.Router()

    let uploadName
    let loggedInUser

    const storage = multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, './frontend/public/')
        },
        filename: (req, file, cb)  => {
            uploadName = `post-image-${Date.now()}${path.extname(file.originalname)}`
            cb(null, uploadName)
        }
    })
    
    const upload = multer({storage : storage})

    router.get('/register', async (req, res) => {
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


router.get('/login', async (req, res, next) => {
    // const {email, password} = req.query
    // console.log(req.query)
    // passport.authenticate('local', {
    //     successRedirect : '/verifyLogin',
    //     failureRedirect : '/verifyLogin',
    //     failureFlash : false, 
    // })(req, res, next)
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
                    user: theUser
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

router.get('/verifyLogin', (req, res) => {
    console.log('VERIFYING',loggedInUser)
    if(loggedInUser){
        res.json({
            message: "success",
            user: loggedInUser
        })
    }else{
        res.json({
            message: "Login details incorrect"
        })
    }
})
router.get('/confirmUser', (req, res) => {
    
    if(loggedInUser){
        res.json({
            message: 'success',
            user: loggedInUser
        })
    }else{
        res.json({
            message: "User not logged in",
        })
    }
})

router.get('/edit', async(req,res, next) => {
    if(!loggedInUser){
        res.json({
            message: 'user is not logged in'
        })
    }else{
        const {field, value} = req.query
        if(field.toLowerCase() == 'name'){
            await User.findByIdAndUpdate(loggedInUser._id,{
                name : value
            })
            loggedInUser.name = value
        }else if(field.toLowerCase() == 'bio'){
            await User.findByIdAndUpdate(loggedInUser._id,{
                bio: value
            })
            loggedInUser.bio = value
        }
    }
})

router.get('/addPost', async (req, res) => {
    const {title, content, contentText,contentHTML, dateCreated, time} = req.query
    console.log(decodeURIComponent(contentHTML))
    const newPost = Post({
        title,
        content,
        contentText,
        contentHTML,
        author: loggedInUser._id,
        dateCreated,
        time
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

router.get('/editPost', async(req, res) => {
    const {title, content, contentText,contentHTML, dateCreated, time, postID} = req.query
    await Post.findOneAndUpdate({_id:postID}, {
        title,
        content,
        contentText,
        contentHTML,
        author: loggedInUser._id,
        dateCreated,
        time
    })
    let thePost = await Post.findOne({_id: postID})
    res.json({
        message : 'success',
        post: thePost
    })
})

router.get('/deletePost', async(req, res) => {
    const {id} = req.query
    await Post.findOneAndDelete({_id: id})
    res.json({
        message: 'success'
    })
})

router.get('/allPost', async (req, res) => {
    let allPost = await Post.find()
    res.json({allPost})
})

router.get('/userInfo', async(req, res) => {
    const {id} = req.query
    let theUser = await User.findOne({_id:id})
    console.log('Posted By',theUser)
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

router.get('/follow', async(req, res, next) => {
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

router.get('/userPosts', async(req, res) => {
    const {id} = req.query
    const userPosts = await Post.find({
        author: id
    })
    res.json({
        message : "success",
        posts: userPosts
    })
})

router.get('/getComments', async(req, res) => {
    const {id} = req.query
    const allComments = await Comment.find({postID: id})
    res.json({
        message: 'success',
        comments: allComments
    })
})

router.get('/getReplies', async(req, res) => {
    const {id} = req.query
    const theReplies = await Comment.find({replyingComment: id})
    console.log(theReplies)
    res.json({
        message: "success",
        replies: theReplies
    })
})

router.get('/deleteComments', async(req, res) => {
    await Comment.deleteMany()
})

router.get('/comment', async(req, res) => {
    const {text, postID, date, time} = req.query
    let newComment = Comment({
        text,
        postID,
        date,
        time,
        user: loggedInUser
    })
    await newComment.save()
    res.json({
        message: 'success',
        comment: newComment
    })
})

router.get('/reply', async(req, res) => {
    const {text, postID, date, time, commentID, replyingUser} = req.query
    let newReply = Comment({
        text,
        date,
        time,
        postID,
        isReply: true,
        user: loggedInUser,
        replyingUser,
        replyingComment: commentID,
        replies : []
    })
    await newReply.save()
    let theComment = await Comment.findOne({_id: commentID})
    let updatedComment = await Comment.findOneAndUpdate({_id: commentID},{
        replies: [...theComment.replies, newReply._id]
    })
    res.json({
        message: 'success',
        comment: newReply
    })
})

router.get('/view', async(req, res, next) => {
    const {postID, userID, viewed} = req.query
    let thePost = await Post.findOne({_id: postID})
    if(viewed){
        await Post.findOneAndUpdate({_id: postID}, {
            views: [...thePost.views, userID]
        })
    }
    
})

router.get('/like', async(req, res, next) => {
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

router.get('/logout',(req, res) => {
    loggedInUser = {}
    res.json({
        message: 'Logout Successful',
    })
    // req.logout(() => {
    //     
    // })
    
})

module.exports = router