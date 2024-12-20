import CompletedCourses from "../../../models/admin/CompletedCourses.js"
import { isJsonString } from "../../../utils/util.js"
import xlsx from 'xlsx'
import excel from 'exceljs'
import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const completedCourseController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        const result = await CompletedCourses.compeletedCoursesList(res.locals.slug,res.locals.biddingId)
        // console.log(result)
        res.render('admin/completedCourses/index',{
            breadcrumbs : req.breadcrumbs,
            completedCoursesList : result.recordset,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error in completed courses controller :", error.message)
    }
}


export const updateCompletedCourseController = async (req,res) => {
    try{
        const result = await CompletedCourses.editCompletedCourse(res.locals.slug,res.locals.biddingId,1,req.body.inputJSON)
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

export const deleteCompletedCourseController = async (req,res) => {
    try{
        console.log(req.body)
        // const result = await CompletedCourses.deleteCompletedCourse(res.locals.slug,res.locals.biddingId,1,req.body.completedCourseId) Not Working
        const result = await CompletedCourses.deleteAllCompletedCourse(res.locals.slug, res.locals.biddingId, 1, req.body.completedCourseId)
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

export const deleteAllCompletedCourseController = async (req,res) => {
    try{
        const result = await CompletedCourses.deleteAllCompletedCourse(res.locals.slug, res.locals.biddingId, 1, req.body.completedCourseList)
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

export const addCompletedCourseController = async (req,res) => {
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded.')
        }

        // Read file from memory
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" })
        const sheetName = workbook.SheetNames[0]
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

        const completedCourseData = data.map(item => {
            let defaultValue = null;
            return {
                sap_id: item.studentSapId == undefined ? defaultValue : item.studentSapId,
                acad_session: item.acadSession == undefined ? defaultValue : item.acadSession.replace(/\s+/g, ' ').trim(),
                course_id: item.courseId == undefined ? defaultValue : item.courseId,
                course_name: item.courseName == undefined ? defaultValue : item.courseName.replace(/\s+/g, ' ').trim()
            }
        })

        const completeCoursesList = { completed_courses: completedCourseData}

        const result = await CompletedCourses.addCompletedCourse(res.locals.slug, res.locals.biddingId, 1, completeCoursesList)
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

export const getGenerateCompletedCourseExcelController = async (req,res) => {
    try{
        const workbook = new excel.Workbook()
        const worksheet = workbook.addWorksheet('Sheet1')

        worksheet.columns = [
            { header: 'studentSapId', key: 'studentSapId', width: 15 },
            { header: 'acadSession', key: 'acadSession', width: 15 },
            { header: 'courseId', key: 'courseId', width: 10 },
            { header: 'courseName', key: 'courseName', width: 10 },
        ]

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'center' };
        })

        const filePath = path.join(__dirname, 'sampleForCompletedCourse.xlsx')
        await workbook.xlsx.writeFile(filePath)

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending Excel file:', err);
                return res.status(500).send('Error sending Excel file');
            }
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