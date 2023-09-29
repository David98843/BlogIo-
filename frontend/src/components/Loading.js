export function Loading(){
    document.body.onload = () => {
        setTimeout(() => {
            let loader = document.querySelector('div.loader')
            loader.style.display = 'none';
        }, 3000)
    }
    return(
        <div className="loader">
            <div className="cont">
                <div className="loading"></div>
                <img src="/images1/01.png" alt="loader" width={'100%'} height={'100%'} />
            </div>     
        </div>
    )
}