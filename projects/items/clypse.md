---
name: clypse
# Projects are listed by `order`, lowest first.
order: 1
status: Work in progress
# Shown as buttons under the description. `icon` is a name from
# _includes/icon.html.
links:
  - label: GitHub
    url: https://github.com/devoctomy/clypse
    icon: github
skills: ["Amazon S3", "Amazon Cognito", "AWS IAM", "Amazon CloudFront", "Serverless", "Cryptography"]
---
Clypse is a complete password management system that you host yourself in Amazon S3. It's completely serverless, hosted as a static website with some additional Cognito configuration for user management. Super easy, and super cheap.

It's designed to use the latest cryptographic standards, but also to be highly customisable.

It uses a few other AWS serverless technologies to make the system a reality, including Cognito, IAM and CloudFront. It's still a work in progress, but the software is completely open source.

I'm currently developing a new underlying framework for creating static web apps with cloud syncing and high security built in. It isn't open just yet, but watch this space, as it will be available soon.
