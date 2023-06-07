export const initialState = {
    user : null,
    userInfo: null,
    userPosts : [],
    viewingUser: null,
    posts: [],
    currentPost: null,
    currentPostComments: [],
    editPost: null,
    showAddPost: false,
    displayComments: false,
    displayUserAccount: false
}

const reducer = (state, action) => {
    switch(action.type){
        case 'SET_USER':
            return{
                ...state,
                user: action.user
            }
        case 'SET_USER_INFO':
            return{
                ...state,
                userInfo: action.userInfo
            }
        case 'SET_USER_POSTS':
            return{
                ...state,
                userPosts: action.posts
            }
        case 'SET_POST':
            return{
                ...state,
                posts: action.posts
            }
        case 'SET_CURRENT_POST':
            return{
                ...state,
                currentPost: action.post
            }
        case 'SET_EDIT_POST':
            return{
                ...state,
                editPost: action.post
            }
        case 'SET_VIEWING_USER':
            return{
                ...state,
                viewingUser: action.user
            }
        case 'TOGGLE_ADD_POST':
            return{
                ...state,
                showAddPost: !action.currentValue
            }
        case 'SET_COMMENTS':
            return {
                ...state,
                currentPostComments: action.comments
            }
        case 'TOGGLE_DISPLAY_COMMENT':
            return{
                ...state,
                displayComments: !action.currentValue
            }

        case 'TOGGLE_DISPLAY_USER':
            return{
                ...state,
                displayUserAccount: !action.currentValue
            }
        default:
            return state
    }
}

export default reducer
