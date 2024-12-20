import ProgramSessions from "../../../models/admin/ProgramSessions.js"
import { isJsonString } from "../../../utils/util.js"

export const programSessionController = async (req,res) => {
    try {
        let sidebarActive = req.sidebarActive.split('/')

        const result = await ProgramSessions.programsSessionsList(res.locals.slug, res.locals.biddingId)
        // console.log(result.recordset)
        res.render('admin/programSessions/index',{
            breadcrumbs : req.breadcrumbs,
            programSessionList : result.recordset,
            active : sidebarActive[2]
        })
    } catch (error) {
        console.log('error in program session controller : ', error.message)
    }
}

export const programSessionsListByRefreshController = async (req,res) => {
    try{
        const result = await ProgramSessions.getProgramSessionsListByRefresh(res.locals.slug, res.locals.biddingId, 1)
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

export const updateProgramSessionController = async (req,res) => {
    try {
        const result = await ProgramSessions.updateProgramSession(res.locals.slug, res.locals.biddingId,1, req.body.inputJSON)
        res.status(200).json(JSON.parse(result.output.output_json))
    } catch (error) {
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