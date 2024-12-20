import DivisionBatches from "../../../models/admin/DivisionBatches.js"
import { isJsonString } from "../../../utils/util.js"
import xlsx from 'xlsx'
import excel from 'exceljs'
import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const divisionBatchesController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        const result = await Promise.all([
            DivisionBatches.divisionBatchesList(res.locals.slug,res.locals.biddingId),
            DivisionBatches.programList(res.locals.slug,res.locals.biddingId),
            DivisionBatches.divisionBatchesListCount(res.locals.slug, res.locals.biddingId)
        ])
        // console.log(result[1].recordset)
        res.render('admin/divisionBatches/index',{
            breadcrumbs : req.breadcrumbs,
            divisionBatchesList : result[0].recordset,
            programList : result[1].recordset,
            divisionBatchesListCount : result[2].recordset[0][''],
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error in division batches controller :", error.message)
    }
}


export const updateDivisionBatchesController = async (req,res) => {
    try{
        // console.log(req.body.inputJSON)
        const result = await DivisionBatches.updateDivisionBatch(res.locals.slug,res.locals.biddingId,1,req.body.inputJSON)
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


export const deleteDivisionBatchesController = async (req,res) => {
    try{
        // console.log(req.body.divisionBatchId)
        const result = await DivisionBatches.deleteDivisionBatch(res.locals.slug,res.locals.biddingId,1,req.body.divisionBatchId)
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

export const addDivisionBatchesController =  async (req,res) => {
    try{
        if (!req.file) {
            return res.status(400).send('No file uploaded.')
        }

        // Read file from memory
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" })
        const sheetName = workbook.SheetNames[0]
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

        const divisionBatchesData = data.map(item => {
            const defaultValue = null;
            return {
                course_name: item.courseName == undefined ? defaultValue: item.courseName,
                course_id: item.courseId == undefined ? defaultValue : item.courseId,
                division: item.division == undefined ? defaultValue : item.division,
                batch: item.batch == undefined ? defaultValue : item.batch,
                max_seats: item.maxSeats == undefined ? defaultValue : item.maxSeats
            }
        })

        let divisionBatches = { division_batches: divisionBatchesData }

        const result = await DivisionBatches.addDivisionBatch(res.locals.slug, res.locals.biddingId, 1, divisionBatches)
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

export const deleteAllDivisionBatchesController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await DivisionBatches.deleteAllDivisionBatch(res.locals.slug, res.locals.biddingId, 1, req.body.divBatchList)
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


export const showDivBatchesEntriesController = async (req,res) => {
    try{
        console.log(req.body)
        const result = await Promise.all([
            DivisionBatches.showDivBatchListEntries(res.locals.slug,res.locals.biddingId,req.body.programId, req.body.acadSessionId, req.body.entriesCount),
            DivisionBatches.showDivBatchListEntriesCount(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.acadSessionId)
        ])
        console.log(result[0].recordset)
        res.status(200).json({
            divBatchesListByEntries : result[0].recordset,
            divBatchesListByEntriesCount : result[1].recordset[0]['']
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

export const showDivBatchesByPorogramIdController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            DivisionBatches.divBatchListByProgramId(res.locals.slug,res.locals.biddingId,req.body.programId, req.body.entriesCount),
            DivisionBatches.acadSessionListForOptionByProgramId(res.locals.slug,res.locals.biddingId,req.body.programId),
            DivisionBatches.divBatchListByProgramIdCount(res.locals.slug, res.locals.biddingId, req.body.programId)
        ])
        res.status(200).json({
            divBatchListByProgramId : result[0].recordset,
            acadSessionListForOptionByProgramId : result[1].recordset,
            divBatchListByProgramIdCount : result[2].recordset[0]['']
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

export const showDivBatchesByAcadSessionIdController = async (req,res) => {
    try{
        // console.log(req.body)
        const result = await Promise.all([
            DivisionBatches.divBatchListByAcadSessionList(res.locals.slug,res.locals.biddingId,req.body.programId, req.body.acadSessionId, req.body.entriesCount),
            DivisionBatches.divBatchListByAcadSessionListCount(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.acadSessionId)
        ])

        res.status(200).json({
            divBatchListByAcadSessionId : result[0].recordset,
            divBatchListByAcadSessionIdCount : result[1].recordset[0]['']
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


export const showDivBatchesListByPagesController = async (req,res) => {
    try{
        // console.log(">>>>",req.body)

        const result = await Promise.all([
            DivisionBatches.divBatchListByPages(res.locals.slug, res.locals.biddingId, req.body.letterSearch, req.body.programId, req.body.acadSessionId, req.body.entriesCount, req.body.pageNo),
            DivisionBatches.divBatchListByPagesCount(res.locals.slug, res.locals.biddingId, req.body.letterSearch, req.body.programId, req.body.acadSessionId)
        ])
        // console.log(result[1].recordset[0][''])
        res.status(200).json({
            divBatchListByPages : result[0].recordset,
            divBatchListByPagesCount : result[1].recordset[0]['']
        })
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

export const getGenerateDivBatchesExcelController = async (req,res) => {
    try{
        const workbook = new excel.Workbook()
        const worksheet = workbook.addWorksheet('Sheet1')

        worksheet.columns = [
            { header: 'courseName', key: 'courseName', width: 15 },
            { header: 'courseId', key: 'courseId', width: 15 },
            { header: 'division', key: 'division', width: 10 },
            { header: 'batch', key: 'batch', width: 10 },
            { header: 'maxSeats', key: 'maxSeats', width: 10 }
        ]

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'center' };
        })

        const filePath = path.join(__dirname, 'sampleForDivBatch.xlsx')
        await workbook.xlsx.writeFile(filePath)

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending Excel file:', err);
                return res.status(500).send('Error sending Excel file');
            }
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