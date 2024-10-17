---
---
---
---
---
---
layout: layouts/post
layout: layouts/post
layout: layouts/post
layout: layouts/post
layout: layouts/post
layout: layouts/post
tags:
tags:
tags:
tags:
tags:
tags:
  news
  news
  news
  news
  news
  news
date: "2016-06-015"
date: "2016-06-015"
date: "2016-06-015"
date: "2016-06-015"
date: "2016-06-0015"
date: "2016-06-0015"
title: "Changes to login and cf-ssh"
title: "Changes to login and cf-ssh"
title: "Changes to login and cf-ssh"
title: "Changes to login and cf-ssh"
title: "Changes to login and cf-ssh"
title: "Changes to login and cf-ssh"
redirect_from:
redirect_from:
redirect_from:
redirect_from:
redirect_from:
redirect_from:
  - /updates/2016-06-015-auth-ssh-changes/
  - /updates/2016-06-015-auth-ssh-changes/
  - /updates/2016-06-015-auth-ssh-changes/
  - /updates/2016-06-015-auth-ssh-changes/
  - /updates/2016-06-0015-auth-ssh-changes/
  - /updates/2016-06-0015-auth-ssh-changes/
---
---
---
---
---
---

Earlier this month we updated **cloud.gov login** and **`cf-ssh`** in ways that mean most cloud.gov users need to change how they use them. You've probably already made these changes if you need to (we sent email notifications to people who should log in using the new system), but here are the details as a handy reference.
<!--more-->

### For GSA and EPA, your cloud.gov login is now your agency login

We updated how @gsa.gov and @epa.gov accounts authenticate with cloud.gov. When you log in, use your official agency credentials instead of your old cloud.gov-specific username and password. Here's how:

* **On the web:** At [https://login.cloud.gov/](https://login.cloud.gov/), select the button for your agency and enter your agency credentials (the same credentials you use for your agency's own services).
* **On the command line:** Use the new command listed at [Setting up the command line]({{ site.baseurl }}/getting-started/setup/) for agency accounts: `cf login -a api.cloud.gov --sso`

This update improves the security of these accounts because you're now using your agency's existing multi-factor authentication system. This is a step in our progress toward FedRAMP compliance and certification for cloud.gov.

### Use the new version of `cf-ssh`

If you use [`cf-ssh` for running one-off commands](https://cloud.gov/docs/management/using-ssh/), we released [version 3 on June 2](https://github.com/18F/cf-ssh/releases/). Please download and use that latest version.

If you haven't updated `cf-ssh`, you may get this error when you try to use it:

    Initiating tmate connection...success
    ssh: Could not resolve hostname tmate.18f.us: nodename nor servname provided, or not known

That usually means you need to update `cf-ssh` to our latest version.
