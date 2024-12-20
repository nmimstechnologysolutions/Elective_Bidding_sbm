import { poolConnect, sql } from "../../config/db.js";

export default class BonusPoints{
    static bonusPointsList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT debp.id, round_name, points_to_increase_after_demand AS incrementPoints 
                FROM [${slug}].demand_estimation_bid_points debp
                INNER JOIN [${slug}].round_settings rs ON rs.round_lid = debp.round_lid 
                WHERE debp.active = 1 AND debp.bidding_session_lid = @biddingId`)
        })
    }

    static addBonusPoints(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_demand_estimation_bid_points]`)
        })
    }

    static editBonusPoints(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_demand_estimation_bid_points]`)
        })
    }

    static deleteBonusPoints(slug, biddingId, userId, bounsPointsId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('id', sql.Int, bounsPointsId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_demand_estimation_bid_points]`)
        })
    }

    
}