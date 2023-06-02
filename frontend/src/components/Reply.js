import React, {useState, useEffect} from 'react'

const Reply = ({reply}) => {

const [replyState, setReplyState] = useState()
    
const fetchReply = async() => {
    let res = await fetch(`http://localhost:5000/getReply?id=${reply}`)
    let data = await res.json()
    return data
}

const setReply = async () => {
    let data = await fetchReply()
    setReplyState(data.reply)
}

useEffect(() => {
    setReply()
},[])

  return (
    replyState ? 
    <div className='reply'>
        <h4>{replyState.text}</h4>
        <p>{replyState.date} || {replyState.time}</p>
    </div> : 'Reply'
  )
}

export default Reply
