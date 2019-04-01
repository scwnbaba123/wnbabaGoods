// pages/list/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_sn: '', //订单号,
    goodsList: [],
    user_name: '',
    user_phone: '',
    province_name: '',
    district_name: '',
    city_name: '',
    address: '',
    buyinfo: '',
    choseAddress: '',
    provinceid: '',//省份id
    cityid: '',//市id
    districtid: '',//区id
    token: '',
    order_sn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    wx.getStorage({
      key: 'token_session',
      success(res) {
        console.log(res.data)
        if(res.data) {
          that.setData({
            token: res.data,
            order_sn: options.order_sn
          })
          that.getGoodsInfomation(options.order_sn);
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
  getGoodsInfomation(val) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: app.globalData.apiBase1 + '/intfa/v1.Buy/pay',
      data: {
        order_sn: val,
        token: that.data.token
      },
      method: 'post',

      success: function (res) {
        // success
        console.log(res.data.data);
        if (res.data.code == 1) {
          var buyinfo = res.data.data.buy_info;
          var data = res.data.data.goods_info;
          var user = res.data.data.user_info;
          var address = res.data.data.address;
          var useraddress = res.data.data.user_info;
          // 市
          for (var i = 0; i < address.city_name.length; i++) {
            if (useraddress.areaid2 == address.city_name[i].region_id) {
              that.setData({
                city_name: address.city_name[i].region_name,
                cityid: address.city_name[i].region_id
              })
            }
          }
          // 区
          for (var i = 0; i < address.district_name.length; i++) {
            if (useraddress.areaid3 == address.district_name[i].region_id) {
              that.setData({
                district_name: address.district_name[i].region_name,
                districtid: address.district_name[i].region_id
              })
            }
          }
          // 省
          for (var i = 0; i < address.province_name.length; i++) {
            if (useraddress.areaid1 == address.province_name[i].region_id) {
              that.setData({
                province_name: address.province_name[i].region_name,
                provinceid: address.province_name[i].region_id
              })
            }
          }
          that.setData({
            goodsList: data,
            user_name: user.user_name,
            user_phone: user.user_phone,
            address: user.address,
            buyinfo: buyinfo,
            choseAddress: res.data.data.address
          })
          console.log(that.data.goodsList)
        }

      },
      fail: function () {
        // fail
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  changeAddress() {
     var that = this;
     var longAddress = that.data.choseAddress;
     wx.chooseAddress({
       success(res) {
         that.setData({
           user_name: res.userName,
           user_phone: res.telNumber,
           province_name: res.provinceName,
           district_name: res.cityName,
           city_name: res.countyName,
           address: res.detailInfo
         })
         // 省
         for(var i=0;i<longAddress.province_name.length;i++){
           if(res.provinceName.indexOf(longAddress.province_name[i].region_name)!=-1) {
             console.log(longAddress.province_name[i].region_name);
             console.log(longAddress.province_name[i].region_id);
             that.setData({
               provinceid: longAddress.province_name[i].region_id
             })
 
             wx.request({
               url: app.globalData.apiBase + '/portal/Buys/get_region_area',
               data: {
                 region_id: longAddress.province_name[i].region_id
               },
               method: 'post', 
               success: function(result){
                 // success
                 console.log(result);
                 if(result.data.code==1) {
                   var data = result.data.data;
                    // 市
                   for(var i=0;i<data.length;i++){
                     if(res.cityName.indexOf(data[i].region_name)!=-1) {
                       console.log(data[i].region_name)
                       console.log(data[i].region_id);
                       that.setData({
                         cityid: data[i].region_id
                       })
 
                       wx.request({
                         url: app.globalData.apiBase + '/portal/Buys/get_region_area',
                         data: {
                           region_id: data[i].region_id
                         },
                         method: 'post', 
                         success: function(val){
                           // success
                           console.log(val);
                           if(val.data.code==1) {
                             var datacount = val.data.data;
                             // // 区
                             for(var i=0;i<datacount.length;i++){
                               if(res.countyName.indexOf(datacount[i].region_name)!=-1) {
                                 console.log(datacount[i].region_name);
                                 console.log(datacount[i].region_id);
                                 that.setData({
                                   districtid: datacount[i].region_id
                                 })
                               }
                             }
                           }
                         }
                       })
                     }
                   }
                 }
               }
             })
           }
         }
       }
     })
  },

  payGoodsListMoney() {
    var that = this;
    console.log(app.globalData.token);
    console.log(that.data.address);
    console.log(that.data.provinceid);
    console.log(that.data.cityid);
    console.log(that.data.districtid);
    console.log(that.data.user_phone);
    console.log(that.data.user_name);
    wx.request({
      url: app.globalData.apiBase1 + '/intfa/v1.Buy/buy_step3',
      data: {
        token: that.data.token,
        address: that.data.address,
        province: that.data.provinceid,
        city: that.data.cityid,
        district: that.data.districtid,
        tel: that.data.user_phone,
        consignee: that.data.user_name,
        order_sn: that.data.order_sn
      },
      method: 'post', 
      success: function(res){
        // success
        console.log(res);
        if(res.data.code == 1){
            // location.href='../html/payStatus.html';
        }else if(res.data.code == 10001){
            // location.href='../html/register.html';
        }else if(res.data.code == 10002) {
            //余额不足调用微信支付
            window.location.href=`https://www.wnbaba.com.cn/portal/Wxpay/wxpay?order_sn=${order_sn}`
        }else if(res.data.code >1 && data.code <10001){
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        }else if(res.data.code ==0){
          wx.showToast({
            title: '购买失败',
            icon: 'success',
            duration: 2000
          })
        }else { }
      }
    })
  }

})