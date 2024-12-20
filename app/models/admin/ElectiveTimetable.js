import { poolConnect, sql } from "../../config/db.js";

export default class ElectiveTimetable{
    static programList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT p.id, p.program_id, p.program_name  
                FROM [${slug}].timetable et 
                INNER JOIN [${slug}].programs p ON et.program_lid = p.id  AND p.bidding_session_lid = @biddingId WHERE et.active = 1 AND et.bidding_session_lid =  @biddingId 
                GROUP By p.id, p.program_id, p.program_name`
            )
        })
    }

    static acadSessions(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT ad.acad_session, ps.sap_acad_session_id as id
                FROM [${slug}].program_sessions ps
                INNER JOIN [dbo].acad_sessions ad ON ps.sap_acad_session_id = ad.sap_acad_session_id WHERE ps.bidding_session_lid = @biddingId`
            )
        })
    }

    static maxAndMinTimeList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT MIN(start_slot_lid) AS start_slot_lid, MAX(end_slot_lid) AS end_slot_lid 
                FROM [${slug}].timetable WHERE bidding_session_lid = @biddingId AND active = 1`
            )
        })
    }

    static roomList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT DISTINCT room_no 
                    FROM [${slug}].timetable WHERE bidding_session_lid = @biddingId AND active = 1`
            )
        })
    }

    static timeSlotList(){
        return poolConnect.then(pool => {
            return pool.request()
            .query(`SELECT CONVERT(NVARCHAR,start_time, 0) AS start_time,
                CONVERT(NVARCHAR,end_time,0) AS end_time 
                FROM [dbo].slot_interval_timings`
            )
        })
    }

    static timeTableListByDay(slug, biddingId, acadSession, dayId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('acadSession', sql.Int, acadSession)
            .input('dayId', sql.Int, dayId)
            .query(`SELECT t.faculty_name, p.program_name, c.acad_session, c.course_name, db.division,
                db.batch, t.faculty_type_abbr, start_slot_lid, end_slot_lid, t.room_no 
                FROM [${slug}].timetable t 
                INNER JOIN [${slug}].programs p ON t.program_lid = p.id
                INNER JOIN [${slug}].division_batches db ON t.division_batch_lid = db.id
                INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                INNER JOIN [dbo].acad_sessions ad ON c.sap_acad_session_id = ad.sap_acad_session_id
                WHERE t.active = 1 AND t.bidding_session_lid = @biddingId AND t.day_lid = @dayId AND ad.sap_acad_session_id = @acadSession`
            )
        })
    }

    static acadSessionByProgram(slug, biddingId, programId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('programId', sql.Int, programId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT ps.id, ad.sap_acad_session_id, ad.acad_session  
                FROM [${slug}].timetable et 
                INNER JOIN [${slug}].program_sessions ps ON et.program_session_lid = ps.id AND ps.bidding_session_lid = @biddingId
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = ps.sap_acad_session_id
                WHERE et.active = 1 AND et.bidding_session_lid =  @biddingId AND program_lid = @programId GROUP BY ps.id, ad.sap_acad_session_id, ad.acad_session`
            )
        })
    }


    static addElectiveTimeTableData(slug, biddingId, userId, inputJSON){
        // inputJSON = JSON.parse(inputJSON)
        // console.log(slug, biddingId, userId, inputJSON)
        // return 
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX),inputJSON)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_upload_timetable]`);
        })
    }

    static deleteTimetableByAcadSession(slug, biddingId, userId, type, programId){
        // console.log(slug, biddingId, userId, type, programId)
        if(type == "program"){
            return poolConnect.then(pool => {
                return pool.request()
                .input('input_program_lid', sql.Int, programId)
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_delete_program_timetable]`)
            })
        }else{
            return poolConnect.then(pool => {
                return pool.request()
                .input('input_program_session_lid', sql.Int, programId)
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_delete_program_session_timetable]`)
            })
        }
    }
}