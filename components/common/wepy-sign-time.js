"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _asyncToGenerator(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(o,i){try{var a=t[o](i),s=a.value}catch(e){return void n(e)}if(!a.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}return r("next")})}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),_wepy=require("./../../npm/wepy/lib/wepy.js"),_wepy2=_interopRequireDefault(_wepy),_tip=require("./../../utils/tip.js"),_tip2=_interopRequireDefault(_tip),_constant=require("./../../utils/constant.js"),_api=require("./../../api/api.js"),_api2=_interopRequireDefault(_api),WepySignTime=function(e){function t(){var e,n,r,o;_classCallCheck(this,t);for(var i=arguments.length,a=Array(i),s=0;s<i;s++)a[s]=arguments[s];return n=r=_possibleConstructorReturn(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(a))),r.data={list:[],aways:0},r.methods={refreshList:function(e){void 0!=e&&(console.log("val.....",e),this.list[this.list.length-1].signed=!0,this.$apply())}},o=n,_possibleConstructorReturn(r,o)}return _inherits(t,e),_createClass(t,[{key:"getSignDate",value:function(){function e(){return t.apply(this,arguments)}var t=_asyncToGenerator(regeneratorRuntime.mark(function e(){var t,n,r,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("getSignDate"),t=this,n=_wepy2.default.getStorageSync(_constant.USER_SPECICAL_INFO)||{},r=n.openid,e.next=6,_api2.default.getSignDate({query:{openId:r}});case 6:o=e.sent,0==o.data.code?(this.list=o.data.list,console.log("console.log(this.list);"),console.log(this.list)):_tip2.default.error(o.data.msg),t.showLoading=!1,this.$apply();case 10:case"end":return e.stop()}},e,this)}));return e}()},{key:"onLoad",value:function(){this.getSignDate()}}]),t}(_wepy2.default.component);exports.default=WepySignTime;