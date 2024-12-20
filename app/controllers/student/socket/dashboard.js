export const DashboardHandler = (socket, io) => {
    if (!io.timeInterval) {
        io.timeInterval = setInterval(() => {
            const currentTime = new Date().toLocaleTimeString();
            // console.log(currentTime)
            io.emit('time', currentTime);
        }, 1000);

    }

    socket.on('disconnect', () => {
        // console.log('A user disconnected:', socket.id);

        if (io.sockets.sockets.size === 0) {
            clearInterval(io.timeInterval);
            delete io.timeInterval;
        }
    })
}