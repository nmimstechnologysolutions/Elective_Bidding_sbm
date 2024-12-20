import { DemandEstimationRound } from "../../../models/student/DemandEstimation.js"


export const DemandEstimationHandler = (socket, io) => {


socket.on('addCourseToDemandEstimation', async (data) => {
    // console.log(data)
    const { slug, biddingId, userId, studentId, courseId, concetrationName } = data
    const roundId = 1

    const inputJSON = {
        import_selected_courses : [{
            course_lid : courseId
        }]
    }

    // console.log(inputJSON)

    try{
        const result = await DemandEstimationRound.saveCoursesDemandEstimation(slug, biddingId, userId, studentId, roundId, inputJSON)
        const resultMessage = JSON.parse(result.output.output_json)
        

        const [selectedCourseList, availableCourseList, studentRoundCriteria] = await Promise.all([
            DemandEstimationRound.selectedCourseList(slug, biddingId, studentId, roundId),
            DemandEstimationRound.availableCourseList(slug, biddingId, studentId),
            DemandEstimationRound.studentRoundCriteria(slug, biddingId, studentId, roundId, concetrationName)
        ])

        socket.emit('courseAddedToDemandEstimation', {
            resultMessage : resultMessage,
            selectedCourseList : selectedCourseList,
            availableCourseList : availableCourseList,
            studentRoundCriteria : studentRoundCriteria
        })

    }catch(error){
        console.error("Error caught:", error.message);


        const [selectedCourseList, availableCourseList, studentRoundCriteria] = await Promise.all([
            DemandEstimationRound.selectedCourseList(slug, biddingId, studentId, roundId),
            DemandEstimationRound.availableCourseList(slug, biddingId, studentId),
            DemandEstimationRound.studentRoundCriteria(slug, biddingId, studentId, roundId, concetrationName)
        ])


        socket.emit('courseAddedToDemandEstimation', {
            errorMessage : JSON.parse(error.message),
            selectedCourseList : selectedCourseList,
            availableCourseList : availableCourseList,
            studentRoundCriteria : studentRoundCriteria
        })
    }
})


socket.on('removeCourseFromDemandEstimation', async (data) => { 
    const { slug, biddingId, userId, studentId, courseId, concetrationName } = data

    const roundId = 1

    try{
        const result = await DemandEstimationRound.deleteCourseDemandEstimation(slug, biddingId, userId, studentId, roundId, courseId)
        const resultMessage = JSON.parse(result.output.output_json)
        
        // console.log(resultMessage)

        const [selectedCourseList, availableCourseList,studentRoundCriteria] = await Promise.all([
            DemandEstimationRound.selectedCourseList(slug, biddingId, studentId, roundId),
            DemandEstimationRound.availableCourseList(slug, biddingId, studentId),
            DemandEstimationRound.studentRoundCriteria(slug, biddingId, studentId, roundId, concetrationName)
        ])

        socket.emit('courseAddedToDemandEstimation', {
            resultMessage : resultMessage,
            selectedCourseList : selectedCourseList,
            availableCourseList : availableCourseList,
            studentRoundCriteria : studentRoundCriteria
        })

    }catch(error){
        console.log(error.message)

        const [selectedCourseList, availableCourseList, studentRoundCriteria] = await Promise.all([
            DemandEstimationRound.selectedCourseList(slug, biddingId, studentId, roundId),
            DemandEstimationRound.availableCourseList(slug, biddingId, studentId),
            DemandEstimationRound.studentRoundCriteria(slug, biddingId, studentId, roundId, concetrationName)
        ])

        const errorMessage = {
            status: 500,
            description : JSON.parse(error?.originalError?.info?.message) || "Internal Server Error",
            data: []
        }

        socket.emit('courseAddedToDemandEstimation', {
            errorMessage : errorMessage,
            selectedCourseList : selectedCourseList,
            availableCourseList : availableCourseList,
            studentRoundCriteria : studentRoundCriteria
        })
    }
    
})


socket.on('getDemandRoundStatus', async (data) => {
    const { slug, biddingId, studentId, demandRoundDetails: roundInfo } = data;

    if (!roundInfo || !roundInfo.round_lid) {
        socket.emit('demandRoundStatus', {
            status: 'Not-Found',
            description: 'Round Not Created',
            data: {}
        });
        return;
    }

    const roundId = roundInfo?.round_lid
    const roundStatus = await DemandEstimationRound.currentRoundStatus(slug, biddingId, roundId);

    const checkStudentIsPartOfRound = await DemandEstimationRound.checkStundetIsPartOfRound(slug, biddingId, studentId, roundId);
    if (checkStudentIsPartOfRound.length === 0) {
        socket.emit('demandRoundStatus', {
            status: 'Not-Eligible',
            description: 'Student Not Eligible for this Round',
            data: {}
        });
        return;
    }

    if (roundStatus.round_ended) {
        socket.emit('demandRoundStatus', {
            status: 'Ended',
            description: 'Round Ended',
            data: {}
        });
        return;
    }

    if (roundStatus.round_started) {
        const interval = setInterval(async () => {
            const remainingTime = calculateRemainingTime(roundStatus.endTime)

            if (remainingTime === '00 : 00 : 00') {
                clearInterval(interval);

                socket.emit('demandRoundStatus', {
                    status: 'Ended',
                    description: 'Round Ended',
                    data: {}
                });
            } else {
                socket.emit('demandRoundStatus', {
                    status: 'Active',
                    description: 'Round Started',
                    data: { remainingTime }
                });
            }
        }, 1000);

        return;
    }

    if (roundStatus.round_not_started_yet) {
        const interval = setInterval(async () => {
            const remainingTime = calculateRemainingTime(roundStatus.startTime)

            if (remainingTime === '00 : 00 : 00') {
                clearInterval(interval);

                socket.emit('demandRoundStatus', {
                    status: 'Active',
                    description: 'Round Started',
                    data: {}
                });
            } else {
                socket.emit('demandRoundStatus', {
                    status: 'Not-Started',
                    description: 'Round Not Started',
                    data: {
                        startTime: roundStatus.startTime,
                        remainingTime
                    }
                });
            }
        }, 1000);

        return;
    }
    

    // console.log(roundTime)

    // roundStatus 
    // roundDescription
    // roundData
})


}


function calculateRemainingTime(targetTime){
    const currentTime = new Date();
    const targetDateTime = new Date(targetTime);
    const remainingMilliseconds = targetDateTime - currentTime;

    if (remainingMilliseconds <= 0) return "00 : 00 : 00";

    const totalSeconds = Math.floor(remainingMilliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
        return `${String(days).padStart(2, '0')} : ${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
    } else {
        return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
    }
}