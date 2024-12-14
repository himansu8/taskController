import jwt from 'jsonwebtoken';
import config from '../../config/config.js';


const private_key = config.PRIVATE_KEY


export function authMiddleware(req, res, next) {

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({error:"You are not authenticated!"}) ;
          }

    jwt.verify(token, private_key, (err, user) => {
    if (err) return res.status(403).json({error:"Token is not valid"});
    req.user = user;
    next();
 
  });
    
  }