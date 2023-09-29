---
title: Setup your fancy terminal
date: '2023-01-26'
tags: [zsh, oh-my-zsh, starship, macOS, Ubuntu]
type: Blog
license: CC BY-SA 4.0
---

Using your shell with Oh My Zsh and Starship on macOS

Some use [fish shell](https://fishshell.com/) as it is an interactive, user-friendly, and modern shell. But it does not have POSIX sh compatibility. Using fish as your default shell could break part of your system. In this post, I will focus on zsh. With powerful plugins. You can have a powerful interactive interface.

## Install [Z shell (zsh)](http://www.zsh.org/)

For macOS:

```bash
brew install zsh
```

For Ubuntu:

```bash
sudo apt install zsh
```

## Install [Oh My Zsh (omz)](https://ohmyz.sh/)

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## Set zsh as your default shell

```bash
chsh -s $(which zsh)
```

## Install [Oh My Zsh plugins](https://github.com/zsh-users)

Clone [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions.git), [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting.git) and [zsh-completions](https://github.com/zsh-users/zsh-completions.git).

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

git clone https://github.com/zsh-users/zsh-completions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-completions
```

Add the plugin to the list of plugins for Oh My Zsh to load (inside ~/.zshrc):

```plaintext
plugins=( 
    # other plugins...
    zsh-autosuggestions
    zsh-syntax-highlighting
    zsh-completions
)
```

## [Starship.rs](http://Starship.rs) (a fast fancy prompt written in Rust)

You need [Nerd Font](https://www.nerdfonts.com/) installed and enabled in your terminal.

We will install [Fira Code Nerd Font](https://www.nerdfonts.com/font-downloads).

For macOS:

```bash
brew tap homebrew/cask-fonts
brew install --cask font-fira-code-nerd-font
```

Open your terminal preferences and enable the font you've just downloaded.

```plaintext
⌘,
```

For Ubuntu:

```bash
sudo apt install fonts-firacode
```

For macOS and Ubuntu:

Add the following to the end of `~/.zshrc`:

```plaintext
eval "$(starship init zsh)"
```

## Result

![Fancy Terminal screenshot](/static/images/Fancy-Terminal-screenshot.webp)
