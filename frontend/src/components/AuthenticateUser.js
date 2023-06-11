import {React, useState} from "react"
import {useDataLayerValue} from './../DataLayer'

const AuthenticateUser = ({fetchUserPosts, toggleDisplayAccount}) => {
    const [name_register, setName] = useState()
    const [email_register, setEmailRegister] = useState()
    const [password_register, setPasswordRegister] = useState()
    const [email_login, setEmailLogin] = useState()
    const [password_login, setPasswordLogin] = useState()
    const [{user}, dispatch] = useDataLayerValue()
    
    function displayLogin(){
        let login_tab = document.getElementById('login')
        let register_tab = document.getElementById('register')
        let login_btn =document.querySelector('a.btn-login')
        let register_btn =document.querySelector('a.btn-register')

        login_tab.classList.remove('remove')
        register_tab.classList.add('remove')

        login_btn.classList.add('displaying')
        register_btn.classList.remove('displaying')
    }

    function displayRegister(){
        let login_tab = document.getElementById('login')
        let register_tab = document.getElementById('register')
        let login_btn =document.querySelector('a.btn-login')
        let register_btn =document.querySelector('a.btn-register')
    
        login_tab.classList.add('remove')
        register_tab.classList.remove('remove')

        login_btn.classList.remove('displaying')
        register_btn.classList.add('displaying')
    }

    function showPwd(type){
        let pwd_input_id
        let pwd_icon_id

        if(type == 'pwd-1'){
            pwd_input_id = 'password-login'
            pwd_icon_id = 'pwd-login-icon'
        }else{
            pwd_input_id = 'password-register'
            pwd_icon_id = 'pwd-register-icon'
        }

        let pwd_input = document.querySelector(`input#${pwd_input_id}`)
        let pwd_icon = document.getElementById(pwd_icon_id)

        if(pwd_input.value.length == 0){

        }else{
            if(pwd_input.getAttribute('type') == 'password'){
                pwd_input.setAttribute('type', 'text')
                pwd_icon.classList.remove('ri-eye-line')
                pwd_icon.classList.add('ri-eye-close-line')
            }else{
                pwd_input.setAttribute('type', 'password')
                pwd_icon.classList.add('ri-eye-line')
                pwd_icon.classList.remove('ri-eye-close-line')
            }
        }
    }

    async function registerUser(){
        let error_cont = document.querySelector('p#error')
        error_cont.innerHTML = ''
        let errors = []

        if(!name_register || !email_register || !password_register){
            error_cont.innerHTML = 'Please fill in all fields'
            errors.push('Please fill in all fields')
        }
        if(password_register){
            if(password_register.length < 3){
                error_cont.innerHTML += '<br>Password is too short'
                errors.push('Password is too Short')
            }
        }
        if(errors.length == 0){
            let res = await fetch(`https://blog-io.vercel.app/register?name=${encodeURIComponent(name_register)}&email=${encodeURIComponent(email_register)}&password=${encodeURIComponent(password_register)}`)
            let data = await res.json()
            if(data.success){
                error_cont.innerHTML = data.success
            }else{
                error_cont.innerHTML = data.error
            }
        }
    }

    async function loginUser(){
        let error_cont = document.querySelector('p#error2')
        error_cont.innerHTML = ''
        let errors = []

        if(!email_login || !password_login){
            error_cont.innerHTML = 'Please fill in all fields'
            errors.push('Please fill in all fields')
        }
        if(errors.length == 0){

            let form_data = new FormData()
            form_data.append('email', email_login)
            form_data.append('password', password_login)
            
            // let res = await fetch('https://blogo-io.vercel.app/login', {
            //     body: { 
            //         email: email_login,
            //         password: password_login
            //     },
            //     method : "POST",
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded'
            //     }
                
            // })
            // console.log(res)
            let res = await fetch(`https://blog-io.vercel.app/login?email=${encodeURIComponent(email_login)}&password=${encodeURIComponent(password_login)}`)
            let data = await res.json()
            if(data.message == 'success'){

                let userInfoRes = await fetch(`https://blog-io.vercel.app/userInfo?id=${encodeURIComponent(data.user)}`)
                let userInfoData = await userInfoRes.json()

                dispatch({
                    type: 'SET_USER_INFO',
                    userInfo: userInfoData.user
                })

                dispatch({
                    type: 'SET_USER',
                    user: data.user
                })

                let userPostsData = await fetchUserPosts(data.user)
                window.localStorage.setItem('user', data.user)

                if(userPostsData.posts){
                    dispatch({
                        type: 'SET_USER_POSTS',
                        posts: userPostsData.posts
                    })
                }

                toggleDisplayAccount()

            }else{
                error_cont.innerHTML = data.message
            }
        }

    }

  return (
    <div className={`account login-register`} id="account">

    <div className="go-back" onClick={
        () => {
            let account = document.getElementById('account')
            account.classList.remove('displayAccount')
            document.body.classList.remove("no-overflow")
        }
    }>
        <i className='ri-arrow-go-back-fill'></i>
    </div>

    <form action="" method="GET" id='form-login' style={{display:'none'}}>
        <input type="email" name="email" value={'email_login'} />
        <input type="password" name="password" value={'password_login'} />
    </form>


        <div className="tabs-nav">
           <a href="#" className='btn-login displaying' onClick={displayLogin}>Login</a>
            <a href="#" className='btn-register' onClick={displayRegister}>Register</a>
        </div>

        <div className="tabs">
            <div className="login-tab tab" id='login'>
                <p id="error2"></p>

                <h2>Login</h2>                
                <input 

                type="email" 
                id='email_login' 
                name='email_login' 
                placeholder='Email'
                onChange={(e) => {
                    setEmailLogin(e.target.value)
                }}/>

                <div className="pwd-item">

                    <input 
                    type="password" 
                    id='password-login' 
                    name='password-login' 
                    placeholder="Password" 
                    value ={password_login} 
                    onChange={(e) => {
                        setPasswordLogin(e.target.value)
                    }}/>

                    <div className="pwd-icon" onClick={() => showPwd('pwd-1')}>
                        <i className="ri-eye-line" id="pwd-login-icon"></i>
                    </div>
                </div>
                <button onClick={() => loginUser()}>Login</button>
            </div>

            <div className="register-tab tab remove" id='register'>
                <p id="error"></p>

                <h2>Register</h2>

                <input 
                type="text" 
                name='name' 
                id='name' 
                placeholder="Name" 
                value={name_register} 
                onChange={(e) => {
                    setName(e.target.value)
                }}/>

                <input 
                type="email" 
                id='email-register' 
                name='email-register' 
                placeholder="Email"
                value = {email_register}
                onChange={(e) => {
                    setEmailRegister(e.target.value)
                }}/>
                
                <div className="pwd-item">
                    
                    <input 
                    type="password" 
                    id='password-register' 
                    name='password-register' 
                    placeholder="Password" 
                    value ={password_register}
                    onChange={(e) => {
                        setPasswordRegister(e.target.value)
                    }}/>

                    <div className="pwd-icon" onClick={() => showPwd('pwd-2')}>
                        <i className="ri-eye-line" id="pwd-register-icon"></i>
                    </div>
                </div>
                <button onClick={() => registerUser()}>Register</button>
            </div>
        </div>
      
    </div>
  )
}

export default AuthenticateUser
