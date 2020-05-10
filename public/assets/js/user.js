$(function(){
    //make connection
    var socket = io.connect("http://localhost:8788");
    //UI
    var notify = $("#notifications");
    socket.on("messageSent", function (message) {
        notify.append("<li>Message</li>");
        Console.log("sms......");
    });
});