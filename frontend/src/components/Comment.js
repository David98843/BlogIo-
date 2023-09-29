import React, {useState, useEffect} from 'react'
import { useDataLayerValue } from '../DataLayer'
import Reply from './Reply'
import { truncateStr, serverUrl } from '../utils'


const Comment = ({comment, toggleViewUserAccount}) => {
    
    const [{currentPost, currentPostComments, user, viewingUser}, dispatch] = useDataLayerValue()
    const [commentReplies, setCommentReplies] = useState([])
    const [displayReplies, setDisplayReplies] = useState(false)

    const fetchUserInfo = async (id) => {
        let res = await fetch(`${serverUrl}/userInfo?id=${id}`)
        let data = await res.json()
        if(data.user){
            return data.user
        }
    }

    const fetchReply = async (id) => {
        let res = await fetch(`${serverUrl}/getReplies?id=${id}`)
        let data = await res.json()
        if(data.replies){
            return data.replies
        }
    }

    const getAndSetCommentReplies = async (id) => {
        let replies = await fetchReply(comment._id)
        setCommentReplies(replies)
    }

    
    async function submitReply(){
        let textInput = document.getElementById(`reply-text${comment._id}`)
        let text = textInput.value
        let postID = currentPost._id
        let months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'] 
        let day = new Date().getDate()
        let month = months[new Date().getMonth()]
        let year = new Date().getFullYear()
        let hour = new Date().getHours()
        let minute = new Date().getMinutes()

        let date = `${month} ${day}, ${year}`
        let time = `${hour}:${minute}`

        let res = await fetch(`${serverUrl}/reply?text=${text}&commentID=${comment._id}&date=${date}&time=${time}&replyingUser=${comment.user}&postID=${currentPost._id}&user=${user}`)
        let data = await res.json()
        if(data.comment){
            textInput.value = ''
            comment.replies.push(data.comment._id)
            if(!displayReplies){
                setDisplayReplies(true)
            }
            await getAndSetCommentReplies()
        }
    }


  return (
    <div id={`comment-container${comment._id}`}>
    <div className={`comment ${comment.isReply ? 'reply' : ''}`} >
        <div className="image" onClick={
            async () => {
                let commentingUser = await fetchUserInfo(comment.user)
                if(viewingUser){
                    dispatch({
                        type: 'SET_VIEWING_USER',
                        user: commentingUser
                    })
                }else{
                    toggleViewUserAccount(commentingUser)
                }
            }
        }>
            <img src="/images1/01.png" alt="" width="100%" height="100%" />
        </div>
        <div className="comment-box">
                <h4>{comment.text}</h4>
            
            <p>{comment.date} || {comment.time} || <a id='reply-link'
                onClick={
                    () => {
                        if(user){
                            let replyBox = document.getElementById(`reply-box${comment._id}`)
                            replyBox.classList.toggle('displayReplyBox')                            
                        }

                        let commentUserImage = document.getElementById(`comment-container${comment._id}`)
                        commentUserImage.classList.toggle('parentComment')
                        if(comment.replies.length > 0){
                            setDisplayReplies(!displayReplies)
                            getAndSetCommentReplies()
                        }
                    }
                }
            >{comment.replies.length} Replies</a> </p>

        {user ? 
        <div className='reply-box' id={`reply-box${comment._id}`}>
            <div className="input">
                <textarea id={`reply-text${comment._id}`} name='text' spellCheck={false}></textarea>
            </div>
            <div className="submit">
                <button onClick={
                    () => {
                        submitReply()
                    }}>
                    <i className='ri-send-plane-2-fill'></i>
                </button>
            </div>
        </div> : ''}

        </div>

    </div>
    {displayReplies ?
        <div className='comment-replies' id='comment-replies-cont'>
            <h3>Replies</h3>
            {
                commentReplies.length > 0 ?
                    commentReplies.map((reply, id) => {
                        return(
                            <Comment comment={reply} key ={id} toggleViewUserAccount={toggleViewUserAccount} />
                        )
                    })
                : ''
            }
        </div>
    : ''}
    </div>
  )
}

export default Comment
