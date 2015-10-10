---
layout: post
title: "A Fresh Start"
date: 2015-10-03 11:00:00
image: '/assets/img/swedish_countryside_2.jpg'
description: 'A new, simpler site'
tags:
- jekyll
- website
- technical
twitter_text: 'A Fresh Start'
---

## Down with Content Management Systems

I'm actually feeling quite liberated with my new site at the moment, and I know that might sound pretty geeky, but hear me out.  When I first started out creating a personal website for myself years ago, I wrote it all in HTML myself, it always looked shit, but it was simple and never got hacked (I never have liked HTML).  Then as I got older and wanted more features on my site, including a forum (for some odd reason), I resorted to using CMS systems.  I've used a few, DotNetNuke, Orchard CMS and also Sharepoint.  All of which should be protected with an SSL cert, otherwise you're likely to have your credentials stolen, and even using an authentication provider won't protect you from hacks.

Basically, my quest for having something easy to update, actually made things more complicated and expensive in the long run, and I've wasted a lot of money doing so.

## GitHub, Jekyll & Travis-CI

So what am I using now?  [GitHub](http://www.github.com), to store my site source code in a [public repository](http://github.com/devoctomy/npsoftware.co.uk), yup I don't care if you can see the source code, there's one piece of sensitive information in there and it's encrypted using RSA, so all good.  I'm also using [Travis-CI](http://www.travis-ci.org) to automatically compile my source code into a static website, in its source form it's a [Jekyll](https://jekyllrb.com/) website.  Once compiled it's also automatically published to [Amazon S3](http://aws.amazon.com/).  That *might* sound complicated, but here's my flow for writing a blog entry,

* Check out the source code from GitHub (This is only done once)
* Create a new markdown file in the 'posts' directory
* Write my blog entry in the new file
* Push my update to GitHub

At this point Travis-CI automatically detects that the repository has changed, compiles my website and then publishes it to S3.  It even sends me an email to tell me if it succeeded or not, how simple is that!

Even better...

* GitHub is **free** for public repositories
* Travis-CI is **free** for public GitHub repositories
* Amazon S3 is **super fast**, and **super cheap**, like pennies in comparison to hosting a CMS

Previously I was spending roughly £50 a month, hosting Orchard CMS on Microsoft Azure, that was easy enough to setup but involved also running a SQL server and using SSL certificates.  Blargh!

## A More Active Blog

The main thing I'm wanting to get out of this, aside from saving myself like £50 a month on Azure hosting, is to have a more active blog.  There's so little to do in order to create engaging and attractively formatted content using this method that there should be nothing stopping me from a weekly blog entry or two.  That's the hope anyway!

## Where Did You Get Your Jekyll Template From?

I'm basically using the first template I came across on [jekyllthemes.org](http://jekyllthemes.org/), you can find it on GitHub [here](https://github.com/willianjusten/will-jekyll-template), it's by a guy named Will.  I've just basically modified it to my liking.  So I'm obviously super grateful to Will for making it open-source.

Anyway, that's it for my first blog post, I haven't gone into technical detail about setting this up, by may do in a later post.  Peace out!
