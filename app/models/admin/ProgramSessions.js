import { sql, poolConnect } from "../../config/db.js";

export default class ProgramSessions {
    static programsSessionsList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT DISTINCT ps.id, p.program_name, ad.acad_session, bs.year, 
                IIF(ps.min_credits IS NULL, 0, ps.min_credits) AS min_credits,
                IIF(ps.max_credits IS NULL, 0, ps.max_credits) AS max_credits 
                FROM [${slug}].program_sessions ps 
                INNER JOIN [${slug}].programs p ON ps.program_id = p.program_id AND p.bidding_session_lid = @biddingId
                INNER JOIN [${slug}].bidding_session bs ON ps.bidding_session_lid = bs.id
                INNER JOIN [dbo].acad_sessions ad ON ps.sap_acad_session_id = ad.sap_acad_session_id  AND ps.bidding_session_lid = @biddingId  AND ps.active = 1`
            )
        })
    }

    static getProgramSessionsListByRefresh(slug, biddingId, userId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_refresh_program_sessions]`)
        })
    }

    static updateProgramSession(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar, inputJSON)
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_program_session_credits]`)
        })
    }
}
