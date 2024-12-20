export const confirmationRoundController = (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        res.render('students/confirmation/index',{
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error in confirmation round controller: ", error.message)
    }
}