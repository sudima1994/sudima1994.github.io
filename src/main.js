import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome, faGlobe, faUserFriends, faClock, faLanguage, faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHome, faGlobe, faUserFriends, faClock, faLanguage, faCoins)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})