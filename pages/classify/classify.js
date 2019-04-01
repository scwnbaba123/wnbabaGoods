var app = getApp();  
Page({
  data: {
    imgUrls: ['../../images/logo@2x.png'],
    tabs: [],
    goodsList: [],
    activeIndex: '',
    pagenation: 1,
    flag: false,
    loadmore: true
    // activeNumber: 
  },
  onLoad(){
    var that = this;
    that.tabGoodsInfo();
    
  },
  tabClick: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: id,
      pagenation: 1,
      goodsList: [],
      flag: false,
      loadmore: true
    });
    this.goodsListClassify(1,id);
  },
  tabGoodsInfo() {//商品分类
    var that = this;
    wx.request({
      url: app.globalData.apiBase + '/portal/Categoriesgood/index',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res){
        if(res.data.code==1) {
          that.setData({
            tabs: res.data.data,
            activeIndex: res.data.data[0].id
          })
          that.goodsListClassify(1,that.data.activeIndex);//初始化第一项商品
        }
      }
    })
  },
  goodsListClassify(pages, id) { //分类商品列表信息
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.globalData.apiBase + '/portal/Goods/index',
      data: {
        page: pages,
        category_id: id
      },
      method: 'post', 
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res){
        // success
        console.log(res.data.data)
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
          if (lastPageLength < 12) {           //如果新加载的一页课程数量小于12，则没有下一页
            that.setData({
              flag: true,
              loadmore: false
            });
          }
          that.setData({
            goodsList: allArr,
          })
        }
      },
      fail: function() {
        // fail
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  details(e) {
    var goodsid = e.currentTarget.id;
    wx.navigateTo({
      url: '../goodsdetails/goodsdetails?goodsid='+goodsid
    })
  },
     /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var pagenation = that.data.pagenation;
    console.log(that.data.activeIndex)
    if(!that.data.flag) {
      console.log('加载中')
      pagenation++
      that.setData({
        pagenation: pagenation
      })
      that.goodsListClassify(that.data.pagenation,that.data.activeIndex);
     
    }else {
      console.log('加载完毕！')
    }
  },
})