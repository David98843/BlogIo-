import React,{useEffect, useState} from 'react'
import { useDataLayerValue } from '../DataLayer'
import UserPosts from './UserPosts'

const Account = ({toggleDisplayAccount}) => {
    const [{user, userInfo, userPosts, showAddPost, posts}, dispatch] = useDataLayerValue()
    const [displayUserPost, setDisplayUserPost] = useState(false)
     
    const editName = () => {
        let name_input = document.querySelector('h2.bio-name')
        let isEditable = name_input.isContentEditable

        name_input.onblur = async (e) => {
            name_input.setAttribute('contenteditable', false)
            let newName = e.target.innerText.trim()

            if(newName.length === 0 || typeof newName === undefined){
                name_input.innerText = userInfo.name
            }else{
                let newUser = {...userInfo, name : newName}
                await fetch(`https://blog-io.vercel.app/edit?field=name&value=${encodeURI(newName)}&user=${user}`)

                dispatch({
                    type: 'SET_USER_INFO',
                    userInfo: newUser
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
            let newUser = {...userInfo, bio: newBio}
            await fetch(`https://blog-io.vercel.app/edit?field=bio&value=${encodeURI(newBio)}&user=${user}`)


            dispatch({
                type: 'SET_USER_INFO',
                userInfo: newUser
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
                <h2 spellCheck={false} contentEditable={false} className='bio-name'>{userInfo.name}</h2>
                <i className='ri-edit-2-fill' onClick={() => editName()}></i>
            </div>
            <div className="bio-text"><span className='bio-text-info'>{typeof userInfo.bio === 'undefined' || userInfo.bio.length === 0 ? "Add Bio" : ''}</span>
                <h4 spellCheck={false} contentEditable={false} id='bio-text'>{userInfo.bio}</h4>
                <i className='ri-edit-2-fill' onClick={() => editBio()}></i>
            </div>
        </div>

        <div className="stats">
            <div className="stat"  onClick={
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
                    <i className='ri-text-wrap'></i>
                </div>
                <div className="stat-text">
                    <h3>{posts.filter(value => value.author === user).length} Posts</h3>
                </div>
            </div>

            <div className="stat" onClick={() => {
                const followFunction = async () => {
                        
                    let newUser = {
                        ...userInfo,
                    }
                    if(userInfo.followers.includes(user)){
                        let newFollowers = userInfo.followers.filter((value) => {
                            return String(value) === String(user) ? '' : value
                        })
                        newUser.followers = newFollowers
                    }else{
                        newUser.followers.push(user)
                    }
                    dispatch({
                        type: 'SET_USER_INFO',
                        userInfo: newUser
                    })

                    let res = await fetch(`https://blog-io.vercel.app/follow?followed=${user}&followed_by=${user}`)
                    }
                    followFunction()
                }
            }>
                <div className="stat-icon">
                    <i className={`${userInfo.followers.includes(String(user)) ? 'ri-user-follow-fill' : 'ri-user-fill'}`}></i>
                </div>
                <div className="stat-text">
                    <h3>{userInfo.followers.length} Followers</h3>
                </div>
            </div>

            <div className="stat">
            
                <div className="stat-icon">
                    <i className='ri-thumb-up-fill'></i>
                </div>
                <div className="stat-text">
                    <h3>{userInfo.following} Following</h3>
                </div>
            </div>
        </div>

        <UserPosts toggleDisplayAccount ={toggleDisplayAccount}/>
    </div>
  )
}

export default Account
