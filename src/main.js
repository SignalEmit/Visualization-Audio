/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-06-21 16:21:00
 * @LastEditors: SignalEmit
 * @LastEditTime: 2020-08-24 22:50:23
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible/index'
import { Message, MessageBox, Dialog, Pagination, Carousel, CarouselItem } from 'element-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.use(ElementUI)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
Vue.config.productionTip = false

global.vm = new Vue({
  router,
  store,
  data() {
    return {
      eventHub: new Vue()
    }
  },
  render: h => h(App)
}).$mount('#app')
