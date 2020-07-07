// const express = require('express');

// const router = express.Router();
// const checksum_lib = require('../../paytm/checksum/checksum');

// router.get('/payment_success', (req, res) => {
//     res.json({
//         success: true,
//         msg: 'Paid successfully'
//     })
// })

// router.get('/payment', (req, res) => {
//     let params = {}
//     params['MID'] = 'oqNhQo48412376230762',
//     params['WEBSITE'] = 'WEBSTAGING',
//     params['CHANNEL_ID'] = 'WEB',
//     params['INDUSTRY_TYPE_ID'] = 'Retail',
//     params['ORDER_ID'] = 'ORD0551',
//     params['CUST_ID'] = 'CUST0511',
//     params['TXN_AMOUNT'] = '10',
//     params['CALLBACK_URL'] = 'https://taskprovider.herokuapp.com/user/payment_success',
//     params['EMAIL'] = 'xyz@gmail.com',
//     params['MOBILE_NO'] = '9668854799'

//     checksum_lib.genchecksum(params, 'PHICEhSu2qZoMPe9', function(err, checksum) {
//         let txn_url = "https://securegw-stage.paytm.in/order/process"
//         let form_fields = ""
//         for(x in params)
//         {
//             form_fields += "<input type='hidden' name='"+x+"' value='"+params[x]+"'/>"

//         }

//         form_fields+="<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' />"

//         var html = '<html><body><center><h1>Please wait! Do not refresh the page</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields +'</form><script type="text/javascript">document.f1.submit()</script></body></html>'
//         res.writeHead(200,{'Content-Type' : 'text/html'})
//         res.write(html)
//         res.end()
//     })
// })

// module.exports = router;
