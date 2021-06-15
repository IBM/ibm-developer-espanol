const express = require('express')
const os = require('os')

const app = express()
app.get('/', (req, res) => {
        res.send(`Hola a todos desde ${os.hostname()}!`)
})

const port = 3000
app.listen(port, () => console.log(`listening on port ${port}`))
