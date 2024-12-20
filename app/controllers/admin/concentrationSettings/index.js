import Areas from "../../../models/admin/Areas.js"
import ConcentrationSettings from "../../../models/admin/concentrationSettings.js"
import {isJsonString} from '../../../utils/util.js'

export const concentrationSettingsController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')
        
        const result = await Promise.all([
            ConcentrationSettings.concentrationSettingsList(res.locals.slug,res.locals.biddingId),
            Areas.areasList(res.locals.slug,res.locals.biddingId)
        ])
        // console.log(result.recordset)
        res.render('admin/concentrationSettings/index', {
            breadcrumbs : req.breadcrumbs,
            concentrationSettingsList : result[0].recordset,
            primaryAreaList : result[1].recordset,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log('Error in Concentration Settings Controller :', error.message)
    }
}


export const concentrationSettingsListByRefreshController = async (req,res) => {
    try{
        const result = await ConcentrationSettings.concentrationSettingsByRefresh(res.locals.slug, res.locals.biddingId, 1)
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

export const updateConcentrationSettingsController = async (req,res) => {
    try{
        // console.log(req.body.inputJSON)
        const result = await ConcentrationSettings.updateConcentrationSettings(res.locals.slug,res.locals.biddingId,1,req.body.inputJSON)
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


export const deleteConcentrationSettingsController = async (req,res) => {
    try{
        // console.log(req.body.id)
        const result = await ConcentrationSettings.deleteConcentrationSettings(res.locals.slug,res.locals.biddingId,1,req.body.id)
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