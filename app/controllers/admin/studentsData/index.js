import StudentsData from "../../../models/admin/StudentsData.js"
import { isJsonString } from "../../../utils/util.js"
import xlsx from 'xlsx'
import excel from 'exceljs'
import path from 'path'
import { fileURLToPath } from "url"
import { hashPassword } from "../../../utils/hash.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const studentsDataController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        const result = await Promise.all([
            StudentsData.studentsDataList(res.locals.slug, res.locals.biddingId),
            StudentsData.programList(res.locals.slug, res.locals.biddingId),
            StudentsData.studentDataListCount(res.locals.slug, res.locals.biddingId)
        ])
        // console.log(result[0].recordset)
        res.render('admin/studentsData/index', {
            breadcrumbs : req.breadcrumbs,
            studentsDataList : result[0].recordset,
            programList : result[1].recordset,
            studentsDataListCount : result[2].recordset[0][''],
            active : sidebarActive[2]
        })
    }catch(error){
        console.log('error in student controller : ', error.message)
    }
}


export const updateStudentsDataController = async (req,res) => {
    try{
        // console.log(req.body.inputJSON)
        const result = await StudentsData.updateStudentsData(res.locals.slug, res.locals.biddingId,1, req.body.inputJSON)
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

export const deleteStudentsDataController = async (req,res) => {
    try{
        const result = await StudentsData.deleteStudentsData(res.locals.slug, res.locals.biddingId,1,req.body.studentId)
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

export const addStudentsDataController = async (req,res) => {
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded.')
        }

        // Read file from memory
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" })
        const sheetName = workbook.SheetNames[0]
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

        const hashPasswords = async (data) => {
            const hashedPasswords = await Promise.all(
                data.map(async (item) => {
                    let hashedPassword = '';
                    if (item.dateofBirthDate) {
                        hashedPassword = await hashPassword(convertExcelDateToJSDate(item.dateofBirthDate.toString()), false);
                    } else {
                        hashedPassword = await hashPassword('pass@123');
                    }
                    let defaultValue = null;
                    return {
                        sap_id: item.studentSapId ?? defaultValue,
                        roll_no: item.rollNo !== undefined ? item.rollNo.toString() : defaultValue,
                        student_name: item.studentName !== undefined ? item.studentName.replace(/\s+/g, ' ').trim() : defaultValue,
                        email: item.email !== undefined ? item.email.replace(/\s+/g, ' ').trim() : defaultValue,
                        program_id: item.programId ?? defaultValue,
                        bid_points: item.bidPoints ?? defaultValue,
                        year_of_joining: item.yearOfJoining ?? defaultValue,
                        previous_elective_credits: item.previousElectiveCredits ?? defaultValue,
                        password: hashedPassword,
                        dob: item.dateofBirthDate == undefined ? defaultValue : convertExcelDateToJSDate(item.dateofBirthDate.toString(), true)
                    };
                })
            )
            return hashedPasswords
        }

        const convertExcelDateToJSDate = (excelDate, isDelimeter) => {
            const millisecondsPerDay = 24 * 60 * 60 * 1000
            const epoch = new Date(Date.UTC(1900, 0, 1))
            const daysSinceEpoch = excelDate - 2
            const millisecondsSinceEpoch = daysSinceEpoch * millisecondsPerDay
            return formatJSDate(new Date(epoch.getTime() + millisecondsSinceEpoch), isDelimeter)
        };

        const formatJSDate = (date, isDelimeter) => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const delimiter = isDelimeter ? '-' : ''
            return `${day}${delimiter}${month}${delimiter}${year}`
        }

        const studentsDataList = await hashPasswords(data)
        const studentsList = { student_data: studentsDataList }

        const result = await StudentsData.addStudentsData(res.locals.slug, res.locals.biddingId, 1, studentsList)
        res.status(200).json(JSON.parse(result.output.output_json))

    }catch(error) {
        // console.log(error.message)
        if (isJsonString(error.originalError.info.message)) {
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


export const deleteAllStudentsDataController = async (req,res) => {
    try{
        const result = await StudentsData.deleteAllStudentsData(res.locals.slug, res.locals.biddingId, 1, req.body.studentList)
        res.status(200).json(JSON.parse(result.output.output_json))
    }catch(error){
        // console.log(error.message)
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

export const showStudentEntriesController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            StudentsData.showStudentListEntries(res.locals.slug, res.locals.biddingId,req.body.programId, req.body.entriesCount),
            StudentsData.showStudentListEntriesCount(res.locals.slug, res.locals.biddingId, req.body.programId)
            //Pagination Query Call Remaining
        ])
        // console.log(result[1].recordset)
        res.status(200).json({
            studentListByEntries : result[0].recordset,
            studentListByEntriesCount : result[1].recordset[0]['']
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

export const getStudentListByProgramIdController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            StudentsData.studentListByProgramId(res.locals.slug, res.locals.biddingId,req.body.programId,req.body.entriesCount),
            StudentsData.studentListForOptionByProgramId(res.locals.slug, res.locals.biddingId,req.body.programId),
            StudentsData.studentListByProgramIdCount(res.locals.slug, res.locals.biddingId, req.body.programId)
            //Pagination Query Call Remaining
        ])

        res.status(200).json({
            studentListByProgramId : result[0].recordset,
            studentOptionsListByProgramId : result[1].recordset,
            studentListByProgramIdCount : result[2].recordset[0]['']
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

export const getStudentListByStudentIdController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            StudentsData.studentListByStudentId(res.locals.slug, res.locals.biddingId,req.body.programId,req.body.studentId),
            StudentsData.studentListByStudentIdCount(res.locals.slug, res.locals.biddingId,req.body.programId,req.body.studentId)
            //Pagination Query Call Remaining
        ])

        res.status(200).json({
            studentListByStudentId : result[0].recordset,
            studentListByStudentIdCount : result[1].recordset[0]['']
        })
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


export const showStudentDataByPagesController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            StudentsData.studentListByPages(res.locals.slug, res.locals.biddingId, req.body.letterSearch, req.body.pageNo, req.body.entriesCount),
            StudentsData.studentListByPagesByCount(res.locals.slug, res.locals.biddingId, req.body.letterSearch, req.body.pageNo)
        ])
        // console.log(result[1].recordset)
        res.status(200).json({
            studentListByPages : result[0].recordset,
            studentListByPagesByCount : result[1].recordset[0]['']
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


export const getGenerateStudentsDataExcelController = async (req,res) => {
    try{
        const workbook = new excel.Workbook()
        const worksheet = workbook.addWorksheet('Sheet1')

        worksheet.columns = [
            { header: 'studentSapId', key: 'studentSapId', width: 15 },
            { header: 'rollNo', key: 'rollNo', width: 10 },
            { header: 'studentName', key: 'studentName', width: 15 },
            { header: 'email', key: 'email', width: 30 },
            { header: 'programId', key: 'programId', width: 15 },
            { header: 'bidPoints', key: 'bidPoints', width: 15 },
            { header: 'yearOfJoining', key: 'yearOfJoining', width: 20 },
            { header: 'previousElectiveCredits', key: 'previousElectiveCredits', width: 20 },
            { header: 'dateofBirthDate', key: 'dateofBirthDate', width: 25 }
        ]

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'center' }
        })

        const filePath = path.join(__dirname, 'sampleForStudentData.xlsx')

        await workbook.xlsx.writeFile(filePath);

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending Excel file:', err);
                return res.status(500).send('Error sending Excel file');
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