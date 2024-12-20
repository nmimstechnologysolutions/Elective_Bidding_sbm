import Programs from "../../../models/admin/Programs.js"
import { isJsonString } from "../../../utils/util.js"

export const programsController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        const results = await Promise.all([
            Programs.getProgramList(res.locals.slug,res.locals.biddingId),
            Programs.getProgramsFromDB(res.locals.slug,res.locals.biddingId)
        ])
        // console.log("program list", results[1])
        res.render('admin/programs/index', {
            breadcrumbs: req.breadcrumbs,
            programList: results[0].recordset,
            programsFromDB : results[1].recordset,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error occured in programsController : ",error.message)
    }
}


export const addProgramController = async (req,res) => {
    try{
        const result = await Programs.addProgram(res.locals.slug, res.locals.biddingId, 1, req.body.inputJSON)
        res.status(200).json(JSON.parse(result.output.output_json))
    }catch(error){
        if (isJsonString(error.originalError.info.message)) { 
            res.status(500).json(JSON.parse(error.originalError.info.message));
        } else {
            res.status(500).json({
                status: 500,
                description: error.originalError.info.message,
                data: []
            });
        }
    }
}


export const deleteProgramController = async (req,res) => {
    try{
        let programId = req.body.program_id !== undefined ? req.body.program_id : null

        // deleteProgram(programId, res.locals.slug, res.locals.userId, req.body.biddingSessionId)
        
        const result = await Programs.deleteProgram(res.locals.slug, res.locals.biddingId, 1, programId)
        // console.log(result.recordset)
        res.status(200).json(JSON.parse(result.output.output_json));
    }catch(error){
        if (isJsonString(error.originalError.info.message)) { 
            res.status(500).json(JSON.parse(error.originalError.info.message));
        } else {
            res.status(500).json({
                status: 500,
                description: error.originalError.info.message,
                data: []
            });
        }
    }
}