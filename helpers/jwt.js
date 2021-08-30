const jwt = require('jsonwebtoken')

module.exports={
    createToken : (payload)=>{
        let token = jwt.sign(payload, process.env.privatekey)
        return token
    },
    verifyToke : (req,res,next)=>{
        console.log(req.token)
        let result = jwt.verify(req.token, process.env.privatekey)

        req.user = result

        next()
    }
}