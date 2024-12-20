import { isJsonString } from "../utils/util.js"

export const LoginController = async (req,res) => {
    try{    
        res.render('login')
    }catch(error){
        console.log(error.message)
        if (isJsonString(error.originalError.info.message)) { 
            res.status(500).json(JSON.parse(error.originalError.info.message));
        } else {
            res.status(500).json({
                status: 500,
                description: error.originalError.info.message,
                data: []
            })
        }
    }
}