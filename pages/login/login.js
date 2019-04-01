const app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    // wx.getSetting({
    //   success: function(res) {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         success: function(res) {
    //           console.log(1)
    //           console.log(res)
    //           // 从数据库获取用户信息
    //           // that.queryUsreInfo();
    //           // 用户已经授权过
    //           // wx.switchTab({
    //           //   url: '/pages/myinfo/myinfo'
    //           // })
    //         }
    //       });
    //     }else {
    //       console.log('no');
    //       wx.getUserInfo({
    //         success: function(res) {
    //           console.log(1)
    //           console.log(res)
    //           // 从数据库获取用户信息
    //           // that.queryUsreInfo();
    //           // 用户已经授权过
    //           // wx.switchTab({
    //           //   url: '/pages/myinfo/myinfo'
    //           // })
    //         }
    //       });
    //     }
    //   }
    // })

    // this.getPhoneNumber();
  },
  wxlogin(ency,iv) {
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        console.log(res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: app.globalData.apiBase1 + '/intfa/v1.Wxlogin/wx_login',
          data: {
            code: res.code,
            encryptedData: ency,
            iv: iv,
          },
          method: 'post', 
          success: function (res) {
            // success
            console.log(res);
            if(res.data.code==1) {
              wx.setStorage({
                key: 'token_session',
                data: res.data.data.token
              })
              wx.navigateBack()
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '服务器报错，请联系管理员',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  getPhoneNumber: function (e) { //点击获取手机号码按钮
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var that = this;
    wx.checkSession({
      success: function (res) {
        var ency = e.detail.encryptedData;
        var iv = e.detail.iv;
        var sessionk = that.data.sessionKey;
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
          console.log("拒绝授权")
          wx.navigateBack({
            delta: 1
          })
        } else { //同意授权
          console.log(res);
          console.log('同意授权');
          that.wxlogin(e.detail.encryptedData,e.detail.iv); //重新登录
        }
      },
      fail: function () {
        console.log("session_key 已经失效，需要重新执行登录流程");
        that.wxlogin(e.detail.encryptedData,e.detail.iv); //重新登录
      }
    });
  }
})