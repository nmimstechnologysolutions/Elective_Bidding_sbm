import Areas from "../../../models/admin/Areas.js"
import { isJsonString } from "../../../utils/util.js" 

export const areasController = async (req,res) => {
    try {
        let sidebarActive = req.sidebarActive.split('/')
        const result = await Areas.areasList(res.locals.slug, res.locals.biddingId)
        res.render('admin/areas/index', {
            breadcrumbs : req.breadcrumbs,
            areaList : result.recordset,
            active : sidebarActive[2]
        })
    } catch (error) {
        console.log('error in areas controller :', error.message)
    }
}


export const getAreasListByRefreshController = async (req,res) => {
    try{
        const result = await Areas.areasListByRefresh(res.locals.slug, res.locals.biddingId, 1)
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