var app = getApp();
// 判断是否登录失效
function getStorageToken(fuc) {
  var that = this;
      wx.getStorage({
        key: 'token_session',
        success(res) {
          console.log(res.data)
          if(res.data) {
            // that.setData({
            //   token: res.data
            // })
            // that.getShopCarList(res.data);
            fuc(res.data);
          }else {
            userLogin();
          }
        },
        fail() {
          console.log('返回');
            wx.navigateTo({
              url: '/pages/login/login'
            })
        }
      })
}




//用户登陆
function userLogin(e) {
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
 
function onLogin(ency,iv) {
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
          }
        })
      }
    })
}
 
function getUserInfo() {
  wx.getUserInfo({
    success: function (res) {
      var userInfo = res.userInfo
      userInfoSetInSQL(userInfo)
    },
    fail: function () {
      userAccess()
    }
  })
}
 
function userInfoSetInSQL(userInfo) {
  wx.getStorage({
    key: 'third_Session',
    success: function (res) {
      console.log(res.data);
      // wx.request({
      //   url: 'Our Server ApiUrl',
      //   data: {
      //     third_Session: res.data,
      //     nickName: userInfo.nickName,
      //     avatarUrl: userInfo.avatarUrl,
      //     gender: userInfo.gender,
      //     province: userInfo.province,
      //     city: userInfo.city,
      //     country: userInfo.country
      //   },
      //   success: function (res) {
      //     if (逻辑成功) {
      //       //SQL更新用户数据成功
      //     }
      //     else {
      //       //SQL更新用户数据失败
      //     }
      //   }
      // })
    }
  })
}


module.exports = {
  userLogin: userLogin,
  getStorageToken: getStorageToken
}