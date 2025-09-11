---
slug: emulator-blog-post
title: Introducing Local Emulators
authors: [jasonmorais]
tags: [sharethrift]
---

When working on Sharethrift, we discovered the need to have local and emulated versions of some of our needed external services, such as mongodb and authorization, and payment.

To solve this, we incorporated local alternatives built into the project that will be referenced instead when running the project locally. This way we have seemless transitioning between local and deployed builds, so that we can develop without needing to do weird work arounds to run our project.
