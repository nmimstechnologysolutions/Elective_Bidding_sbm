// import { acadSessionQuery, addFavCourseQuery, areaNameQuery, availableCoursesQuery, biddingNameQuery, biddingPointsQuery, courseNameQuery, filterCourseQuery, remainingPointsQuery, roundNameQuery, searchCourseQuery, yearlyCreditsQuery } from "../../../models/student/Dashboard.js"
import Dashboard from "../../../models/student/Dashboard.js"
import { addAndDropRound1Query, addAndDropRound2Query, biddingRound1Query, biddingRound2Query, confirmationRound1Query, confirmationRound2Query, demandEstimationRoundQuery, waitlistGenerationRoundQuery } from "../../../models/student/Rounds.js"
import { isJsonString } from "../../../utils/util.js"

export const dashboardController = async (req,res) => {
    try{

        // const {totalCredits} = await yearlyCreditsQuery('sbm-mum', 1)
        // const {biddingName} = await biddingNameQuery('sbm-mum', 1)
        // // const {biddingPoints} = await biddingPointsQuery('sbm-mum', 1)
        // const {remainingPoints} = await remainingPointsQuery(res.locals.slug, res.locals.biddingId)
        // const  courseList = await availableCoursesQuery('sbm-mum', 1)
        // const acadSession = await acadSessionQuery('sbm-mum', 1)
        // const areaName = await areaNameQuery('sbm-mum', 1)
        // const courseName = await courseNameQuery('sbm-mum', 1)
        // const biddingRounds = await roundNameQuery('sbm-mum', 1)

        // const result = await Promise.all([

        // ])
        

        // const availableCourses = await courseList.sort((a,b)=> b.is_favourite-a.is_favourite)
        // res.render('students/dashboard/index',{
        //     totalCredits,
        //     biddingName,
        //     // biddingPoints,
        //     remainingPoints,
        //     acadSession,
        //     areaName,
        //     courseName,
        //     availableCourses,
        //     biddingRounds
        // })   
        let sidebarActive = req.sidebarActive.split('/')

        // const result = await Promise.all([
        //     Dashboard.yearlyCredits(res.locals.slug, res.locals.biddingId),
        //     Dashboard.biddingName(res.locals.slug, res.locals.biddingId),
        //     Dashboard.biddingPoints(res.locals.slug, res.locals.biddingId),
        //     Dashboard.remainingPoints(res.locals.slug, res.locals.biddingId),
        //     Dashboard.availableCourses(res.locals.slug, res.locals.biddingId),
        //     Dashboard.acadSessionsList(res.locals.slug, res.locals.biddingId),
        //     Dashboard.areaName(res.locals.slug, res.locals.biddingId),
        //     Dashboard.courseName(res.locals.slug, res.locals.biddingId),
        //     Dashboard.roundName(res.locals.slug, res.locals.biddingId)
        // ])
        // console.log(result[2].recordset)
        // res.render('students/dashboard/index',{
        //     path: '/student',
        //     biddingName : res.locals.biddingName,
        //     totalCredits : result[0].recordset[0].totalCredits,    
        //     biddingName : result[1].recordset[0].biddingName,
        //     biddingPoints : result[2].recordset[0],
        //     breadcrumbs : req.breadcrumbs,
        //     active : sidebarActive[2]
        // })

        const result = await Promise.all([
            Dashboard.concentrationsList(res.locals.slug, res.locals.biddingId),
            Dashboard.studentDetails(res.locals.slug, res.locals.biddingId, res.locals.username),
            Dashboard.yearlyCredits(res.locals.slug, res.locals.biddingId),
            Dashboard.biddingRounds(res.locals.slug, res.locals.biddingId),
            Dashboard.acadSessionsList(res.locals.slug, res.locals.biddingId),
            Dashboard.areaNameList(res.locals.slug, res.locals.biddingId),
            Dashboard.courseNameList(res.locals.slug, res.locals.biddingId),
            Dashboard.availableCoursesList(res.locals.slug, 1220)
        ])

        
        // console.log(result[1].recordset)

        res.render('students/dashboard/index',{
            path: '/student',
            concentrationList : result[0].recordset,
            studentDetails : result[1].recordset[0],
            yearlyCredits : result[2].recordset[0],
            biddingRounds : result[3].recordset,
            acadSessionsList : result[4].recordset,
            areaNameList : result[5].recordset,
            courseNameList : result[6].recordset,
            availableCoursesList : result[7].recordset,
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })

        

    }catch(error){
        console.log('error in dashboard controller :', error.message)
    }
}

