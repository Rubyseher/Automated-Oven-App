import React from 'react';

class Server extends React.Component {
    constructor(props) {
        super(props);
        var ws = new WebSocket('ws://oven.local:8069');
    }
    GetCooking = () => {
        req = {
            user: 'John',
            msg: 'method',
            method: 'getCooking'
        }
        this.ws.send(JSON.stringify(req));
    }

}
export default Server