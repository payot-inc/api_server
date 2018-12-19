const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://13.209.63.212:1883')

client.on('connect', () => {
    console.log('연결됨')
})

function onConnected() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('mqtt server timeout connectd')
        }, 2000);
        client.on('connect', () => {
            resolve()
        })
    })
}

function request(topic, message) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject({ code: 400, name: 'message response timeout' })
        }, 1000 * 10);

        let responseTopic = topic.replace('server', 'machine')
        client.publish(topic, message)
        client.subscribe(responseTopic)
        client.on('message', (t, m) => {
            if (t == responseTopic) {
                resolve({ topic: t, message: m.toString().split(' ') })
                client.unsubscribe(responseTopic)
            }
        })
    })
}

function mqttApi(topic, message) {
    return onConnected()
        .then(() => {
            return request(topic, message)
        })
}

module.exports = {
    client,
    request
}