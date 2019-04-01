var app = getApp();
var userInfo = require('../../components/common/getinfo');
//index.js
//获取应用实例
Page({
  data: {
    memberLevel: '', //会员等级
    userscore: '', //积分余额
    carbonaccount: '', //碳账户
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    token: ''
  },
  onLoad: function () {
    
  },
  userCenter(token) {
    var that = this;
    wx.request({
      url: app.globalData.apiBase + '/portal/User/user_center',
      data: {
        token: token
      },
      method: 'post',
      success: function (res) {
        // success
        console.log(res);
        if (res.data.code == 1) {
          if (res.data.data.status == 1) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }else {
            that.setData({
              memberLevel: res.data.data.level_name,
              userscore: res.data.data.user_score,
              carbonaccount: res.data.data.carbonaccount
            })
          }
        } else {}
      }
    })
  },
  onShow() {
    // this.getUserInfo()
    var that = this;
    wx.getStorage({
      key: 'token_session',
      success(res) {
        console.log(res)
        if (res.data) {
          that.setData({
            token: res.data
          })
          that.userCenter(res.data);
        } else {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      },
      fail() {
        console.log('返回');
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    })
  },
  getUserInfo() {
    var that = this;
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        that.data.userInfo = res.userInfo;
        that.setData({
          userInfo: that.data.userInfo
        })
      }
    })
  },
  togoodsorder() {
    wx.navigateTo({
      url: '/pages/shoporder/shoporder'
    })
  },
  topersonal() {
    wx.navigateTo({
      url: '/pages/personal/personal'
    })
  },
  // 退出登录
  layout() {
    var that = this;
    wx.request({
      url: app.globalData.apiBase + '/user/Public/logout',
      data: {
        token: that.data.token
      },
      method: 'post', 
      success: function(res){
        // success
        console.log(res);
        if(res.data.code==1) {
          wx.removeStorage({
            key: 'token_session',
            success(res) {
              console.log(res.data)
            }
          })
          wx.showToast({
            title:'已退出登录',
            icon: 'success',
            duration: 2000
          })
          wx.switchTab({
            url: '/pages/home/home'
          })
        }
      }
    })
  }
})