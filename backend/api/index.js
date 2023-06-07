const express = require('express')
const app = express()

require('dotenv').config()
require('./middleware')(app)

app.use('/', require('./routes'))
app.get('/', (req, res) => {
  res.send('Hello Express')  
})

const PORT = process.env.PORT || 30
app.listen(PORT, console.log(`App started on PORT ${PORT}`))

module.exports = app
