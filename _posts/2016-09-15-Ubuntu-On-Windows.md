---
layout: post
title: 'Ubuntu On Windows'
date: 2016-09-15 19:0:00
image: '/assets/img/ubuntuonwindows.jpg'
description: 'Ubuntu running natively in Windows, awesome!'
tags:
 - windows
 - linux
 - ubuntu
 - developer
 - jekyll
twitter_text: 'Ubuntu running natively in Windows, awesome!'
---

One lesser known feature of the new Anniversary Update for Windows 10 is 'Ubuntu on Windows'.  This should be shouted about way more than it currently is, it's an amazing feat of Engineering and enables Windows developers to stay in their cozy Windows environment whilst performing duties in Linux, without even creating a Virtual Machine or copying files from one environment to another.  I'm going to run through something I've just done to test this feature and why I think it's so cool.

## No More Ballache Virtual Machines

Take this site as an example, it's compiled in Linux, using Jekyll and Ruby.  Although you can set this up on Windows it always seems like a bit of a hack that could break apart at any moment.  The tools weren't primarily designed for Windows, most open-source stuff isn't.  If I wanted to view changes before going live I would have to fire up a prepared Linux VM, navigate to the source directory of my site, perform a Git Pull and then run Jekyll.  Although this is okay when you have normal networked conditions, trying to access a website on a VM that has no IP address as you're mobile and off the grid is a ballache at the best of times.

"So what do you need to do now?" I hear you asking... Well not literally cos I'm not mental, but I'm sure some of you were thinking it.  This is what I do.

1.  Open a command prompt by clicking the start button, typing 'cmd' and pressing 'Return'.
2.  Typing the following command (into the command prompt),

    ```
    bash
    ```

3.  Navigating to the source folder *on my Windows computer* via

    ```
    bin/bash --login
    cd /mnt/c/npSoftware/GitHub/npsoftware.co.uk/
    ```

4.  Typing the following (into the command prompt / bash window),

    ```
    bundle exec jekyll serve --no-watch
    ```

Now with the magic of Jekyll my site will be built and available on 'http://127.0.0.1:4000'

**BOSH!!!**

## Essential Developer Feature

This feature obviously isn't going to be appealing to everyone, your nan isn't going to be opening bash prompts and running grep commands, unless she's proper badass.  It's mainly meant for developers that need to dip in and out of Linux on a regular / occasional basis.  What I like best about it being able to store one copy of my source code when developing and testing, although I could edit the source files in Linux using Nano or Vi, I'm not going to do that as I fucking hate command line text editors, they are for people with personality disorders who like to think that the more techy they look when working, the more intelligent they are, completely negating the productivity factor.

For example, at current I'm writing this post using Haroopad in Windows and can see a real-time HTML preview of my post's layout prior to testing on the site itself, I'm not looking at a terminal window thinking "Did I type that syntax correctly?".

Now this is just a basic use-case, you could even write full C / C++ applications using a decent Windows IDE and then compile / test in Linux.  Or maybe even setup a Deepdream server (not tried this yet),  The world is your oyster.

## What About GUI Applications?

Initially I didn't think this would be possible, but after reading the following article,

[How to run Graphical Ubuntu Linux from Bash Shell in Windows 10](http://thehackernews.com/2016/07/ubuntu-gui-windows-10.html)

I now know differently.

If you would like to see exactly how to set Ubuntu on Windows app, read this article,

[How to Install and Use the Linux Bash Shell on Windows 10](http://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/)

Also, just a side note, I will write up a full article on developing Jekyll applications using this technique in the near future.

> Please note that this feature is still in Beta so will more than likely contain bugs / incompatabilities until it reaches gold.

Have fun!