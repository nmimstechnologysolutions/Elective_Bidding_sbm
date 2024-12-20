import ElectiveTimetable from "../../../models/admin/ElectiveTimetable.js"
import { convertExcelTimeToHHMMSS, isJsonString } from "../../../utils/util.js"
import xlsx from 'xlsx'
import excel from 'exceljs'
import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const electiveTimetableController = async (req,res) => {
    try {
        let sidebarActive = req.sidebarActive.split('/')

        const result = await Promise.all([
            ElectiveTimetable.programList(res.locals.slug,res.locals.biddingId),
            ElectiveTimetable.acadSessions(res.locals.slug,res.locals.biddingId),
            ElectiveTimetable.roomList(res.locals.slug,res.locals.biddingId),
            ElectiveTimetable.maxAndMinTimeList(res.locals.slug,res.locals.biddingId),
            ElectiveTimetable.timeSlotList()
        ])
        // console.log(result[0].recordset)
        res.render('admin/electiveTimetable/index',{
            breadcrumbs : req.breadcrumbs,
            programList : result[0].recordset,
            acadSessions : result[1].recordset,
            roomList : result[2].recordset,
            maxAndMinTimeList : result[3].recordset[0],
            timeSlotList : result[4].recordset,
            active : sidebarActive[2]
        })
    } catch (error) {
        console.log("error in elective timetable controller : ", error.message)
    }
}


export const electiveTimetableAsPerDayController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await ElectiveTimetable.timeTableListByDay(res.locals.slug, res.locals.biddingId,req.body.acadSessionId, req.body.dayId)
        res.status(200).json({courseList : result.recordset})
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

export const getAcadSessionByProgramForDeleteController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await ElectiveTimetable.acadSessionByProgram(res.locals.slug, res.locals.biddingId, req.body.programId)
        res.status(200).json({acadSessionsList : result.recordset})
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

export const addElectiveTimetableController = async (req,res) => {
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded.')
        }

        // Read file from memory
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" })
        const sheetName = workbook.SheetNames[0]
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

        const electiveTimetableData = data.map(item => {
            const defaultValue = null
            return {
                program_id: item.programId == undefined ? defaultValue : item.programId,
                acad_session: item.acadSession == undefined ? defaultValue : item.acadSession.replace(/\s+/g, ' ').trim(),
                course_name: item.courseName == undefined ? defaultValue : item.courseName.replace(/\s+/g, ' ').trim(),
                division: item.division == undefined ? defaultValue : item.division.replace(/\s+/g, ' ').trim(),
                batch: item.batch == undefined ? defaultValue : item.batch,
                day: item.day == undefined ? defaultValue : item.day,
                start_time: item.startTime == undefined ? defaultValue : convertExcelTimeToHHMMSS(item.startTime),
                end_time: item.endTime == undefined ? defaultValue : convertExcelTimeToHHMMSS(item.endTime),
                room_no: item.roomNo == undefined ? defaultValue : item.roomNo.toString(),
                faculty_id: item.facultyId == undefined ? defaultValue : item.facultyId.toString(),
                faculty_name: item.facultyName == undefined ? defaultValue : item.facultyName.replace(/\s+/g, ' ').trim(),
                faculty_type_abbr: item.facultyType == undefined ? defaultValue : item.facultyType
            }
        })

        const timetableDataValue = JSON.stringify({ timetable: electiveTimetableData })


        const result = await ElectiveTimetable.addElectiveTimeTableData(res.locals.slug, res.locals.biddingId, 1, timetableDataValue)
        res.status(200).json(JSON.parse(result.output.output_json))
    }catch(error){
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

export const deleteElectiveTimetableByAcadSessionController = async (req,res) => {
    try{
        const result =  await ElectiveTimetable.deleteTimetableByAcadSession(res.locals.slug, res.locals.biddingId, 1, req.body.type, req.body.programId)
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


export const getGenerateExcelController = async (req,res) => {
    try {
        const workbook = new excel.Workbook()
        const worksheet = workbook.addWorksheet('Sheet1')

        worksheet.columns = [
            { header: 'programId', key: 'programId', width: 15 },
            { header: 'acadSession', key: 'acadSession', width: 15 },
            { header: 'courseName', key: 'courseName', width: 15 },
            { header: 'division', key: 'division', width: 15 },
            { header: 'batch', key: 'batch', width: 15 },
            { header: 'day', key: 'day', width: 15 },
            { header: 'startTime', key: 'startTime', width: 15 },
            { header: 'endTime', key: 'endTime', width: 15 },
            { header: 'roomNo', key: 'roomNo', width: 15 },
            { header: 'facultyId', key: 'facultyId', width: 15 },
            { header: 'facultyName', key: 'facultyName', width: 15 },
            { header: 'facultyType', key: 'facultyType', width: 15 },
        ]

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true }
            cell.alignment = { horizontal: 'center', vertical: 'center' }
        })

        for (let rowNumber = 2; rowNumber <= 2000; rowNumber++) {
            const cell = worksheet.getCell(`F${rowNumber}`);
            cell.dataValidation = {
                type: 'list',
                formulae: ['"Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"'],
                allowBlank: true,
            };
        }

        const filePath = path.join(__dirname, 'sampleForTimetable.xlsx')

        await workbook.xlsx.writeFile(filePath)

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending Excel file:', err);
                return res.status(500).send('Error sending Excel file')
            }
        })
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