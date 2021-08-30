const {db} = require('../database')
const crypto = require('crypto')
const {createToken}= require('../helpers/jwt')
const {upload} = require('../helpers/multer')

module.exports={
    login : (req,res)=>{
        const {username, password} = req.body
        let hash = crypto.createHmac('sha1', 'hash123').update(password).digest('hex')

        const getuser = `select * from user where username= ${db.escape(username)} and password= ${db.escape(hash)};`

        db.query(getuser, (errUser, resUser)=>{
            if(errUser){
                console.log(errUser)
                res.status(400).send(errUser)
            }else if(resUser.length !==0){
                    let token = createToken({iduser : resUser[0].iduser})

                    res.status(200).send({dataUser : resUser[0], token})

                 
            }else if (resUser.length ===0){
                const autoRegister = `insert into user set ?`

                req.body.password = crypto.createHmac('sha1', 'hash123').update(password).digest('hex')

                db.query(autoRegister, req.body, (errRegis, resRegis)=>{
                    if(errRegis){
                        console.log(errRegis)
                        res.status(400).send(errRegis)
                    }
                    const getnewuser = `select * from user where username= ${db.escape(username)} and password= ${db.escape(hash)};`
                    db.query(getnewuser, (errNewUser, resNewUser)=>{
                        if(errNewUser){
                            console.log(errNewUser)
                            res.status(400).send(errNewUser)
                        }
                        let token = createToken({iduser : resNewUser[0].iduser})

                        res.status(200).send({dataUser : resNewUser[0], token})

                    })



                    // res.status(200).send(resUser)
                })

            }
        })
    },
    keeplogin : (req,res)=>{
        const getuserkeep = `select * from user where iduser=${db.escape(req.user.iduser)}`
        console.log(getuserkeep)

        db.query(getuserkeep, (errKeep, resKeep)=>{
            if(errKeep){
                console.log(errKeep)
                res.status(400).send(errKeep)
            }
            res.status(200).send(resKeep)
        })

    },
    uploadPhoto : (req,res)=>{
        
        if(!req.file){
            res.status(400).send("NO FILE")
        }
        // const updatePict =`update profile set profile_pic = 'images/${req.file.filename}' where iduser = ${db.escape(req.params.iduser)};`
       const updatePict = `insert into profile(profile_pic,iduser) values ('images/${req.file.filename}',${req.params.iduser});`
        console.log(updatePict)
        console.log(req.file)
        db.query(updatePict, (errUpload ,resUpload)=>{
            if(errUpload){
                console.log(errUpload)
                res.status(400).send(errUpload)
            }
            res.status(200).send(resUpload)
        })

    }
}