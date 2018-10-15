var express = require('express')
var app = express()
const port = process.env.PORT || 3000

// Define request response for root
app.get('/test', (req, res) => {
    res.send("Hello World!")
})

// Listen!
app.listen(port, () => {
    console.log(`Profile server listening on port ${port}`)
})

module.exports = app