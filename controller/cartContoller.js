const {db}= require('../database')
const transporter = require('../helpers/nodemailer')

module.exports={

    // add product to cart
    addCart : (req,res)=>{
        const {idproduct, date, quantity, price, status, iduser} = req.body
        const addToCart = `insert into cart (idproduct,date,quantity,totalPrice, status, iduser) values (${db.escape(idproduct)},${db.escape(date)}, ${db.escape(quantity)},${db.escape(price)}, ${db.escape(status)},${db.escape(iduser)});`

        db.query(addToCart, req.body , (errAddtoCart, resAddtoCart)=>{
            if(errAddtoCart){
                console.log(errAddtoCart)
                res.status(400).send(errAddtoCart)
            }
            res.status(200).send(resAddtoCart)
        })
    },

    //edit product in cart page
    editCart : (req,res)=>{
        const {quantity, totalPrice, idcart, iduser} = req.body
        const editCart = `update cart set quantity=${db.escape(quantity)}, totalPrice=${db.escape(totalPrice)} where idcart = ${db.escape(idcart)};`

        db.query(editCart, (errEditCart, resEditCart)=>{
            if(errEditCart){
                console.log(errEditCart)
                res.status(400).send(errEditCart)
            }
            const getCartEdit = `select c.totalPrice,c.idcart, c.date, c.quantity, c.iduser, c.idproduct, p.name, c.status, p.img, p.price, p.stock
        from cart c
        left join productsmarket p
        on c.idproduct = p.idproduct
        where c.status ='belum bayar' 
        and c.iduser=${db.escape(req.user.iduser)};`

            db.query(getCartEdit, (errGetEdit, resGetEdit)=>{
                if(errGetEdit){
                    console.log(errGetEdit)
                    res.status(400).send(errGetEdit)
                }
                res.status(200).send({cart : resGetEdit})
            })

        })

    },

    //delete product in cart page
    deleteProduct : (req,res)=>{
         const {iduser} = req.body
        const deleteProduct = `update cart set status='pembelian dibatalkan'  where idcart = ${db.escape(req.body.idcart)};`

        db.query(deleteProduct, (errdelProd, resdelProd)=>{
            if(errdelProd){
                console.log(errdelProd)
                res.status(400).send(errdelProd)
            }
            const delCart= `select c.totalPrice,c.idcart, c.date, c.quantity, c.iduser, c.idproduct, p.name, c.status, p.img, p.price, p.stock
            from cart c
            left join productsmarket p
            on c.idproduct = p.idproduct
            where c.status ='belum bayar' 
            and c.iduser=${db.escape(req.user.iduser)};`

            db.query(delCart, (errDelCart, resDelCart)=>{
                if(errDelCart){
                    console.log(errDelCart)
                    res.status(400).send(errDelCart)
                }
                res.status(200).send({cart : resDelCart})
            })
        })

    },

    //get cart page
    cart :(req,res)=>{
        console.log(req.user.iduser)
        const getCart = `select c.totalPrice,c.idcart, c.date, c.quantity, c.iduser, c.idproduct, p.name, c.status, p.img, p.price, p.stock
        from cart c
        left join productsmarket p
        on c.idproduct = p.idproduct
        where c.status ='belum bayar' 
        and c.iduser=${req.user.iduser};`

        db.query(getCart, (errCart, resCart)=>{
            if(errCart){
                console.log(errCart)
                res.status(400).send(errCart)
            }
            res.status(200).send({cart : resCart})
        })

    },

    //checkout Product from cart to waiting payment page
    checkoutToPayment :(req,res)=>{
        const checkoutToPayment = `update cart set status='menunggu pembayaran' where idcart=${req.body.idcart};`
        
        db.query(checkoutToPayment, (errCheckoutToPayment, resCheckoutToPayment)=>{
            if(errCheckoutToPayment){
                console.log(errCheckoutToPayment)
                res.status(400).send(errCheckoutToPayment)
            }
            let info = transporter.sendMail({
                from: '"ADMIN GANTENG" <patrajuanda10@gmail.com>', // sender address
                to: `${req.body.email}`, // list of receivers
                subject: `Hi ${req.body.email}, segera checkout belanjaan mu dan nikmati gratis Ongkir `, // Subject line
                text: "Hello world?", // plain text body
                html: `<a href="http://localhost:3000/verification/"> Click here to Verify your account </a>`, // html body
            })
            
            const updateCart =`select c.totalPrice,c.idcart, c.date, c.quantity, c.iduser, c.idproduct, p.name, c.status, p.img, p.price, p.stock
            from cart c
            left join productsmarket p
            on c.idproduct = p.idproduct
            where c.status ='belum bayar' 
            and c.iduser=${req.user.iduser};`
            db.query(updateCart, (errUpdate, resUpdata)=>{
                if(errUpdate){
                    console.log(errUpdate)
                    res.status(400).send(errUpdate)
                }
                console.log(resUpdata)
                res.status(200).send({cart : resUpdata})
            })
        })

    },

    //checkout product (buy Product)
    checkoutCart : (req,res)=>{
        const { idcart, email}= req.body
        const checkout = `update productsmarket m
        left join  cart t
        on m.idproduct = t.idproduct
        set stock = stock - quantity, t.status= 'sudah bayar'
        where t.status = 'menunggu pembayaran'
        and iduser=${db.escape(req.user.iduser)} and t.idcart=${db.escape(idcart)};`

        db.query(checkout, (errCheckout, resCheckout)=>{
            if(errCheckout){
                console.log(errCheckout)
                res.status(400).send(errCheckout)
            }
            let info = transporter.sendMail({
                from: '"ADMIN GANTENG" <patrajuanda10@gmail.com>', // sender address
                to: `${email}`, // list of receivers
                subject: `Hi ${email} Pembayaran berhasil`, // Subject line
                text: "Hello world?", // plain text body
                html: `<a href="http://localhost:3000/verification"> Click here to Verify your account </a>`, // html body
            })

            const updateCart =`select * 
            from cart c
            left join productsmarket p
            on c.idproduct = p.idproduct
            where c.status ='menunggu pembayaran' 
            and c.iduser=${db.escape(req.user.iduser)};`
            
            db.query(updateCart, (errUpdateCart, resUpdateCart)=>{
                if(errUpdateCart){
                    console.log(errUpdateCart)
                    res.status(400).send(errUpdateCart)
                }
                

                res.status(200).send(resUpdateCart)
            })
        })

    },

    //cancel buy product
    cancelPayment : (req,res)=>{
        const cancel = `update productsmarket p left join cart t on p.idproduct=t.idproduct set stock = stock+quantity, status='pembayaran dibatalkan' where t.idcart=${db.escape(req.body.idcart)} and p.idproduct = ${db.escape(req.body.idproduct)} ;`

        db.query(cancel, (errCancel, resCancel)=>{
            if(errCancel){
                console.log(errCancel)
                res.status(400).send(errCancel)
            }
            const updateWaitPayment = `select * 
            from cart c
            left join productsmarket p
            on c.idproduct = p.idproduct
            where c.status ='menunggu pembayaran' 
            and c.iduser=${db.escape(req.user.iduser)};`

            db.query(updateWaitPayment, (errUpWaPa, resUpWaPa)=>{
                if(errUpWaPa){
                    console.log(errUpWaPa)
                    res.status(400).send(errUpWaPa)
                }
                res.status(200).send(resUpWaPa)
            })
        })
    },

    //waiting payment Page
    waitingPayment : (req,res)=>{
        const waitPayment = `select * 
        from cart c
        left join productsmarket p
        on c.idproduct = p.idproduct
        where c.status ='menunggu pembayaran' 
        and c.iduser=${db.escape(req.user.iduser)};`

        db.query(waitPayment, (errWP, resWP)=>{
            console.log(waitPayment)
            if(errWP){
                console.log(errWP)
                res.status(400).send(errWP)
            }
            res.status(200).send(resWP)
            console.log(resWP)
        })
    }
}