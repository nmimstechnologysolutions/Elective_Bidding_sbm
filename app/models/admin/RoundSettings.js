import { poolConnect, sql } from "../../config/db.js";

export default class RoundSettings{
    static roundSettingsList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .query(`SELECT id, round_lid, round_name, total_students, is_bid_limit, bid_limit,
                IIF(total_courses IS NULL, '', total_courses) AS total_courses,
                FORMAT(end_date_time, 'dd MMM yyyy, hh:mm tt') AS end_date_time, 
                FORMAT(start_date_time, 'dd MMM yyyy, hh:mm tt') AS start_date_time,
                FORMAT(end_date_time, 'yyyy-MM-dd HH:mm:ss') AS end_date_time_attr,
                FORMAT(start_date_time, 'yyyy-MM-dd HH:mm:ss') AS start_date_time_attr
                FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1`)
        })
    }

    static preDefinedRoundList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .query(`SELECT esr.id, esr.round_name 
                FROM [dbo].elective_selection_rounds esr 
                WHERE esr.id NOT IN( SELECT rs.round_lid
                FROM [${slug}].round_settings rs
                INNER JOIN [${slug}].bidding_session bs ON bs.id = rs.bidding_session_lid
                WHERE rs.active = 1 AND bs.status = 1 )`)
        })
    }

    static studentsList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .query(`SELECT sd.id AS student_lid, * FROM [${slug}].student_data sd 
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                WHERE sd.bidding_session_lid = @biddingId AND sd.active = 1 AND p.bidding_session_lid = @biddingId AND p.active = 1`)
        })
    }


    static courseList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT c.* FROM [${slug}].courses c 
                INNER JOIN [${slug}].programs p ON c.program_id = p.program_id
                WHERE c.bidding_session_lid = @biddingId AND c.active = 1 AND p.bidding_session_lid = @biddingId AND p.active = 1`)
        })
    }


    static roundSettingsDetailsByRound(slug, biddingId, roundId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('roundId', sql.Int, roundId)
            .input('biddingId', sql.Int, biddingId)
            .query(`select * from [${slug}].round_settings where round_lid = @roundId AND bidding_session_lid = @biddingId AND active = 1`)
        })
    }

    static studentsListByRound(slug, biddingId, roundId){
        return poolConnect.then(pool => {
            return pool.request()
            .input("roundId", sql.Int, roundId)
            .input("biddingId", sql.Int, biddingId)
            .query(`select sd.id AS student_lid,sd.sap_id, sd.student_name, p.program_name from [${slug}].student_round_mapping srm
                INNER JOIN [${slug}].student_data sd on srm.student_lid = sd.id 
                INNER JOIN [${slug}].programs p on p.program_id = sd.program_id
                where  srm.round_lid = @roundId AND srm.bidding_session_lid = @biddingId AND srm.active = 1 
                AND sd.bidding_session_lid = @biddingId AND sd.active = 1 
                AND p.bidding_session_lid = @biddingId AND p.active = 1`
            )
        })
    }

    static courseListByRound(slug, biddingId, roundId){
        return poolConnect.then(pool => {
            return pool.request()
            .input("roundId", sql.Int, roundId)
            .input("biddingId", sql.Int, biddingId)
            .query(`select cd.id , cd.course_id, cd.course_name, cd.credits from [${slug}].course_round_mapping crm
                INNER JOIN [${slug}].courses cd on crm.course_lid = cd.id
                INNER JOIN [${slug}].programs p on cd.program_id = p.program_id
                where crm.round_lid=@roundId AND crm.bidding_session_lid = @biddingId AND crm.active = 1 
                AND cd.bidding_session_lid = @biddingId AND cd.active = 1 
                AND p.bidding_session_lid = @biddingId AND p.active = 1`
            )
        })
    }


    static addRoundSettingsRound(slug, biddingId, userId, inputJSON){
        // console.log("inputJSON>>>", inputJSON)
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_round_settings]`)
        })
    }

    static updateRoundSettingsRound(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_round_settings]`)
        })
    }

    static deleteRoundSettingsRound(slug, biddingId, userId, roundSettingsId){
        // console.log("roundSettingsId>>>>>>", roundSettingsId)
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_round_lid', sql.Int, roundSettingsId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_round_settings]`)
        })
    }
}