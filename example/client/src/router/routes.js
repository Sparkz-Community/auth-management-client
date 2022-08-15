// eslint-disable-next-line no-unused-vars
export default function ({store, ssrContext}) {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        {path: '', component: () => import('pages/Index.vue')},

        {
          path: 'login',
          name: 'login',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/login/baseLogin/login'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/register/baseRegister/register'),
        },
        {
          path: 'verify',
          name: 'verify',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/authManagement/verifyEmail/verifyEmail'),
        },
        {
          path: 'resetPassword',
          name: 'resetPassword',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/authManagement/resetPassword/resetPassword'),
        },
        {
          path: 'verifyAndSetPassword',
          name: 'verifyAndSetPassword',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/authManagement/verifyAndSetPassword/verifyAndSetPassword'),
        },
        {
          path: 'changePassword',
          name: 'changePassword',
          component: () => import('@ionrev/quasar-app-extension-ir-auth-management-client/src/pages/authManagement/changePassword/changePassword'),
        },
        {
          path: 'logout',
          name: 'logout',
          beforeEnter(to, from, next) {
            store.dispatch('auth/logout')
              // eslint-disable-next-line no-unused-vars
              .then(result => {
                // console.log('logout:', result);
                next('/');
              })
              .catch(error => {
                console.error('error logout:', error);
                next();
              });
          },
        },
      ],
    },
  ];

  // Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue'),
    });
  }

  return routes;
}

