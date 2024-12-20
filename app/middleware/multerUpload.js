import multer from "multer"

const excelFilter = (req, file, cb) => {
    if(file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml")){
        cb(null, true)
    }else{
        cb("Please upload only excel file", false)
    }
}

export const uploadFile = multer({storage: multer.memoryStorage(), fileFilter : excelFilter})