---
title: Xcode project build number use svn revision
date: '2015-09-03'
tags: [Xcode, svn]
---

I wrote a script auto read svn revision number and replace Xcode project build number.

Select the project under **TARGETS** then click the **+** on top-left conor

![+](/static/images/+.png)

Choose **New Run Script Phase**

![new](/static/images/new.png)

Copy and paste this script

![script](/static/images/script.png)

I have posted this script to GitHub Gist

<script src="https://gist.github.com/HackingGate/945c53824f6b8f441868.js"></script>

Everytime when you build, project build number will auto update.

