import React, {useState, useEffect} from 'react'
import { useDataLayerValue } from '../DataLayer'
import Comment from './Comment'
import { serverUrl } from '../utils'

const PostComments = ({toggleViewUserAccount}) => {
  const [{currentPost, currentPostComments, user}, dispatch] = useDataLayerValue()

  const fetchCurrentPostComments = async() => {
    let res = await fetch(`${serverUrl}/getComments?id=${currentPost._id}`)
    let data = await res.json()
    if(data.comments){
      return data
    }
  }

    useEffect(() => {
      const setComment = async () => {
        let data = await fetchCurrentPostComments()
        dispatch({
          type: 'SET_COMMENTS',
          comments: [...data.comments]
        })
      }
      if(currentPost){
        setComment()
      }else{
      }
    },[currentPost])

  async function addComment(){
    let textInput = document.getElementById('post-comment-input')
    let text = textInput.value
    if(text.length > 0){
      textInput.value = ''
      let postID = currentPost._id
      let months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'] 
      let day = new Date().getDate()
      let month = months[new Date().getMonth()]
      let year = new Date().getFullYear()
      let hour = new Date().getHours()
      let minute = new Date().getMinutes()
      let date = `${month} ${day}, ${year}`
      let time = `${hour}:${minute}`
      
      let res = await fetch(`${serverUrl}/comment?text=${text}&postID=${postID}&date=${date}&time=${time}&user=${user}`)
      let data = await res.json()
      if(data.comment){
        dispatch({
          type: 'SET_COMMENTS',
          comments: [...currentPostComments, data.comment]
        })
        let postBody = document.getElementById('post-body')
        
        setTimeout(
          () => {
            postBody.scrollTo({
            top: postBody.scrollHeight * 100,
            left: 0
          })
        },100)
      }

    }else{

    }
  }

  
  return (
    <div className='post-comment'>
      {currentPostComments.map((comment, id) => {
        console.log(comment)
        return !comment.isReply ? <Comment comment = {comment} key = {id} toggleViewUserAccount={toggleViewUserAccount} /> : ''
      })}
      
      {user  ? <div className="post-comment-box">
        <div className="image">
          <img src="/images1/01.png" alt="" width="100%" height="100%"/>
        </div>
        <div className="input">
          <textarea id="post-comment-input" spellCheck={false}></textarea>
        </div>
        <div className="submit">
          <button onClick={
            () => {
              addComment()
            }
          }>
            <i className='ri-send-plane-2-fill'></i>
          </button>
        </div>
      </div> : ''}

      
    </div>
  )
}

export default PostComments
