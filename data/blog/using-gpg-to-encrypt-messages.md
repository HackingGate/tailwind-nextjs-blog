---
title: Using GPG to Encrypt Messages
date: '2019-07-09'
tags: [GPG, PGP, Encryption, Security, GitHub, Keybase, Key Server, Pub Key, Private Key, SSH, Git, Linux]
type: Blog
license: CC BY-SA 4.0
---

You might have been using GPG for years.  
Do you often send encrypted messages to your friends?  
Or maybe you don't even know your friend has a pub key.

If you are new.  
There are high-quality documents written by GitHub.
Start with this one for example: [Generating a new GPG key](https://help.github.com/en/articles/generating-a-new-gpg-key)

## Sharing public keys with each other

### Using key servers

#### Find a key on key servers

```sh
gpg --search-keys "HackingGate"
```

#### List keys

List GPG keys associated with `i@hackinggate.com`

```sh
gpg --list-keys i@hackinggate.com
```

#### Upload a key to a key server

If you want your key available on the key server. Just upload it.

```sh
gpg --send-key 85E38F69046B44C1EC9FB07B76D78F0500D026C4
```

But wait. Not everyone's pub key is available on key servers.
You can't make sure keys on key servers are 100% real.  
Someone could claim themselves as yourself.  
What to do?  

### Keybase.io

[Keybase.io](https://keybase.io) came to solve that. They will use additional information such as a tweet, a DNS record, a gist to make sure you are yourself.
But still, not everyone is using it. And I don't personally like Keybase.io. Because the setup process will upload your private key by default. It's NOT safe.

### GitHub could be the best solution

Almost every developer has a GitHub account.
And lots of them using GPG sign their git commits.

#### URL for GPG pub key

```url
https://github.com/<username>.gpg
```

#### Example

Import a GPG pub key from GitHub user HackingGate (which is me)

```sh
curl https://github.com/HackingGate.gpg | gpg --import
```

## Encrypt messages

```sh
gpg --encrypt --sign --armor --recipient email@example.com message.txt
```

Send the file (or copy text from) `message.txt.asc` to the owner of `email@example.com`.  
Only she/he can decrypt the encrypted message.

## Decrypt messages

```sh
gpg message.txt.asc
```

