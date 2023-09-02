---
title: Upgrade to Raspbian Buster (Debian 10) for Raspberry Pi
date: '2019-06-24'
tags: []
type: Blog
license: CC BY-SA 4.0
---

[Official installation guide](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)

I'll use

- macOS Mojave
- Raspbian Buster Lite
- 32GB micro SD card

## Flash os image to sdcard

### List disks

```sh
diskutil list
```

```sh
/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *32.0 GB    disk2
   1:             Windows_FAT_32 boot                    46.0 MB    disk2s1
   2:                      Linux                         32.0 GB    disk2s2
```

### Unmount disk2

```sh
diskutil unmountDisk disk2
```

### Download image

[Download Page](https://www.raspberrypi.org/downloads/raspbian/)

### Check SHA-256

```sh
sha256sum 2019-06-20-raspbian-buster-lite.zip
```

```sh
9009409a9f969b117602d85d992d90563f181a904bc3812bdd880fc493185234  2019-06-20-raspbian-buster-lite.zip
```

### Unzip

```sh
unzip 2019-06-20-raspbian-buster-lite.zip
```

### Flash image

```sh
sudo dd bs=1m if=2019-06-20-raspbian-buster-lite.img of=/dev/rdisk2 conv=sync
```

### List disk2

```sh
diskutil list disk2
```

```sh
/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *32.0 GB    disk2
   1:             Windows_FAT_32 boot                    268.4 MB   disk2s1
   2:                      Linux                         1.9 GB     disk2s2
```

### Unmount disk2 again

```sh
diskutil unmountDisk disk2
```

## After install

### Login

The default user is `pi`, password is `raspberry`.

### Change keyboard

Open "/etc/default/keyboard"

```sh
sudo nano /etc/default/keyboard
```

The file should be like this:

```conf
# KEYBOARD CONFIGURATION FILE
 
# Consult the keyboard(5) manual page.
 
XKBMODEL="pc105"
XKBLAYOUT="gb"
XKBVARIANT=""
XKBOPTIONS=""
 
BACKSPACE="guess"
```

Change "gb" to "us"

```conf
XKBLAYOUT="us"
```

### Remote access via SSH

Enable and start SSH

```sh
sudo systemctl enable ssh
sudo systemctl start ssh
```

Copy ssh-id

```sh
ssh-copy-id pi@192.168.1.14
```

### Secure SSH

On Raspbian, edit "/etc/ssh/sshd_config", there are three lines that need to be changed to `no`.

```conf
ChallengeResponseAuthentication no
PasswordAuthentication no
UsePAM no
```

Change port number if necessary, e.g. 2222.

```conf
Port 2222
```

Read [Securing your Raspberry Pi](https://www.raspberrypi.org/documentation/configuration/security.md) for more info.

### Locale

Fix locale error like this

```sh
/bin/bash: warning: setlocale: LC_ALL: cannot change locale (en_US.UTF-8)
```

This means LC_ALL is set to en_US.UTF-8. But en_US.UTF-8 is not generated (not in locale -a).

Generate locales

```sh
sudo raspi-config
```

Select "4 Localisation Options" -> "L1 Change Locale"

Prees "space bar" to check All locales (will take time to generate)

![Pi-Configure-Locale.png](/static/images/Pi-Configure-Locale.png)

Select en_US.UTF-8 as default.

![Pi-Locale-enUS.png](/static/images/Pi-Locale-enUS.png)

Another way of doing this is to edit "/etc/locale.gen"

Uncomment en_US.UTF-8 and others you want to use

Use commands below to generate and set default

```sh
sudo locale-gen
sudo update-locale en_US.UTF-8
```

Many thanks to [jaredwolff.com](https://www.jaredwolff.com/raspberry-pi-setting-your-locale).

### Cloudflare DDNS

Use my shell script  
https://gist.github.com/HackingGate/2276b69d52839fef1603132b4de941f0

SSH login from anywhere

```sh
ssh pi@example.com -p 2222
```

