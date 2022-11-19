const BadRequestError = require("../errors/custom-error")

const errorHandlerMiddleware = (err,req,res,next) => {
    if(err instanceof BadRequestError) {
        return res.status(err.statusCode).json({msg: err.message})
    }
    res.status(500).json({msg: "Connection error, please try again later !"})
}

module.exports = errorHandlerMiddleware