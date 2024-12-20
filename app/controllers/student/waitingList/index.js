export const waitingListRoundController = (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        res.render('students/waitingList/index',{
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error waiting list controller: ", error.message)
    }
}