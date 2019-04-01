var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
    data: {
        tabs: ["全部订单", "待付款", "已付款","待收货"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        goodsList: [],
        pagenation: 1,
        flag: false,
        loadmore: true,
        token: ''
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        var that = this;
      wx.getStorage({
        key: 'token_session',
        success(res) {
          console.log(res)
          if (res.data) {
            that.getGoodsList(1,res.data);
            that.setData({
              token: res.data
            })
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
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    getGoodsList(pages,token) {
      var that = this;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.apiBase + '/portal/Orders/my_order',
        data: {
          token: token,
          page: pages
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res){
          // success
          console.log(res);
          if(res.data.code==1) {
            var allArr = [];   
            var initArr = that.data.goodsList ? that.data.goodsList : [];  //获取已加载的商品
            var newArr = res.data.data;				//获取新加载的商品
            var lastPageLength = newArr.length;  			//新获取的商品数量
            if( pages <= 1 ){									//如果是第一页
              allArr = res.data.data;
            }else{
              allArr = initArr.concat(newArr);		//如果不是第一页，连接已加载与新加载商品
            }
            if (lastPageLength < 10) {           //如果新加载的一页课程数量小于12，则没有下一页
              console.log(999);
              that.setData({
                flag: true,
                loadmore: false
              });
            }
            that.setData({
              goodsList: allArr,
            })
            console.log(that.data.goodsList);
          }
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    },
    goodsdetail(e) {
      console.log(e.currentTarget.id);
      wx.navigateTo({
        url: '../goodsorder/goodsorder?order_sn='+e.currentTarget.id
      })
    },
    onShow() {
      // var that = this;
      // wx.getStorage({
      //   key: 'token_session',
      //   success(res) {
      //     console.log(res)
      //     if (res.data) {
      //       that.getGoodsList(1,res.data);
      //       that.setData({
      //         token: res.data
      //       })
      //     } else {
      //       wx.navigateTo({
      //         url: '/pages/login/login'
      //       })
      //     }
      //   },
      //   fail() {
      //     console.log('返回');
      //     wx.navigateTo({
      //       url: '/pages/login/login'
      //     })
      //   }
      // })
    },
       /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('到底了')
    var that = this;
    var pagenation = that.data.pagenation;
    if(!that.data.flag) {
      console.log('加载中')
      pagenation++
      that.setData({
        pagenation: pagenation
      })
      console.log(that.data.pagenation)
      that.getGoodsList(that.data.pagenation,that.data.token);
    }else {
      console.log('加载完毕！')
    }
  },
});