import { poolConnect, sql } from "../../config/db.js";

export default class StudentsData {
    static studentsDataList(slug, biddingId){
        let showEntries = 10
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP ${showEntries} sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email, 
                p.program_name, sd.bid_points, sd.year_of_joining, sd.previous_elective_credits
                FROM [${slug}].student_data sd 
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                WHERE sd.active = 1 AND p.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId`)
        })
    }

    static studentDataListCount(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                FROM [${slug}].student_data sd 
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId AND p.active = 1`
            )
        })
    }

    static programList(slug, biddingId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT p.program_id,p.program_name
                FROM [${slug}].student_data sd 
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                WHERE sd.active = 1 AND 
                p.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId AND p.active = 1 GROUP BY p.program_id,p.program_name`)
        })
    }

    static showStudentListEntries(slug, biddingId, programId, entriesCount){
        if (programId != '-1') {
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT TOP ${entriesCount} sd.id, sd.sap_id, sd.roll_no, sd.student_name, 
                    sd.email, p.program_name, sd.bid_points, sd.year_of_joining, sd.previous_elective_credits
                    FROM [${slug}].student_data sd 
                    INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 
                    AND p.bidding_session_lid= @biddingId 
                    AND sd.bidding_session_lid = @biddingId 
                    AND p.program_id = @programId AND p.active = 1`
                )
            })
        } else {
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT TOP ${entriesCount} sd.id, sd.sap_id, sd.roll_no, sd.student_name, 
                    sd.email, p.program_name, sd.bid_points,sd.year_of_joining, sd.previous_elective_credits
                    FROM [${slug}].student_data sd 
                    INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                    WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId 
                    AND sd.bidding_session_lid = @biddingId AND p.active = 1`
                )
            })
        }
    }

    static showStudentListEntriesCount(slug, biddingId, programId){
        if(programId !== '-1'){
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].student_data sd 
                    INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.active = 1`
                )
            })
        }else{
            return poolConnect.then(pool => {
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*)
                    FROM [${slug}].student_data sd 
                    INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                    WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId AND p.active = 1`
                )
            })
        }
    }

    static studentListByProgramId(slug, biddingId, programId, entriesCount){
        return poolConnect.then(pool => {
            return pool.request()
            .input('programId', sql.Int, programId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP ${entriesCount} sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email,
                p.program_name,sd.bid_points,sd.year_of_joining, sd.previous_elective_credits
                FROM [${slug}].student_data sd
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId AND p.active = 1 ORDER BY sd.id`
            )
        })
    }

    static studentListByProgramIdCount(slug, biddingId, programId){
        return poolConnect.then(pool => {
            return pool.request()
            .input("programId", sql.Int, programId)
            .input("biddingId", sql.Int, biddingId)
            .query(`SELECT COUNT(*)
                FROM [${slug}].student_data sd
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId AND p.active = 1`
            )
        })
    }

    static studentListForOptionByProgramId(slug, biddingId, programId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('programId', sql.Int, programId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT sap_id, student_name
                FROM [${slug}].student_data sd
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId AND p.active = 1 ORDER BY sd.id`
            )
        })
    }

    static studentListByStudentId(slug, biddingId, programId, studentId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('studentId', sql.NVarChar(sql.MAX), studentId)
            .input('programId', sql.Int, programId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email,
                p.program_name,sd.bid_points,sd.year_of_joining, sd.previous_elective_credits
                FROM [${slug}].student_data sd
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId AND sd.sap_id = @studentId 
                AND p.active = 1`
            )
        })
    }


    static studentListByStudentIdCount(slug, biddingId, programId, studentId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('studentId', sql.NVarChar(sql.MAX), studentId)
            .input('programId', sql.Int, programId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                FROM [${slug}].student_data sd 
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId AND sd.sap_id = @studentId 
                AND p.active = 1`)
        })
    }

    static studentListByPages(slug, biddingId, letterSearch, pageNo, entriesCount){
        if(pageNo){
            return poolConnect.then(pool => {
                return pool.request()
                .input('pageNo', sql.Int, pageNo)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email, 
                                p.program_name, sd.bid_points, sd.year_of_joining, 
                                sd.previous_elective_credits
                                FROM [${slug}].student_data sd 
                                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                                WHERE sd.bidding_session_lid = @bidding_session_lid AND sd.active = '1' 
                                AND p.active = 1 AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch) ORDER BY sd.id OFFSET (@pageNo - 1) * ${Number(entriesCount)} ROWS FETCH NEXT ${Number(entriesCount)} ROWS ONLY`
                )
            })
        }else{
            return poolConnect.then(pool => {
                return pool.request()
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email, p.program_name,
                    sd.bid_points, sd.year_of_joining, sd.previous_elective_credits
                    FROM [${slug}].student_data sd 
                    INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                    WHERE sd.bidding_session_lid = @bidding_session_lid AND sd.active = '1'
                    AND p.active = 1 AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE  @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch)`
                )
            })
        }
    }

    static studentListByPagesByCount(slug, biddingId, letterSearch, pageNo){
        return poolConnect.then(pool => {
            return pool.request()
            .input('pageNo', sql.Int, pageNo)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
            .query(`SELECT COUNT(*)
                FROM [${slug}].student_data sd 
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                WHERE sd.bidding_session_lid = @bidding_session_lid AND sd.active = '1' 
                AND p.active = 1 AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE  @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch)`
            )
        })
    }

    static updateStudentsData(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_student_data]`)
        })
    }

    static deleteStudentsData(slug, biddingId, userId, studentId){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_student_lid', sql.Int, studentId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_student_data]`)
        })
    }


    static addStudentsData(slug, biddingId, userId, inputJSON){
        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].sp_upload_student_data`)
        })
    }

    static deleteAllStudentsData(slug, biddingId, userId, inputJSON){
        // console.log(JSON.stringify(inputJSON))
        // return

        return poolConnect.then(pool => {
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('last_modified_by', sql.Int, userId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_all_student_data]`)
        })
    }
}