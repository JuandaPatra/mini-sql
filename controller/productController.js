const {db} = require('../database')

module.exports={
    getAll :(req,res)=>{
        let getAllProduct = 'select * from productsmarket;'
        db.query(getAllProduct, (errGetProd,resultGetProd)=>{
            if(errGetProd){
                console.log(errGetProd)
                res.status(400).send(errGetProd)
            }
            res.status(200).send(resultGetProd)
        })
    },
    getProd : (req,res)=>{
        let prod = `select * from productsmarket where idproduct =${db.escape(req.params.id)};`
        db.query(prod, (errProd, resultProd)=>{
            if(errProd){
                console.log(errProd)
                res.status(400).send(errProd)
            }
            res.status(200).send(resultProd)
        })
    }
}