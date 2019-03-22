var app = getApp();
Page({
  data: {
    goodsname: '', //商品名称
    saleprice: '', //价格
    storage: '', //库存
    franking: 0, //邮费
    goodscontent: '', //商品简介
    imgUrls: [], //商品图片
    thumbnail: '', //封面图
    isLike: true,
    animationData: '',
    showModalStatus: '',
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    num: 1, // input默认是1
    minusStatus: 'disabled', // 使用data数据对象设置样式名
    amount: 0
  },
  onLoad(options) {
    this.goodsdetails(options.goodsid)
  },
  goodsdetails(goodsid) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.globalData.apiBase + '/portal/Goods/goods_detail',
      data: {
        goods_id: 204
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 1) {
          var money = 0;
          if (res.data.data.franking <= 0) {
            money = 0;
          } else if (res.data.data.franking > 0) {
            money = Number(res.data.data.franking);
          }
          that.setData({
            goodsname: res.data.data.goods_name,
            saleprice: res.data.data.sale_price,
            storage: res.data.data.storage,
            franking: Number(res.data.data.franking),
            goodscontent: res.data.data.goods_content,
            imgUrls: res.data.data.more.photos,
            thumbnail: res.data.data.more.thumbnail,
            amount: money
          })
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },
  // 收藏
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
  },
  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '/pages/car/car'
    })
  },
  // 立即购买
  immeBuy() {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 2000
    });
  },
})