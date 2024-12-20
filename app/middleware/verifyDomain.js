import { poolConnect } from "../config/db.js";
    
export const verifySubDomain = async (req,res,next) =>  {
    try {
        const checkArr = ['map', 'png', 'jpg', 'jpeg', 'css', 'js', 'ico'];
        let isUrl = true;
        const splitedDomain = req.url.split('.');
        for (const item of checkArr) {
            if (splitedDomain[splitedDomain.length - 1] === item) {
                isUrl = false;
                break;
            }
        }

        // console.log('isUrl:', isUrl)
        if (isUrl) {
            const subDomain = req.headers.host.split(".")[0];

            if (subDomain === 'timetable') {
                return next();
            }

            res.locals.slug = subDomain
            res.locals.organizationId = 24
            res.locals.campusId = 10
            res.locals.campusIdSap = '50070078'
            res.locals.organizationIdSap = '00004533'
            res.locals.academicYear = 2023
            res.locals.page_filter = JSON.parse(process.env.PAGE_FILTER)

            const pool = await poolConnect
            const slug = res.locals.slug

            
            const recordCountResult = await pool.request().query(`SELECT COUNT(*) AS count FROM [${slug}].bidding_session WHERE status = 1`)
            const count = recordCountResult.recordset[0].count
            // console.log(count)


            let query;
            if (count > 0) {
                query = `SELECT bidding_name, id, status FROM [${slug}].bidding_session WHERE active = 1 AND status = 1`;
            } else {
                query = `SELECT bidding_name, id, status FROM [${slug}].bidding_session WHERE active = 1`;
            }

            const result = await pool.request().query(query);
            // console.log(result)
            res.locals.biddingId = result.recordset[0].id;
            res.locals.biddingName = result.recordset[0].bidding_name;
            res.locals.status = result.recordset[0].status;

            //student data need to change while login 
            
            // res.locals.userId = 671
            // res.locals.firstName = 'MANAV'
            // res.locals.username = 'manav.talwar001@nmims.edu.in'
            // res.locals.fullName = 'MANAV TALWAR'
            // res.locals.useSapId = '80512200001'
            // res.locals.studentId = 668


            return next();
        } else {
            return next();
        }
    } catch (error) {
        console.error('Error in verifySubDomain middleware:', error.message);
        return next();
    }
}