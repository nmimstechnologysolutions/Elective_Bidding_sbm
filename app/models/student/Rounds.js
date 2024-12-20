import { poolConnect, sql } from "../../config/db.js"


export const demandEstimationRoundQuery = async (slug, biddingSessionId, studentId) => {
    try{
        const pool = await poolConnect
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingSessionId', sql.Int, biddingSessionId)
            .query(`SELECT c.course_name, c.credits, c.acad_session, c.area_name, de.last_modified_date
                FROM [${slug}].demand_estimation de
                INNER JOIN [${slug}].courses c
                    ON de.course_lid = c.id
                WHERE student_lid = @studentId
                AND de.bidding_session_lid = @biddingSessionId AND de.active = 1
                AND c.bidding_session_lid = @biddingSessionId AND c.active = 1;`
        )
        return result.recordset
    }catch(error){
        console.log('error in demand estimation round query :', error.message)
    }
}


export const biddingRound1Query = async (slug, biddingSessionId, studentId) => {
    try {
        const pool = await poolConnect
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingSessionId', sql.Int, biddingSessionId)
            .query(`SELECT CONCAT(c.course_name, ' - ', db.division) AS course, c.credits, c.acad_session, 
                c.area_name, ser.bid_points, rtb.min_req_bid,
                IIF(ser.is_winning = 1,'Yes','No') AS winning_status, ser.created_at
                FROM [${slug}].student_elective_reports ser
                INNER JOIN [${slug}].student_data sd
                    ON ser.student_lid = sd.id
                INNER JOIN [${slug}].division_batches db
                    ON ser.div_batch_lid = db.id
                INNER JOIN [${slug}].courses c
                    ON c.id = db.course_lid
                INNER JOIN [${slug}].real_time_bidding rtb
                    ON ser.div_batch_lid = rtb.div_batch_lid
                WHERE ser.bidding_session_lid = @biddingSessionId
                AND sd.bidding_session_lid = @biddingSessionId
                AND db.bidding_session_lid = @biddingSessionId
                AND c.bidding_session_lid = @biddingSessionId
                AND rtb.bidding_session_lid = @biddingSessionId
                AND ser.active = 1
                AND sd.active = 1
                AND db.active = 1
                AND c.active = 1
                AND rtb.active = 1
                AND ser.round_lid = 2
                AND rtb.round_lid = 2
                AND waitlist_no IS NULL
                AND ser.student_lid = @studentId
                ORDER BY ser.created_at ASC`
        )
        return result.recordset
    } catch (error) {
        console.log('error in bidding round 1 query :', error.message)
    }
}


export const confirmationRound1Query = async (slug, biddingSessionId, studentId) => {
    try{
        const pool = await poolConnect
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingSessionId', sql.Int, biddingSessionId)
            .query(`SELECT CONCAT(c.course_name, ' - ', db.division) AS course, c.credits, c.acad_session, c.area_name,
                ser.bid_points, ser.created_at
                FROM [${slug}].student_elective_reports ser
                INNER JOIN [${slug}].student_data sd
                    ON ser.student_lid = sd.id
                INNER JOIN [${slug}].division_batches db
                    ON ser.div_batch_lid = db.id
                INNER JOIN [${slug}].courses c
                ON c.id = db.course_lid
                WHERE ser.bidding_session_lid = @biddingSessionId
                AND sd.bidding_session_lid = @biddingSessionId
                AND db.bidding_session_lid = @biddingSessionId
                AND c.bidding_session_lid = @biddingSessionId
                AND ser.active = 1  
                AND sd.active = 1
                AND db.active = 1
                AND c.active = 1
                AND ser.round_lid = 3
                AND waitlist_no IS NULL
                AND ser.student_lid = @studentId;`
        )
        return result.recordset
    }catch(error){
        console.log('error in confirmation round 1 query :', error.message)
    }
}


export const biddingRound2Query = async(slug, biddingSessionId, studentId) => {
    try{
        const pool = await poolConnect
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingSessionId', sql.Int, biddingSessionId)
            .query(`SELECT CONCAT(c.course_name, ' - ', db.division) AS course, c.credits, c.acad_session, c.area_name,
                ser.bid_points, rtb.min_req_bid,
                IIF(ser.is_winning = 1,'Yes','No') AS winning_status, ser.created_at
                FROM [${slug}].student_elective_reports ser
                INNER JOIN [${slug}].student_data sd
                    ON ser.student_lid = sd.id
                INNER JOIN [${slug}].division_batches db
                    ON ser.div_batch_lid = db.id
                INNER JOIN [${slug}].courses c
                    ON c.id = db.course_lid
                INNER JOIN [${slug}].real_time_bidding rtb
                    ON ser.div_batch_lid = rtb.div_batch_lid
                WHERE ser.bidding_session_lid = @biddingSessionId
                AND sd.bidding_session_lid = @biddingSessionId
                AND db.bidding_session_lid = @biddingSessionId
                AND c.bidding_session_lid = @biddingSessionId
                AND rtb.bidding_session_lid = @biddingSessionId
                AND ser.active = 1
                AND sd.active = 1
                AND db.active = 1
                AND c.active = 1
                AND rtb.active = 1
                AND ser.round_lid = 4
                AND rtb.round_lid = 4
                AND waitlist_no IS NULL
                AND ser.student_lid = @studentId
                ORDER BY ser.created_at ASC`
        )
        return result.recordset
    }catch(error){
        console.log('error in bidding round 2 query :', error.message)
    }
}

