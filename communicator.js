export default class Communicator {
    constructor(token) {
        if (!token) {
            throw new Error("No token specified!");
        }

        this.listenFor = this.listenFor.bind(this);
        this.initializeSocket = this.initializeSocket.bind(this);
        this.close = this.close.bind(this);

        this.listeners = {};

        this.token = token;
   
        this.initializeSocket(token)
    }

    initializeSocket() {
        const protocol = "ws://";
        const host = window.location.host;
        const uri = protocol + host + "/socket?token=" + this.token;

        this.socket = new WebSocket(uri);
        this.socket.onopen = ev => {
            this.connected = true;
            if (this.onConnect) {
                this.onConnect();
                delete this.onConnect;
            }
        };

        this.socket.onclose = ev => {
            this.connected = false;
        }

        this.socket.onmessage = ev => {
            const message = JSON.parse(ev.data);
            if (!message.route || !this.listeners[message.route]) {
                return;
            }

            for (let i = 0; i < this.listeners[message.route].length; ++i) {
                this.listeners[message.route][i](message.data);
            }
        };

        return new Promise((accept, reject) => {
            if (this.connected) accept();
            else this.onConnect = accept();
        });
    }

    listenFor(messageName, handler) {
        if (!this.listeners[messageName]) {
            this.listeners[messageName] = [];
        }

        this.listeners[messageName].push(handler);
    }

    stopListeningFor(messageName, handler) {
        if (!this.listeners[messageName]) {
            return;
        }

        const index = this.listeners[messageName].indexOf(handler);
        if (index !== -1) {
            this.listeners[messageName].splice(index, 1);
        }
    }

    sendMessage(route, data) {
        if (!this.socket) return;

        this.socket.send({route: route, data: data});
    }

    close() {
        if (!this.socket) return;

        this.socket.close();
    }
}