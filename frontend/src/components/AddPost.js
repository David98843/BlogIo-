import React from 'react'
import {useState} from 'react'
import { useDataLayerValue } from '../DataLayer'
import { dateCreated, time, selectElement, setEditable, removeEditable, serverUrl } from '../utils'

const AddPost = () => {
  const [{user, posts, editPost, userPosts, showAddPost}, dispatch] = useDataLayerValue()
  const [imageErr, setImageErr] = useState(false) 

  const displayCurrentHTML = () => {
    let displayArea = document.getElementById('display-area')
    displayArea.innerHTML = ''
    displayArea.innerHTML += editPost.contentHTML
  }

  setTimeout(() => {
    if(editPost && showAddPost)
      displayCurrentHTML()    
      enableFunctions()
  }, 1000)

  let selected = null

  function selectElement (id){
    if(selected){
      document.getElementById(selected).classList.remove('selected')
      document.getElementById(id).classList.add('selected')
      selected = id
    }else{
      selected = id
      document.getElementById(selected).classList.add('selected')
    }
  }

  function enableFunctions(){
    let all_elem = document.getElementById('display-area').children
    for(let elem of all_elem){
      if(elem.id){
        
        elem.ondblclick = e => {
          setEditable(e)
        }

        elem.onpaste = e => {     
          e.preventDefault()     
          let pasteText = e.clipboardData.getData('text')
          elem.innerText += pasteText
        }

        elem.onblur =  e => {
          removeEditable(e)
        }
        
        elem.onclick = e => {
          selectElement(e.target.id, selected) 
        }

      }
    }
  }


  document.onkeyup = e => {
    if(e.key === 'x' && e.ctrlKey){
      let parent = document.getElementById('display-area')
      let selectedElem = document.getElementById(selected)
      parent.removeChild(selectedElem)
      selected = null
    }
  }

  function editText(type){
    let typesMap = {
      'u': 'underlined', 
      'b': 'bold',
      'a' : 'link',
      'i' : 'italics',
      'sup' : 'sup',
      'sub' : 'sub'
    } 
    let elemClass = typesMap[type]
    let newElem = document.createElement('span')
    newElem.setAttribute('contenteditable', false)

    let space_Elem = document.createElement('span')
    space_Elem.innerHTML = '&nbsp;'
    space_Elem.setAttribute('contenteditable', false)
    
    newElem.classList.add(elemClass)
    let selection = document.getSelection()
    let sel_range = selection.getRangeAt(0)
    let text_block = selection.focusNode.parentElement
    if(text_block.classList.contains('display-area') || text_block.classList.contains('text-block')){
      newElem.innerText = sel_range.toString()
      sel_range.deleteContents()
      sel_range.insertNode(space_Elem)
      sel_range.insertNode(newElem)

      let newRange = new Range()
      newRange.setStartAfter(space_Elem)
    }else{
      
    }
  }

  function addBlock(){
    let randNum = Math.random() * .4023

    let block_type = document.getElementById('elem-type').value
    let newElem = document.createElement('div')
    newElem.setAttribute('id', randNum)
    newElem.innerText = 'Type Something Here'
    newElem.setAttribute('spellcheck', 'false')
    newElem.classList.add('text-block')

    if(block_type === 'p'){

    }else{
      newElem.classList.add('header-block')
    }

    document.getElementById('display-area').appendChild(newElem)
    enableFunctions()
  }

  function setContent(){
    let all_span = document.getElementsByTagName('span')
    for(let span of all_span){
      span.setAttribute('contenteditable', 'false')
    }
    if(selected){
      document.getElementById(selected).classList.remove('selected')
      selected = null
    }
    
    let all_text = document.getElementsByClassName('text-block')
    let text_list = []

    for(let text of all_text){
      let block_props = {}
      block_props[`text`] = text.innerHTML
      block_props['Block Type'] = text.classList.length === 1 ? 'p' : 'h3'
      text_list.push(block_props)
      block_props['class'] = String(text.classList)
    }

    let content = ' ';
    let content_text = ' ';
    let content_html = [];
    for(let block of text_list){
      content += `<${block['Block Type']}>${block['text']}</${block['Block Type']}>`
      content_text += `${block['text']}`
    }

    let displayArea = document.getElementById('display-area')
    for(let child of displayArea.children){
      let randID = Math.random(0,4)
      content_html += `<div class = '${String(child.classList)}' id = '${randID}'>${child.innerHTML}</div>`
    }

    return {
      content, 
      content_html,
      content_text
    }

  }

  async function submit(){

    let {content, content_html, content_text} = setContent()
    let title = document.getElementById('title').innerText
    
    encodeURIComponent(title)
    content = encodeURIComponent(content)
    content_text = encodeURIComponent(content_text)
    content_html = encodeURIComponent(content_html)

    if(!title  || content_text.length < 2 ){
      alert('No way')
    }else{

      if(editPost){
        let res = await fetch(`${serverUrl}/editPost?title=${title}&content=${content}&contentText=${content_text}&contentHTML=${content_html}&dateCreated=${dateCreated}&time=${time}&postID=${editPost._id}&user=${user}`)
        let data = await res.json()

        if(data.message === 'success'){
          dispatch({
            type: 'TOGGLE_ADD_POST',
            currentValue: true
          })
          dispatch({
            type: 'SET_EDIT_POST',
            post: null
          })
          let updatedPost = data.post
          let newPosts = posts.map(post => {
            return post._id === editPost._id ? updatedPost : post
          })
          let newUserPosts = userPosts.map(post => {
            return post._id === editPost._id ? updatedPost : post
          })
          dispatch({
            type : 'SET_POST',
            posts : [...newPosts]
          })
          dispatch({
            type: 'SET_USER_POSTS',
            posts: [...newUserPosts]
          })
        }else{
          alert('Server Error')
        }


      }else{
        let res = await fetch(`${serverUrl}/addPost?title=${title}&content=${content}&contentText=${content_text}&contentHTML=${content_html}&dateCreated=${dateCreated}&time=${time}&user=${user}`)
        let data = await res.json()

        if(data.message === 'success'){
          alert('Post Created')
          dispatch({
            type: 'SET_POST',
            posts: [...posts, data.post]
          })
          dispatch({
            type: 'SET_USER_POSTS',
            posts: [...userPosts, data.post]
          })
        }else{
          alert('Server Error')
        }
      }
    }
  }

  return (
    <div className='post-editor' >

      <div className="controls-area">

        <div className="controls">
          <div className="cancel-add-post" onClick={
            () => {
              dispatch({
                type: 'TOGGLE_ADD_POST',
                currentValue: true
              })
              dispatch({
                type: 'SET_EDIT_POST',
                post: null
              })
            }
          }>
            <i className="ri-arrow-go-back-fill"></i>
          </div>

          <label>Post Title</label>
          <div className="post-title" contentEditable={true} id = 'title' placeholder='Post Title'>
            {editPost ? editPost.title : ''}
          </div>

          <label htmlFor="elem-type">Element Type</label>

          <select name="type" id="elem-type">
            <option value="h3">Sub Header</option>
            <option value="p">Paragraph</option>
          </select>

          {/* <div className="text-block" draggable={true} id="text-block"
            onDragStart = {e => {
              e.dataTransfer.setData('element','text-block')
              console.log(e)
            }}
          ></div> */}

          <div className="add-block">
            <button onClick={() => {
              addBlock()
            }}>Add Block</button>
          </div>

          <div className="text-style-controls">
            <button className="control control-i" onClick={() => {
              editText('i')
            }}>
              I
            </button>
            <button className="control control-u" onClick = {
              () => {
                editText('u')
              }
            }>
              U
            </button>
            <button className="control control-b" 
              onClick={() => {
              editText('b')
            }}>
              B
            </button>
            <button className="control control-sup" onClick={() => {
              editText('sup')
            }}>
              T<sup>2</sup>
            </button>
            <button className="control control-sub" onClick={() => {
              editText('sub')
            }}>
              T<sub>2</sub>
            </button>
          </div>

          <div className="post-image">
            <label htmlFor="post-image">Post Image</label>
            <input type="file" name='post-image' id='post-image' form ='post-form' 
            onInput={e => {
              if(!e.target.files[0].type.startsWith('image')){
                alert('Please selected a valid image!')
                setImageErr(true)
              }else{
                setImageErr(false)
              }
            }}           
            />
          </div>

          <img id = 'preview-image'/>
          
          <div className="submit-btn">
            <button onClick={
            () => {
              submit()
            }
          }>{editPost ? 'Edit Post' : 'Add Post'}</button>
          </div>
        </div>

      </div>
      
      <div className="display-area" id='display-area' dropzone = {'copy'}

        onDragOver={e => {
          e.preventDefault()
        }}

        onDragEnter={e => {
          e.preventDefault()
        }}

        // onDrop = {
        //    (e) => {
        //     // e.preventDefault()

        //     // for(const item of e.dataTransfer.items){
        //     //   if(item.kind === 'file'){
        //     //     const entry = await item.getAsFileSystemHandle();
        //     //     console.log(entry) 
        //     //   }
        //     // }


        //     let randNum = Math.random() * .4023
        //     let elem_type = e.dataTransfer.getData('element')
        //     if(elem_type === 'text-block'){

        //       let block_type = document.getElementById('elem-type').value
        //       let newElem = document.createElement('div')
        //       newElem.setAttribute('id', randNum)
        //       newElem.innerText = 'Type Something Here'
        //       newElem.setAttribute('spellcheck', 'false')
        //       newElem.classList.add('text-block')

        //       if(block_type === 'p'){

        //       }else{
        //         newElem.classList.add('header-block')
        //       }

        //       e.target.appendChild(newElem)
        //       enableFunctions()
        //     }

        //   }
        // }
      >
      </div>
      
    </div>
  )
}
export default AddPost
