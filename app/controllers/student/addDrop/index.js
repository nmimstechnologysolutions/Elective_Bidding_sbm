export const addDropRoundController = (req,res) => {
    try{
        let sidebarActive = req.sidebarActive.split('/')

        res.render('students/addDrop/index',{
            breadcrumbs : req.breadcrumbs,
            active : sidebarActive[2]
        })
    }catch(error){
        console.log("error add & drop round controller: ", error.message)
    }
}