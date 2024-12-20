import { poolConnect, sql } from "../../config/db.js";

export default class Specialization {
    static specializationList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT id, concentration_name 
                FROM [${slug}].concentration WHERE active = 1 AND bidding_session_lid = @biddingId`
            )
        })
    }

    static addSpecialization(slug, biddingId, userId, inputJSON){
        console.log(JSON.stringify(inputJSON))
        return poolConnect.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_specialization]`);
        })
    }

    static updateSpecialization(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar, JSON.stringify(inputJSON))
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_specialization]`
            )
        })
    }

    static deleteSpecialization(slug, biddingId, userId, specializationId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_concentration_lid', sql.Int, specializationId)
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_specialization]`)
        })
    }
}