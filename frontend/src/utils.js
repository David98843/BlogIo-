let months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'] 
let day = new Date().getDate()
let month = months[new Date().getMonth()]
let year = new Date().getFullYear()
let hour = new Date().getHours()
let minute = new Date().getMinutes()

hour = String(hour).length === 1 ? `0${String(hour)}` : String(hour)
minute = String(minute).length === 1 ? `0${String(minute)}` : String(minute)

let time = `${hour}:${minute}`
let dateCreated = `${month} ${day}`

module.exports = {
    truncateStr : (str, n_chars) => {
        let res = str.length < n_chars ? str : str.slice(0,n_chars)+'...'
        return res
    },
    dateCreated,
    time,
    setEditable : (e) => {
        e.target.setAttribute('contenteditable', true)
        e.target.focus()
    },
    removeEditable : (e) => {
        e.target.setAttribute('contenteditable', false)
    },
    serverUrl: 'http://localhost:5000',
}