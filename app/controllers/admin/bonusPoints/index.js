import BonusPoints from "../../../models/admin/BonusPoints.js"
import { isJsonString } from "../../../utils/util.js"

export const bonusPointsController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        const result = await BonusPoints.bonusPointsList(res.locals.slug, res.locals.biddingId)
        // console.log(result.recordset)
        res.render('admin/bonusPoints/index',{
            breadcrumbs : req.breadcrumbs,
            bonusPointsList : result.recordset,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error in bonus points controller : ", error.message)
    }
}

export const addBonusPointsController = async (req,res) => {
    try{
        const result = await BonusPoints.addBonusPoints(res.locals.slug, res.locals.biddingId ,1,req.body.inputJSON)
        res.status(200).json(JSON.parse(result.output.output_json))
    }catch(error){
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


export const editBonusPointsController = async (req,res) => {
    try{
        const result = await BonusPoints.editBonusPoints(res.locals.slug, res.locals.biddingId,1,req.body.inputJSON)
        res.status(200).json(JSON.parse(result.output.output_json))
    }catch(error){
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


export const deleteBonusPointsController = async (req,res) => {
    try{
        const result = await BonusPoints.deleteBonusPoints(res.locals.slug, res.locals.biddingId,1,req.body.bonusPointsId)
        res.status(200).json(JSON.parse(result.output.output_json))
    }catch(error){
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