export const confirmationRound2Query = async(slug, biddingSessionId, studentId) => {
    try{
        const pool = await poolConnect
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingSessionId', sql.Int, biddingSessionId)
            .query(`SELECT CONCAT(c.course_name, ' - ', db.division) AS course_name, c.credits, c.acad_session, c.area_name,
                ser.bid_points, ser.created_at
                FROM [${slug}].student_elective_reports ser
                INNER JOIN [${slug}].student_data sd
                    ON ser.student_lid = sd.id
                INNER JOIN [${slug}].division_batches db
                    ON ser.div_batch_lid = db.id
                INNER JOIN [${slug}].courses c
                    ON c.id = db.course_lid
                WHERE ser.bidding_session_lid = @biddingSessionId
                AND sd.bidding_session_lid = @biddingSessionId
                AND db.bidding_session_lid = @biddingSessionId
                AND c.bidding_session_lid = @biddingSessionId
                AND ser.active = 1  
                AND sd.active = 1
                AND db.active = 1
                AND c.active = 1
                AND ser.round_lid = 5
                AND waitlist_no IS NULL
                AND ser.student_lid = @studentId;`
        )
        return result.recordset
    }catch(error){
        console.log(`error in confirmation round 2 query :`, error.message)
    }
}


export const waitlistGenerationRoundQuery = async (slug, biddingSessionId, studentId) => {
    try {
        const pool = await poolConnect
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingSessionId', sql.Int, biddingSessionId)
            .query(`SELECT CONCAT(c.course_name, ' - ', db.division) AS course, c.credits, c.acad_session, c.area_name,
                ser.bid_points, ser.waitlist_no, ser.created_at
                FROM [${slug}].student_data sd
                INNER JOIN [${slug}].student_elective_reports ser
                    ON sd.id = ser.student_lid
                INNER JOIN [${slug}].division_batches db
                    ON db.id = ser.div_batch_lid
                INNER JOIN [${slug}].courses c
                    ON c.id = db.course_lid
                WHERE sd.bidding_session_lid = @biddingSessionId
                AND ser.bidding_session_lid = @biddingSessionId
                AND db.bidding_session_lid = @biddingSessionId
                AND c.bidding_session_lid = @biddingSessionId
                AND sd.active = 1
                AND db.active = 1
                AND c.active = 1
                AND ser.active = 1
                AND ser.round_lid = 6
                AND ser.waitlist_no IS NOT NULL
                AND ser.student_lid = @studentId;`
        )
        return result.recordset
    } catch (error) {
        console.log('error in waitlist generation round query :', error.message)
    }
}


export const addAndDropRound1Query = async(slug, biddingSessionId, studentId) => {
    try{
        const pool = await poolConnect
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingSessionId', sql.Int, biddingSessionId)
            .query(`SELECT CONCAT(c.course_name, ' - ', db.division) AS course, c.credits, c.acad_session, c.area_name,
                ser.bid_points, ser.created_at
                FROM [${slug}].student_elective_reports ser
                INNER JOIN [${slug}].student_data sd
                    ON ser.student_lid = sd.id
                INNER JOIN [${slug}].division_batches db
                    ON ser.div_batch_lid = db.id
                INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                WHERE ser.bidding_session_lid = @biddingSessionId
                AND sd.bidding_session_lid = @biddingSessionId
                AND db.bidding_session_lid = @biddingSessionId
                AND c.bidding_session_lid = @biddingSessionId
                AND ser.active = 1  
                AND sd.active = 1
                AND db.active = 1
                AND c.active = 1
                AND ser.waitlist_no IS NULL
                AND ser.student_lid = @studentId --(Student chosen by admin)
                AND ser.round_lid IN (3, 5, 7)
                AND NOT EXISTS (
                    SELECT 1
                    FROM [${slug}].student_elective_reports ser2
                    WHERE ser2.student_lid = ser.student_lid
                    AND ser2.div_batch_lid = ser.div_batch_lid
                    AND ser2.round_lid = 7
                    AND ser2.active = 0
                );`
        )
        return result.recordset
    }catch(error){
        console.log('error in add and drop round 1 query :', error.message)
    }
}

export const addAndDropRound2Query = async(slug, biddingSessionId, studentId) => {
    try{
        const pool = await poolConnect
        const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingSessionId', sql.Int, biddingSessionId)
            .query(`SELECT CONCAT(c.course_name, ' - ', db.division) AS course, c.credits, c.acad_session, c.area_name,
            ser.bid_points, ser.created_at
            FROM [${slug}].student_elective_reports ser
            INNER JOIN [${slug}].student_data sd
                ON ser.student_lid = sd.id
            INNER JOIN [${slug}].division_batches db
                ON ser.div_batch_lid = db.id
            INNER JOIN [${slug}].courses c ON c.id = db.course_lid
            WHERE ser.bidding_session_lid = @biddingSessionId
            AND sd.bidding_session_lid = @biddingSessionId
            AND db.bidding_session_lid = @biddingSessionId
            AND c.bidding_session_lid = @biddingSessionId
            AND ser.active = 1  
            AND sd.active = 1
            AND db.active = 1
            AND c.active = 1
            AND ser.waitlist_no IS NULL
            AND ser.student_lid = @studentId --(Student chosen by admin)
            AND ser.round_lid IN (3, 5, 7, 8)
            AND NOT EXISTS (
                SELECT 1
                FROM [${slug}].student_elective_reports ser2
                WHERE ser2.student_lid = ser.student_lid
                AND ser2.div_batch_lid = ser.div_batch_lid
                AND ser2.round_lid IN (7, 8)
                AND ser2.active = 0
            );`
        )
        return result.recordset
    }catch(error){
        console.log('error in add and drop round 2 query :', error.message)
    }
}
