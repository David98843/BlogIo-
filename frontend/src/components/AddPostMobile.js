import {dateCreated, removeEditable, setEditable, time} from './../utils'
import { useDataLayerValue } from '../DataLayer'

const AddPostMobile = () => {
    let selected = null
    const [{user, posts, userPosts, editPost, showAddPost}, dispatch] = useDataLayerValue()

    const displayCurrentMobileHTML = () => {
        let displayArea = document.getElementById('mobile-text-area')
        displayArea.innerHTML = ''
        displayArea.innerHTML += editPost.contentHTML
        enableMobileFunctions()
    }

    document.body.classList.add('no-overflow')

    setTimeout(() => {
        if(editPost && showAddPost && window.innerWidth <= 900)
          displayCurrentMobileHTML()    
    }, 1000)

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

    function deleteSelected(){
        let textArea = document.getElementById('mobile-text-area')
        let selectedElement = document.getElementById(selected)
        textArea.removeChild(selectedElement)
        selected = null
    }

    function enableMobileFunctions(){
        let displayArea = document.getElementById('mobile-text-area').children
        for(let blockChild of displayArea){
            blockChild.onclick = e => {
                setEditable(e)
                selectElement(e.target.id, selected)
            } 
            blockChild.onblur = e => {
                removeEditable(e)
            }
        }
    }

    function addBlock(block_type){
        let randNum = Math.random() * .4023
    
        let newElem = document.createElement('div')
        newElem.setAttribute('id', randNum)
        newElem.innerText = 'Type Something Here'
        newElem.setAttribute('spellcheck', 'false')
        newElem.classList.add('text-block')
    
        if(block_type === 'p'){
    
        }else{
          newElem.classList.add('header-block')
        }
    
        document.getElementById('mobile-text-area').appendChild(newElem)
        enableMobileFunctions()
      }

    function editText(type){
        let typesMap = {
        'u': 'underlined', 
        'b': 'bold',
        'a' : 'link',
        'i' : 'italics',
        'sup' : 'sup',
        'sub' : 'sub',
        } 
        
        let newElem
        if(type === 'header'){
            newElem = document.createElement('div')
            newElem.classList.add('mobile-header-block')
        }
        else{

            let elemClass = typesMap[type]
            newElem = document.createElement('span')
            newElem.classList.add(elemClass)
        }


        let space_Elem = document.createElement('span')
        space_Elem.innerHTML = '&nbsp;'
        
        let selection = document.getSelection()
        let sel_range = selection.getRangeAt(0)
        let parentBlock = selection.focusNode.parentElement

        if(parentBlock.classList.contains('mobile-text-area') || parentBlock.classList.contains('text-block')){
        newElem.innerText = sel_range.toString()
        sel_range.deleteContents()
        sel_range.insertNode(space_Elem)
        sel_range.insertNode(newElem)

        let newRange = new Range()
        newRange.setStartAfter(space_Elem)
        }else{
        
        }
    }


  function setContent(){

    if(selected){
      document.getElementById(selected).classList.remove('selected')
      selected = null
    }
    
    let all_text = document.getElementById('mobile-text-area').children
    let text_list = []

    for(let text of all_text){
      let block_props = {}
      block_props[`text`] = text.innerHTML
      block_props['Block Type'] = text.classList.length === 1 ? 'p' : 'h3'
      text_list.push(block_props)
    }

    let content = ' ';
    let content_text = ' ';
    let content_html = [];
    for(let block of text_list){
      content += `<${block['Block Type']}>${block['text']}</${block['Block Type']}>`
      content_text += `${block['text']}`
    }

    let displayArea = document.getElementById('mobile-text-area')
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

    async function submitPost(){
        let title = document.getElementById('post-title').value;
        let {content, content_html, content_text} = setContent();

        content = encodeURIComponent(content);
        content_html = encodeURIComponent(content_html);
        content_text = encodeURIComponent(content_text);

        if(!title || !content){
            alert('No way')
        }else{
            if(editPost){
                if(content_html.length > 2){
                    let res = await fetch(`https://blog-io.vercel.app/editPost?title=${title}&content=${content}&contentText=${content_text}&contentHTML=${content_html}&dateCreated=${dateCreated}&time=${time}&postID=${editPost._id}&user=${user}`)
                    let data = await res.json()
            
                    if(data.message === 'success'){
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
                      alert('Post Edited')
                    }else{
                      alert('Server Error')
                    }
                }

            }else{
                if(content_html.length > 2){
                    let res = await fetch(`https://blog-io.vercel.app/addPost?title=${title}&content=${content}&contentText=${content_text}&contentHTML=${content_html}&dateCreated=${dateCreated}&time=${time}&user=${user}`)
                    let data = await res.json()
                    if(data.message === 'success'){
                        dispatch({
                            type: 'SET_POST',
                            posts: [...posts, data.post]
                        })
                        dispatch({
                            type: 'SET_USER_POSTS',
                            posts: [...userPosts, data.post]
                        })
                      alert('Post Added')
                    }
                }
            }
        }

        dispatch({
            type: 'TOGGLE_ADD_POST',
            currentValue: showAddPost
        })
        dispatch({
            type: 'SET_EDIT_POST',
            post: null
        })
        document.body.classList.remove('no-overflow')
    }

    return(
        <div className="add-post-mobile" id="add-post-mobile">
            <div className="go-back" onClick={
                () => {
                    dispatch({
                        type: 'TOGGLE_ADD_POST',
                        currentValue: showAddPost
                    })
                    dispatch({
                        type: 'SET_EDIT_POST',
                        post: null
                    })
                    document.body.classList.remove('no-overflow')
                } 
            }>
                <i className="ri-arrow-go-back-fill"></i>
            </div>
            <div className="text-cont" id="text-cont">
                <div id="mobile-text-area" className="mobile-text-area" 
                // onPaste={
                //     (e) => {
                //         let pasteText = e.clipboardData.getData('text')
                //         e.clipboardData.setData('text', '')
                //         navigator.clipboard.read()
                //             .then(items => console.log(items))
                //     }
                // }
                >
                </div>
            </div>

            <div className="toggle-controls" onClick={
                () => {
                    let controlsCont = document.getElementById('controls-cont')
                    controlsCont.classList.toggle('show-controls-cont')
                    let textCont = document.getElementById('text-cont')
                    textCont.classList.toggle('all-text-cont')
                }
            }>
                <i className='ri-keyboard-box-fill'></i>
            </div>
            
            <div className="controls-cont" id="controls-cont">
                <div className="controls controls-1">
                    <button onClick={
                        () => {
                            addBlock('h')
                        }
                    } ><strong>H</strong></button>

                    <button onClick={
                        () => {
                            addBlock('p')
                        }
                    } >
                        <i className='ri-text-wrap'></i>
                    </button>

                    <button onClick={
                        () => {
                            editText('i')
                        }
                    }><em>I</em></button>

                    <button onClick={
                        () => {
                            editText('b')
                        }
                    }><strong>B</strong></button>

                    <button onClick={
                        () => {
                            editText('u')
                        }
                    } className = 'underlined'>U</button>

                    <button onClick={
                        () => {
                            editText('sup')
                        }
                    }><sup>2</sup></button>

                    <button onClick={
                        () => {
                            editText('sub')
                        }
                    }><sub>2</sub></button>

                    <button onClick={
                        () => {
                            deleteSelected()
                        }
                    }>
                        <i className='ri-delete-bin-4-line'></i>
                    </button>

                </div>
   
                <div className="controls controls-2">
                    <input type="text" id="post-title" placeholder='Post Title' defaultValue = {editPost ? editPost.title : ''} />
                </div>
                <div className="controls controls-2">
                    <input type="text" placeholder='Link URL'/>
                    <button>Add Link</button>
                </div>
                <div className="controls controls-3">
                    <label htmlFor="" id="post-image-name">Post Image</label>
                    <button onClick={
                        () => {
                            document.getElementById('post-image-input').click()
                        }
                    }>Choose Image</button>
                    <input type="file" id='post-image-input' onInput={
                        (e) => {
                            document.getElementById('post-image-name').innerText = e.target.files[0].name
                        }
                    }/>
                </div>
                <div className="controls controls-4">
                    <button onClick = {
                        () => {
                            submitPost()
                        }
                    }>{editPost ? 'Edit Post' : 'Add Post'}</button>
                </div>
                
            </div>
        </div>
    )
}

export default AddPostMobile
