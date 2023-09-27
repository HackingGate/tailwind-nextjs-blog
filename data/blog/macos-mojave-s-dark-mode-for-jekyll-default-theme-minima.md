---
title: macOS Mojave's Dark Mode for Jekyll default theme minima
date: '2019-03-31'
tags: [macOS, Mojave, Dark Mode, Jekyll, minima]
type: Blog
license: CC BY-SA 4.0
---

We now supports macOS Mojave’s Dark Mode.

If you are using latest macOS. Set your system appearance in Dark. You should see our site looks like this in Safari:

![Mojave-Dark-Site-View.png](/static/images/Mojave-Dark-Site-View.png)

## How it works

```css
@media (prefers-color-scheme: light) {
  // css code for light mode
}
@media (prefers-color-scheme: dark) {
  // css code for dark mode
}
```

## Try it with yourself

Open this [example site](https://jekyll.github.io/minima/) of [Jekyll](https://jekyllrb.com) with macOS Safari.

Press `option+command+I` to open Web Inspector. Navigate to Resources -> All Resources -> minima -> `style.css`. Copy and paste the following code below `body {}` section:

(or copy the whole `style.css` of our site if you want a better look)

```css
@media (prefers-color-scheme: dark) {
  body {
    font: 400 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    color: #c8e1ff;
    background-color: #1b1f23;
    -webkit-text-size-adjust: 100%;
    -webkit-font-feature-settings: "kern" 1;
    -moz-font-feature-settings: "kern" 1;
    -o-font-feature-settings: "kern" 1;
    font-feature-settings: "kern" 1;
    font-kerning: normal;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
}
```

You should see website changes when you change macOS Apperance.

You might gonna like this app: [Gray](https://github.com/zenangst/Gray).

## Add macOS Dark Mode support to your own Jekyll site

My modified minima is available on GitHub. ([link here](https://github.com/HackingGate/minima/commit/404934ed2b7bba90da1dba93bc7b9ad580fdddbf))

Use [specific_install](https://github.com/rdp/specific_install) to install gem straight from git.

```bash
gem install specific_install
gem specific_install https://github.com/HackingGate/minima.git mojave
```

Modify `_config.yml` in your site root directory:

```yml
minima:
  mojave-dark-mode: enable
```

Preview with `bundle exec jekyll serve` command.

Enjoy it!
