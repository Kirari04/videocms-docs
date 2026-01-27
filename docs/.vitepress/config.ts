import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  lang: 'en-US',
  title: 'VideoCMS',
  description: 'Start distributing videos on your own hardware in under 5 minutes',

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  },

  themeConfig: {
    logo: 'https://raw.githubusercontent.com/Kirari04/videocms/master/public/logo.png',

    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Operations', link: '/operations/production' },
      { text: 'Reference', link: '/reference/configuration' },
      { text: 'Development', link: '/development/guide' },
      {
        text: 'Links',
        items: [
          { text: 'GitHub', link: 'https://github.com/Kirari04/videocms' },
          { text: 'Docker', link: 'https://hub.docker.com/r/kirari04/videocms' },
          { text: 'Discord', link: 'https://discord.gg/pHcstaPThK' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Upload a Video', link: '/guide/upload-video' },
          { text: 'User Management', link: '/guide/user-management' },
          { text: 'Encoding Settings', link: '/guide/encoding' },
          { text: 'Subtitle Support', link: '/guide/subtitles' },
          { text: 'Custom Webpages', link: '/guide/customization' },
        ]
      },
      {
        text: 'Operations',
        items: [
          { text: 'Production Deployment', link: '/operations/production' },
          { text: 'Cloudflare Setup', link: '/operations/cloudflare' },
          { text: 'Security', link: '/operations/security' },
          { text: 'Backup & Restore', link: '/operations/backup-restore' },
          { text: 'Webhooks', link: '/operations/webhooks' },
          {
            text: 'Upgrade Guide',
            link: '/operations/upgrade',
            items: [
              { text: 'v0.0.9 to v0.1.0', link: '/operations/migration-alpha-beta' }
            ]
          },
          { text: 'Troubleshooting', link: '/operations/troubleshooting' },
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Configuration', link: '/reference/configuration' },
          { text: 'CLI Reference', link: '/reference/cli' },
          { text: 'API Reference', link: '/reference/api' },
          { text: 'Architecture', link: '/reference/architecture' },
        ]
      },
      {
        text: 'Development',
        items: [
          { text: 'Developer Guide', link: '/development/guide' },
          { text: 'Changelog', link: '/development/changelog' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Kirari04/videocms' }
    ],

    footer: {
      message: 'Released under the AGPL-3.0 License.',
      copyright: `Copyright © 2024-${new Date().getFullYear()} VideoCMS`
    },

    editLink: {
      pattern: 'https://github.com/Kirari04/videocms-docs/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    }

  }
}))
