var usertype={
    'sysadmin':1,
    'org':2,
    'courier':3
}

var expCompany=[
    {
      num:0,
      code:'无',
      name:'无'
    },
    {
        num:1,
        code:'UAPEX',
        name:'全一快递'
    },
    {
        num:2,
        code:'SF',
        name:'顺丰速运'
    },
    {
        num:3,
        code:'LB',
        name:'龙邦速递'
    },
    {
        num:4,
        code:'FAST',
        name:'快捷速递'
    },
    {
        num:5,
        code:'NEDA',
        name:'港中能达'
    },
     {
         num:6,
        code:'ZHQKD',
        name:'汇强快递'
    },
     {
         num:7,
        code:'ZTO',
        name:'中通速递'
    },
     {
           num:8,
        code:'GTO',
        name:'国通快递'
    },
     {
         num:9,
        code:'QFKD',
        name:'全峰快递'
    },
     {
           num:10,
        code:'ZJS',
        name:'宅急送'
    },
    {
         num:11,
        code:'DBL',
        name:'德邦物流'
    },
    {
        num:12,
        code:'YTO',
        name:'圆通速递'
    },
    {
        num:13,
        code:'HTKY',
        name:'汇通快运'
    },
    {
        num:14,
        code:'HOAU',
        name:'天地华宇'
    },
     {
         num:15,
        code:'UC',
        name:'优速快递'
    }
]

var userstatus=[
    {
        status:'正常',
        num:1
    },
    {
        status:'冻结',
        num:2
    }
]

var orderstatus=[
    {
        num:0,
        name:'未取件'
    },
    {
        num:1,
        name:'已取件'
    },
    {
        num:2,
        name:'运送中'  
    },
    {
        num:3,
        name:'已送达'
    },
    {
        num:4,
        name:'未知状态'
    }
    
    
    
]

var wechatinfo={
    appid:'wx45eb07597f1e004a',
    appsecret:'9c4c330a78978494d2465bc63fcf6e16',
    token:'exproj',
    encodingAESKey:'12RQxjmBlNmQ8HwKRb654CaUPWzx3TjyfFSEZXOhEJD',
    templateId1:'bAencoI6OcRtG9SRaIkLlrxEk0upreRrHFSu9EyhNYk',//新订单提醒（OPENTM207719853）
    templateId2:'dBPyanyWnu4l07WrSqEARUXbQVhGdNOdd80VzZJv11I'//订单状态提醒
}

var kdniao ={
    businessid:'1256928',
    apikey:'df11131b-a116-41c7-8a89-486c1f9747a7',
    apiurl:'http://api.kdniao.cc/Ebusiness/EbusinessOrderHandle.aspx'
}



module.exports ={kdniao:kdniao,orderstatus:orderstatus,usertype:usertype,expCompany:expCompany,userstatus:userstatus,wechatinfo:wechatinfo};