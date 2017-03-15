/** 
 * Cookie getting function from Stackoverflow
 * http://stackoverflow.com/questions/5968196/check-cookie-if-cookie-exists
 */
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    
    return decodeURI(dc.substring(begin + prefix.length, end));
} 

export default class Communicator {
    constructor() {
        this.listenFor = this.listenFor.bind(this);
        this.initializeSocket = this.initializeSocket.bind(this);
        this.listeners = {};
   
        const token = getCookie('token');
        if (token !== null) {
            this.initializeSocket();
        } else {
            fetch('/token', {
                credentials: 'same-origin'
            }).then(this.initializeSocket);
        }
    }

    initializeSocket() {
        const protocol = "ws://";
        const host = window.location.host;
        const uri = protocol + host + "/socket/";
        console.log(uri);
        console.log("token: " + getCookie('token'));

        this.socket = new WebSocket(uri);
        this.socket.onmessage = ev => {
            const message = JSON.parse(ev.data);
            if (!message.route || !this.listeners[message.route]) {
                return;
            }

            for (let i = 0; i < this.listeners[message.route].length; ++i) {
                this.listeners[message.route][i](message.data);
            }
        };
    }

    listenFor(messageName, handler) {
        if (!this.listeners[messageName]) {
            this.listeners[messageName] = [];
        }

        this.listeners.push(handler);
    }

    sendMessage(route, data) {
        this.socket.send({route: route, data: data});
    }
}