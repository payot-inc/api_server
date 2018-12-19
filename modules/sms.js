const request = require("request");
const _ = require('lodash');

/*
 * 문자전송
 */
function aligo(numbers, head, message) {
    let params = require("./aligo.json");
    const messageBody = `${head}\n${message}`;

    // 메시지내용
    params.msg = messageBody;
    params.receiver = numbers;

    // 테스트 구분
    // params.testmode_yn = "Y";

    const options = {
        method: 'POST',
        url: "https://apis.aligo.in/send/",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        form: params
    };

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (err) { reject(err); }

            const response = JSON.parse(body);
            if (response.result_code !== '1') reject(new Error(response.message));
            else resolve(response);
        });
    });
}

function remain(message, count) {
    const params = require('./aligo.json');

    const messageLength = Buffer.byteLength(`${message}`);
    let messageType = 'SMS';
    if (messageLength > 90 && messageLength <= 2000) messageType = 'LMS';
    else if (messageLength > 2000) return Promise.reject(new Error("메시지 길이가 너무 깁니다"));

    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: 'https://apis.aligo.in/remain/',
            form: {
                key: params.key,
                user_id: params.user_id
            }
        };

        request(options, (err, res, body) => {
            if (err) return reject(err);

            const response = JSON.parse(body);
            if (messageType === 'SMS') {
                resolve(response.SMS_CNT >= count);
            } else {
                resolve(response.LMS_CNT >= count);
            }
        });
    });
}

function send(numbers, header, message) {
    let receivers = [];

    if (numbers instanceof String || typeof numbers === 'string') receivers = [numbers];
    else receivers = numbers;
    // 문자메시지는 1회요청에 1000명의 사용자에게만 전송할 수 있음
    // 전화번호 형식이 맞는 연락처의 갯수 구하기
    receivers = receivers.map(number => {
        if (number.includes('-')) return number;
        else return number.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
    });

    receivers = _.uniq(receivers);
    receivers = receivers.filter(number => {
        const regex = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
        return regex.test(number);
    });

    return remain(message, receivers.length)
        .then(status => {
            // 전송수량이 부족한 경우
            if (!status) return Promise.reject(new Error('전송할 수 있는 메시지 잔량이 충분하지 않습니다'));

            const sendList = _.chunk(receivers, 1000);
            const request = sendList.map(users => users.join(',')).map(target => aligo(target, header, message));

            return Promise.all(request);
        })
        .then(results => {
            const sendCount = _.sumBy(results, 'success_cnt');
            const messageType = results[0].msg_type;

            return {
                type: messageType,
                count: sendCount,
                message: message
            };
        });
}

module.exports = send;