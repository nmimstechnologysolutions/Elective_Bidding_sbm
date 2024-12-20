import { poolConnect, sql } from "../../config/db.js"

export default class Dashboard{

    static biddingName = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`select bidding_name as biddingName
                from [${slug}].bidding_session 
                where id = @biddingId AND active = 1`
            )
            
            return result
            
        }catch(error){
            throw error
        }
    }

    static studentDetails = async (slug, biddingId, username) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('username', sql.NVarChar, username)
            .query(`SELECT sd.id, sd.sap_id, roll_no, sd.student_name, email, sd.bid_points, sd.remaining_bid_points,
                year_of_joining, sd.previous_elective_credits, 
                IIF(sd.concentration_lid IS NULL, 0, sd.concentration_lid) AS concentration, 
                LOWER(c.concentration_name) AS concentrationName
                FROM [${slug}].student_data sd
                INNER JOIN [${slug}].concentration c ON c.id = sd.concentration_lid 
                WHERE email = @username AND sd.active = 1`
            )
            return result
        }catch(error){
            throw error
        }
    }

    static biddingPoints = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`select bid_points as biddingPoints 
                from [${slug}].student_data 
                where id = 1 AND active = 1`    
            )
            
            return result
    
        }catch(error){
            throw error
        }
    }

    static remainingPoints = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`select remaining_bid_points as remainingPoints 
                from [${slug}].student_data 
                where id = @biddingId AND active = 1`
            )
            return result
        }catch(error){
            throw error
        }
    }

    static acadSessionsList = async(slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`select distinct acad_session 
                from [${slug}].courses
                where bidding_session_lid = @biddingId and active = 1`
            )
            return result
        }catch(error){
            throw error
        }
    }

    static areaNameList = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`select distinct area_name 
                from [${slug}].courses
                where bidding_session_lid = @biddingId
                and active = 1`
            )
            return result
        }catch(error){
            throw error
        }
    }

    static courseNameList = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`select course_name 
                from [${slug}].courses
                where bidding_session_lid = @biddingId
                and active = 1`
            )
            return result
        }catch(error){
            throw error
        }
    }

    static yearlyCredits = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT SUM(IIF(max_credits IS NULL, 0, max_credits)) AS annually_credits_count, 
                SUM(IIF(min_credits IS NULL, 0, min_credits)) AS min_yearly_credits 
                FROM [${slug}].program_sessions WHERE bidding_session_lid = @biddingId AND active = 1`
            )
            return result
        }catch(error){
            throw error
        }
    }

    static concentrationsList = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
                .input('biddingId', sql.Int, biddingId) 
                .query(`SELECT id, concentration_name 
                    FROM [${slug}].concentration 
                    WHERE bidding_session_lid = @biddingId AND active = 1`
                )
            return result
        }catch(error){
            throw error
        }
    }

    static biddingRounds = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`select round_lid AS round_id,
                REPLACE( CASE WHEN PATINDEX('%[0-9]%', round_name) > 0 THEN 
                    STUFF(round_name, PATINDEX('%[0-9]%', round_name), 0, ' ')
                    ELSE round_name 
                    END, 
                    '_', 
                    ' '
                ) AS round_name, start_date_time, end_date_time 
                from [${slug}].round_settings
                where bidding_session_lid = @biddingId
                and active = 1`
            )

            return result
        }catch(error){
            throw error
        }
    }

    // static roundName = async (slug, biddingId) => {
    //     try{
    //         const pool = await poolConnect
    //         const result = await pool.request()
    //         .input('biddingId', sql.Int, biddingId)
    //         .query(`select round_lid AS round_id,
    //             REPLACE(
    //             CASE 
    //                 WHEN PATINDEX('%[0-9]%', round_name) > 0 THEN 
    //                     STUFF(round_name, PATINDEX('%[0-9]%', round_name), 0, ' ')
    //                 ELSE
    //                     round_name
    //             END, 
    //             '_', 
    //             ' '
    //             ) AS round_name, start_date_time, end_date_time 
    //             from [${slug}].round_settings
    //             where bidding_session_lid = @biddingId
    //             and active = 1`
    //         )

    //         return result
    //     }catch(error){
    //         throw error
    //     }
    // }
    

    static availableCoursesList = async (slug, studentId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .query(`SELECT c.area_name AS area_name, db.id AS division_id, c.course_id, CONCAT(c.course_name, '-', db.division) AS course_name,
                c.acad_session AS acad_session, STRING_AGG(CONCAT(LEFT(dd.day_name, 3), ' ' ,LOWER(FORMAT(CAST(sit.start_time AS datetime2), N'hh:mm tt')), '  - ', LOWER(FORMAT(CAST(sit1.end_time AS datetime2), N'hh:mm tt'))), ', ') 
                WITHIN GROUP (ORDER BY dd.id) AS course_timeing, c.credits AS credits, db.max_seats AS total_seat, STRING_AGG((tt.faculty_name),'/')  AS faculty_name,
                ISNULL(sem.is_favourite, 0) AS is_favourite  
                FROM [${slug}].courses c
                INNER JOIN [${slug}].division_batches db ON c.id = db.course_lid
                INNER JOIN [${slug}].timetable tt ON db.id = tt.division_batch_lid
                INNER JOIN dbo.slot_interval_timings sit ON sit.id = tt.start_slot_lid
                INNER JOIN dbo.slot_interval_timings sit1 ON sit1.id = tt.end_slot_lid
                INNER JOIN dbo.days dd ON dd.id = tt.day_lid
                INNER JOIN [${slug}].student_data sd ON db.bidding_session_lid = sd.bidding_session_lid
                LEFT JOIN [${slug}].student_elective_mapping sem ON sd.id = sem.student_lid AND db.id = sem.div_batch_lid WHERE sd.id = @studentId
                GROUP BY c.area_name, c.course_id, c.course_name, db.division, c.acad_session, c.credits, db.max_seats, sem.is_favourite, db.id
                ORDER BY sem.is_favourite DESC`
            )
            return result
        }catch(error){
            throw error
        }
    }

    static addFavCourse = async (slug, biddingId, userId, inputJSON) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('last_modified_by', sql.Int, userId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_favourite]`    
            )
            return result
        }catch(error){
            throw error
        }
    }

    static filterCourses = async (slug, studentId, trimisterInput, areaInput) => {
        try{
            const pool = await poolConnect
            const request = pool.request().input('studentId', sql.Int, studentId)

            let query = `
                SELECT c.area_name AS area_name,db.id AS division_id, c.course_id, CONCAT(c.course_name, '-', db.division) AS course_name, 
                c.acad_session AS acad_session, STRING_AGG(CONCAT(LEFT(dd.day_name, 3), ' ' ,
                LOWER(FORMAT(CAST(sit.start_time AS datetime2), N'hh:mm tt')), '  - ', 
                LOWER(FORMAT(CAST(sit1.end_time AS datetime2), N'hh:mm tt'))), ', ')
                WITHIN GROUP (ORDER BY dd.id) AS course_timeing, c.credits AS credits, db.max_seats AS total_seat, 
                STRING_AGG((tt.faculty_name),'/')  AS faculty_name, ISNULL(sem.is_favourite, 0) AS is_favourite  
                FROM [${slug}].courses c
                INNER JOIN [${slug}].division_batches db ON c.id = db.course_lid
                INNER JOIN [${slug}].timetable tt ON db.id = tt.division_batch_lid
                INNER JOIN dbo.slot_interval_timings sit ON sit.id = tt.start_slot_lid
                INNER JOIN dbo.slot_interval_timings sit1 ON sit1.id = tt.end_slot_lid
                INNER JOIN dbo.days dd ON dd.id = tt.day_lid
                INNER JOIN [${slug}].student_data sd ON db.bidding_session_lid = sd.bidding_session_lid
                LEFT JOIN [${slug}].student_elective_mapping sem ON sd.id = sem.student_lid AND db.id = sem.div_batch_lid
                WHERE sd.id = @studentId
            `

            if (trimisterInput !== null) {
                query += ` AND c.acad_session IN (SELECT value FROM STRING_SPLIT(@trimisterInput, ','))`
                request.input('trimisterInput', sql.NVarChar(sql.MAX), trimisterInput)
            }
            
            if (areaInput !== null) {
                query += ` AND c.area_name IN (SELECT value FROM STRING_SPLIT(@areaInput, ','))`
                request.input('areaInput', sql.NVarChar(sql.MAX), areaInput)
            }

            query += `GROUP BY c.area_name, c.course_id, c.course_name, db.division, c.acad_session, c.credits, db.max_seats, sem.is_favourite, db.id
            ORDER BY sem.is_favourite DESC;`

            const result = await request.query(query)
            return result.recordset 

        }catch(error){
            throw error
        }
    }

    static searchCourse = async (slug, studentId, courseInput) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('courseInput', sql.NVarChar(sql.MAX), courseInput)
            .query(`SELECT c.area_name AS area_name, db.id AS division_id, c.course_id, 
                CONCAT(c.course_name, '-', db.division) AS course_name, 
                c.acad_session AS acad_session, 
                STRING_AGG(CONCAT(LEFT(dd.day_name, 3), ' ', 
                LOWER(FORMAT(CAST(sit.start_time AS datetime2), N'hh:mm tt')), ' - ', 
                LOWER(FORMAT(CAST(sit1.end_time AS datetime2), N'hh:mm tt'))), ', ') 
                WITHIN GROUP (ORDER BY dd.id) AS course_timeing, 
                c.credits AS credits, db.max_seats AS total_seat, 
                STRING_AGG(tt.faculty_name, '/') AS faculty_name, 
                ISNULL(sem.is_favourite, 0) AS is_favourite  
                FROM [${slug}].courses c
                INNER JOIN [${slug}].division_batches db ON c.id = db.course_lid
                INNER JOIN [${slug}].timetable tt ON db.id = tt.division_batch_lid
                INNER JOIN dbo.slot_interval_timings sit ON sit.id = tt.start_slot_lid
                INNER JOIN dbo.slot_interval_timings sit1 ON sit1.id = tt.end_slot_lid
                INNER JOIN dbo.days dd ON dd.id = tt.day_lid
                INNER JOIN [${slug}].student_data sd ON db.bidding_session_lid = sd.bidding_session_lid
                INNER JOIN dbo.acad_sessions das ON das.acad_session = c.acad_session
                INNER JOIN [${slug}].areas a ON a.area_name = c.area_name
                LEFT JOIN [${slug}].student_elective_mapping sem ON sd.id = sem.student_lid AND db.id = sem.div_batch_lid
                WHERE sd.id = @studentId
                AND c.course_name IN (SELECT value FROM STRING_SPLIT(@courseInput, ','))
                GROUP BY c.area_name, c.course_id, c.course_name, db.division, c.acad_session, c.credits, db.max_seats, sem.is_favourite, das.sap_acad_session_id, db.id
                ORDER BY sem.is_favourite DESC;`
            )
        
            return result.recordset 

        }catch(error){
            throw error
        }
    }

    static saveConcentration = async (slug, biddingId, userId, inputJSON) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].sp_select_specialization`)

            return result
        }catch(error){
            throw error
        }
    }

    
}
