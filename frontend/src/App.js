// import React, {useReducer, useContext, createContext} from "react";

// const initialState = {
//     count : 0,
//     name : null
// };

// const reducer = (state, action) => {
//     switch(action.type){
//         case "increment" :
//             return {...state, 
//                 count: state.count ++
//             }
//         case "decrement" : 
//             return {...state,
//                 count: state.count --
//             }
//         case "changeName":
//             return {...state,
//                 name: action.value
//             }
//         default:
//             throw new Error()
//     }
// }

// const themes = {
//     light:{
//         color : "black",
//         background: "whitesmoke"
//     },
//     dark : {
//         color : "whitesmoke",
//         background: "black"
//     }
// }

// const ThemeContext = createContext(themes.light)

// const App = () => {

//     const[state, dispatch] = useReducer(reducer, initialState)

//     return(
//         <ThemeContext.Provider value={themes.dark}>
//             <>
//                 <h1>{state.name}</h1>
//                 <p>Count : {state.count}</p>

//                 <button onClick={() => {
//                     dispatch({type : "increment"})
//                 }}>+</button>

//                 <button onClick={() => {
//                     dispatch({type : "decrement"})
//                 }}>-</button><br/>

//                 <input type="text" onChange={ (e) => {
//                         dispatch({type: "changeName", value : e.target.value})
//                     }
//                 } />
//             </>
//             <AllNotes/>
//         </ThemeContext.Provider>
//     )
// }

// const AllNotes = () => {
//     return (
//         <div>
//             <Note/>
//             <Note/>
//             <Note/>
//         </div>
//     )
// }

// const Note = () => {
//     const theme = useContext(ThemeContext)
//     return (
//         <div style={{background: theme.background
//         ,color : theme.color, padding :'20px', margin : "10px"}}>
//             <p>Hello World</p>
//         </div>
//     )
// }


// export default App;

import Header from "./components/Header"
import PostListing from "./components/PostListing"
import PostSingle from "./components/PostSingle"
import RecommendedListing from "./components/RecommendedListing"
import Account from "./components/Account"
import AuthenticateUser from "./components/AuthenticateUser"
import AddPost from "./components/AddPost"
import ViewUserAccount from "./components/ViewUserAccount"
import AddPostMobile from "./components/AddPostMobile"
import { useDataLayerValue } from "./DataLayer"
import { serverUrl } from "./utils"
import './App.css'
import './icons.css'
import React,{
    useEffect,
    useState,
} from 'react'
import { Loading } from "./components/Loading"

const App = () => {

    const [{user, userInfo, posts, currentPost, viewingUser, userPosts, showAddPost, displayUserAccount}, dispatch] = useDataLayerValue()

    console.log(serverUrl)

    const getUser = () => {
        let user = window.localStorage.getItem('user')
        if(user){
            return user
        }else{
            return null
        }
    }

    const fetchUserInfo = async (id) => {
        let res = await fetch(`${serverUrl}/userInfo?id=${id}`)
        let data = await res.json()
        if(data.message === 'success'){
            return data.user
        }
    }


    const fetchPosts = async () => {
        const res = await fetch(`${serverUrl}/allPost`)
        const data = await res.json()
        return data.allPost
    }

    const fetchUserPosts = async (id) => {
        let res = await fetch(`${serverUrl}/userPosts?id=${id}`)
        let data = await res.json()
        return data
      }

      const setUser = async() => {
        let userData = getUser()
        if(userData){
            let userInfoData = await fetchUserInfo(userData)
            dispatch({
                type: 'SET_USER_INFO',
                userInfo: userInfoData
            })
            dispatch({
                type: 'SET_USER',
                user: userData
            })
        }
    }

    useEffect(() => {
        const setPosts = async() => {
            let data = await fetchPosts()
            dispatch({
                type: 'SET_POST',
                posts: data
            })
            dispatch({
                type: 'SET_USER_POSTS',
                posts: posts.filter(value => value.author === user)
            })
            let isDesktop = window.innerWidth > 900
            if(isDesktop){
                dispatch({
                    type: 'SET_CURRENT_POST',
                    post:  isDesktop ? data[0] : null
                })        
            }

        }

        const setUSER = async () => {
            await setUser()
        }

        setUSER()
        setPosts()
    },[])



    const toggleDisplayAccount = async () => {
        await setUser()
        let account = document.getElementById('account')
        account.classList.toggle('displayAccount')
        dispatch({
            type: 'SET_USER_POSTS',
            posts: posts.filter(value => value.author === user)
        })
        document.body.classList.add('no-overflow')
    }
    
    const toggleViewUserAccount = (user) => {
        if(viewingUser){
            dispatch({
                type: 'SET_VIEWING_USER',
                user: null
            })
        }else{
            dispatch({
                type: 'SET_VIEWING_USER',
                user,
            })
        }
    }

    return(
        <>
            <Loading/>
            <Header toggleDisplayAccount = {toggleDisplayAccount} setUser = {setUser} />
            {viewingUser ? <ViewUserAccount toggleViewUserAccount = {toggleViewUserAccount} /> : ''}
            <PostListing/>
            {showAddPost ? <AddPostMobile/> : ''}
            {currentPost ? <PostSingle toggleViewUserAccount = {toggleViewUserAccount} /> : ''}
            {showAddPost ? <AddPost/> : ''}
            {userInfo ? <Account toggleDisplayAccount={toggleDisplayAccount} />  : <AuthenticateUser fetchUserPosts={fetchUserPosts} toggleDisplayAccount={toggleDisplayAccount} />}
        </>
    )
}

export default App