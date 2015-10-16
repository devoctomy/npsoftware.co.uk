---
layout: post
title: "Another Site Deployed"
date: 2015-10-06 20:00:00
image: '/assets/img/website-designing.jpg'
description: 'Two down, two to go.'
tags:
 - jekyll
 - website
 - technical
twitter_text: 'Another Site Deployed'
---

## A New Site For My Mothers Work

So I spent last Sunday working on deploying another Jekyll site, using a different theme this time which actually tought me a hell of a lot about the differences with themes.  I would recommend taking a deep dive into several themes before finally deciding on one, so much so that I'm actually considering changing this site to something with more features.  I might not though, seeing as it's taken me a whole weekend sorting these two out as it is and I have another 2 yet to complete.

You can check out my mums new site at the following URL, (not totally finished and my mum is still adding content)

[www.knittedbysteph.com](http://www.knittedbysteph.com)

And yup, just incase you didn't read that correctly, my mum is now authoring her site using GitHub & Markdown, 'cos that's just how she rolls! She's using [ATOM](http://atom.io) as her Markdown editor.

## Not All Templates Are Created Equal

As you would expect, there can be a huge difference in usability between site templates, but not only that, some really handy features too, like my mums new site, allows you to configure multiple authors.  This simple ability allows you to create guest blog posts much easier than the template I'm currently using.

The template I chose for knittedbysteph.com is the [So Simple Theme](https://github.com/mmistakes/so-simple-theme/).  I removed what was the 'Blog' section of the theme and repurposed the 'Articles' section as this provides pretty much the same functionality, only with guest author support, great!  This theme also has a whole host of additional social networking integration options that aren't available on mine, although they aren't all essential for my purposes, they are nice to have.

## Other Lessons Learned

Aside from templating lessons, I have also learnt quite a bit about Amazon CloudFront, which I'm using to globally distribute the site so that it's super fast, no matter where in the world it's being loaded from, and still many times cheaper than hosting a CMS on Azure.  The main lesson is caching time, this *will* do your head in, honestly.  Changes are not instantaneous as you can imagine, considering the site has to be duplicated all over the globe, the data is "eventually consistent".  I found myself changing some graphics, and struggling to get the changes to be shown in the browser, even at the original bucket URL.  I found a combination of deleting my source buckets content, and recreating it, as well as making an invalidation set (I think that's what they call it) in CloudFront of /*  Now I'm not entirely sure what works best, but I also dropped the TTL to 1 hour, from 24 hours.  Eventually the changes show up, so this can be a bit frustrating which is why it's best to test as much locally as possible, prior to pushing live, or use a staging bucket that isn't using CloudFront.

I also found that on a number of occasions my markdown wasn't rendered correctly, for example my first blog post appeared as just one solid h2 block, not good!  Pushing the source to git again seemed to resolve this.  Not sure how this could happen in all honesty, I'm hoping it was a one-off.

## What's Next?

Well the next website I have to do is going to be quite a bit more tricky, it's for my photography blog 'hdrzone.co.uk'.  I'm really wanting something impressive with this and am pretty sure using Jekyll and S3 will give me just what I'm after.  I've already picked the theme, which is the  [Hmfaysal Omega Theme](http://www.hossainmohdfaysal.com/hmfaysal-omega-theme/) as this has some nice photo gallery support.

I'm hoping to have it up and running this weekend, so fingers crossed!  Anyway, just a side note, I still think the whole GitHub / Jekyll / Travis-CI approach to site building is the way to go for now, even with the little oddities here and there it's still more reliable than using a CMS.
