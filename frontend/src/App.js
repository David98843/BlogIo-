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
import './App.css'
import './icons.css'
import React,{
    useEffect,
    useState,
} from 'react'

const App = () => {

    const [{user, posts, currentPost, viewingUser, userPosts, showAddPost}, dispatch] = useDataLayerValue()

    const fetchUser = async () => {
        const res = await fetch('http://localhost:5000/verifyLogin')
        const data = await res.json()
        return data
    }

    const fetchPosts = async () => {
        const res = await fetch('http://localhost:5000/allPost')
        const data = await res.json()
        return data.allPost
    }

    const fetchUserPosts = async (id) => {
        let res = await fetch(`http://localhost:5000/userPosts?id=${id}`)
        let data = await res.json()
        return data
      }

      const setUser = async() => {
        let data = await fetchUser()
        if(data.user){
            dispatch({
                type: 'SET_USER',
                user: data.user
            })

            let userPostsData = await fetchUserPosts(data.user._id)
            if(userPostsData.posts){
                dispatch({
                    type: 'SET_USER_POSTS',
                    posts: userPostsData.posts
                })
            }
        }
    }

    useEffect(() => {

        const setPosts = async() => {
            let data = await fetchPosts()
            dispatch({
                type: 'SET_POST',
                posts: data
            })
        }


        setUser()
        setPosts()
    },[])


    console.log(posts)

    const toggleDisplayAccount = () => {
        let account = document.getElementById('account')
        account.classList.toggle('displayAccount')
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
            <Header toggleDisplayAccount = {toggleDisplayAccount} setUser = {setUser} />
            {viewingUser ? <ViewUserAccount toggleViewUserAccount = {toggleViewUserAccount} /> : ''}
            <PostListing/>
            {showAddPost ? <AddPostMobile/> : ''}
            {currentPost ? <PostSingle toggleViewUserAccount = {toggleViewUserAccount} /> : ''}
            {showAddPost ? <AddPost/> : ''}
            {user ? <Account toggleDisplayAccount={toggleDisplayAccount} /> : <AuthenticateUser fetchUserPosts={fetchUserPosts} />}
        </>
    )
}

export default App