// pages/shopgoodsok/shopgoodsok.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goshop() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  myorder() {
    // wx.navigateTo({
    //   url: '../',
    //   success: function(res){
    //     // success
    //   },
    //   fail: function() {
    //     // fail
    //   },
    //   complete: function() {
    //     // complete
    //   }
    // })
  }
})