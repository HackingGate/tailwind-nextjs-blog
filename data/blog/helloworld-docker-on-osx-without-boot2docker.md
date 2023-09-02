---
title: Helloworld docker on OS X without boot2docker
date: '2015-09-16'
tags: [osx, linux, docker]
type: Blog
---

## 2019 Update

I suggest to install GUI version of Docker in `brew cask` instead CLI version in `brew`.

```bash
brew cask install docker
```

## Install cli Docker on OS X

```bash
brew search docker
```

There's too many search results, which one should I choose?

> 'boot2docker' is officially deprecated in favor of 'docker-machine'

So, Install the following.

```bash
brew install docker
brew install docker-machine
brew install Caskroom/cask/virtualbox
```

## Trying to run hello-world

```bash
docker run hello-world
```

I got this error message

```bash
Post http://var/run/docker.sock/v1.20/containers/create: dial unix /var/run/docker.sock: connect: no such file or directory.
* Are you trying to connect to a TLS-enabled daemon without TLS?
* Is your docker daemon up and running?
```

## Create a machine

We'll use `virtualbox` in this tutorial. (`vmwarefusion` and `xhyve` driver are also available)

Create default Docker VM.

```bash
docker-machine create --driver virtualbox default
```

To see if  `default` is running.

```bash
docker-machine ls
```

Get the environment from `default`.

```bash
docker-machine env default
```

Connect your shell to the `default` machine.

```bash
eval "$(docker-machine env default)"
```

Then run hello-world

```bash
docker run hello-world
```

## Run ubuntu bash in Docker

```bash
docker run -it ubuntu bash
```

This will automaticaly download a ubuntu image, please wait.

```bash
uname -a
```

```bash
Linux d04026aedb7e 4.0.9-boot2docker #1 SMP Thu Sep 10 20:39:20 UTC 2015 x8664 x8664 x86_64 GNU/Linux
```

## Start & Stop command

```bash
docker-machine start default
docker-machine stop default
docker-machine restart default
```

## Several Docker commands

- `docker images` - List images.
- `docker ps -l` - Lists containers.
- `docker logs` - Shows us the standard output of a container.
- `docker stop` - Stops running containers.
- `docker rm` - Remove containers.
- `docker rmi` - Remove images.

