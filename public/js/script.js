$('.toggle-button').on('click', function(){
    $('.sidebar').toggleClass('collapsed')
    $('.logo-nmims').toggleClass('collapsed')
    $('.main').toggleClass('collapsed')
    $(this).find('i').toggleClass('fa-angles-left fa-angles-right')
})

$(window).resize(function() {
    if ($(window).width() <= 1200) {
        $('.sidebar').addClass('collapsed')
        $('.logo-nmims').addClass('collapsed')
        $('.main').addClass('collapsed')
        $('.toggle-button').find('i').removeClass('fa-angles-left').addClass('fa-angles-right')
    } else {
        $('.sidebar').removeClass('collapsed')
        $('.logo-nmims').removeClass('collapsed')
        $('.main').removeClass('collapsed')
        $('.toggle-button').find('i').removeClass('fa-angles-right').addClass('fa-angles-left')
    }
});


// Setting Bidding Session Status 

// $(document).ready(function(){
//     $("#set-bidding-session-status").selectize()
// })

$("#change-bidding-session-modal").on("show.bs.modal", function(){
    // $("#set-bidding-session-status").selectize()
    const $selectElement = $("#set-bidding-session-status").selectize();
    const biddingSessionsSelect = $selectElement[0].selectize 

    let ApiObj = {
        type: "POST",
        url: "/admin/bidding-sessions/active-bidding-session",
        data: {},
        dataType: JSON
    }

    ajaxApi(ApiObj)
    .then(result => {
        const biddingSessionList = result.biddingSessionList
        
        biddingSessionsSelect.clearOptions()

        if (biddingSessionList.length > 0) {
            biddingSessionList.forEach(biddingSession => {
                biddingSessionsSelect.addOption({
                    value: biddingSession.id,
                    text: `${biddingSession.bidding_name}`,
                })

                if (biddingSession.active) {
                    activeSessionId = biddingSession.id
                    biddingSessionsSelect.setValue(activeSessionId)
                }
            })


        } else {
            biddingSessionsSelect.addOption({
                value: "",
                text: "No Bidding Session",
                disabled: true,
            })
        }

        biddingSessionsSelect.refreshOptions(false)
    })
    .catch(err => {
        console.error(err);
    })
})

$("#confirm-bidding-session-status-btn").on("click", function(){
    const biddingSessionId = $("#set-bidding-session-status")[0].selectize.items[0]
    const biddingSessionName = $("#set-bidding-session-status").text()

    const inputJSON = {
        id : biddingSessionId,
        bidding_name : biddingSessionName
    }

    let ApiObj = {
        type : "POST",
        url : "/admin/bidding-sessions/set-active-bidding-session",
        data : {
            inputJSON : JSON.stringify(inputJSON)
        },
        dataType : JSON
    }

    ajaxApi(ApiObj).then(result => {
        toast.success(result.description)
        $("#change-bidding-session-modal").modal("hide")

        setTimeout(()=>{
            location.reload()
        },[3000])

    }).catch(err => {
        toast.error(err.responseJSON.description)
    })
    
})

function setActiveMenuItem(active){
    $(".menu-item." +active).addClass('active')
    // console.log($(`.menu-item ${active}`))
}


