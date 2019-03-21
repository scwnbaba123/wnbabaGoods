var app = getApp();  
Page({
  data: {
    imgUrls: ['../../images/logo@2x.png'],
    imgCar: ['../../images/car.png'],
    pagenation: 1,
    goodsList: [],
    flag: false
  },
  onLoad(){
    var that = this;
    that.tabGoodsInfo(that.data.pagenation);
  },
  tabGoodsInfo(pages) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.globalData.apiBase + '/portal/Goods/index',
      data: {
        page: pages
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res){
        console.log(res)
        if(res.data.code==1) {
          var allArr=[];   
          var initArr = that.data.goodsList ? that.data.goodsList : [];  //获取已加载的商品
          var newArr = res.data.data;				//获取新加载的商品
          var lastPageLength = newArr.length;  			//新获取的商品数量
          if( pages <= 1 ){									//如果是第一页
            allArr = res.data.data;
          }else{
            allArr = initArr.concat(newArr);		//如果不是第一页，连接已加载与新加载商品
          }
          if (lastPageLength < 12) {           //如果新加载的一页课程数量小于12，则没有下一页
            that.setData({
              flag: true,
            });
          }
          that.setData({
            goodsList: allArr,
          })
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
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
      that.tabGoodsInfo(that.data.pagenation);
    }else {
      console.log('加载完毕！')
    }
  },
  //下拉刷新,要将商品列表，页码都改为初始值，否则会出现刷新之后商品的错乱
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    this.setData({
      pagenation: 1,
      flag: false,    //无更多
      goodsList: [], //商品列表
    })
    this.tabGoodsInfo(this.data.pagenation);
  }
})