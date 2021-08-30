const {db}= require('../database')
const transporter = require('../helpers/nodemailer')

module.exports={
    addCart : (req,res)=>{
        const {idproduct, date, quantity, price, status, iduser} = req.body
        const addToCart = `insert into cart (idproduct,date,quantity,price, status, iduser) values (${db.escape(idproduct)},${db.escape(date)}, ${db.escape(quantity)},${db.escape(price)}, ${db.escape(status)},${db.escape(iduser)});`

        db.query(addToCart, req.body , (errAddtoCart, resAddtoCart)=>{
            if(errAddtoCart){
                console.log(errAddtoCart)
                res.status(400).send(errAddtoCart)
            }
            res.status(200).send(resAddtoCart)
        })
    },
    editCart : (req,res)=>{
        const {quantity, price, idcart} = req.body
        const editCart = `update cart set quantity=${db.escape(quantity)}, price=${db.escape(price)} where idcart = ${db.escape(idcart)};`

        db.query(editCart, (errEditCart, resEditCart)=>{
            if(errEditCart){
                console.log(errEditCart)
                res.status(400).send(errEditCart)
            }
            res.status(200).send(resEditCart)
        })

    },
    deleteProduct : (req,res)=>{
        const deleteProduct = `update cart set status='pembelian dibatalkan'  where idcart = ${db.escape(req.body.idcart)};`

        db.query(deleteProduct, (errdelProd, resdelProd)=>{
            if(errdelProd){
                console.log(errdelProd)
                res.status(400).send(errdelProd)
            }
            res.status(200).send(resdelProd)
        })

    },
    cart :(req,res)=>{
        const {iduser} =req.body
        const getCart = `select * 
        from cart c
        left join productsmarket p
        on c.idproduct = p.idproduct
        where c.status ='belum bayar' 
        and c.iduser=${iduser};`

        db.query(getCart, (errCart, resCart)=>{
            if(errCart){
                console.log(errCart)
                res.status(400).send(errCart)
            }
            res.status(200).send(resCart)
        })

    },
    checkoutCart : (req,res)=>{
        const {iduser, idcart, email}= req.body
        const checkout = `update productsmarket m
        left join  cart t
        on m.idproduct = t.idproduct
        set stock = stock - quantity, t.status= 'sudah bayar'
        where t.status = 'menunggu pembayaran'
        and iduser=${db.escape(iduser)} and t.idcart=${db.escape(idcart)};`

        db.query(checkout, (errCheckout, resCheckout)=>{
            if(errCheckout){
                console.log(errCheckout)
                res.status(400).send(errCheckout)
            }
            let info = transporter.sendMail({
                from: '"ADMIN GANTENG" <patrajuanda10@gmail.com>', // sender address
                to: `${email}`, // list of receivers
                subject: ` ${email} Pembayaran berhasil`, // Subject line
                text: "Hello world?", // plain text body
                html: `<a href="http://localhost:3000/verification/${token}"> Click here to Verify your account </a>`, // html body
            })
            res.status(200).send(resCheckout)
        })

    },
    cancelPayment : (req,res)=>{
        const cancel = `update productsmarket m
        left join  cart t
        on m.idproduct = t.idproduct
        set stock = stock + quantity
        where t.status = 'belum bayar'
        and t.idproduct = ${req.body.idproduct};`

        db.query(cancel, (errCancel, resCancel)=>{
            if(errCancel){
                console.log(errCancel)
                res.status(400).send(errCancel)
            }
            res.status(200).send(resCancel)
        })
    },
    waitingPayment : (req,res)=>{
        const waitPayment = `select * 
        from cart c
        left join productsmarket p
        on c.idproduct = p.idproduct
        where c.status ='menunggu pembayaran' 
        and c.iduser=${db.escape(req.user.iduser)};`

        db.query(waitPayment, (errWP, resWP)=>{
            if(errWP){
                console.log(errWP)
                res.status(400).send(errWP)
            }
            res.status(200).send(resWP)
        })
    },
    successPayment : (req,res)=>{
        const success =`update cart set status='sudah bayar' where idcart=2;`
        db.query(success, (errSuccess, resSuccsee)=>{
            if(errSuccess){
                console.log(errSuccess)
                res.status(400).send(errSuccess)
            }
            res.status(200).send(resSuccsee)

        })
    }
}