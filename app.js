const express = require('express')
const scraper = require("./scraper")
require("express-async-errors")
const errorHandlerMiddleware = require("./middlewares/error-handler")
const app = express()

app.use(express.json())

app.get("/",scraper)
app.use(errorHandlerMiddleware)

const port = 5000

app.listen(port, console.log(`server is listening on port ${port}`))