---
title: 'Moving to new Yubikeys'
date: '2021-12-05'
lastmod: '2021-12-05'
tags: [Yuibikey, OpenGPG, OTP]
type: Blog
draft: false
summary: "A guide to migrating GPG keys, FIDO U2F configurations, and other security credentials when switching to new YubiKeys, ensuring secure and smooth transition without compromising security."
license: CC BY-SA 4.0
---
My old Yubikey 5Ci was cracked. So I ordered a new Yubikey 5C NFC. Yubico sent me a wrong key Yubikey 5 NFC and the correct one later.

Now I have 3 keys in total.

## OpenGPG

Generate a recovation certicate

https://msol.io/blog/tech/back-up-your-pgp-keys-with-gpg/

Revoke the key

```
$ gpg --import new-3AF9BF2B-pgp-revocation.asc

gpg: key E761498A3AF9BF2B: "HackingGate <i@hackinggate.com>" revocation certificate imported
gpg: Total number processed: 1
gpg:    new key revocations: 1
gpg: no ultimately trusted keys found
```

Send key to keyserver

```
$ gpg --send-key E761498A3AF9BF2B

gpg: sending key E761498A3AF9BF2B to hkps://keys.openpgp.org
```

Check if the key was revoked

```
% gpg --search-keys "E761498A3AF9BF2B"

gpg: data source: https://keys.openpgp.org:443
(1)	  4096 bit RSA key E761498A3AF9BF2B, created: 2020-05-10 (revoked)
Keys 1-1 of 1 for "E761498A3AF9BF2B".  Enter number(s), N)ext, or Q)uit > 
```

## Generate a new PGP

Follow the tutorial

[Generating Keys externally from the YubiKey (Recommended)](https://support.yubico.com/hc/en-us/articles/360013790259-Using-Your-YubiKey-with-OpenPGP)

Reimport the key

```
gpg --import EFB4B737-private.asc
```

Repeat the tutorial and import it to the second Yubikey.

Switching between two or more Yubikeys.

```
gpg-connect-agent "scd serialno" "learn --force" /bye
```

Send key ot keyserver
```
gpg --send-key E83E59A8EFB4B737
```

Export public key
```
gpg --output public.asc --armor --export i@hackinggate.com
cat public.asc | pbcopy
```

Require touch

```
ykman openpgp keys set-touch aut on
ykman openpgp keys set-touch sig on
ykman openpgp keys set-touch enc on
```

Change info

```
gpg/card> admin
gpg/card> passwd
gpg/card> name
gpg/card> lang
gpg/card> login
gpg/card> url
gpg/card> list
```

## OTP

When you touch Yubikey. It inputs a OTP code look like this: `cccccbcbfbdkghkvhtlcunbibljiuelhhllirikbtjfi`.

To diable it

```
ykman config usb --disable OTP
ykman config nfc --disable OTP
```

Check if the interfaces are disabled.
```
ykman info
```

