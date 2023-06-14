import { useDataLayerValue } from "../DataLayer"

const Header = (props) => {
    const[{user}, dispatch] = useDataLayerValue()

    async function logOut(){
        window.localStorage.removeItem('user')
        dispatch({
            type: 'SET_USER',
            user: null
        })
        dispatch({
            type: 'SET_USER_INFO',
            userInfo: null
        })
    }


    return (
        <>
        <div className="header">

            <div className="logo">
                <img src={"/images1/logo-black.png"} alt="" width="100%" height = "100%"/>
            </div>
            <div className="nav">
                <a href="#"><i className="ri-home-3-line"></i></a>
                <a href="#" title={user ? 'Profile' : 'Login'} onClick={() => {
                    props.toggleDisplayAccount()
                }}><i className="ri-user-line" ></i></a>
                <a href="#" title="Logout" onClick={() => logOut()}><i className="ri-logout-circle-line"></i></a>
            </div>
        </div>
        <div className="sticky-nav">
            <a href="#"><i className="ri-home-3-line"></i></a>
            <a href="#" title={user ? 'Profile' : 'Login'} onClick={() => {
                props.toggleDisplayAccount()
            }}><i className="ri-user-line" ></i></a>
            <a href="#" title="Logout" onClick={() => logOut()}><i className="ri-logout-circle-line"></i></a>            
        </div>
        </>
    )
}

export default Header