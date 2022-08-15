const { resolve } = require('path')

module.exports = {
  base: '/',
  title: 'My Library',
  description: 'Just playing around',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/' },
      { text: 'Github', link: 'https://gitlab.com/iy4u/auth-management-client-lib' },
    ],
    sidebar: [
      {
        title: 'Introduction',
        collapsable: false,
        children: [
          'introduction/guide'
        ]
      },
      {
        title: 'Components',
        collapsable: false,
        children: [
          'components/component-a',
          'components/component-b'
        ]
      }
    ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@iy4u/auth-management-client-lib': resolve(__dirname, '../../src')
      }
    }
  }
}
