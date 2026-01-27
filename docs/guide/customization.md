---
lang: en-US
title: Custom Webpages
description: How to create and manage custom static pages on VideoCMS
---

# Custom Webpages

VideoCMS allows you to create and manage custom static pages directly from your dashboard. This feature is primarily designed for essential pages such as legal notices, privacy policies, and terms of service.

## Managing Webpages

To manage your custom pages, navigate to **Web Pages** in your user dashboard. From there, you can:

- **Create New Pages**: Click the "New Webpage" button to start building a new page.
- **Edit Existing Pages**: Click the edit icon on any page in the list to modify its content, path, or settings.
- **Delete Pages**: Remove pages that are no longer needed.

## Configuration Options

Each webpage has several key configuration options:

- **Page Title**: The internal and public-facing title of the page.
- **Public Path**: The URL segment where the page will be accessible. All custom pages are prefixed with `/p/`. For example, a path of `privacy` will be available at `/p/privacy`.
- **Include in Footer**: A toggle that determines if a link to this page should automatically appear in the website's footer navigation.

## Design and Content

VideoCMS integrates a visual editor (GrapesJS) to help you design your pages without writing HTML manually. You can:

- Build layouts using a drag-and-drop interface.
- Style elements directly within the editor.
- Preview your changes before saving.

## Typical Use Cases

Custom webpages are ideal for:

- **Impressum / Legal Notice**
- **Data Privacy Policy**
- **System Policies**
- **Terms and Conditions**
- **About Us pages**

## Technical Implementation

Public pages are rendered dynamically based on their path. When a user visits `/p/[slug]`, VideoCMS fetches the corresponding HTML content and renders it within the standard site layout.
