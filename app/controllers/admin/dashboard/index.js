import ElectiveTimetable from "../../../models/admin/ElectiveTimetable.js"

export const dashboardController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')
        res.render('admin/dashboard/index',{
            path: '/admin',
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2],
        })
    }catch(error){
        console.log('error in admin dashboard controller :', error.message)
    }
}

export const masterDataController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')
        res.render('admin/masterData/index',{
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log('error in admin dashboard controller :', error.message)
    }
}

export const biddingSettingsController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')
        res.render('admin/biddingSettings/index',{
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log('error in admin dashboard controller :', error.message)
    }
}

// export const electiveTimetableController = async (req,res) => {
//     try{
//         let sidebarActive = req.sidebarActive.split('/')
//         const result = await Promise.all([
//             ElectiveTimetable.programList(res.locals.slug,res.locals.biddingId),
//             ElectiveTimetable.acadSessions(res.locals.slug,res.locals.biddingId),
//             ElectiveTimetable.roomList(res.locals.slug,res.locals.biddingId),
//             ElectiveTimetable.maxAndMinTimeList(res.locals.slug,res.locals.biddingId),
//             ElectiveTimetable.timeSlotList()
//         ])
//         res.render('admin/electiveTimetable/index',{
//             breadcrumbs : req.breadcrumbs,
//             programList : result[0].recordset,
//             acadSessions : result[1].recordset,
//             roomList : result[2].recordset,
//             maxAndMinTimeList : result[3].recordset[0],
//             timeSlotList : result[4].recordset,
//             active : sidebarActive[2]
//         })
//     }catch(error){
//         console.log('error in admin dashboard controller :', error.message)
//     }
// }

// export const manualEnrollmentController = async (req,res) => {
//     try{

//     }catch(error){
//         console.log('error in admin dashboard controller :', error.message)
//     }
// }


export const reportsController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')
        res.render('admin/reports/index',{
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log('error in admin dashboard controller :', error.message)
    }
}


export const utilityController = async (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')
        res.render('admin/utility/index',{
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log('error in admin dashboard controller :', error.message)
    }
}