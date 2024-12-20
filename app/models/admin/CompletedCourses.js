import { poolConnect, sql } from "../../config/db.js";

export default class CompletedCourses{
    static compeletedCoursesList(slug, biddingId){
        let showEntries = 10
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP ${showEntries} cc.id, sd.student_name, cc.course_name 
                FROM [${slug}].completed_courses cc 
                INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id 
                WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId AND sd.active = 1 ORDER BY cc.id`
            )
        })
    }

    static deleteCompletedCourse(slug, biddingId, userId, courseId){
        console.log(courseId)
        return poolConnect.then(pool => {
            return pool.request()
            .input('course_lid', sql.Int, courseId)
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_courses]`)
        })
    }

    static editCompletedCourse(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('bidding_session_lid',  sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_courses]`)
        })
    }

    static deleteAllCompletedCourse(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_all_completed_courses]`)
        })
    }

    static addCompletedCourse(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_upload_completed_courses]`)
        })
    }
}