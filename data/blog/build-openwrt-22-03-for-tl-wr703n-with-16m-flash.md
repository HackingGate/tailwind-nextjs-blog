---
title: Build OpenWrt 22.03 for TL-WR703N with 16m flash
date: '2023-09-30'
tags: [OpenWrt, tl-wr703n, ath79, ar71xx, 16m, make, build]
type: Blog
license: CC BY-SA 4.0
---
*The blog post has been updated on September 30, 2023. The original post was written on January 25, 2020 and can be found [here](https://hackinggate.gitlab.io/2020/01/25/build-openwrt-19-07-for-tl-wr703n.html).*

Since 18.06, OpenWrt no longer provide image for TL-WR703N because of default 4m flash is not enough.  
If you want to use latest OpenWrt on your modified TL-WR703N.  
You have to build it on your own.  

`ar71xx` has been migrating[^1] to `ath79` since 19.07, on 21.02 and later, `ar71xx` has been removed.
. This tutorial is for `ath79`.

## Precompiled

~~Download my precompiled OpenWrt image for TL-WR703N from here:~~  
~~https://downloads.hackinggate.com~~ (No longer maintained)

![TL-WR703N-OpenWrt-19.07.0.png](/static/images/TL-WR703N-OpenWrt-19.07.0.webp)
![TL-WR703N-OpenWrt-16m.png](/static/images/TL-WR703N-OpenWrt-16m.webp)

## Prepare to Build

Please read [Install build system](https://openwrt.org/docs/guide-developer/build-system/install-buildsystem).

Make sure all dependencies are installed.

Clone the OpenWrt source code.

```bash
git clone https://github.com/openwrt/openwrt.git
cd openwrt
```

Checkout the version you want to build. We will use v22.03.5 as example.

```bash
git tag -l
git checkout v22.03.5
```

Install feeds.

```bash
./scripts/feeds update -a
./scripts/feeds install -a
```

Make sure there's no dependency error.

Make sure there's enougth RAM or swap for build.

## Modify the Device/tplink_tl-wr703n Definition

After I took some look at the source code.  
Edit `target/linux/ath79/image/tiny-tp-link.mk`.  
Find the line `define Device/tplink_tl-wr703n` and change the line `$(Device/tplink-4mlzma)` to `$(Device/tplink-16mlzma)`.
If you have modified flash. For me it's 16m.  
The result should be like this.

```target/linux/ath79/image/tiny-tp-link.mk
define Device/tplink_tl-wr703n
  $(Device/tplink-16mlzma)
  SOC := ar9331            
  DEVICE_MODEL := TL-WR703N                            
  DEVICE_PACKAGES := kmod-usb-chipidea2
  TPLINK_HWID := 0x07030101
  SUPPORTED_DEVICES += tl-wr703n     
endef
TARGET_DEVICES += tplink_tl-wr703n
```

### Modify the dts file for 16m flash

Edit `target/linux/ath79/dts/ar9331_tplink_tl-wr703n_tl-mr10u.dtsi`    
Under `partition@20000 {` change the line `reg = <0x20000 0x3d0000>;` to `reg = <0x20000 0xfd0000>;`.  
Find the line `art: partition@3f0000 {` and change it to `art: partition@ff0000 {`.  
And under that, change the line `reg = <0x3f0000 0x10000>;` to `reg = <0xff0000 0x10000>;`.  
The result should be like this.

```target/linux/ath79/dts/ar9331_tplink_tl-wr703n_tl-mr10u.dtsi
&spi {                  
        status = "okay";
                                             
        flash@0 {                            
                compatible = "jedec,spi-nor";  
                reg = <0>;                     
                spi-max-frequency = <25000000>;
                                                        
                partitions {                            
                        compatible = "fixed-partitions";
                        #address-cells = <1>;
                        #size-cells = <1>;  
                                                    
                        uboot: partition@0 {        
                                reg = <0x0 0x20000>;
                                label = "u-boot";
                                read-only;
                        };                                     
                                                               
                        partition@20000 {                      
                                compatible = "tplink,firmware";
                                reg = <0x20000 0xfd0000>;
                                label = "firmware";
                        };                               
                                                         
                        art: partition@ff0000 {          
                                reg = <0xff0000 0x10000>;
                                label = "art";
                                read-only;
                        };
                };
        };
};
```

## Configure Build

Use this `config.buildinfo` for OpenWrt v22.03.5 (modify the link if you are building for different version)

```bash
wget https://downloads.openwrt.org/releases/22.03.5/targets/ath79/tiny/config.buildinfo -O config.buildinfo
```

Add the following two lines to `config.buildinfo`

```conf
CONFIG_TARGET_DEVICE_ath79_tiny_DEVICE_tl-wr703n-v1=y
CONFIG_TARGET_DEVICE_PACKAGES_ath79_tiny_DEVICE_tl-wr703n-v1=""
```

Overwrite `.config` with `config.buildinfo`

```bash
cat config.buildinfo > .config
```

You should see **TL-WR703N** appeared in Target Devices.

```bash
make defconfig
make menuconfig
```

## Start to Build

This will take minutes to hours.

```bash
nohup time make -j8 V=s &
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

```bash
scp bin/targets/ath79/tiny/openwrt-ath79-tiny-tplink_tl-wr703n-squashfs-sysupgrade.bin root@192.168.1.1:/tmp/
ssh root@192.168.1.1
sysupgrade -i /tmp/openwrt-ath79-tiny-tplink_tl-wr703n-squashfs-sysupgrade.bin
```

## After install

I have some tips for you. Shell script for upgrade all packages, DNS-over-TLS, etc. Please check my gist as below.  
https://gist.github.com/HackingGate/b75ac856397075756ea878380c5b848c

[^1]: You can read more about [ar71xx-ath79 transition](https://openwrt.org/docs/techref/targets/ath79#ar71xx-ath79_transition).