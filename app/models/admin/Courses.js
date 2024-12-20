import { poolConnect, sql } from "../../config/db.js";

export default class Courses{
    static courseListCount(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) AS count FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`
            )
        })
    }

    static courseList(slug, biddingId){
        const showEntry = 10
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, 
                area_name, min_demand_criteria, year_of_introduction
                FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId ORDER BY c.id`
            )
        })
    }

    static courseListComplete(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                area_name, min_demand_criteria, year_of_introduction
                FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId ORDER BY c.id`
            )
        })
    }

    static programList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT p.program_name, p.program_id 
                FROM [${slug}].courses c
                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id WHERE c.active = 1 AND 
                p.bidding_session_lid = @biddingId GROUP BY p.program_id, program_name`
            )
        })
    }

    static acadSessions(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT DISTINCT sap_acad_session_id AS id, acad_session AS name
                FROM [${slug}].courses WHERE bidding_session_lid = @biddingId AND active = 1`
            )
        })
    }



    static showCoursesListEntries(slug, biddingId, showEntry, programId, acadSessionId){
        if(programId !== '-1' && acadSessionId !== '-1'){
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT TOP ${showEntry} c.id, course_name, credits, 
                    program_id, ad.acad_session,
                    area_name, min_demand_criteria, year_of_introduction
                    FROM [${slug}].courses c
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND c.program_id = @programId 
                    AND c.sap_acad_session_id = @acadSessionId`
                )
            })
        }else if(programId != "-1"){
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session,
                    area_name, min_demand_criteria, year_of_introduction
                    FROM [${slug}].courses c
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND c.program_id = @programId`
                )
            })
        }else{
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session,
                    area_name, min_demand_criteria, year_of_introduction
                    FROM [${slug}].courses c
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`
                )
            })
        }
    }

    static showCoursesListEntriesCount(slug, biddingId, showEntry, programId, acadSessionId){
        // console.log(programId, acadSessionId)
        if (programId !== '-1' && acadSessionId !== '-1') {
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].courses c
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND c.program_id = @programId 
                    AND c.sap_acad_session_id = @acadSessionId`
                )
            })
        }else if (programId !== '-1') { 
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].courses c
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND c.program_id = @programId`
                )
            })
        }
        else{
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].courses c
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`
                )
            })
        }
    }

    static courseListByPages(slug, biddingId, pageNo, letterSearch, showEntry, programId, acadSessionId){
        if (pageNo) {
            if (programId !== '-1' && acadSessionId !== '-1') {
                return poolConnect.then(pool => {
                
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('programId', sql.Int, programId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                                WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' 
                                AND c.program_id = @programId AND c.sap_acad_session_id = @acadSessionId
                                AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                })
            } else if (programId !== '-1') { 
                return poolConnect.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('programId', sql.Int, programId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                                WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND c.program_id = @programId AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                })
            }
            else {
                return poolConnect.then(pool => {
                    return pool.request()
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .input('pageNo', sql.Int, pageNo)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                                WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                })
            }
        }else{
            if (programId !== '-1' && acadSessionId !== '-1') {
                return poolConnect.then(pool => {
                
                    return pool.request()
                        .input('programId', sql.Int, programId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                                WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' 
                                AND c.program_id = @programId AND c.sap_acad_session_id = @acadSessionId
                                AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id`);
                })
            } else if (programId !== '-1') { 
                return poolConnect.then(pool => {
                    return pool.request()
                        .input('programId', sql.Int, programId)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                                WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND c.program_id = @programId AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id`);
                })
            }
            else {
                return poolConnect.then(pool => {
                    return pool.request()
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                                WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id`);
                })
            }
        }
    }

    static courseListByProgramId(slug, biddingId, programId, entriesCount){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .input("programId", sql.Int, programId)
            .query(`SELECT TOP ${entriesCount} c.id, course_name, credits, program_id, ad.acad_session, 
                area_name, min_demand_criteria, year_of_introduction
                FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId
                ORDER BY c.id`
            )
        })
    }

    static courseListByProgramIdCount(slug, biddingId, programId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('programId', sql.Int, programId)
            .query(`SELECT COUNT(*)
                FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId`
            )
        })
    }

    static acadSessionListByProgramId(slug, biddingId, programId, entriesCount){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .input("programId", sql.Int, programId)
            .query(`SELECT TOP ${entriesCount} ad.id, ad.sap_acad_session_id, ad.acad_session
                FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId
                GROUP BY ad.id,ad.sap_acad_session_id,ad.acad_session ORDER BY ad.id`
            )
        })
    }

    static courseListByAcadSessionId(slug, biddingId, programId, sessionId, entriesCount){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .input("programId", sql.Int, programId)
            .input("sessionId", sql.Int, sessionId)
            .query(`SELECT TOP ${entriesCount} c.id, course_name, credits, program_id, ad.acad_session, 
                area_name, min_demand_criteria, year_of_introduction 
                FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId ORDER BY c.id`
            )
        })
    }

    static courseListByAcadSessionIdCount(slug, biddingId, programId, sessionId){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .input("programId", sql.Int, programId)
            .input("sessionId", sql.Int, sessionId)
            .query(`SELECT COUNT(*) FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId`
            )
        })
    }

    static courseListForOptionByAcadSessionId(slug, biddingId, programId, sessionId){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .input("programId", sql.Int, programId)
            .input("sessionId", sql.Int, sessionId)
            .query(`SELECT c.id, c.course_id, c.course_name
                FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId GROUP BY c.id, c.course_id, c.course_name ORDER BY c.id`
            )
        })
    }

    static courseListByCourseId(slug, biddingId, programId, sessionId, courseId, entriesCount){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .input("programId", sql.Int, programId)
            .input("sessionId", sql.Int, sessionId)
            .input("courseId", sql.Int, courseId)
            .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                area_name, min_demand_criteria, year_of_introduction
                FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId AND c.course_id = @courseId ORDER BY c.id`
            )
        })
    }

    static courseListByCourseIdCount(slug, biddingId, programId, sessionId, courseId){
        return poolConnect.then(pool => {
            return pool.request()
            .input("biddingId", sql.Int, biddingId)
            .input("programId", sql.Int, programId)
            .input("sessionId", sql.Int, sessionId)
            .input("courseId", sql.Int, courseId)
            .query(`SELECT COUNT(*) FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId AND c.course_id = @courseId`
            )
        })
    }

    static updateCourse(slug, biddingId, userId, inputJson){
        return poolConnect.then(pool => {
            return pool.request()
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('input_json', sql.NVarChar(sql.MAX), inputJson)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_courses]`)
        })
    }

    static deleteCourse(slug, biddingId, userId, courseId){
        return poolConnect.then(pool => {
            return pool.request()

            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('course_lid', sql.Int, courseId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_courses]`)
        })
    }


    static addCourses(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_upload_courses]`)
        })
    }

    static deleteAllCourses(slug, biddingId, userId, inputJSON){
        inputJSON = inputJSON.map(item => ({
            id: parseInt(item.id) 
        }))

        return poolConnect.then(pool => {
            return pool.request()
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_all_courses]`)
        })
    }
}