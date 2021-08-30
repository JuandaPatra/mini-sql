const multer = require('multer')

const path = require('path')

module.exports={
    upload : ()=>{
        let storage = multer.diskStorage({
            destination : path.join(path.resolve('public'), 'images'),
            filename : (req,file,cb)=>{
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        })
        return multer({storage}).single('IMG')
    }
}