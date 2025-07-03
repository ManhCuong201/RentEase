import express from 'express';
import dateFormat from 'dateformat';
import crypto from 'crypto';
import querystring from 'qs';

const paymentRouter = express.Router();

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

paymentRouter.post('/create_payment_url', (req, res, next) => {
    var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

    const tmnCode = "EVIDPN2G";
    const secretKey = "0KHFYAI4JTDKYZ8JD53WR0MHS40DJVW4";

    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = "http://localhost:8081/afterpaymentReturn";
    const date = new Date();
    const createDate = dateFormat(date, 'yyyymmddHHmmss');

    const orderId = dateFormat(date, 'HHmmss');
    const amount = req.body.amount;
    const orderInfo = req.body.orderDescription;
    const orderType = 250000;
    const locale = 'vn';
    const currCode = 'VND';

    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    // if(bankCode !== null && bankCode !== ''){
    //     vnp_Params['vnp_BankCode'] = bankCode;
    // }
    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 

    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

    res.json({ paymentUrl });
});

paymentRouter.get('/vnpay_return', (req, res, next) => {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    vnp_Params = sortObject(vnp_Params);
    const tmnCode = "EVIDPN2G";
    var secretKey = config.get('vnp_HashSecret');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
    if(secureHash === signed){
        res.render('success', {code: vnp_Params['vnp_ResponseCode']})
    } else{
        res.render('success', {code: '97'})
    }
});

paymentRouter.get('/vnpay_ipn', function (req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = "0KHFYAI4JTDKYZ8JD53WR0MHS40DJVW4";
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        res.status(200).json({ RspCode: '00', Message: 'success' });
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
    }
});

export default paymentRouter;
