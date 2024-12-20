export const getBreadCrumbs = (req,res,next) => {
    // let rtn = []
    // let acc = ''
    // let arr = req.originalUrl.substring(1).split("/")

    // console.log(arr)

    // // arr.forEach((item, index) => {
    // //     acc = index != arr.length - 1 ? acc + "/" + arr[index] : null;
    // //     if(acc[0] === '/student'){
    // //         acc = '/student/dashboard'
    // //     }
    // //     if(acc[0] === '/admin'){
    // //         acc = '/admin/dashboard'
    // //     }

    // //     rtn[index] = {
    // //         name : item,
    // //         url : acc
    // //     }

    // //     if(acc === '/student/dashboard'){
    // //         acc = '/dashboard'
    // //     }

    // //     if(acc == '/admin/dashboard'){
    // //         acc = '/dashboard'
    // //     }

    // // })

    // const baseRoute = arr[0] === 'admin' ? 'admin' : arr[0] === 'student' ? 'student' : '';

    // // Handle dashboard explicitly
    // if (arr.length > 0) {
    //     rtn.push({
    //         name: 'dashboard',
    //         url: `/${baseRoute}/dashboard`
    //     });
    // }

    // // Build breadcrumbs for remaining parts of the URL
    // arr.slice(1).forEach((item, index) => {
    //     acc += `/${item}`;
    //     rtn.push({
    //         name: item, // Display name for each segment
    //         url: `/${baseRoute}/dashboard${acc}` // Keep `dashboard` in every link
    //     });
    // });


    // req.breadcrumbs = rtn
    // next()


    const arr = req.originalUrl.substring(1).split("/"); // Split the URL into segments
    const baseRoute = arr[0]; // Determine if the user is admin or student
    const isAdmin = baseRoute === "admin";
    const isStudent = baseRoute === "student";

    // Ensure base route is either 'admin' or 'student'
    if (!isAdmin && !isStudent) {
        req.breadcrumbs = []; // No breadcrumbs for invalid routes
        return next();
    }

    // Start building the breadcrumbs from the second segment onwards
    const breadcrumbs = [];
    let acc = ""; // Accumulator to build the full path

    arr.slice(1).forEach((item, index) => {
        acc += `/${item}`; // Build the path incrementally
        breadcrumbs.push({
            name: item.replace(/-/g, " "), // Convert 'page-1' to 'page 1' for better readability
            url: `/${baseRoute}${acc}` // Ensure the URL includes the base route
        });
    });

    req.breadcrumbs = breadcrumbs; // Set the breadcrumbs in the request object
    next(); // Proceed to the next middleware or route handler

}

