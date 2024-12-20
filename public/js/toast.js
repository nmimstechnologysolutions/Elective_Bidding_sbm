const toast = {
    success: function (text) {
        // console.log('Showing success toast');
        this.createToast('success', text, 'fa-check');
    },

    error: function (text) {
        this.createToast('error', text, 'fa-exclamation');
    },

    info: function (text) {
        this.createToast('info', text, 'fa-info');
    },

    warn: function (text) {
        this.createToast('warn', text, 'fa-exclamation');
    },

    createToast: function (type, message, iconClass) {
        const toastHTML = `
            <div class="toast ${type}">
                <div class="toast-content">
                    <div class="icon-container ${type}">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="message">
                        <span class="text text-1">${message}</span>
                    </div>
                </div>
                <i class="fa-solid fa-xmark close"></i>
                <div class="progress active ${type}"></div>
            </div>
        `;

        // console.log('Appending toast to DOM');
        $("#toast-container").append(toastHTML);
        setTimeout(function(){
            // console.log('Removing toast');
            $('#toast-container .toast').first().remove();
        }, 4000);

        // Close button functionality
        $('#toast-container .toast .close').last().click(function () {
            $(this).parent().parent().remove();
        });
    }
};

// $(document).ready(function() {
//     $("#toast-btn").on('click', function() {
//         toast.success('Your changes have been saved');
//         console.log('Button clicked');
//     });
// });
