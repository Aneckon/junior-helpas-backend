const jwt = require('jsonwebtoken')
const {Token} = require('../models/models')

class TokenService{

    generateJWT(id, email){
        return jwt.sign({id, email}, process.env.JWT_SECRET, {expiresIn: '24h'})
    }

    async removeJWT(refreshToken){
        const tokenData = await Token.destroy({where: {refreshToken}})
        return tokenData
    }
}

module.exports = new TokenService()