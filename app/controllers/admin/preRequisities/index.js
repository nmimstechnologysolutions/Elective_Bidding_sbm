import PreRequisities from "../../../models/admin/PreRequisties.js"
import { isJsonString } from "../../../utils/util.js"

export const preRequisitesController = async (req,res) => {
    try {
        let sidebarActive = req.sidebarActive.split('/')

        const result = await Promise.all([
            PreRequisities.preRequisitiesList(res.locals.slug,res.locals.biddingId),
            PreRequisities.acadSessionsList(res.locals.slug,res.locals.biddingId),
            PreRequisities.preRequiredAcadSessionsList(),
            PreRequisities.courseList(res.locals.slug,res.locals.biddingId),
            PreRequisities.preRequisitiesTypes()
        ])
        // console.log(result[0].recordset)
        res.render('admin/preRequisities/index', {
            breadcrumbs : req.breadcrumbs,
            preRequisitiesList : result[0].recordset,
            acadSessionsList : result[1].recordset,
            preRequiredAcadSessionsList : result[2].recordset,
            courseList : result[3].recordset,
            preRequisitiesTypes : result[4].recordset,
            active : sidebarActive[2]
        })
    } catch (error) {
        console.log('error in pre requisites controller')
    }
}


export const preRequisiteCourseListByAcadSessionController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await PreRequisities.courseListByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId)
        res.status(200).json({
            courseList : result.recordset
        })

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

export const addPreRequisiteCourseController = async (req,res) => {
    try{
        const inputJSON = {
            pre_requisites : JSON.parse(req.body.inputJSON)
        }
        const result = await PreRequisities.addPreRequisiteCourse(res.locals.slug, res.locals.biddingId, 1, inputJSON)
        res.status(200).json(JSON.parse(result.output.output_json))
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

export const editPreRequisiteCourseController = async (req,res) => {
    try{
        const result = await PreRequisities.editPreRequisiteCourse(res.locals.slug, res.locals.biddingId, 1, req.body.inputJSON)
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

export const deletePreRequisiteCourseController = async (req,res) => {
    try{
        const result = await PreRequisities.deletePreRequisiteCourse(res.locals.slug,res.locals.biddingId,1,req.body.preRequisiteId)
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