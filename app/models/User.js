import { poolConnect, sql } from "../config/db.js"

export default class User{
    static userDetails = async (slug, biddingId, body) => {
        const username = body.username
        try{

            const pool = await poolConnect
            const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query(`SELECT role_lid FROM [${slug}].users WHERE username = @username`)

            // console.log("res>>",result.recordset[0]?.role_lid)

            const role_lid = result.recordset[0]?.role_lid

            if(!role_lid){
                return null
            }

            const roleNameResult = await pool.request()
            .input('role_lid', sql.Int, role_lid)
            .query(`SELECT role_name FROM [dbo].user_roles WHERE id = @role_lid`)

            const roleName = roleNameResult.recordset[0]?.role_name

            if(roleName == 'student'){
                const studentDetails = await pool.request()
                .input('username', sql.VarChar, username)
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT u.*, ur.role_name, sd.sap_id, sd.id AS student_lid 
                    FROM [${slug}].users u 
                    INNER JOIN [dbo].user_roles ur ON ur.id = u.role_lid
                    INNER JOIN [${slug}].student_data sd ON sd.email = u.username 
                    WHERE username = @username AND u.active = 1 AND sd.active = 1 
                    AND sd.bidding_session_lid = @biddingId`
                )
                return studentDetails.recordset

            }else if(roleName == 'admin'){
                const adminDetails = await pool.request()
                .input('username', sql.VarChar, username)
                .query(`SELECT u.*, ur.role_name 
                    FROM [${slug}].users u 
                    INNER JOIN [dbo].user_roles ur ON ur.id = u.role_lid
                    WHERE username = @username AND u.active = 1`
                )
                return adminDetails.recordset
            }
            return null
        
        }catch(error){
            console.error('Error fetching user details:', error);
            throw error
        }
        
    }
}