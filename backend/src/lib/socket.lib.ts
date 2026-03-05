import {Server} from 'socket.io';
import { Captain, User } from '../models';


let io: Server;

export function initializeSocket(server: any){
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET','POST','PUT','DELETE','PATCH']
        }
    });

    io.on('connection', (socket: any) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async(data : any) => {
            const { userId, userType} = data

            if(userType === 'user') {
                await User.findByIdAndUpdate(userId, {socketId: socket.id})
            }else if(userType === 'captain'){
                await Captain.findByIdAndUpdate(userId, {socketId: socket.id})
            }
        });

        socket.on('update-location-captain', async(data: any) => {
            const {userId, location } = data;

            if(!location || !location.ltd || !location.lng){
                return socket.emit('error', {message: 'Invalid location data'})
            }

            await Captain.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });

        socket.on('disconnect', ()=>{
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

export const sendMessageToSocketId = (socketId: any, messageObject: any) => {
    console.log(messageObject);

    if(io){
        io.to(socketId).emit(messageObject.event, messageObject.data);
    }else{
        console.log('Socket.io not initialized.');
    }
}
