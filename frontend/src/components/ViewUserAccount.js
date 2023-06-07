import React, {
    useEffect,
    useState
} from 'react'
import { useDataLayerValue } from '../DataLayer'
import ViewUserPosts from './ViewUserPosts'

const ViewUserAccount = () => {
    const [displayAccountPosts, setDisplayAccountPosts] = useState(false)
    const [{user,viewingUser}, dispatch] = useDataLayerValue()
    const [numPosts, setNumPosts] = useState()
    
    const fetchUserPosts = async () => {
      let res = await fetch(`http://localhost:5000/userPosts?id=${viewingUser.id}`)
      let data = await res.json()
      return data
    }

    useEffect(() => {
        const setPostNumber = async () => {
            let data = await fetchUserPosts()
            setNumPosts(data.posts.length)
        }
        setPostNumber()
    })

  return (
    user ?
    <div className='account displayAccount view-user' id ='view-user'>
        <div className="go-back" onClick={
          () => {
                let view_user = document.getElementById('view-user')
                view_user.classList.remove('displayAccount')
                dispatch({
                    type: 'SET_VIEWING_USER',
                    post: null
                })
            }
        }>
          <i className='ri-arrow-go-back-fill'></i>
        </div>
        <div className="image">
            <img src="/images1/01.png" alt="user image" width={'100%'} height= {'100%'}/>
        </div>

        <div className="bio">
            <div className="name" >
                <h2 className='bio-name'>{viewingUser.name}</h2>
            </div>
            <div className="bio-text">
                <h4>{viewingUser.bio}</h4>
            </div>
        </div>

        <div className="stats">
            <div className="stat" onClick={() => {
                setDisplayAccountPosts(!displayAccountPosts)
            }}>
                <div className="stat-icon">
                    <i className='ri-text-wrap'></i>
                </div>
                <div className="stat-text">
                    <h3>{numPosts} Posts</h3>
                </div>
            </div>

            <div className="stat" onClick = {
                async() => {
                    const followFunction = async () => {
                        
                        let newViewingUser = {
                            ...viewingUser,
                        }
                        if(viewingUser.followers.includes(user)){
                            let newFollowers = viewingUser.followers.filter((value) => {
                                return String(value) === String(user) ? '' : value
                            })
                            newViewingUser.followers = newFollowers
                        }else{
                            newViewingUser.followers.push(user)
                        }
                        dispatch({
                            type: 'SET_VIEWING_USER',
                            user: newViewingUser
                        })

                        let res = await fetch(`http://localhost:5000/follow?followed=${viewingUser.id}&followed_by=${user}`)
                        let data = await res.json()
                        if(data.message === 'success'){
                        }else{}
                    }
                    await followFunction()
                    }
                    
            }>
                {/* 'ri-user-3-fill' */}
                <div className="stat-icon">
                    <i className = {`${viewingUser.followers.includes(String(user)) ? 'ri-user-follow-fill' : 'ri-user-fill'}`} ></i>
                </div>
                <div className="stat-text">
                    <h3>{viewingUser.followers.length} Followers</h3>
                </div>
            </div>

            <div className="stat">
                <div className="stat-icon">
                    <i className='ri-thumb-up-fill'></i>
                </div>
                <div className="stat-text">
                    <h3>{viewingUser.following} Following</h3>
                </div>
            </div>
        </div>

        <ViewUserPosts />

    </div>: ''
  ) 
}

export default ViewUserAccount
