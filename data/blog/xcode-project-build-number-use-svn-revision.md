---
title: Xcode project build number use svn revision
date: '2015-09-03'
tags: [Xcode, SVN, build number, script]
type: Blog
license: CC BY-SA 4.0
---

I wrote a script auto read svn revision number and replace Xcode project build number.

Select the project under **TARGETS** then click the **+** on top-left conor

![+](/static/images/+.webp)

Choose **New Run Script Phase**

![new](/static/images/new.webp)

Copy and paste this script

![script](/static/images/script.webp)

The script is

```updateBuildNumber.sh
REV_GIT=`git svn info |grep Revision: |cut -c11-`
REV_SVN=`svn info |grep Revision: |cut -c11-`
if [ -z $REV_GIT ] ;then
REV=$REV_SVN
else
REV=$REV_GIT
fi
echo "REV is $REV"

BASEVERNUM=`/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" "${INFOPLIST_FILE}"`
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $REV" "${INFOPLIST_FILE}"
```

I have posted this script to [GitHub Gist](https://gist.github.com/HackingGate/945c53824f6b8f441868)

Everytime when you build, project build number will auto update.
