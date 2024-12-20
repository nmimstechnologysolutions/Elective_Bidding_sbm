export const isJsonString = (str) => {
    if (typeof str !== 'string') return false
    try{
        JSON.parse(str)
        return true
    }catch(error){
        return false
    }
}

export const convertExcelTimeToHHMMSS = (excelTime) => {
    if (typeof excelTime === 'number') {
        const hours = Math.floor(excelTime * 24);
        let minutes = Math.floor((excelTime * 24 - hours) * 60)
        if(minutes%5 == 1){
             minutes = Math.floor((excelTime * 24 - hours) * 60);
        }
       
        if(minutes%5 == 4){
             minutes = Math.ceil((excelTime * 24 - hours) * 60);
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    } else {
        return excelTime;
    }
}