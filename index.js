const express = require('express')
const cors = require('cors')
require('dotenv').config()
const bearerToken = require('express-bearer-token')
const PORT = process.env.PORT

const app =express()

app.use(cors())
app.use(bearerToken())
app.use(express.json())
app.use(express.static('./public'))

const {db} =require('./database')
db.connect((err)=>{
    if(err){
        console.log('error connecting :' + err.stack)
        return
    }
    console.log('connected as id' + db.threadId)
})

app.get('/', (req, res)=>{
    res.status(200).send(`<h1> Toko sepatu check </h1>`)
})

const {productRouter, userRouter, cartRouter} = require('./router')
app.use('/product', productRouter)
app.use('/user', userRouter)
app.use('/cart', cartRouter)

app.listen(PORT, ()=> console.log(`magic happens in PORT : ${PORT}`))