module.exports = (req,res,next) => {
    if(req.cookies.formularioCookies){
        req.session.userLogin = req.cookies.formularioCookies
    }
    next()
}