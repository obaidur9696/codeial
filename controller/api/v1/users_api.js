const User = require('../../../model/user')

// json web token library.
const jwt = require('jsonwebtoken')


module.exports.createSession = async function (request, response) {
   try {
      let user = await User.findOne({ email: request.body.email });
      if (!user || user.password != request.body.password) {
         return response.status(422).json({
            message: "invalid username/ password"
         })
      }
console.log(request) 
      return response.status(200).json({
         message: "sign in successfully",
         data: {
            token: jwt.sign(user.toJSON(), 'codeiel', { expiresIn: '100000' })
         }
      })

   } catch (error) {

   }
}