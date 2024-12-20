import ManualEnrollment from "../../../models/admin/ManualEnrollment.js"

export const manualEnrollmentController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        const roundId = 9
        const result = await Promise.all([
            ManualEnrollment.roundDetails(res.locals.slug,res.locals.biddingId,roundId),
            ManualEnrollment.manualEnrollmentList(res.locals.slug,res.locals.biddingId,roundId),
            ManualEnrollment.studentsList(res.locals.slug,res.locals.biddingId,roundId)
        ])
        // console.log(result[2].recordset)
        res.render('admin/manualEnrollment/index',{
            breadcrumbs : req.breadcrumbs,
            isRoundCreated : result[0].recordset !== undefined ? result[0].recordset : "",
            manualEnrollmentList : result[1].recordset !== undefined ? result[1].recordset : "",
            studentsList : result[2].recordset !== undefined ? result[2].recordset : "",
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error in manual enrollment controller : ", error.message)
    }
}

export const getCourseListController = async (req,res) => {
    try{
        const result = await ManualEnrollment.courseList(res.locals.slug, res.locals.biddingId,req.body.id, req.body.studentId, req.body.roundId)
        res.status(200).json({
            courseList : result.recordset
        })
    }catch(error){
        if (isJsonString.isJsonString(error.originalError.info.message)) {
            res.status(500).json(JSON.parse(error.originalError.info.message))
        } else {
            res.status(500).json({
                status: 500,
                description: error.originalError.info.message,
                data: []
            })
        }
    }
}

export const addStuentToEnrollmentController = async (req,res) => {
    try{
        console.log(req.body)
        res.status(200).json({msg:'ok'})
    }catch(error){
        if (isJsonString.isJsonString(error.originalError.info.message)) {
            res.status(500).json(JSON.parse(error.originalError.info.message))
        } else {
            res.status(500).json({
                status: 500,
                description: error.originalError.info.message,
                data: []
            })
        }
    }
}
