const { Strategy, ExtractJwt } = require('passport-jwt');

const secret = "PrestaYA"

//Extract JWT from header
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

//Create the strategy for validate JWT
export default new Strategy(options, (payload:any, done:any) => {
    return done(null, payload)
});