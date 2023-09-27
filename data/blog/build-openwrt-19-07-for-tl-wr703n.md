---
title: Build OpenWrt 19.07 for tl-wr703n
date: '2020-01-25'
tags: [OpenWrt, tl-wr703n]
type: Blog
license: CC BY-SA 4.0
---

Since 18.06, OpenWrt no longer provide image for tl-wr703n because of default 4m flash is not enough.  
If you want to use latest OpenWrt on your modified tl-wr703n.  
You have to build it on your own.  

## Precompiled

Download my precompiled OpenWrt image for tl-wr703n from here:  
https://downloads.hackinggate.com

![TL-WR703N-OpenWrt-19.07.0.png](/static/images/TL-WR703N-OpenWrt-19.07.0.png)
![TL-WR703N-OpenWrt-16m.png](/static/images/TL-WR703N-OpenWrt-16m.png)

## Prepare to Build

Update: If you want to build the latest version 19.07.2. Just replace the version number in my tutorial.  

Please read [Install build system](https://openwrt.org/docs/guide-developer/build-system/install-buildsystem) and [Quick Image Building Guide](https://openwrt.org/docs/guide-developer/quickstart-build-images).

Make sure all dependencies are installed.

Clone source code and install feeds

```sh
git clone https://github.com/openwrt/openwrt.git
cd openwrt
git checkout v19.07.0
./scripts/feeds update -a
./scripts/feeds install -a
```

This will build the latest Snapshot. If you want stable release. `git checkout [TAG]`.

Make sure there's no dependency error.

Make sure there's enougth RAM or Swap.

## Add tl-wr703n-v1 defination

After I took some look at the source code.  
Edit `target/linux/ar71xx/image/generic-tp-link.mk`.  
Add the tl-wr703n-v1 define above tl-wr710n-v1. Note the TPLINK_HWID is different with tl-wr710n.  
If you have modified flash. For me it's 16m.  

```conf
define Device/tl-wr703n-v1
  $(Device/tplink-16mlzma)
  DEVICE_TITLE := TP-LINK TL-WR703N v1
  DEVICE_PACKAGES := kmod-usb-core kmod-usb2
  BOARDNAME := TL-WR703N
  DEVICE_PROFILE := TLWR703
  TPLINK_HWID := 0x07030101
  CONSOLE := ttyATH0,115200
  IMAGE/factory.bin := append-rootfs | mktplinkfw factory -C US
endef
TARGET_DEVICES += tl-wr703n-v1
```

## Configure Build

Use this config.seed (modify link if you are building for stable release)

```sh
wget https://downloads.openwrt.org/releases/19.07.0/targets/ar71xx/generic/config.buildinfo -O config.buildinfo
rm -rf .config*
mv config.buildinfo .config
```

Add the following two lines to .config

```conf
CONFIG_TARGET_DEVICE_ar71xx_generic_DEVICE_tl-wr703n-v1=y
CONFIG_TARGET_DEVICE_PACKAGES_ar71xx_generic_DEVICE_tl-wr703n-v1=""
```

You should see **TP-LINK TLWR703N v1** appeared in Target Devices.

```sh
make defconfig
make menuconfig
```

## Start to Build

This will take minutes to hours.

```sh
nohup time make -j4 V=s &
```

```
  -j [jobs], --jobs[=jobs]
       Specifies the number of jobs (commands) to run simultaneously.
       If there is more than one -j option, the last one is effective.
       If the -j option is given without an argument, make will not limit the
       number of jobs that can run simultaneously.
```

Log file is `nohup.out`

View real time log via `tail -f nohup.out`

## Troubleshooting

If you see error like this.

```
WARNING: Makefile 'package/feeds/luci/luci-proto-modemmanager/Makefile' has a dependency on 'modemmanager', which does not exist
WARNING: Makefile 'package/feeds/packages/meson/Makefile' has a dependency on 'python3-pkg-resources', which does not exist
```

Try do this.

```
./scripts/feeds uninstall meson luci-proto-modemmanager
```

And don't forget to apply.

```
make defconfig
```

Clean the build.

```
make clean
```

If still failing, try -j1 to see real error.

```
make -j1 V=s
```

In my case, openvswitch-2.11.0 was failed to build.

```
./scripts/feeds uninstall openvswitch
```

## Flash Image

Upload image to router (OpenWrt) and upgrade.

```sh
scp bin/targets/ar71xx/generic/openwrt-ar71xx-generic-tl-wr703n-v1-squashfs-sysupgrade.bin root@192.168.1.1:/tmp/
ssh root@192.168.1.1
sysupgrade -i /tmp/openwrt-ar71xx-generic-tl-wr703n-v1-squashfs-sysupgrade.bin
```

## After install

I have some tips for you. Shell script for upgrade all packages, DNS-over-TLS, etc.  
https://gist.github.com/HackingGate/b75ac856397075756ea878380c5b848c

