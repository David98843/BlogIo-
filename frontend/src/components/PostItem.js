import { useDataLayerValue } from './../DataLayer'
import {truncateStr, serverUrl} from './../utils'
import { useState } from 'react'

const PostItem = ({post, id}) => {
    const [{currentPost, user, displayComments}, dispatch] = useDataLayerValue()
    const [numComments, setNumComment] = useState(null)

    const fetchComments = async () => {
        let res = await fetch(`${serverUrl}/getComments?id=${post._id}`)
        let data = await res.json()
        if(data.comments){
            return data.comments.length
        }else{
            return 0
        }
    }

    function normalizePostBody(){
        let body = document.getElementsByTagName('body')[0]
        let postBody = document.getElementById('post-body')
        let isMobile = window.innerWidth <= 900;
        window.scrollTo({
            'top': 0,
            'behavior' : 'instant'
        })
        body.classList.add('no-overflow')
        if(!isMobile){
            postBody.scrollTo({
                'top': 0,
                'behavior' : 'instant'
            })
        }
        dispatch({
            type: 'SET_COMMENTS',
            comments: []
        })
    }

    async function viewPost(){

        if(!post.views.includes(user)){
            dispatch({
                type: 'SET_CURRENT_POST',
                post: {
                    ...post, 
                    views:post.views.unshift(user)
                }
            })
            let postViews = document.getElementById(`post-views-${id}`)
            postViews.innerText = 1
            await fetch(`${serverUrl}/view?userID=${user}&postID=${post._id}&viewed=false`)
        }else{
            dispatch({
                type: 'SET_CURRENT_POST',
                post: post
            })
        }
        normalizePostBody()
    }

    async function likePost() {
        let postLikes = document.getElementById(`post-likes-${id}`)
        let currLikes = Number(postLikes.innerText)
        if(post.likes.includes(user)){
            await fetch(`${serverUrl}/like?userID=${user}&postID=${post._id}&liked=true`)
            let newLikes = post.likes.filter((value) => {
                return value == user ? '' : value
            })
            post = {
                ...post, 
                likes: [...newLikes]
            }
        }else{
            await fetch(`${serverUrl}/like?userID=${user}&postID=${post._id}&liked=false`)
            post.likes.unshift(user)
        }
        postLikes.innerText = post.likes.length
        let likeIcon = document.getElementById(`like-icon${post._id}`)
        likeIcon.classList.toggle('liked')
    }

    function displayCommentBox(){
        let commentBox = document.getElementById(`comment-box${id}`)
        commentBox.classList.toggle('displayPostItemCommentBox')
    }
    
    return (
        post ? 
            <div>
            <div className="post-item" id={`#${post._id}`}>
            <a href={`#${post._id}`}>
                <div className="image"
                onClick={ 
                    () => {
                        if(user){
                            viewPost()
                        }else{
                            dispatch({
                                type: 'SET_CURRENT_POST',
                                post
                            })
                            normalizePostBody()
                        }
                        dispatch({
                            type: 'TOGGLE_DISPLAY_COMMENT',
                            currentValue: true
                        })
                    }
                }>
                    <img src="/images1/apple-1302430_1920.jpg" alt="post-image" width = "100%" height = "100%" id={`image-${id}`} onLoad={ async () => {
                        let infoParagraph = document.getElementById(`info-para${id}`)
                        infoParagraph.innerHTML = truncateStr(post.contentText,80)
                        let commentsData = await fetchComments()
                        setNumComment(commentsData)
                    }} />
                </div>
                <div className="text" onClick={
                    () => {
                        if(user){
                            viewPost()
                        }else{
                            dispatch({
                                type: 'SET_CURRENT_POST',
                                post
                            })
                            normalizePostBody()
                        }
                        dispatch({
                            type: 'TOGGLE_DISPLAY_COMMENT',
                            currentValue: true
                        })
                    }
                }>
                    <div className="info-col">
                        <h2>{truncateStr(post.title, 38)}</h2>
                        <p id={`info-para${id}`}></p>
                    </div>
                    {/* <div className="date-col">
                        <div className="item">
                            <p>{post.dateCreated}</p>
                            <p>{post.time}</p>
                        </div>
                    </div> */}
                </div>
                </a>
                <div className="extra-info">
                    <div className="icons">
                        <div className="icon">
                            <i className='las la-eye'></i>
                            <span id={`post-views-${id}`}>{post.views.length}</span> 
                        </div>
                        <div className="icon" onClick={
                            () => {
                                if(user){
                                    likePost()
                                }
                            }
                        }>
                            <i className={`las la-heart ${user ? post.likes.includes(user) ? 'liked' : '' : ''}`} id={`like-icon${post._id}`}></i>
                            <span id={`post-likes-${id}`}>{post.likes.length}</span> 
                        </div>

                        <div className="icon" onClick={() => {
                            // displayCommentBox()
                        }}>
                            <i className='las la-comment-alt'></i>
                            <span id={`post-comment${id}`}>{numComments || 0}</span>
                        </div>                    
                    </div>
                </div>
            </div>

            {/* <div className="post-item-comment-box" id={`comment-box${id}`}>
                <div className="input">
                    <input type="text" name={`comment${id}`} id={`comment${id}`} autoComplete='off'  />
                </div>
                <div className="submit">
                    <button>
                        <i className = 'ri-send-plane-2-fill'></i>
                    </button>
                </div>
            </div> */}
        </div> : ''
        
    )
}

export default PostItem