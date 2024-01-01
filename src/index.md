---
title: My first page
layout: layouts/base.hbs
templateEngineOverride: hbs,md
---
## Cat of the Day

<img src="{{ catpic }}" />

## Blog Posts

{{> postlist}}
