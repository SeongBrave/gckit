module.exports = {
  dest: 'gckit',
  base: '/gckit/',
  title: 'Gckit-CLI',
  description: '代码生成工具',
  head: [
    ['link', {
      rel: 'icon',
      href: `/favicon.png`
    }]
  ],
  serviceWorker: true,
  contentLoading: true,
  themeConfig: {
    nav: [{
        text: '指南',
        link: '/guide/'
      },
      {
        text: '配置',
        link: '/config/'
      },
      {
        text: '模板',
        link: '/template/'
      },
      {
        text: '关于',
        link: '/about/'
      },
      {
        text: 'github',
        link: 'https://github.com/SeongBrave/gckit'
      },
    ],
    sidebar: {
      '/guide/': [{
        title: '指南',
        collapsable: false,
        children: [
          '/guide/',
          '/guide/getting-started',
          '/guide/basic-config',
          '/guide/generate'
        ]
      }, {
        title: '进阶',
        collapsable: false,
        children: [
          '/guide/advanced/gtype-config',
          '/guide/advanced/lang-config',
          '/guide/advanced/cocoapods'
        ]
      }]
    }
  }

}
