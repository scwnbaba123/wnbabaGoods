var app = getApp();
Page({
  data: {
    choseAddress: '',
    userName: '',//用户名
    user_phone: '',//电话
    addresss: '',//具体地址
    city_name: '',//城市名
    district_name: '',//区名
    province_name: '',//省份
    choseAddress: '',
    provinceid: '',//省份id
    cityid: '',//市id
    districtid: '',//区id
    token: ''
  },
  onLoad() {
    var that = this;
    wx.getStorage({
      key: 'token_session',
      success(res) {
        console.log(res)
        if (res.data) {
          that.setData({
            token: res.data
          })
          that.getUserInfo(res.data);

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

  getUserInfo(token) {
    var that = this;
    wx.request({
      url: app.globalData.apiBase + '/portal/User/user_info',
      data: {
        token: token
      },
      method: 'post', 
      success: function(res){
        // success
        console.log(res);
        if(res.data.code==1) {
          var data = res.data.data;
          var address = res.data.data.address;
          var useraddress = res.data.data.user_address;
          // 市
          for (var i = 0; i < address.city_name.length; i++) {
            if (useraddress.areaid2 == address.city_name[i].region_id) {
              console.log(address.city_name[i].region_name);
              that.setData({
                city_name: address.city_name[i].region_name
              })
            }else {
             console.log(address.city_name[i].region_name); 
            }
          }
          // 区
          for (var i = 0; i < address.district_name.length; i++) {
            if (useraddress.areaid3 == address.district_name[i].region_id) {
              console.log(address.district_name[i].region_name);
              that.setData({
                district_name: address.district_name[i].region_name
              })
            }
          }
          // 省
          for (var i = 0; i < address.province_name.length; i++) {
            if (useraddress.areaid1 == address.province_name[i].region_id) {
              console.log(address.province_name[i].region_name);
              that.setData({
                province_name: address.province_name[i].region_name
              })
            }
          }

          that.setData({
            userName: data.user_address.user_name,
            user_phone: data.user_address.user_phone,
            address: data.user_address.address,
            choseAddress: res.data.data.address
          })
        }
      }
    })
  },


  changeAddress() {
    // console.log(this.data.choseAddress)
    var that = this;
    var longAddress = that.data.choseAddress;
    // wx.getSetting({
    //   success(res) {
    //     console.log("vres.authSetting['scope.address']：",res.authSetting['scope.address'])
    //     if (res.authSetting['scope.address']) {
    //       console.log("111")
    wx.chooseAddress({
      success(res) {
        that.setData({
          userName: res.userName,
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
                                that.setData({
                                  districtid: datacount[i].region_id
                                })
                                   wx.request({
                                      url: app.globalData.apiBase + '/portal/User/save_user_address',
                                      data: {
                                        token: that.data.token,
                                        address: res.detailInfo,
                                        areaid1: that.data.provinceid,
                                        areaid2: that.data.cityid,
                                        areaid3: that.data.districtid,
                                        user_name: res.userName,
                                        user_phone: res.telNumber
                                      },
                                      method: 'post', 
                                      success: function(res){
                                        // success
                                        console.log(res);
                                        if(res.data.code==1) {
                                          wx.showToast({
                                            title: '信息修改成功',
                                            icon: 'success',
                                            duration: 2000
                                          });
                                        }else {
                                          wx.showToast({
                                            title: '暂无更新',
                                            icon: 'success',
                                            duration: 2000
                                          });
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
              }
            })
          }
        }
        // console.log(res.userName)
        // console.log(res.postalCode)
        // console.log(res.provinceName)
        // console.log(res.cityName)
        // console.log(res.countyName)
        // console.log(res.detailInfo)
        // console.log(res.nationalCode)
        // console.log(res.telNumber)
        
      }
    })
    // } else {
    //   if (res.authSetting['scope.address'] == false) {
    //     console.log("222")
    //     wx.openSetting({
    //       success(res) {
    //         console.log(res.authSetting)
    //       }
    //     })
    //   } else {
    //     console.log("eee")
    //     wx.chooseAddress({
    //       success(res) {
    //         console.log(res.userName)
    //         console.log(res.postalCode)
    //         console.log(res.provinceName)
    //         console.log(res.cityName)
    //         console.log(res.countyName)
    //         console.log(res.detailInfo)
    //         console.log(res.nationalCode)
    //         console.log(res.telNumber)
    //         that.setData({
    //           user_name: res.userName,
    //           user_phone: res.telNumber,
    //           province_nam: res.provinceName,
    //           district_name: res.cityName,
    //           city_name: res.countyName,
    //           address: res.detailInfo
    //         })
    //       }
    //     })
    //   }
    // }
    // }
    // })
  },
  
})