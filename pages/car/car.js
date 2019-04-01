var app = getApp();
var userInfo = require('../../components/common/getinfo');
Page({
 
    /**
     * 页面的初始数据
     */
    data: {
      hasList: false,//购物车是否有数据
      totalMoney: 0,//总金额
      selectAllStatus: false,//是否全选
      totalCount: 0,//数量
      carts: [],
      token: ''
    },
    //删除商品
    bindCartsDel(e) {
      console.log(e)
      var that = this;

      wx.getStorage({
        key: 'token_session',
        success(res) {
          console.log(res.data)
          if(res.data) {
            that.setData({
              token: res.data
            })
            wx.showModal({
              title: '提示',
              content: '您确定要删除吗？',
              success: function (resa) {
                console.log(resa)
                if (resa.confirm) {
                  //网络请求删除购物车数据
                  console.log(that.token);
                  wx.request({
                    url: app.globalData.apiBase + '/portal/Carts/cart_del',
                    method: 'post',
                    data: {
                      cart_id: e.currentTarget.id,
                      token: res.data
                    },
                    success:function(data) {
                      console.log(data)
                      if(data.data.code==1) {
                        if(data.data.data.status==1) {
                          wx.navigateTo({
                            url: '/pages/login/login'
                          })
                        }else {
                          wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            duration: 1000
                          })
                          const index = e.currentTarget.dataset.index;
                          let carts = that.data.carts;
                          carts.splice(index,1);              // 删除购物车列表里这个商品
                          that.setData({
                              carts: carts
                          });
                          if(!carts.length){                  // 如果购物车为空
                            that.setData({
                                  hasList: false              // 修改标识为false，显示购物车为空页面
                              });
                          }else{                              // 如果不为空
                            that.getTotalPrice();           // 重新计算总价格
                          }   
                        }
                      }
                    }
                  })
                }
              }
            })
          }else {
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
   
    //计算总价
    getTotalPrice() {
      let carts = this.data.carts;                  // 获取购物车列表
      let total = 0;
      let num = 0;
      for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
        if (carts[i].isSelect) {                   // 判断选中才会计算价格
          total += carts[i].goods_num * carts[i].goods_price;    // 所有价格加起来
          num += carts[i].goods_num;
        }
      }
      this.setData({                                // 最后赋值到data中渲染到页面
        carts: carts,
        totalCount: num,
        totalMoney: total.toFixed(2)
      });
    },
   
    //绑定单选
    bindCheckbox: function (e) {
      var that = this;
      const idx = e.currentTarget.dataset.index;
      let carts = that.data.carts;
      const isSelect1 = carts[idx].isSelect;
      carts[idx].isSelect = !isSelect1;
      that.setData({
        carts: carts,
        selectAllStatus: false
      });
      that.getTotalPrice();
    },
   
   
    //绑定多选
    bindSelectAll: function (e) {
      var that = this;
      let selectedAllStatus = that.data.selectAllStatus;
      let carts = that.data.carts;
      selectedAllStatus = !selectedAllStatus;
      for (var i = 0; i < carts.length; i++) {
        carts[i].isSelect = selectedAllStatus;
      }
   
      that.setData({
        carts: carts,
        selectAllStatus: selectedAllStatus
      });
      that.getTotalPrice();
    },
   
    //购物车结算
    bindjiesuan: function () {
      console.log(1)
      var that = this;
      let carts = that.data.carts;
      let jscart = [];
      var j = 0
      for (var i = 0; i < carts.length; i++) {
        if (carts[i].isSelect) {
          jscart[j] = carts[i];
          j++;
        }
      }
      // if (jscart.length <= 0) {
      //   wx.showToast({
      //     title: '未选择商品',
      //     icon: 'success',
      //     duration: 1000
      //   })
      //   return;
      // }
      wx.setStorageSync('jscart', jscart);//存入缓存
      //转到结算页面
      wx.navigateTo({
        url: 'jiesuan?amount=' + that.data.totalMoney
      });
   
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
    },
//    购物车列表
    getShopCarList(token) {
        var that = this;
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
            url: app.globalData.apiBase + '/portal/Carts/cart_list',
            data: {
                token: token
            },
            method: 'post', 
            success: function(res){
                // success
                console.log(res)
                if(res.data.code==1) {
                  if(res.data.data.status==1) {
                    wx.navigateTo({
                      url: '/pages/login/login'
                    })
                  }else{
                    if(res.data.data.cart_list.length >0) {
                        that.setData({
                            carts: res.data.data.cart_list,
                            hasList: true
                        })
                    }else {
                        that.setData({
                            hasList: false
                        })
                    }
                    // that.getTotalPrice();
                  }
                }
            },
            complete: function () {
              wx.hideLoading();
            }
        })
    },
    onShow() {

      var that = this;
      wx.getStorage({
        key: 'token_session',
        success(res) {
          console.log(res.data)
          if(res.data) {
            that.setData({
              token: res.data
            })
            that.getShopCarList(res.data);
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
    togoodsdetails(e) {
      console.log(e);
      var goodsid = e.currentTarget.id;
      wx.navigateTo({
        url: '/pages/goodsdetails/goodsdetails?goodsid='+goodsid
      })
    },
  })