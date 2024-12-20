import Courses from "../../../models/admin/Courses.js";
import { isJsonString } from "../../../utils/util.js";
import xlsx from 'xlsx'
import excel from 'exceljs'
import path from 'path'
import { fileURLToPath } from "url"
import BiddingSession from "../../../models/admin/BiddingSessions.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const coursesController = async (req,res) => {
    try {
        let sidebarActive = req.sidebarActive.split('/')

        const results = await Promise.all([
            Courses.courseListCount(res.locals.slug, res.locals.biddingId),
            Courses.programList(res.locals.slug, res.locals.biddingId),
            Courses.courseList(res.locals.slug, res.locals.biddingId),
            // Courses.courseListComplete(res.locals.slug,1)
            // Courses.acadSessions(res.locals.slug,1),
        ])
        // console.log(JSON.stringify(results[2].recordset))
        res.render('admin/courses/index', {
            breadcrumbs : req.breadcrumbs,
            courseListCount : results[0].recordset[0].count,
            programList : results[1].recordset,
            courseList : results[2].recordset,
            // courseListComplete : results[3].recordset
            // acadSessions : results[4].recordset,
            active : sidebarActive[2]
        })
    } catch (error) {
        console.log('error in courses controller :', error.message)
    }
}


export const showCourseEntriesController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            Courses.showCoursesListEntries(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.programId, req.body.acadSessionId),
            Courses.showCoursesListEntriesCount(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.programId, req.body.acadSessionId)
        ])

        res.status(200).json({
            courses : result[0].recordset,
            entries : result[1].recordset[0]['']
        })
    }catch(error){
        console.log(error)
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

export const showCoursesDataByPagesController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Courses.courseListByPages(res.locals.slug, res.locals.biddingId, req.body.pageNo, req.body.letterSearch, req.body.entriesCount, req.body.programId, req.body.acadSessionId)
        res.status(200).json(result.recordset)
    }catch(error){
        // console.log(error)
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

export const addCourseController = async (req,res) => {
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded.')
        }

        // Read file from memory
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" })
        const sheetName = workbook.SheetNames[0]
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

        const courseData = data.map(item => {
            let defaultValue =  null
            return {
                course_name: item.areaName == undefined ?  defaultValue : item.courseName.replace(/\s+/g, ' ').trim(), 
                course_id: item.courseId == undefined ?  defaultValue : item.courseId,
                credits: item.credits == undefined ?  defaultValue : item.credits,
                program_id: item.programId == undefined ?  defaultValue : item.programId,
                acad_session: item.acadSession == undefined ?  defaultValue : item.acadSession.replace(/\s+/g, ' ').trim(),
                area_name: item.areaName == undefined ?  defaultValue : item.areaName.replace(/\s+/g, ' ').trim(),
                year_of_introduction: item.yearOfIntroduction == undefined ?  defaultValue : item.yearOfIntroduction,
                min_demand_criteria: item.minDemandCriteria == undefined ?  defaultValue : item.minDemandCriteria
            }
        })

        let courses = { courses: courseData }

        const result = await Courses.addCourses(res.locals.slug, res.locals.biddingId, 1, courses)

        // console.log("result add file", result)
        res.status(200).json(JSON.parse(result.output.output_json))

    }catch(error){
        // console.log("add error :", error)
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

export const updateCourseController = async (req,res) => {
    try{
        // console.log(req.body.inputJSON)
        const result = await Courses.updateCourse(res.locals.slug, res.locals.biddingId,1, req.body.inputJSON)
        res.status(200).json(JSON.parse(result.output.output_json));

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

export const deleteCourseController = async (req,res) => {
    try{
        const result = await Courses.deleteCourse(res.locals.slug, res.locals.biddingId,1, req.body.courseId)
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


export const deleteAllCoursesController = async (req,res) => {
    try{
        const result = await Courses.deleteAllCourses(res.locals.slug, res.locals.biddingId, 1, req.body.courseList)
        res.status(200).json(JSON.parse(result.output.output_json))
    }catch(error){
        console.log(error)
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

export const getCourseListByProgramIdController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            Courses.courseListByProgramId(res.locals.slug, res.locals.biddingId,req.body.programId,req.body.entriesCount),
            Courses.courseListByProgramIdCount(res.locals.slug, res.locals.biddingId,req.body.programId),
            Courses.acadSessionListByProgramId(res.locals.slug, res.locals.biddingId,req.body.programId,req.body.entriesCount)
            //Pagination Query Call Remaining
        ])
        // console.log(result[1].recordset[0][''])
        res.status(200).json({
          courseListByProgramId : result[0].recordset,
          courseListByProgramIdCount : result[1].recordset[0][''],
          acadSessionListByProgramId : result[2].recordset
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

export const getCourseListByAcadSessionIdController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            Courses.courseListByAcadSessionId(res.locals.slug, res.locals.biddingId,req.body.programId, req.body.sessionId, req.body.entriesCount),
            Courses.courseListForOptionByAcadSessionId(res.locals.slug, res.locals.biddingId,req.body.programId, req.body.sessionId),
            Courses.courseListByAcadSessionIdCount(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId)
            //Pagination Query Call Remaining
        ])
        res.status(200).json({
            courseListByAcadSessionId : result[0].recordset,
            courseListForOptionByAcadSessionId : result[1].recordset,
            courseListByAcadSessionIdCount : result[2].recordset[0]['']
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

export const getCourseListByCourseIdController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            Courses.courseListByCourseId(res.locals.slug, res.locals.biddingId,req.body.programId, req.body.acadSessionId, req.body.courseId, req.body.entriesCount),
            Courses.courseListByCourseIdCount(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.acadSessionId, req.body.courseId)
            // Pagination Query Call Remaining
        ])
        console.log(result)
        res.status(200).json({
            courseListByCourseId : result[0].recordset,
            courseListByCourseIdCount : result[1].recordset[0]['']
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


export const getGenerateCourseExcelController = async (req, res) => {
    try{
        const workbook = new excel.Workbook()
        const worksheet = workbook.addWorksheet('Sheet1')

        const acadSessionOfBiddingSessions = await BiddingSession.acadSessionsList()

        const acadSessionDropDownOptions = acadSessionOfBiddingSessions.recordset.map(item => item.acad_session)

        worksheet.columns = [
            { header: 'courseName', key: 'courseName', width: 15 },
            { header: 'courseId', key: 'courseId', width: 10 },
            { header: 'credits', key: 'credits', width: 10 },
            { header: 'programId', key: 'programId', width: 10 },
            { header: 'acadSession', key: 'acadSession', width: 20 },
            { header: 'areaName', key: 'areaName', width: 15 },
            { header: 'yearOfIntroduction', key: 'yearOfIntroduction', width: 20 },
            { header: 'minDemandCriteria', key: 'minDemandCriteria', width: 20 }
        ]

        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'center' };
        })

        const maxFormulaLength = 255
        const truncatedOptions = acadSessionDropDownOptions.join(',').slice(0, maxFormulaLength)

        const formulaValue = `"${truncatedOptions}"`

        for (let rowNumber = 2; rowNumber <= 2000; rowNumber++) {
            const cell = worksheet.getCell(`E${rowNumber}`);
            cell.dataValidation = {
                type: 'list',
                formula1: formulaValue,
                allowBlank: true,
                showErrorMessage: true,
                errorTitle: 'Invalid Entry',
                error: 'Please select a value from the dropdown list.'
            }
        }

        const filePath = path.join(__dirname, 'sampleForCourses.xlsx')

        await workbook.xlsx.writeFile(filePath)

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending Excel file:', err);
                return res.status(500).send('Error sending Excel file')
            }
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