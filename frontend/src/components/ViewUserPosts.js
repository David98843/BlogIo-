import React,{
  useState,
  useEffect
} from 'react'
import PostItemAccount from './PostItemAccount'
import { useDataLayerValue } from '../DataLayer'
import { serverUrl } from '../utils'

const ViewUserPosts = () => {
  const [{viewingUser}, dispatch] = useDataLayerValue()
  const [viewingUserPosts, setViewingUserPosts] = useState([])

  useEffect(() => {
    const fetchUserPosts = async() => {
      let res = await fetch(`${serverUrl}/userPosts?id=${viewingUser.id}`)
      let data = await res.json()
      if(data.message == 'success'){
          setViewingUserPosts([...data.posts])
      } 
    }
    fetchUserPosts()
  },[])


  return (
    <>
      {viewingUserPosts.length >= 1 ? viewingUserPosts.map((value, index) => {
        return(
          <PostItemAccount post = {value} key = {index}/>
        )
      }) : ''}
    </>
  )
}

export default ViewUserPosts
