import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { externalLinkIconPlugin } from '@vuepress/plugin-external-link-icon'

export default defineUserConfig({
  lang: 'en-US',

  title: 'VideoCMS',
  description: ' Start distributing videos on your own hardware in under 5 minutes',

  theme: defaultTheme({
    logo: 'https://raw.githubusercontent.com/Kirari04/videocms/master/public/logo.png',

    navbar: [
      '/',
      '/get-started',
      { text: "GitHub", link: "https://github.com/Kirari04/videocms", target: "_blank" },
      { text: "Docker", link: "https://hub.docker.com/r/kirari04/videocms", target: "_blank" },
      { text: "Discord", link: "https://discord.gg/pHcstaPThK", target: "_blank" },
    ],
  }),

  bundler: viteBundler(),
  plugins: [

  ]
})
