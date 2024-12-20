import { poolConnect, sql } from "../../config/db.js";

export default class DivisionBatches{
    static divisionBatchesList(slug, biddingId){
        return poolConnect.then(pool => {
            let showEntries = 10
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP ${showEntries} db.id, p.program_name, ad.acad_session, c.course_name, 
                db.division, db.batch, max_seats 
                FROM [${slug}].division_batches db 
                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.active = 1`)
        })
    }

    static divisionBatchesListCount(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                FROM [${slug}].division_batches db 
                INNER JOIN [${slug}].courses c ON db.course_lid = c.id 
                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId`
            )
        })
    }

    static programList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT p.program_id, program_name 
                FROM [${slug}].division_batches db 
                INNER JOIN [${slug}].courses c ON db.course_id = db.course_id 
                INNER JOIN [${slug}].programs p ON c.program_id = p.program_id WHERE p.bidding_session_lid = @biddingId GROUP BY p.program_id, p.program_name`
            )
        })
    }

    static updateDivisionBatch(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_division_batches]`)
        })
    }

    static deleteDivisionBatch(slug, biddingId, userId, divisionId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .input('div_batch_lid', sql.Int, divisionId)
            .output('output_json',sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_division_batches]`)
        })
    }

    static addDivisionBatch(slug, biddingId, userId, inputJSON){
        // console.log( JSON.stringify(inputJSON))
        // return
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_upload_division_batches]`)
        })
    }

    static deleteAllDivisionBatch(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_all_division_batches]`)
        })
    }

    static showDivBatchListEntries(slug, biddingId, programId, acadSessionId, entriesCount){
        if (programId !== -1 && acadSessionId !== -1) {  
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT TOP ${entriesCount} db.id, p.program_name,ad.acad_session, c.course_name, 
                    db.division, db.batch, max_seats 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND p.program_id = @programId AND c.sap_acad_session_id = @acadSessionId
                    ORDER BY c.id DESC`
                )
            })
        }else if (acadSessionId !== -1) {
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT TOP ${entriesCount} db.id,p.program_name,ad.acad_session,
                    c.course_name, db.division, db.batch, max_seats 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId
                    ORDER BY `
                )
            })
        }else {
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT TOP ${entriesCount} db.id, p.program_name, ad.acad_session, c.course_name,
                    db.division, db.batch, max_seats 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE db.active = 1 AND c.bidding_session_lid = @biddingId`
                )
            })
        }
    }

    static showDivBatchListEntriesCount(slug, biddingId, programId, acadSessionId){
        if (programId != - 1 && acadSessionId != -1) {   
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND p.program_id = @programId AND c.sap_acad_session_id = @acadSessionId`
                )
            })
        }else if (acadSessionId != -1) {
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId`
                )
            })
        }else {
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`
                )
            })
        }
    }

    static divBatchListByProgramId(slug, biddingId, programId, entriesCount){
        return poolConnect.then(pool => {
            return pool.request()
            .input('programId', sql.Int, programId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP ${entriesCount} db.id, p.program_name, ad.acad_session, c.course_name, 
                db.division, db.batch, max_seats 
                FROM [${slug}].division_batches db 
                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.active = 1 AND p.bidding_session_lid = @biddingId ORDER BY db.id`
            )
        })
    }
    
    static divBatchListByProgramIdCount(slug, biddingId, programId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('programId', sql.Int, programId)
            .query(`SELECT COUNT(*) 
                FROM [${slug}].division_batches db 
                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.active = 1 AND p.bidding_session_lid = @biddingId`
            )
        })
    }

    static acadSessionListForOptionByProgramId(slug, biddingId, programId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('programId', sql.Int, programId)
            .query(`SELECT c.sap_acad_session_id, c.acad_session 
                FROM [${slug}].division_batches db 
                INNER JOIN [${slug}].courses c ON db.course_lid = c.id WHERE db.bidding_session_lid = @biddingId AND db.active = 1 AND program_id = @programId  GROUP BY c.sap_acad_session_id, c.acad_session ORDER BY c.sap_acad_session_id`
            )
        })
    }

    static divBatchListByAcadSessionList(slug, biddingId, programId, acadSessionId, entriesCount){
        return poolConnect.then(pool => {
            return pool.request()
            .input('acadSessionId', sql.Int, acadSessionId)
            .input('programId', sql.Int, programId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP ${entriesCount} db.id, p.program_name, ad.acad_session, c.course_name, 
                db.division, db.batch, max_seats 
                FROM [${slug}].division_batches db 
                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId
                AND p.program_id = @programId AND c.sap_acad_session_id = @acadSessionId AND p.active = 1 AND p.bidding_session_lid = @biddingId ORDER BY db.id`
            )
        })
    }

    static divBatchListByAcadSessionListCount(slug, biddingId, programId, acadSessionId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('sessionId', sql.Int, acadSessionId)
            .input('programId', sql.Int, programId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                FROM [${slug}].division_batches db 
                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId AND c.sap_acad_session_id = @sessionId AND p.active = 1 AND p.bidding_session_lid = @biddingId`
            )
        })
    }

    static divBatchListByPages(slug, biddingId, letterSearch, programId, acadSessionId, showEntry, pageNo) {

        if (pageNo) {
            if ((programId != -1) && (acadSessionId != -1)) {
                return poolConnect.then(pool => {
                    return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .input('acadSessionId', sql.Int, acadSessionId)
                    .input('pageNo', sql.Int, pageNo)
                    .query(`SELECT db.id, p.program_name, ad.acad_session, 
                        c.course_name, db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id   
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND p.program_id = @programId
                        AND p.bidding_session_lid = @biddingId AND p.active = 1 
                        AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`
                    )
                })
            } else if (programId != -1) {
                
                return poolConnect.then(pool => {
                    return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .input('pageNo', sql.Int, pageNo)
                    .query(`SELECT db.id, p.program_name, ad.acad_session, 
                        c.course_name, db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id 
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId
                        AND p.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.program_id = @programId AND (p.program_name LIKE @letterSearch) OR (ad.acad_session LIKE @letterSearch) OR (c.course_name LIKE @letterSearch) OR (db.division LIKE @letterSearch) OR db.batch LIKE @letterSearch OR (db.max_seats LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`
                    )
                });
            } else {
                return poolConnect.then(pool => {
                    return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .input('pageNo', sql.Int, pageNo)
                    .query(`SELECT db.id, p.program_name, ad.acad_session, c.course_name, 
                        db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId
                        AND(p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`
                    )
                })
            }
        } else {
            if (programId != '-1' && acadSessionId != '-1') {
                return poolConnect.then(pool => {
                    return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .input('acadSessionId', sql.Int, acadSessionId)
                    .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, 
                        c.course_name, db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId AND p.program_id = @programId  
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch)`
                    )
                })
            } else if (programId != '-1') {
                return poolConnect.then(pool => {
                    return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name, 
                        db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId AND p.program_id = @programId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch )`
                    )
                })
            } else {
                return poolConnect.then(pool => {
                    return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT db.id, p.program_name, ad.acad_session, c.course_name, 
                        db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch )`
                    )
                })
            }
        }
    }


    static divBatchListByPagesCount(slug, biddingId, letterSearch, programId, acadSessionId) {
        if (programId != '-1' && acadSessionId != '-1') {
            return poolConnect.then(pool => {
                return pool.request()
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId AND p.program_id = @programId  
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                    WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch)`
                )
            })
        } else if (programId != '-1') {
            return poolConnect.then(pool => {
                return pool.request()
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId AND p.program_id = @programId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                    WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch )`
                )
            })
        } else {
            return poolConnect.then(pool => {
                return pool.request()
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                    WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch )`
                )
            })
        }
    }
}