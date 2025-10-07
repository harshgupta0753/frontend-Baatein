import { getSocket } from "./socket";

export const testSocket =(payload:any, off:boolean=false)=>{
    const socket= getSocket();
    if(!socket) {
        console.error("Socket not connected");
        return;
    }
    if(off){
        socket.off('testSocket',payload);
    }else if(typeof payload ==='function'){
        socket.on('testSocket',payload);
    }else{
        socket.emit('testSocket',payload);
    }
};

export const updateProfile =(payload:any, off:boolean=false)=>{
    const socket= getSocket();
    if(!socket) {
        console.error("socketEvents UpdateProfile");
        return;
    }
    if(off){
        socket.off('updateProfile',payload);
    }else if(typeof payload ==='function'){
        socket.on('updateProfile',payload);
    }else{
        socket.emit('updateProfile',payload);
    }
};

export const getContacts =(payload:any, off:boolean=false)=>{
    const socket= getSocket();
    if(!socket) {
        console.error("socketEvents getContacts");
        return;
    }
    if(off){
        socket.off('getContacts',payload);
    }else if(typeof payload ==='function'){
        socket.on('getContacts',payload);
    }else{
        socket.emit('getContacts',payload);
    }
};

export const newConversation =(payload:any, off:boolean=false)=>{
    const socket= getSocket();
    if(!socket) {
        //console.error("socketEvents newConversation");
        return;
    }
    if(off){
        socket.off('newConversation',payload);
    }else if(typeof payload ==='function'){
        socket.on('newConversation',payload);
    }else{
        socket.emit('newConversation',payload);
    }
};

export const getConversations =(payload:any, off:boolean=false)=>{
    const socket= getSocket();
    if(!socket) {
        console.error("socketEvents getConversations");
        return;
    }
    if(off){
        socket.off('getConversations',payload);
    }else if(typeof payload ==='function'){
        socket.on('getConversations',payload);
    }else{
        socket.emit('getConversations',payload);
    }
};

export const newMessage =(payload:any, off:boolean=false)=>{
    const socket= getSocket();
    if(!socket) {
        console.error("socketEvents newMessage");
        return;
    }
    if(off){
        socket.off('newMessage',payload);
    }else if(typeof payload ==='function'){
        socket.on('newMessage',payload);
    }else{
        socket.emit('newMessage',payload);
    }
};

export const getMessages =(payload:any, off:boolean=false)=>{
    const socket= getSocket();
    if(!socket) {
        console.error("socketEvents getMessages");
        return;
    }
    if(off){
        socket.off('getMessages',payload);
    }else if(typeof payload ==='function'){
        socket.on('getMessages',payload);
    }else{
        socket.emit('getMessages',payload);
    }
};