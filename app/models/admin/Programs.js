import { sql, poolConnect } from "../../config/db.js";

export default class Programs {
    static getProgramList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT id, RTRIM(LTRIM(program_name)) AS program_name,
                RTRIM(LTRIM(abbr)) AS abbr, RTRIM(LTRIM(ISNULL(program_code,'NA'))) program_code  
                FROM [${slug}].programs WHERE active = 1 AND bidding_session_lid = @biddingId
            `)
        })
    }

    static getProgramsFromDB(slug, biddingId){
        return poolConnect.then(pool => {
            let abbr = 'SBM-NM-M';
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('abbr', sql.NVarChar, abbr)
            .query(`SELECT RTRIM(LTRIM(dboP.program_name)) AS program_name, RTRIM(LTRIM(dboP.abbr)) 
                AS abbr, dboP.program_id 
                FROM [dbo].programs dboP WHERE dboP.program_id NOT IN( SELECT program_id
                FROM [${slug}].programs p
                INNER JOIN [${slug}].bidding_session bs ON bs.id = p.bidding_session_lid 
                WHERE p.active = 1 AND bs.status = 1) AND dboP.abbr = @abbr`
            )
        })
    }

    static addProgram(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_import_programs]`)
        })
    }

    static deleteProgram(slug, biddingId, userId, programId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_program_lid', sql.Int, programId)
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_programs]`)
        })
    }
}