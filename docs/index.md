---
layout: home

hero:
  name: VideoCMS
  text: Start distributing videos on your own hardware in under 5 minutes
  tagline: Lightweight, powerful, and easy to use.
  image:
    src: https://raw.githubusercontent.com/Kirari04/videocms/master/public/logo.png
    alt: VideoCMS Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Documentation
      link: /guide/index

features:
  - title: Selfhost
    details: Selfhost VideoCMS using Docker on your own hardware
  - title: Pretty Subtitles
    details: Subtitles stored as softsub in the ASS format to keep the style and save storage
  - title: HLS Multi-Quality
    details: The video will be converted into multiple qualities to ensure fast playback
  - title: Multi-Audio
    details: The player supports multiple audio tracks that arent stored inside the video to save storage
  - title: Fast Chunked Upload
    details: This allows the server to be behind a proxy without having crazy high maximum post limits
  - title: Dynamic MKV Download
    details: The server assembles the subtitles, audio tracks and video tracks dynamicly during the download without re-encoding

---