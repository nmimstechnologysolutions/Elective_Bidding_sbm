import { poolConnect, sql } from "../../config/db.js";

export default class Areas {
    static areasList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT a.id, a.area_name FROM [${slug}].areas a WHERE a.active = 1 AND 
                a.bidding_session_lid = @biddingId ORDER BY a.id `
            )
        })
    }

    static areasListByRefresh(slug, biddingId, userId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_refresh_areas]`)
        })
    }
}