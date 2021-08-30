const nodemailer = require('nodemailer')
const key =process.env.key

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'patrajuanda10@gmail.com',
        pass : key
    },
    tls:{
        rejectUnauthorized :true
    }
})

module.exports = transporter