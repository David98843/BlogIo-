import { useDataLayerValue } from "../DataLayer"
import {useState, useEffect} from 'react'

const PostSingleContent = () => {

    const [{currentPost}, dispatch] = useDataLayerValue()

    useEffect(() => {
        const setContent = () => {
            let postContentContainer = document.getElementById('post-content')
            postContentContainer.innerHTML = currentPost.content
        }
        setContent()
    },[currentPost])

    return(
        <div className="content" id = 'post-content'></div>
    )
}

export default PostSingleContent