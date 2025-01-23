---
title: Using Jenkins to auto deploy webservices on Raspberry Pi with Docker
date: '2024-01-30'
tags: [RaspberryPi, Jenkins, Docker]
type: Blog
license: CC BY-SA 4.0
---

## Background

I have recently created a project called [Video Management Service](https://github.com/HackingGate/video-management-service) and deployed it on my Raspberry Pi 4.

I want to make it auto deploys when I push to GitHub. It's possible to use GitHub Actions to invoke a script via SSH on Raspberry Pi to pull the latest code, build the docker and restart the service. But I want to try Jenkins.

## Install Jenkins on Raspberry Pi

This is the OS I am using.

```
OS: Debian GNU/Linux 11 (bullseye) aarch64
```

### Install Java

```sh
sudo apt install default-jdk
```

### Install Jenkins

Follow the official guide: [Installing Jenkins on Debian-based distributions](https://www.jenkins.io/doc/book/installing/#debianubuntu)

### Check if Jenkins is running

```sh
sudo systemctl status jenkins
```

### The service is not running

Let's check the log.

```sh
journalctl -xe -u jenkins
```

It says: `Address already in use`

List ports in use to find out which port is available.

```sh
sudo netstat -tulpn | grep LISTEN
```

Let's change the port to a number that is not in use. (In my case, I changed it to 8087)

https://stackoverflow.com/a/71533015/4063462

Edit `/etc/systemd/system/jenkins.service.d/override.conf`

```/etc/systemd/system/jenkins.service.d/override.conf
[Service]
Environment="JENKINS_PORT=8087"
```

Reload systemd.

```sh
sudo systemctl daemon-reload
```

Start Jenkins service.

```sh
sudo systemctl start jenkins
```

It now says: `raspberrypi systemd[1]: jenkins.service: Failed with result 'timeout'.`

Change the timeout to 180 seconds.

https://askubuntu.com/a/1445202/353447

Reload systemd.

```sh
sudo systemctl daemon-reload
```

Start Jenkins service.

```sh
sudo systemctl start jenkins
```

### Open Jenkins in browser

```url
http://[address_to_raspberrypi]:8087
```

### Unlock Jenkins

```sh
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Input the password and continue.

## Create a new job

### Create a new item

![Jenkins-New-Item](/static/images/Jenkins-New-Item.webp)

### Configure the job

![Jenkins-Job-Configuration](/static/images/Jenkins-Job-Configuration.webp)

Hit "Apply" and "Save".

This will poll the repository every 3 minutes and run the following commands if there is a new commit.

```sh
whoami
make build 
make up
```

The Jenkins server and the webserver are the same server (Raspberry Pi 4). I can manipulate the docker without using SSH.

### Allow Jenkins to use Docker

Add Jenkins to docker group

```sh
sudo usermod -aG docker jenkins
```

Restart Jenkins service.

```sh
sudo systemctl restart jenkins
```

### Push to GitHub

Voilà! It works!

I pushed something to GitHub and Jenkins automatically pulled the latest code, built the docker and restarted the service.

![Jenkins-Job-Console-Output](/static/images/Jenkins-Job-Console-Output.webp)
