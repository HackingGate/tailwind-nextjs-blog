---
title: GNU/Linux Tar Command Cheat Sheet
date: '2019-07-10'
tags: []
---

## Archive Only (no compress)

- -c for Create a tarball, archive, (c mode)
- -x for Extract a tarball (x mode)
- -v for Verbose
- -f for File, read or write to the file

### Archive Example

```sh
tar -cvf code.tar ./code-directory
tar -xvf code.tar
```

I don’t really understand -f, what’s that?
You can use tar without -f.

```sh
tar -cv ./code-directory > code.tar
tar -xv < code.tar
```

As far as I know, it is equivalent to the Example above.

## Compress Only (no archive)

Before that, let me introduce you gzip, bzip2, and xz.
(for compress only, no archive.)

### Compress Example

```sh
gzip file01
gzip -d file01.gz
# (-d for Decompress)
```

You can’t use gzip/bzip2/xz compress a folder, it only works with a file.
In this case, you would create a tarball first, then gzip/bzip2/xz it.

### Create Tarball with Compress (archive & compress)

```sh
tar -cvzf code.tar.gz ./code-directory
tar -xvf code.tar.gz
```

- -z for gzip
- -j for bzip2
- -J for xz

A complicated Example:

```sh
# prepare some files
for i in {1..5}; do echo $i > file$i; done
# tar first, then compress
tar -cvf files.tar file{1..5}; gzip files.tar
# is equivalent to
tar -cvzf files.tar.gz file{1..5}
# decompress & unpack (autodetect gzip/bzip2/xz)
tar -xvf files.tar.gz
cat file{1..5}
```

