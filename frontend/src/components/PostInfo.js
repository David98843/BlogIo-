import { useDataLayerValue } from "../DataLayer"
import {useState, useEffect} from 'react'
import { truncateStr } from '../utils'

const PostInfo = ({toggleViewUserAccount}) => {
    const [{currentPost}, dispatch] = useDataLayerValue()
    const [author, setAuthor] = useState()
    const [authorChange, setAuthorChange] = useState(false)

    const fetchuserInfo = async (id) => {
        let res = await fetch(`https://blog-io.vercel.app/userInfo?id=${encodeURIComponent(id)}`);
        let data = await res.json();
        if(data.message = 'success'){
            return data.user
        }else{
            return null
        }
    }

    useEffect(() => {
        const setAuthorInfo = async () => {
            let authorNameDisplay = document.getElementById('author-name-display')
            let authorBioDisplay = document.getElementById('author-bio-display')
            
            let authorInfo = await fetchuserInfo(currentPost.author)
            setAuthor(authorInfo)

            authorNameDisplay.innerHTML = truncateStr(authorInfo.name, 10)
            authorBioDisplay.innerHTML = truncateStr(authorInfo.bio, 20)
        }
        setAuthorInfo()
    },[currentPost, authorChange])


    return (
        <>
            <div className="title">
                <h3>{currentPost.title}</h3>
            </div>

            <div className="info">
                <div className="author">
                    <div className="image" onClick={
                        () => {
                            toggleViewUserAccount(author)
                            setAuthorChange(!authorChange)
                        }
                    }>
                        <img src="/images1/01.jpg" alt="author-image" width={'100%'} height={'100%'}/>
                    </div>
                    <div className="name">
                        <h3 id ='author-name-display'></h3>
                        <h5 id ='author-bio-display'></h5>
                    </div>
                </div>

                <div className="date-time">
                    <h4>
                        <i className="ri-calendar-line"></i>
                        {currentPost.dateCreated}</h4>
                    <h4>
                        <i className="ri-timer-line"></i>
                        {currentPost.time}
                    </h4>
                </div>
            </div>
        </>
    )
}

export default PostInfo
