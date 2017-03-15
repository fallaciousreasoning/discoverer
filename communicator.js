export default class Communicator {
    constructor() {
        const protocol = "ws://";
        const host = window.location.host;
        const uri = protocol + host + "/socket/";
        console.log(uri);

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

        this.listenFor = this.listenFor.bind(this);
        this.listeners = {};
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