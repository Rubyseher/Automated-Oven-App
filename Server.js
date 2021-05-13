
const ws = new WebSocket('ws://oven.local:8069');
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