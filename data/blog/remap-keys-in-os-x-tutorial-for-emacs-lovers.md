---
title: "Remap keys in OS X tutorial for Emacs lovers"
date: "2015-08-31"
lastmod: "2015-08-31"
tags: [osx, emacs, keybinding]
type: Blog
draft: false
summary: "A comprehensive guide to remapping keyboard keys in macOS for Emacs users, improving productivity with custom key bindings and modifiers that provide a more ergonomic editing experience."
license: CC BY-SA 4.0
---
## Remap Caps Lock to Control

Open `System Preferences`

Then go to `Keyboard` - `Modifier Keys...`

![keyboard](/static/images/keyboard.webp)

Remap `Caps Lock` to `Control`, then `OK`.

![remap](/static/images/remap.webp)

## Use Option as Meta key

For system terminal users:

![system](/static/images/system.webp)

For iterm terminal users:

![iterm](/static/images/iterm.webp)

## Use Meta key in Global

(This will NOT work on the latest macOS!)

Use DefaultKeyBinding.dict to set custom key binding.

There is a Keybindings for emacs emulation from hcs.harvard.edu.

```bash
wget -O- http://www.hcs.harvard.edu/~jrus/site/KeyBindings/Emacs%20Opt%20Bindings.dict > ~/Library/KeyBindings/DefaultKeyBinding.dict
```

[Learn more](http://osxnotes.net/keybindings.html)

## Advanced

If you want more deep custom, use [Karabiner](https://pqrs.org/osx/karabiner/).

