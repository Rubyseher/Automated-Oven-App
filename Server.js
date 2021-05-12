
const ws = new WebSocket('ws://192.168.0.164:8069');
ws.onopen = () => {
    // connection opened
    req = {
        user: 'John',
        msg: 'open'
    }
    ws.send(JSON.stringify(req));
};
ws.onerror = (e) => { console.log(e); };
export default ws