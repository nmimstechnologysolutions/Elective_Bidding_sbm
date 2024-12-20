import Courses from "../../../models/admin/Courses.js"
import { DemandEstimationRound } from "../../../models/student/DemandEstimation.js"
import { isJsonString } from "../../../utils/util.js"

export const demandEstimationRoundController = async (req,res) => {
    let sidebarActive = req.sidebarActive.split('/')
    try{
        const result = await Promise.all([
            DemandEstimationRound.roundDetails(res.locals.slug, res.locals.biddingId),
            Courses.acadSessions(res.locals.slug, res.locals.biddingId),
            DemandEstimationRound.acadSessionsWiseCredits(res.locals.slug, res.locals.biddingId),
            DemandEstimationRound.demandRoundCriteria(res.locals.slug, res.locals.biddingId, res.locals.username),
            DemandEstimationRound.selectedCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            DemandEstimationRound.availableCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId)
        ])

        // console.log(result)

        res.render('students/demandEstimation/index',{
            roundDetails : result[0] != undefined ? result[0] : null,
            acadSessions : result[1].recordset,
            acadSessionsWiseCredits : result[2],
            demandRoundCriteria : result[3],
            selectedCourseList : result[4],
            availableCourseList : result[5],
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })

    }catch(error){
        console.log("error in demandestimation controller: ", error.message)
    }
}

// export const demandEstimationRoundController = async (req,res) => {
//     let sidebarActive = req.sidebarActive.split('/')
//     const roundId = 1
//     try{
//         const result = await Promise.all([
//             DemandEstimationRound.roundDetails(res.locals.slug, res.locals.biddingId),
//             DemandEstimationRound.availableCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
//             DemandEstimationRound.availableCourseListCount(res.locals.slug, res.locals.biddingId),
//             Courses.acadSessions(res.locals.slug, res.locals.biddingId),
//             DemandEstimationRound.acadSessionsWiseCredits(res.locals.slug, res.locals.biddingId),
//             DemandEstimationRound.roundStartTimeEndTime(res.locals.slug, res.locals.biddingId, roundId),
//             DemandEstimationRound.selectedCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
//             DemandEstimationRound.concentrationDetails(res.locals.slug, res.locals.biddingId, res.locals.username),
//             DemandEstimationRound.totalCredits(res.locals.slug, res.locals.biddingId),
//             DemandEstimationRound.demandEstimationRoundOneDayBefore(res.locals.slug, res.locals.biddingId, roundId),
//             DemandEstimationRound.checkStundetIsPartOfRound(res.locals.slug, res.locals.biddingId, res.locals.studentId, roundId),
//             DemandEstimationRound.currentRoundStatus(res.locals.slug, res.locals.biddingId, roundId),
//         ])

//         // console.log(result[10].length)

//         res.render('students/demandEstimation/index',{
//             demandEstimationRounds : result[0],
//             availableCourseList : result[1],
//             availableCourseListCount : result[2],
//             acadSessionsList : result[3].recordset,
//             acadSessionsListWiseCredits : result[4],
//             roundStartTimeEndeTime : result[5],
//             selectedCourseList : result[6],
//             concentrationDetails : result[7],
//             totalCredits : result[8],
//             demandEstimationRoundDetails : result[9],
//             checkStundetIsPartOfRound : result[10].length,
//             currentRoundStatus : result[11].length == 0 ? JSON.parse(JSON.stringify({'round_status':'Round Not Found'})) : JSON.parse(JSON.stringify(result[11][0])),
//             breadcrumbs : req.breadcrumbs,
//             active : sidebarActive[2]
//         })
//     }catch(error){
//         console.log("error in demandestimation controller: ", error.message)
//     }
// }

export const filterByAcadSessionController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            DemandEstimationRound.courseListByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId),
            DemandEstimationRound.coursesCountByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId),
            DemandEstimationRound.areaListByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId)
        ])

        res.status(200).json({
            courseListByAcadSession : result[0],
            courseCountByAcadSession : result[1][0],
            areaListByAcadSession : result[2]
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

export const filterByAreaController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            DemandEstimationRound.coursesListByArea(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaId),
            DemandEstimationRound.coursesCountByArea(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaId)
        ])

        res.status(200).json({
            courseListByArea : result[0],
            courseCountByArea : result[1][0]
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