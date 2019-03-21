var app = getApp();  
Page({
  data: {
    imgUrls: ['../../images/logo@2x.png'],
    tabs: [],
    goodsList: [],
    activeIndex: '',
    pagenation: 1,
    flag: false
    // activeNumber: 
  },
  onLoad(){
    console.log(app.globalData.apiBase)
    var that = this;
    that.tabGoodsInfo();
    
  },
  tabClick: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
        console.log(index)
    this.setData({
      activeIndex: id
    });
    console.log(this.data.activeIndex + 'pp')
    this.goodsListClassify(index,id);
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
        console.log(res)
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
    var that = this;
    wx.request({
      url: app.globalData.apiBase + '/portal/Goods/index',
      data: {
        page: pages,
        category_id: id
      },
      method: 'post', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res){
        // success
        console.log(res)
        if(res.data.code==1) {
          // var allArr=[];   
          // var initArr = that.data.goodsList ? that.data.goodsList : [];  //获取已加载的商品
          // var newArr = res.data.data;				//获取新加载的商品
          // var lastPageLength = newArr.length;  			//新获取的商品数量
          // if( pages <= 1 ){									//如果是第一页
          //   allArr = res.data.data;
          // }else{
          //   allArr = initArr.concat(newArr);		//如果不是第一页，连接已加载与新加载商品
          // }
          // if (lastPageLength < 12) {           //如果新加载的一页课程数量小于12，则没有下一页
          //   that.setData({
          //     flag: true,
          //   });
          // }
          that.setData({
            goodsList: res.data.data,
          })
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
     /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('到底了')
    // var that = this;
    // var pagenation = that.data.pagenation;
    // if(!that.data.flag) {
    //   console.log('加载中')
    //   pagenation++
    //   that.setData({
    //     pagenation: pagenation
    //   })
    //   console.log(that.data.pagenation)
    //   that.tabGoodsInfo(that.data.pagenation);
    // }else {
    //   console.log('加载完毕！')
    // }
  },
})