import { poolConnect, sql } from "../../config/db.js";

export default class ConcentrationSettings {
    static concentrationSettingsList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT cs.id, a.id AS areaId, concentration_name AS name,
                concentration_lid AS concentraionId, 
                cs.bidding_session_lid AS biddingId,
                IIF(total_elective_credits IS NULL, 0, total_elective_credits) AS totalCredits,
                IIF(max_credits_per_area IS NULL, 0, max_credits_per_area) AS maxCreditsPerArea,
                IIF(no_of_areas_to_cover IS NULL, 0, no_of_areas_to_cover) AS noofAreasToCover,
                IIF(min_credits_per_area IS NULL, 0, min_credits_per_area) AS minCreditsPerArea,  
                IIF(primary_area IS NULL, 'NA', primary_area) AS primaryArea,
                IIF(min_credits_in_primary_area IS NULL, 0, min_credits_in_primary_area) AS minCreditsInPriArea 
                FROM [${slug}].concentration_settings cs
                LEFT JOIN [${slug}].areas a ON a.area_name = cs.primary_area AND cs.active = 1 
                AND cs.bidding_session_lid = @biddingId AND a.active = 1 AND a.bidding_session_lid = @biddingId 
                WHERE cs.active = 1 AND cs.bidding_session_lid = @biddingId`
            )
        })
    }

    static concentrationSettingsByRefresh(slug, biddingId, userId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_refresh_concentration_settings]`)
        })
    }

    static updateConcentrationSettings(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('bidding_session_lid', sql.Int, biddingId) 
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_concentration_settings]`)
        })
    }

    static deleteConcentrationSettings(slug, biddingId, userId, concentrationSettingsId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_concentration_settings_lid', sql.Int, concentrationSettingsId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_concentration_settings]`)
        })
    }
}