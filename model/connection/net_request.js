class NetRequest {
    test() {
        console.log('test()')
        let { Net } = require('electron')
        let net = new Net();
        const request = net.request('https://www.baidu.com')   //输入地址
        request.on('response', (response) => {
            console.log(`STATUS: ${response.statusCode}`)
            console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
            response.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`)
            })
            response.on('end', () => {
                console.log('No more data in response.')
            })
        })
        request.end()


    };
};

module.exports = NetRequest