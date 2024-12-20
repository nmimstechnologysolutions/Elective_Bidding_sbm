import { poolConnect, sql } from "../../config/db.js";

export default class PreRequisities{
    static preRequisitiesList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT pr.id, p.program_name, pr.acad_session, pr.course_name, pr.course_id AS courseId, 
                type, pre_req_course_name, pre_req_course_id 
                FROM [${slug}].pre_requisites pr
                INNER JOIN [${slug}].courses c ON  pr.course_id = c.course_id AND c.bidding_session_lid = @biddingId
                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                WHERE pr.active = 1 AND pr.bidding_session_lid = @biddingId AND c.active = 1 AND c.bidding_session_lid = @biddingId AND p.active = 1 AND p.bidding_session_lid = @biddingId`
            )
        })
    }

    static acadSessionsList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT ad.sap_acad_session_id AS id, ad.acad_session AS name, 
                IIF(ps.min_credits IS NULL, 0, ps.min_credits) AS credits, 
                IIF(ps.max_credits IS NULL, 0, ps.max_credits) AS maxCredits
                FROM [${slug}].program_sessions ps 
                INNER JOIN [dbo].acad_sessions ad ON ps.sap_acad_session_id = ad.sap_acad_session_id
                WHERE bidding_session_lid = @biddingId AND active = 1`
            )
        })
    }

    static preRequiredAcadSessionsList(){
        return poolConnect.then(pool => {
            return pool.request()
            .query(`SELECT sap_acad_session_id, acad_session FROM [dbo].acad_sessions 
                where sap_acad_session_id IN(31,32,33)`
            )
        })
    }

    static courseList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT DISTINCT c.course_id, c.course_name 
                FROM [${slug}].timetable t
                INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid
                INNER JOIN [${slug}].courses c ON c.id = db.course_lid 
                WHERE t.active = 1 AND db.active = 1 AND c.active = 1 AND t.bidding_session_lid = @biddingId `
            )
        })
    }

    static preRequisitiesTypes(){
        return poolConnect.then(pool => {
            return pool.request()
            .query(`SELECT id, pre_req_type FROM [dbo].pre_req_types`)
        })
    }

    static courseListByAcadSession(slug, biddingId, acadSessionId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('acadSessionId', sql.Int, acadSessionId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT DISTINCT course_id, course_name 
                FROM [${slug}].courses 
                WHERE active = 1 AND bidding_session_lid = @biddingId 
                AND sap_acad_session_id = @acadSessionId`
            )
        })
    }

    static addPreRequisiteCourse(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_pre_requisites]`)
        })
    }

    static editPreRequisiteCourse(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_pre_requisites]`)
        })
    }

    static deletePreRequisiteCourse(slug, biddingId, userId, preRequisiteId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('pre_requisite_lid', sql.Int, preRequisiteId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_pre_requisites]`)
        })
    }
}