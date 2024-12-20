import RoundSettings from "../../../models/admin/RoundSettings.js"
import { isJsonString } from "../../../utils/util.js"

export const roundSettingsController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        const result = await Promise.all([
            RoundSettings.roundSettingsList(res.locals.slug, res.locals.biddingId),
            RoundSettings.preDefinedRoundList(res.locals.slug, res.locals.biddingId),
            RoundSettings.courseList(res.locals.slug, res.locals.biddingId),
            RoundSettings.studentsList(res.locals.slug, res.locals.biddingId)
        ])
        // console.log(result[1].recordset)
        res.render('admin/roundSettings/index',{
            breadcrumbs : req.breadcrumbs,
            roundSettingsList : result[0].recordset,
            preDefinedRoundList : result[1].recordset,
            courseList : result[2].recordset,
            studentsList : result[3].recordset,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error in round settings controller : ", error.message)
    }
}

export const roundDataController = async (req,res) => {
    try{
        // console.log(req.body.roundId)
        const result = await Promise.all([
            RoundSettings.roundSettingsDetailsByRound(res.locals.slug, res.locals.biddingId,req.body.roundId),
            RoundSettings.studentsListByRound(res.locals.slug, res.locals.biddingId,req.body.roundId),
            RoundSettings.courseListByRound(res.locals.slug, res.locals.biddingId,req.body.roundId)
        ])

        res.status(200).json({
            roundDetails : result[0].recordset[0],
            roundStudentList : result[1].recordset,
            roundCourseList : result[2].recordset
        })

    }catch(error){
        console.log("error in round data controller : ", error.message)
    }
}

export const addRoundSettingsRoundController = async (req,res) => {
    try{
        // console.log(req.body.roundSettings)
        const result = await RoundSettings.addRoundSettingsRound(res.locals.slug, res.locals.biddingId,1,req.body.roundSettings)
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

export const updateRoundSettingsRoundController = async (req,res) => {
    try{
        // console.log(req.body.inputJSON)
        const result = await RoundSettings.updateRoundSettingsRound(res.locals.slug, res.locals.biddingId,1,req.body.inputJSON)
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


export const deleteRoundSettingsRoundController = async (req,res) => {
    try{
        // console.log(req.body.roundSettingsId)
        const result = await RoundSettings.deleteRoundSettingsRound(res.locals.slug, res.locals.biddingId,1,req.body.roundSettingsId)
        res.status(200).json(JSON.parse(result.output.output_json))
    }catch(error){
        // console.log(error.message)
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