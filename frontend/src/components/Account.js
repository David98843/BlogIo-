import React,{useState} from 'react'
import { useDataLayerValue } from '../DataLayer'
import UserPosts from './UserPosts'

const Account = ({toggleDisplayAccount}) => {
    const [{user, userPosts, showAddPost}, dispatch] = useDataLayerValue()
    const [displayUserPost, setDisplayUserPost] = useState(false)
     
    const editName = () => {
        let name_input = document.querySelector('h2.bio-name')
        let isEditable = name_input.isContentEditable

        name_input.onblur = async (e) => {
            name_input.setAttribute('contenteditable', false)
            let newName = e.target.innerText.trim()

            if(newName.length === 0 || typeof newName === undefined){
                name_input.innerText = user.name
            }else{
                let newUser = {...user, name : newName}
                await fetch(`http://localhost:5000/edit?field=name&value=${encodeURI(newName)}`)

                dispatch({
                    type: 'SET_USER',
                    user: newUser
                })
            }
            
        }

        name_input.oncopy = e => {
            navigator.clipboard.writeText(e.target.innerText)
        }

        if(!isEditable){
            name_input.setAttribute('contenteditable', true)
            let end = name_input.innerText.length
            name_input.focus()
        }
    }

    const editBio = () => {
        let bio_input = document.querySelector('h4#bio-text')
        let isEditable = bio_input.isContentEditable

        let bio_info = document.querySelector('span.bio-text-info')

        bio_input.onblur = async (e) => {
            let info_value = e.target.innerText.length === 0 ? "Add Bio:" : ''
            bio_info.innerText = info_value

            bio_input.setAttribute('contenteditable', false)
            let newBio = e.target.innerText.trim()
            let newUser = {...user, bio: newBio}
            await fetch(`http://localhost:5000/edit?field=bio&value=${encodeURI(newBio)}`)


            dispatch({
                type: 'SET_USER',
                user: newUser
            })
        }

        bio_input.oncopy = e => {
            navigator.clipboard.writeText(e.target.innerText)
        }


        if(!isEditable){
            bio_input.setAttribute('contenteditable', true)
            bio_info.innerHTML = ''
            bio_input.focus()
        }
    }
    
  return (
    <div className={`account`} id='account'>
        <div className="go-back" onClick={
          () => {
                let account = document.getElementById('account')
                account.classList.remove('displayAccount')
                document.body.classList.remove("no-overflow")
            }
        }>
          <i className='ri-arrow-go-back-fill'></i>
        </div>

        <div className="image">
            <img src="/images1/01.png" alt="user image" width={'100%'} height= {'100%'}/>
        </div>
        
        <div className="bio">
            <div className="name" >
                <h2 spellCheck={false} contentEditable={false} className='bio-name'>{user.name}</h2>
                <i className='ri-edit-2-fill' onClick={() => editName()}></i>
            </div>
            <div className="bio-text"><span className='bio-text-info'>{typeof user.bio === 'undefined' || user.bio.length === 0 ? "Add Bio" : ''}</span>
                <h4 spellCheck={false} contentEditable={false} id='bio-text'>{user.bio}</h4>
                <i className='ri-edit-2-fill' onClick={() => editBio()}></i>
            </div>
        </div>

        <div className="stats">
            <div className="stat" onClick = {
                () => {
                    setDisplayUserPost(!displayUserPost)
                }
            }>
                <div className="stat-icon">
                    <i className='ri-text-wrap'></i>
                </div>
                <div className="stat-text">
                    <h3>{userPosts.length} Posts</h3>
                </div>
            </div>

            <div className="stat" onClick={() => {
                const followFunction = async () => {
                        
                    let newUser = {
                        ...user,
                    }
                    if(user.followers.includes(user._id)){
                        let newFollowers = user.followers.filter((value) => {
                            return String(value) === String(user._id) ? '' : value
                        })
                        newUser.followers = newFollowers
                    }else{
                        newUser.followers.push(user._id)
                    }
                    dispatch({
                        type: 'SET_USER',
                        user: newUser
                    })

                    let res = await fetch(`http://localhost:5000/follow?followed=${user._id}&followed_by=${user._id}`)
                    let data = await res.json()
                                          
                    }
                    followFunction()
                }
            }>
                <div className="stat-icon">
                    <i className={`${user.followers.includes(String(user._id)) ? 'ri-user-follow-fill' : 'ri-user-fill'}`}></i>
                </div>
                <div className="stat-text">
                    <h3>{user.followers.length} Followers</h3>
                </div>
            </div>

            <div className="stat" onClick={
                () => {
                    dispatch({
                        type: 'TOGGLE_ADD_POST',
                        currentValue: showAddPost
                    })
                    toggleDisplayAccount()
                    document.body.classList.add('no-overflow')
                }
            }>
            
                <div className="stat-icon">
                    <i className='ri-thumb-up-fill'></i>
                </div>
                <div className="stat-text">
                    <h3>{user.following} Following</h3>
                </div>
            </div>
        </div>

        <UserPosts toggleDisplayAccount ={toggleDisplayAccount}/>

    </div>
  )
}

export default Account
