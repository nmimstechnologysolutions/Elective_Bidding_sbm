import { poolConnect, sql } from "../../config/db.js";

export class DemandEstimationRound{
    static roundDetails = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('demand', sql.NChar, 'DEMAND_ESTIMATION_ROUND')
            .query(`SELECT round_lid, SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, 
                LEN(round_name)) AS DemandEstimation
                FROM [${slug}].round_settings 
                WHERE active = 1 AND bidding_session_lid = @biddingId AND round_name LIKE '%' + @demand + '%'`
            )

            return result.recordset[0]

        }catch(error){
            throw error
        }
    }

    static availableCourseList = async (slug, biddingId, studentId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT course_name AS courseName, credits, program_id AS programId, 
                ad.acad_session AS acadSession, a.area_name AS areaName, min_demand_criteria, year_of_introduction AS year, 
                c.sap_acad_session_id AS acadSessionId, c.id AS courseId, a.id AS areaId
                FROM [${slug}].course_round_mapping crm 
                INNER JOIN [${slug}].courses c ON crm.course_lid = c.id AND crm.active = 1
                INNER JOIN [${slug}].areas a ON c.area_name = a.area_name
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                LEFT JOIN [${slug}].demand_estimation de ON c.id = de.course_lid AND c.active = 1
                AND c.bidding_session_lid = @biddingId AND de.bidding_session_lid = @biddingId
                AND de.active = 1 AND de.student_lid = @studentId WHERE de.course_lid IS NULL ORDER BY c.id`
            )

            return result.recordset
        }catch(error){
            throw error
        }
    }

    static availableCourseListCount = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) AS count
                FROM [${slug}].courses c 
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`
            )

            return result.recordset[0]
        }catch(error){
            throw error
        }
    }

    static acadSessionsWiseCredits = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT ad.sap_acad_session_id AS id, ad.acad_session AS name, 
                IIF(ps.min_credits IS NULL, 0, ps.min_credits) AS credits, 
                IIF(ps.max_credits IS NULL, 0, ps.max_credits) AS maxCredits
                FROM [${slug}].program_sessions ps 
                INNER JOIN [dbo].acad_sessions ad ON ps.sap_acad_session_id = ad.sap_acad_session_id
                WHERE bidding_session_lid = @biddingId AND active = 1`
            )

            return result.recordset
        }catch(error){
            throw error
        }
    }

    static roundTime = async (slug, biddingId, roundId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('roundId', sql.Int, roundId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT FORMAT(start_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS startTime,     
                FORMAT(end_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS endTime, 
                SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, LEN(round_name)) AS roundName,
                round_lid , bidding_session_lid
                FROM [${slug}].round_settings 
                WHERE active = 1 AND round_lid = @roundId  AND start_date_time <= DATEADD(HOUR, 24, GETDATE()) AND 
                end_date_time > GETDATE() AND bidding_session_lid = @biddingId AND active = 1 `
            )

            return result.recordset[0]

        }catch(error){
            throw error
        }
    }

    static selectedCourseList = async (slug, biddingId, studentId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('studentId', sql.Int, studentId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT c.id, c.area_name AS areaName, c.course_name AS courseName, c.acad_session AS acadSession,
                c.credits, c.sap_acad_session_id AS acadSessionId 
                FROM [${slug}].demand_estimation de 
                INNER JOIN [${slug}].courses c ON c.id = de.course_lid 
                WHERE de.student_lid = @studentId AND de.active = 1 AND c.active = 1`
            )

            return result.recordset

        }catch(error){
            throw error
        }
    }

    static demandRoundCriteria = async (slug, biddingId, studentEmail) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('studentEmail', sql.NVarChar, studentEmail)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT cs.concentration_name AS name, total_elective_credits AS totalCredits,
                max_credits_per_area AS maxCreditsPerArea, no_of_areas_to_cover AS areasCover,
                min_credits_per_area AS minCreditsPerArea, primary_area As primaryArea,
                min_credits_in_primary_area AS minCreditsInPrimayArea, u.id AS userId, sd.id AS studentId 
                FROM [${slug}].student_data sd 
                INNER JOIN [${slug}].concentration c ON sd.concentration_lid = c.id
                INNER JOIN [${slug}].users u ON u.email = sd.email
                INNER JOIN [${slug}].concentration_settings cs ON cs.concentration_lid = sd.concentration_lid WHERE sd.email = @studentEmail AND sd.active = 1`
            )

            return result.recordset[0]

        }catch(error){
            throw error
        }
    }

    static studentRoundCriteria = async (slug, biddingId, studentId, roundId, concentrationName) => {
        try{
            if(concentrationName = 'General Management'){
                const pool = await poolConnect
                const result = await pool.request()
                .input('studentId', sql.Int, studentId)
                .input('roundId', sql.Int, roundId)
                .input('biddingId', sql.Int, biddingId)
                .query(`WITH filtered_data AS (
                        SELECT
                            c.acad_session,
                            c.credits,
                            c.area_name,
                            cs.primary_area,
                            cs.no_of_areas_to_cover,
                            cs.min_credits_per_area
                        FROM
                            [${slug}].demand_estimation de
                        INNER JOIN
                            [${slug}].courses c ON de.course_lid = c.id
                        INNER JOIN
                            [${slug}].student_data sd ON sd.id = de.student_lid
                        INNER JOIN
                            [${slug}].concentration_settings cs ON sd.concentration_lid = cs.concentration_lid
                        WHERE
                            de.bidding_session_lid = @biddingId
                            AND c.bidding_session_lid = @biddingId
                            AND de.active = 1
                            AND c.active = 1
                            AND de.student_lid = @studentId
                            AND de.round_lid = @roundId
                    ),
                    total_credits AS (
                        SELECT
                            SUM(credits) AS total_credits
                        FROM
                            filtered_data
                    ),
                    trimesterwise_credits AS (
                        SELECT
                            acad_session,
                            SUM(credits) AS trimesterwise_credits
                        FROM
                            filtered_data
                        GROUP BY
                            acad_session
                    ),
                    primary_area_credits AS (
                        SELECT
                            SUM(credits) AS primary_area_credits
                        FROM
                            filtered_data
                        WHERE
                            area_name = primary_area
                    ),
                    pivoted_trimesterwise_credits AS (
                        SELECT
                            MAX(CASE WHEN acad_session = 'Trimester IV' THEN trimesterwise_credits ELSE 0 END) AS trimester_IV_credits,
                            MAX(CASE WHEN acad_session = 'Trimester V' THEN trimesterwise_credits ELSE 0 END) AS trimester_V_credits,
                            MAX(CASE WHEN acad_session = 'Trimester VI' THEN trimesterwise_credits ELSE 0 END) AS trimester_VI_credits
                        FROM
                            trimesterwise_credits
                    ),
                    area_wise_credits AS (
                        SELECT
                            SUM(credits) AS area_wise_credits,
                            area_name,
                            min_credits_per_area
                        FROM
                            filtered_data
                        GROUP BY
                            area_name, min_credits_per_area, primary_area
                        HAVING
                            SUM(credits) >= min_credits_per_area    
                    ),
                    no_of_areas_covered AS (
                        SELECT COUNT(*) AS no_of_areas_covered FROM area_wise_credits
                    ),
                    criteria_met AS (
                        SELECT
                            CASE
                                WHEN ((SELECT trimester_IV_credits FROM pivoted_trimesterwise_credits) =
                                    (SELECT SUM(min_credits) FROM [${slug}].program_sessions
                                    WHERE sap_acad_session_id = 34 AND bidding_session_lid = @biddingId AND active = 1))
                                AND ((SELECT trimester_V_credits FROM pivoted_trimesterwise_credits) =
                                    (SELECT SUM(min_credits) FROM [${slug}].program_sessions
                                    WHERE sap_acad_session_id = 35 AND bidding_session_lid = @biddingId AND active = 1))
                                AND ((SELECT trimester_VI_credits FROM pivoted_trimesterwise_credits) =
                                    (SELECT SUM(min_credits) FROM [${slug}].program_sessions
                                    WHERE sap_acad_session_id = 36 AND bidding_session_lid = @biddingId AND active = 1))
                                AND (SELECT no_of_areas_covered FROM no_of_areas_covered) >=
                                    (SELECT MAX(no_of_areas_to_cover) FROM filtered_data)
                                THEN 1
                                ELSE 0
                            END AS criteria_met
                    )
                    SELECT
                        tc.total_credits,
                        ptc.trimester_IV_credits,
                        ptc.trimester_V_credits,
                        ptc.trimester_VI_credits,
                        nac.no_of_areas_covered,
                        cm.criteria_met
                    FROM
                        total_credits tc
                    CROSS JOIN
                        pivoted_trimesterwise_credits ptc
                    CROSS JOIN
                        no_of_areas_covered nac
                    CROSS JOIN
                        criteria_met cm;`
                )

                return result.recordset[0]

            }else{
                const pool = await poolConnect
                const result = await pool.request()
                .input('studentId', sql.Int, studentId)
                .input('roundId', sql.Int, roundId)
                .input('biddingId', sql.Int, biddingId)
                .query(`WITH filtered_data AS (
                        SELECT
                            c.acad_session,
                            c.credits,
                            c.area_name,
                            cs.primary_area,
                            cs.no_of_areas_to_cover,
                            cs.min_credits_per_area
                        FROM
                            [${slug}].demand_estimation de
                        INNER JOIN
                            [${slug}].courses c ON de.course_lid = c.id
                        INNER JOIN
                            [${slug}].student_data sd ON sd.id = de.student_lid
                        INNER JOIN
                            [${slug}].concentration_settings cs ON sd.concentration_lid = cs.concentration_lid
                        WHERE
                            de.bidding_session_lid = @biddingId
                            AND c.bidding_session_lid = @biddingId
                            AND de.active = 1
                            AND c.active = 1
                            AND de.student_lid = @studentId
                            AND de.round_lid = @roundId
                    ),
                    total_credits AS (
                        SELECT
                            SUM(credits) AS total_credits
                        FROM
                            filtered_data
                    ),
                    trimesterwise_credits AS (
                        SELECT
                            acad_session,
                            SUM(credits) AS trimesterwise_credits
                        FROM
                            filtered_data
                        GROUP BY
                            acad_session
                    ),
                    primary_area_credits AS (
                        SELECT
                            SUM(credits) AS primary_area_credits
                        FROM
                            filtered_data
                        WHERE
                            area_name = primary_area
                    ),
                    pivoted_trimesterwise_credits AS (
                        SELECT
                            MAX(CASE WHEN acad_session = 'Trimester IV' THEN trimesterwise_credits ELSE 0 END) AS trimester_IV_credits,
                            MAX(CASE WHEN acad_session = 'Trimester V' THEN trimesterwise_credits ELSE 0 END) AS trimester_V_credits,
                            MAX(CASE WHEN acad_session = 'Trimester VI' THEN trimesterwise_credits ELSE 0 END) AS trimester_VI_credits
                        FROM
                            trimesterwise_credits
                    ),
                    area_wise_credits AS (
                        SELECT
                            SUM(credits) AS area_wise_credits,
                            area_name,
                            min_credits_per_area
                        FROM
                            filtered_data
                        GROUP BY
                            area_name, min_credits_per_area, primary_area
                        HAVING
                            SUM(credits) >= min_credits_per_area
                            AND area_name <> primary_area
                    ),
                    primary_area_covered AS (
                        SELECT
                            CASE
                                WHEN (SELECT SUM(credits) FROM filtered_data WHERE area_name = primary_area) >=
                                    (SELECT primary_area_credits FROM primary_area_credits) THEN 1
                                ELSE 0
                            END AS primary_area_covered
                    ),
                    no_of_areas_covered AS (
                        SELECT
                            (SELECT COUNT(*) FROM area_wise_credits) +
                            (SELECT primary_area_covered FROM primary_area_covered) AS no_of_areas_covered
                    ),
                    criteria_met AS (
                        SELECT
                            CASE
                                WHEN ((SELECT trimester_IV_credits FROM pivoted_trimesterwise_credits) =
                                    (SELECT SUM(min_credits) FROM [${slug}].program_sessions
                                    WHERE sap_acad_session_id = 34 AND bidding_session_lid = @biddingId AND active = 1))
                                AND ((SELECT trimester_V_credits FROM pivoted_trimesterwise_credits) =
                                    (SELECT SUM(min_credits) FROM [${slug}].program_sessions
                                    WHERE sap_acad_session_id = 35 AND bidding_session_lid = @biddingId AND active = 1))
                                AND ((SELECT trimester_VI_credits FROM pivoted_trimesterwise_credits) =
                                    (SELECT SUM(min_credits) FROM [${slug}].program_sessions
                                    WHERE sap_acad_session_id = 36 AND bidding_session_lid = @biddingId AND active = 1))
                                AND (SELECT no_of_areas_covered FROM no_of_areas_covered) >=
                                    (SELECT MAX(no_of_areas_to_cover) FROM filtered_data)
                                AND (SELECT primary_area_covered FROM primary_area_covered) = 1
                                THEN 1
                                ELSE 0
                            END AS criteria_met
                    )
                    SELECT
                        tc.total_credits,
                        ptc.trimester_IV_credits,
                        ptc.trimester_V_credits,
                        ptc.trimester_VI_credits,
                        pac.primary_area_credits,
                        nac.no_of_areas_covered,
                        cm.criteria_met
                    FROM
                        total_credits tc
                    CROSS JOIN
                        pivoted_trimesterwise_credits ptc
                    CROSS JOIN
                        primary_area_credits pac
                    CROSS JOIN
                        no_of_areas_covered nac
                    CROSS JOIN
                        criteria_met cm;`
                )

                return result.recordset[0]

            }

            
        }catch(error){
            throw error
        }
    }

    static totalCredits = async (slug, biddingId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP 1 total_elective_credits AS totalCount 
                FROM [${slug}].concentration_settings WHERE active = 1 
                AND bidding_session_lid = @biddingId`
            )

            return result.recordset[0]
        }catch(error){
            throw error
        }
    }

    // static demandEstimationRoundOneDayBefore = async (slug, biddingId, roundId) => {
    //     try{
    //         const pool = await poolConnect
    //         const result = await pool.request()
    //         .input('roundId', sql.Int, roundId)
    //         .input('biddingId', sql.Int, biddingId)
    //         .query(`SELECT round_lid, FORMAT(start_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS startTime,
    //             FORMAT(end_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS endTime, 
    //             REPLACE(SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, LEN(round_name)), '_', ' ') AS roundName
    //             FROM [${slug}].round_settings
    //             WHERE start_date_time <= DATEADD(HOUR, 24, GETDATE()) AND 
    //             end_date_time > GETDATE() AND 
    //             bidding_session_lid = @biddingId AND 
    //             active = 1 AND 
    //             round_lid = @roundId`
    //         )

    //         return result.recordset
    //     }catch(error){
    //         throw error
    //     }
    // }

    static checkStundetIsPartOfRound = async (slug, biddingId, studentId, roundId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentId', sql.Int, studentId)
            .input('roundId', sql.Int, roundId)
            .query(`SELECT * FROM [${slug}].student_round_mapping 
                WHERE round_lid = @roundId AND student_lid = @studentId AND active = 1 AND 
                bidding_session_lid = @biddingId`
            )

            return result.recordset
        }catch(error){
            throw error
        }
    }


    static currentRoundStatus = async (slug, bidddingId, roundId) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('biddingId', sql.Int, bidddingId)
            .input('roundId', sql.Int, roundId)
            .query(`SELECT rs.round_name, FORMAT(rs.start_date_time, 'dd-MMMM yyyy h:mm:ss tt') as startTime, FORMAT(rs.end_date_time, 'dd-MMMM yyyy h:mm:ss tt') as endTime,
                IIF(rs.end_date_time < GETDATE(), 1, 0) AS round_ended, 
                IIF((rs.end_date_time > GETDATE() AND rs.start_date_time < GETDATE()), 1, 0) AS round_started,  
                IIF(rs.start_date_time > GETDATE(), 1, 0) AS round_not_started_yet
                FROM [${slug}].round_settings rs
                INNER JOIN [dbo].elective_selection_rounds es ON es.id = rs.round_lid
                WHERE es.round_name = 'DEMAND_ESTIMATION_ROUND' 
                AND rs.active = 1 
                AND rs.bidding_session_lid = @biddingId`
            )

            return result.recordset[0]
        }catch(error){
            throw error
        }
    }

    static courseListByAcadSession = async (slug, biddingId, acadSession) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('acadSessionId', sql.Int, acadSession)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT c.area_name AS areaName, c.course_name AS courseName, c.acad_session AS acadSession,
                c.id AS courseId, c.sap_acad_session_id AS acadSessionId, p.program_name AS programName,
                c.credits
                FROM [${slug}].courses c 
                INNER JOIN [${slug}].programs p ON c.program_id = p.program_id
                WHERE c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND 
                c.active = 1 ORDER BY c.id`
            )

            return result.recordset
        }catch(error){
            throw error
        }
    }

    static coursesCountByAcadSession = async (slug, biddingId, acadSession) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('acadSessionId', sql.Int, acadSession)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) AS count 
                FROM [${slug}].courses c 
                INNER JOIN [${slug}].programs p ON c.program_id = p.program_id 
                WHERE c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND c.active = 1`
            )

            return result.recordset
        }catch(error){
            throw error
        }
    }

    static areaListByAcadSession = async (slug, biddingId, acadSession) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('acadSessionId', sql.Int, acadSession)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT DISTINCT a.id, a.area_name AS areaName
                FROM [${slug}].courses c
                INNER JOIN [${slug}].areas a ON a.area_name = c.area_name
                WHERE c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId
                AND c.active = 1 AND a.active = 1 AND a.bidding_session_lid = @biddingId`
            )

            return result.recordset
        }catch(error){
            throw error
        }
    }

    static coursesListByArea = async (slug, biddingId, acadSession, area) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('areaId', sql.Int, area)
            .input('acadSessionId', sql.Int, acadSession)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT DISTINCT c.course_id, c.area_name AS areaName,
                c.course_name AS courseName,c.acad_session AS acadSession, c.id AS courseId,
                c.sap_acad_session_id AS acadSessionId, p.program_name AS programName, c.credits 
                FROM [${slug}].courses c 
                INNER JOIN [${slug}].programs p ON c.program_id = p.program_id
                INNER JOIN [${slug}].areas a ON a.area_name = c.area_name
                WHERE c.sap_acad_session_id = @acadSessionId AND c.active = 1 AND c.bidding_session_lid = @biddingId AND a.id = @areaId ORDER BY c.id`
            )

            return result.recordset
        }catch(error){
            throw error
        }
    }

    static coursesCountByArea = async (slug, biddingId, acadSession, area) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('areaId', sql.Int, area)
            .input('acadSessionId', sql.Int, acadSession)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) AS count 
                FROM [${slug}].courses c 
                INNER JOIN [${slug}].programs p ON c.program_id = p.program_id 
                INNER JOIN [${slug}].areas a ON a.area_name = c.area_name
                WHERE c.sap_acad_session_id = @acadSessionId AND c.active = 1 AND c.bidding_session_lid = @biddingId AND a.id = @areaId`
            )

            return result.recordset
        }catch(error){
            throw error
        }
    }


    static saveCoursesDemandEstimation = async (slug, biddingId, userId, studentId, roundId, inputJSON) => {
        try{
            const pool = await poolConnect
            const result = await pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('student_lid', sql.Int, studentId)
            .input('round_lid', sql.Int, roundId)
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_demand]`)

            return result
        }catch(error){
            throw error
        }
    }

    static deleteCourseDemandEstimation = async (slug, biddingId, userId, studentId, roundId, courseId) => {
        try{
            // console.log(slug, biddingId, userId, studentId, roundId, courseId)
            const pool = await poolConnect
            const result = await pool.request()
            .input('course_lid', sql.Int, courseId)
            .input('student_lid', sql.Int, studentId)
            .input('round_lid', sql.Int, roundId)
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_demand]`)

            return result
        }catch(error){
            throw error
        }
    }

}