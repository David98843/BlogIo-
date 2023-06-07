import React from 'react'
import { useDataLayerValue } from '../DataLayer'
import PostItemAccount from './PostItemAccount'

const UserPosts = ({toggleDisplayAccount}) => {
    const [{userPosts, user, posts}, dispatch] = useDataLayerValue()
  return (
    <div>
        {
        posts.filter(value => value.author === user).length === 0 ? 
        <div className='no-posts'>
          <h3>You have made no posts</h3>
        </div> 
        : userPosts.map((post, id) => {
            return(
                <PostItemAccount toggleDisplayAccount = {toggleDisplayAccount} post = {post} key = {id} editable = {true} id = {id} />
            )
        })}
          
    </div>
  )
}

export default UserPosts
