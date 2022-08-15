import * as mylib from '@iy4u/auth-management-client-lib'
import '../../assets/main.css'

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  Vue.use(mylib)
}
