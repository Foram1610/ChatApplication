const jwt = require('jsonwebtoken');

var checkUser = async(req,res,next) => {
    const {authorization} = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try{
            let token  = authorization.split(' ')[1]
            const {_id} = jwt.verify(token,process.env.SECRET_KEY)
            req.id = _id;
            next();
        }catch(error){
            res.status(401).json({message:'Unauthorized User!!'})
        }
    } else {
        res.status(400).json({message:'User have no token!!!'})
    }
}

module.exports = checkUser