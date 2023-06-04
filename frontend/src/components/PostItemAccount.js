import React from 'react'
import { truncateStr } from '../utils'
import { useDataLayerValue } from '../DataLayer'

const PostItemAccount = ({post, editable, toggleDisplayAccount}) => {
  const [{editPost, showAddPost, posts, userPosts}, dispatch] = useDataLayerValue()

  const deletePost = async () => {
    let confirmDelete = window.confirm('This action cannot be reversed')
    if(confirmDelete)
        await deleteFromServer()
    async function deleteFromServer(){ 
        let res = await fetch(`http://localhost:5000/deletePost?id=${post._id}`)
        let data = await res.json()
        if(data.message === 'success'){
            dispatch({
                type: 'SET_POST',
                posts: [...posts.filter(valPost => {
                    return valPost._id === post._id ? '' : valPost
                })]
            })

            // let currentPostElement = document.getElementById(`post-item${post._id}`)
            // let currentPostElementParent = currentPostElement.parentNode
            // currentPostElementParent.removeChild(currentPostElement)

            dispatch({
                type: 'SET_USER_POSTS',
                posts: [...userPosts.map(valPost => {
                    return valPost._id === post._id ? '' : valPost
                })]
            })
        }
    }
  } 


  return (
    post ? 
        <div className="post-item" id={`post-item${post._id}`}>
            {editable ?
            <div className="options-icons">
                <div className="icons">
                    <div className="icon" onClick = {
                        () => deletePost()
                    }>
                        <i className='las la-trash'></i>
                    </div>
                    <div className="icon" onClick={
                        () => {
                            if(editable){
                                dispatch({
                                    type: 'TOGGLE_ADD_POST',
                                    currentValue: showAddPost
                                })
                                if(!editPost){
                                    dispatch({
                                        type: 'SET_EDIT_POST',
                                        post
                                    })
                                }else{
                                    dispatch({
                                        type: 'SET_EDIT_POST',
                                        post : null
                                    })
                                }
                                toggleDisplayAccount()
                            }
                        }
                    }>
                        <i className='las la-edit'></i>
                    </div>
                </div>
            </div>  : ''}

            <div className="image"
            onClick={() => {
                dispatch({
                    type: 'SET_CURRENT_POST',
                    post
                })
            }}>
                <img src="/images1/apple-1302430_1920.jpg" alt="post-image" width = "100%" height = "100%" />
            </div>
            <div className="text">

                <div className="info-date-col">
                    <div className="info-col">
                        <h2>{post.title}</h2>
                        <p>{truncateStr(post.contentText, 20)}</p>
                    </div>
                    <div className="date-col">
                        <div className="item">
                            <p>{post.dateCreated}</p>
                            <p>{post.time}</p>
                        </div>
                    </div>
                </div>
                
            <div className="extra-info">
                <div className="icons">
                    <div className="icon">
                        <i className='las la-eye'></i>
                        <span>{post.views.length}</span> 
                    </div>
                    <div className="icon">
                        <i className='las la-heart'></i>
                        <span>{post.likes.length}</span>
                    </div>

                    <div className="icon">
                        <i className='las la-comment-alt'></i>
                        <span>{post.comments}</span>
                    </div>
                </div>                
            </div>

            </div>
                
        </div>
        : ''
  )
}

export default PostItemAccount
