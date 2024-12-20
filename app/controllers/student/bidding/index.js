export const biddingRoundController = (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        res.render('students/bidding/index',{
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error in bidding round controller: ", error.message)
    }
}