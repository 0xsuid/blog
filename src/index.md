---
title: My first page
layout: layouts/base.njk
templateEngineOverride: njk,md
---
## Cat of the Day

<img src="{{ catpic }}" />

## Blog Posts

{% include "postlist.njk" %}
