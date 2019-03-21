const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              // console.log(1)
              // console.log(res)
              //从数据库获取用户信息
              // that.queryUsreInfo();
              //用户已经授权过
              // wx.switchTab({
              //   url: '/pages/home/home'
              // })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function(res) {
    console.log(res);
    if (res.detail.userInfo) {
      console.log("点击了同意授权");
    } else {
      console.log("点击了拒绝授权");
    }


    // if (e.detail.userInfo) {
    //   //用户按了允许授权按钮
    //   var that = this;
    //   //插入登录的用户的相关信息到数据库
    //   wx.request({
    //     url: app.globalData.urlPath + 'user/add',
    //     data: {
    //       openid: getApp().globalData.openid,
    //       nickName: e.detail.userInfo.nickName,
    //       avatarUrl: e.detail.userInfo.avatarUrl,
    //       province: e.detail.userInfo.province,
    //       city: e.detail.userInfo.city
    //     },
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     success: function (res) {
    //       //从数据库获取用户信息
    //       that.queryUsreInfo();
    //       console.log("插入小程序登录用户信息成功！");
    //     }
    //   });
    //   //授权成功后，跳转进入小程序首页
    //   wx.switchTab({
    //     url: '/pages/index/index'
    //   })
    // } else {
    //   //用户按了拒绝按钮
    //   wx.showModal({
    //     title: '警告',
    //     content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
    //     showCancel: false,
    //     confirmText: '返回授权',
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击了“返回授权”')
    //       }
    //     }
    //   })
    // }
  },
  //获取用户信息接口
  queryUsreInfo: function() {
    wx.request({
      url: app.globalData.apiBase + 'user/userInfo',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data);
        getApp().globalData.userInfo = res.data;
      }
    })
  },
  getPhoneNumber: function(e) { //点击获取手机号码按钮

console.log(e)

    var that = this;



    wx.checkSession({

      success: function() {

        console.log(e.detail.errMsg)

        console.log(e.detail.iv)

        console.log(e.detail.encryptedData)



        var ency = e.detail.encryptedData;

        var iv = e.detail.iv;

        var sessionk = that.data.sessionKey;



        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
          console.log("shgiabi")
          that.setData({

            modalstatus: true

          });
          wx.switchTab({
                url: '/pages/home/home'
              })

        } else { //同意授权

          wx.request({

            method: "GET",

            url: 'https://xxx/wx/deciphering.do',

            data: {

              encrypdata: ency,

              ivdata: iv,

              sessionkey: sessionk

            },

            header: {

              'content-type': 'application/json' // 默认值

            },

            success: (res) => {

              console.log("解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~");

              console.log(res);

              var phone = res.data.phoneNumber;

              console.log(phone);



            },
            fail: function(res) {

              console.log("解密失败~~~~~~~~~~~~~");

              console.log(res);

            }

          });

        }

      },

      fail: function() {

        console.log("session_key 已经失效，需要重新执行登录流程");

        that.wxlogin(); //重新登录

      }

    });



  }
})