import { poolConnect, sql } from "../../config/db.js"

export default class ManualEnrollment{
    static roundDetails(slug, biddingId, roundId){
        return poolConnect.then(pool =>{
            return pool.request()
            .input('roundId', sql.Int, roundId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT * FROM [${slug}].round_settings 
                WHERE round_lid = @roundId AND bidding_session_lid = @biddingId AND active = 1`
            )
        })
    }

    static manualEnrollmentList(slug, biddingId, roundId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('roundId', sql.Int, roundId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT seb.id, student_lid, student_name, course_name, seb.course_lid, db.division  
                FROM [${slug}].student_elective_bidding seb 
                INNER JOIN [${slug}].courses c ON c.id = seb.course_lid
                INNER JOIN [${slug}].student_data sd ON sd.id = seb.student_lid
                INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                WHERE seb.active = 1 AND seb.bidding_session_lid = @biddingId AND seb.round_lid = @roundId
                AND seb.is_confirmed = 1`
            )
        })
    }

    static studentsList(slug, biddingId, roundId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('roundId', sql.Int, roundId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT student_lid, student_name, round_lid, concentration_lid 
                    FROM [${slug}].student_round_mapping rsm
                    INNER JOIN [${slug}].student_data sd ON rsm.student_lid = sd.id
                    WHERE rsm.round_lid = @roundId AND rsm.active = 1 AND rsm.bidding_session_lid = @biddingId`
            )
        })
    }

    static courseList(slug, biddingId, id, studentId, roundId){
        const query1 = `
            SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session,
            c.sap_acad_session_id, c.credits, db.max_seats, db.available_seats,
            RTRIM(LTRIM(db.division)) AS division, t.faculty_id, t.faculty_name, d.day_name,
            c.id AS course_lid, CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
            CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime
            FROM [${slug}].timetable t 
            INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
            INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
            INNER JOIN [${slug}].courses c ON c.id = db.course_lid
            INNER JOIN [dbo].days d ON d.id = t.day_lid
            LEFT JOIN [${slug}].student_elective_bidding seb 
            ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentId 
            AND seb.bidding_session_lid = @biddingId AND seb.active = 1 AND seb.is_confirmed != 1  
            WHERE db.available_seats > 0 AND db.bidding_session_lid = @biddingId 
            AND db.active = 1 AND seb.div_batch_lid IS NULL`
            
        const query2 = `
            SELECT seb.id as rowId, c.course_name, c.course_id, c.id AS courseId,
            db.id AS division_batch_lid, db.division 
            FROM [${slug}].student_elective_bidding seb 
            INNER JOIN [${slug}].courses c ON c.id = seb.course_lid
            INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
            WHERE seb.active = 1 AND seb.bidding_session_lid = @biddingId 
            AND c.active = 1 AND c.bidding_session_lid = @biddingId 
            AND is_confirmed = 1 AND student_lid = @studentId`
        
        const query = id === '1' ? query1 : query2

        return poolConnect.then(pool => pool.request()
            .input('id', sql.Int, id)
            .input('studentId', sql.Int, studentId)
            .input('roundId', sql.Int, roundId)
            .input('biddingId', sql.Int, biddingId)
            .query(query)
        )
    }

    static addEnrollment(slug, biddingId, studentId, roundId, courseId, concentrationId, divisionId, bidPoint ,userId) {
        return poolConnection.then(pool => {
            return pool.request()
            .input('student_lid', sql.Int, studentId)
            .input('course_lid', sql.Int, courseId)
            .input('concentration_lid', sql.Int, concentrationId)
            .input('div_batch_lid', sql.Int, divisionId)
            .input('bid_points', sql.Int, bidPoint)
            .input('round_lid', sql.Int, roundId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_flag', sql.Bit)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_drop_add]`);
        });
    }

    static dropEnrollment(slug, biddingId, id, studentId, divisionId, roundId, userId) {
        return poolConnection.then(pool => {
            return pool.request()
            .input('id', sql.Int, id)
            .input('student_lid', sql.Int, studentId)
            .input('round_lid', sql.Int, roundId)
            .input('div_batch_lid', sql.Int, divisionId)
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_flag', sql.Bit)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_drop_drop]`);
        });
    }
}