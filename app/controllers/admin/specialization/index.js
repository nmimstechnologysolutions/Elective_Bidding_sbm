import Specialization from "../../../models/admin/Sepecialization.js"
import { isJsonString } from "../../../utils/util.js"

export const specializationController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        const result = await Specialization.specializationList(res.locals.slug, res.locals.biddingId)
        // console.log(result.recordset)
        res.render('admin/specialization/index',{
            breadcrumbs : req.breadcrumbs,
            specializationsList : result.recordset,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log('error in specialization controller : ', error.message)
    }
}

export const addSpecializationController = async (req,res) => {
    try {
        console.log(req.body.inputJSON)
        const result = await Specialization.addSpecialization(res.locals.slug, res.locals.biddingId,1,req.body.inputJSON)
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

export const updateSpecializationController = async (req,res) => {
    try{
        // console.log(req.body.inputJSON)
        const result = await Specialization.updateSpecialization(res.locals.slug, res.locals.biddingId,1,req.body.inputJSON)
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


export const deleteSpecializationController = async (req,res) => {
    try{
        // console.log(req.body.specializationId)
        const result = await Specialization.deleteSpecialization(res.locals.slug, res.locals.biddingId,1,req.body.specializationId)
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