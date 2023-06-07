const express = require('express')
const app = express()

require('dotenv').config()
require('./middleware')(app)

app.use('/', require('./routes'))

const PORT = process.env.PORT || 30
app.listen(PORT, console.log(`App started on PORT ${PORT}`))