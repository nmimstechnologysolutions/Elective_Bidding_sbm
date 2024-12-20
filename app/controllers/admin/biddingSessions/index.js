import BiddingSession from "../../../models/admin/BiddingSessions.js"
import { isJsonString } from "../../../utils/util.js"

export const biddingSessionsController = async (req,res) => {
    try {
        // console.log(res.locals.slug, res.locals.biddingId )
        const sidebarActive = req.sidebarActive.split('/')
        // console.log(req.breadcrumbs)    
        const result = await Promise.all([
            BiddingSession.biddingSessionList(res.locals.slug,res.locals.status),
            BiddingSession.acadSessionsList()
        ])
        res.render('admin/biddingSessions/index',{
            breadcrumbs : req.breadcrumbs,
            biddingSessionList : result[0].recordset,
            acadSessionList : result[1].recordset,
            active : sidebarActive[2]
        })
    } catch (error) {
        console.log('error in admin biddingSessions controller : ', error.message)
    }
}

export const getActiveBiddingSessionsController = async (req,res) => {
    try{
        const result = await BiddingSession.getActiveBiddingSessions(res.locals.slug)
        res.status(200).json({
            biddingSessionList : result.recordset
        })
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

export const setActiveBiddingSessionController = async (req,res) => {
    try{
        const result = await BiddingSession.setActiveBiddingSession(res.locals.slug, 1, req.body.inputJSON)
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

export const addNewBiddingSessionController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await BiddingSession.addBiddingSession(res.locals.slug,1,req.body.inputJSON)
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

export const editBiddingSessionController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await BiddingSession.editBiddingSession(res.locals.slug,res.locals.biddingId,1,req.body.inputJSON)
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

export const deleteBiddingSessionController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await BiddingSession.deleteBiddingSession(res.locals.slug, 1 ,req.body.biddingSessionId)
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
