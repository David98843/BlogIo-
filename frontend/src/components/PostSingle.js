import { useDataLayerValue } from '../DataLayer'
import PostSingleContent from './PostSingleContent'
import PostInfo from './PostInfo'
import PostComments from './PostComments'
import {useState} from "react"

const PostSingle = ({toggleViewUserAccount}) => {

    const [{currentPost, displayComments}, dispatch] = useDataLayerValue()

    function showReadPercent(e){
      let readIndicator = document.querySelector('div.read-percent')
      let scrollTop = e.target.scrollTop
      let readPercent
      if(scrollTop == 0){
        readPercent = (e.target.scrollTop) / e.target.scrollHeight * 100        
      }else{
        readPercent = (e.target.scrollTop + e.target.clientHeight) / e.target.scrollHeight * 100        
      }
      readIndicator.style.width = `${readPercent}%`
    }
    
  return (
    <div className='post-body' id='post-body' onScroll={
      (e) => {
        showReadPercent(e)
      }
    }
    >
        <div className="read-percent"></div>
        <div className="go-back" onClick={
          () => {
            dispatch({
              type: 'SET_CURRENT_POST',
              post: null
            })
            let body = document.getElementsByTagName('body')[0]
            body.classList.remove('no-overflow')
            let window_location = document.location.hash
            document.location.hash = ''
            let prev_location = document.getElementById(decodeURIComponent(window_location))
            prev_location.scrollIntoView(true)
          }
        }>
          <i className='ri-arrow-go-back-fill'></i>
        </div>
        <PostInfo toggleViewUserAccount={toggleViewUserAccount}/>
        {currentPost.content ? <PostSingleContent/> : ''} 

        <h3 className='comment-displayer-text' onClick={() => {
          dispatch({
            type: 'TOGGLE_DISPLAY_COMMENT',
            currentValue: displayComments
          })
          let displayCommentIcon = document.getElementById('display-comment-icon')
          displayCommentIcon.classList.toggle('la-angle-up')
        }}>Comments 
        <i className='las la-angle-down' id='display-comment-icon'></i>
        </h3>

        {displayComments ? <PostComments toggleViewUserAccount={toggleViewUserAccount} /> : ''}
      
    </div>
  )
}

export default PostSingle
