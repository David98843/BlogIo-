import React from 'react'
import { useDataLayerValue } from '../DataLayer'
import PostItemAccount from './PostItemAccount'

const UserPosts = ({toggleDisplayAccount}) => {
    const [{userPosts}, dispatch] = useDataLayerValue()
  return (
    <div>
        {userPosts.map((post, id) => {
            return(
                <PostItemAccount toggleDisplayAccount = {toggleDisplayAccount} post = {post} key = {id} editable = {true} id = {id} />
            )
        })}
          
    </div>
  )
}

export default UserPosts
