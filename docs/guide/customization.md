---
lang: en-US
title: Static Pages
description: How to publish supporting Markdown or HTML pages in VideoCMS
---

# Static Pages

VideoCMS can publish supporting content such as a legal notice, privacy policy, terms, or an about page. Static pages use the standard VideoCMS layout and are not intended to replace a website or content-management system.

## Managing Pages

Admins can open **Static pages** in the dashboard to create, edit, hide, or delete a page.

Each page has these settings:

- **Title**: Shown above the page content.
- **Public path**: The address below `/p/`. A path of `privacy` is available at `/p/privacy/`.
- **Published**: Hidden pages remain editable but return `404` publicly.
- **Footer link**: Adds the page to footer navigation while it is published.
- **Content format**: Markdown or advanced HTML.

## Markdown

Markdown is the default format and is the best option for most pages. It supports headings, paragraphs, links, lists, quotes, code, and tables without exposing layout or theme controls.

Use the **Write** and **Preview** tabs to check the rendered result before saving.

## Advanced HTML

HTML mode accepts an HTML fragment for cases where Markdown is not enough. VideoCMS sanitizes the fragment before previewing or publishing it. Scripts, embeds, inline styles, event handlers, and unsafe URLs are removed.

The public page still uses VideoCMS typography, spacing, colors, and responsive behavior. Full HTML documents and custom JavaScript are not supported.

## Hiding a Page

Turn off **Published** to remove a page from public access without deleting its content. Hidden pages:

- remain available to admins;
- are removed from footer navigation;
- return `404` at their previous public path.

Publishing the page again restores its URL and its footer preference.