export const fetchAllCourseController = async (req,res) => {
    try{
        const courseList = await Dashboard.availableCoursesList(res.locals.slug, 1220)
        const allCourses = await courseList.recordset.sort((a,b)=> b.is_favourite-a.is_favourite)
        res.status(200).json(allCourses)
    }catch(error){
        console.log('error in fetching all courses controller :', error.message)
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



export const addFavCourseController = async (req,res) => {
    try{
        const inputJSON = {
            student_lid : 1220,
            div_batch_lid: req.body.divId,
            is_favourite: req.body.isFavourite
        }

        const result = await Dashboard.addFavCourse(res.locals.slug, res.locals.biddingId, 1220, inputJSON)
        res.status(200).json(JSON.parse(result.output.output_json))
    }catch(error){
        console.log('error in addFavController :', error.message)
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

export const filterCourseController = async (req,res) => {
    try {
        const filterInputs = req.body.filterInputs
        const trimesterInput = filterInputs.trimister ? filterInputs.trimister.toString() : null
        const areaInput = filterInputs.area ? filterInputs.area.toString() : null

        const filteredResult = await Dashboard.filterCourses(res.locals.slug, 1220, trimesterInput, areaInput)

        const filteredCourses = filteredResult.sort((a,b)=> b.is_favourite-a.is_favourite)

        res.status(200).json(filteredCourses)
    } catch (error) {
        console.log('error in filterCourseController :', error.message)
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


export const searchCourseController = async (req,res) => {
    try{
        const courseNames  = req.body.coursesNames
        const courseInputs = courseNames.toString()
        const searchCourseResult = await Dashboard.searchCourse(res.locals.slug, 1220, courseInputs)
        const searchCourses = searchCourseResult.sort((a,b)=> b.is_favourite-a.is_favourite)

        res.status(200).json(searchCourses)
    }catch(error){
        console.log('error in searchcourseController :', error.message)
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



export const completedRoundResultController = async (req,res) => {
    try{
        const roundId = parseInt(req.body.roundId)
        let courseList
        switch(roundId){
            case 1:
                courseList = await demandEstimationRoundQuery(res.locals.slug, res.locals.biddingId, 1220)
                break
            case 2:
                courseList = await biddingRound1Query(res.locals.slug, res.locals.biddingId, 1220)
                break
            case 3:
                courseList = await confirmationRound1Query(res.locals.slug, res.locals.biddingId, 1220)
                break
            case 4:
                courseList = await biddingRound2Query(res.locals.slug, res.locals.biddingId, 1220)
                break
            case 5:
                courseList = await confirmationRound2Query(res.locals.slug, res.locals.biddingId, 1220)
                break
            case 6:
                courseList = await waitlistGenerationRoundQuery(res.locals.slug, res.locals.biddingId, 1220)
                break
            case 7:
                courseList = await addAndDropRound1Query(res.locals.slug, res.locals.biddingId, 1220)
                break
            case 8:
                courseList = await addAndDropRound2Query(res.locals.slug, res.locals.biddingId, 1220)
                break
            case 9:
                courseList = []
                break
            default:
                console.log('no extra round exists')
                break
        }
        res.status(200).json(courseList)
    }catch(error){
        console.log('error in completedroundController :',error.message)
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

export const saveConcentrationController = async (req,res) => {
    try{
        // {"select_specialization":{"id":668,"concentration_lid":2,"concentration_name":"Marketing"}}
        const inputJSON = {
            select_specialization : {
                id : res.locals.studentId,
                concentration_lid : req.body.concentrationId,
                concentration_name : req.body.concentrationName
            }
        }

        const result = await Dashboard.saveConcentration(res.locals.slug, res.locals.biddingId, res.locals.userId, inputJSON)
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