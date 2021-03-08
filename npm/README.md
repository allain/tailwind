# twbuild

*twbuild* is a tool for building tailwind css at break neck speed.


It wraps a go implementation under the hood ([gotailwindcss](https://github.com/gotailwindcss/tailwind)).

Though it is not yet feature complete, the parts of tailwind that it does support are extremely useful.

The goal is to have feature parity with tailwind but until then the features it currently supports are powerful enough to warrant its use.

## Installation &amp; Usage

```sh
npm install --global twbuild

twbuild build 
```


## Features

The following features are supported:
- `@tailwind`
- `@apply`
- `purging`

These directives are **not yet** supported:

- `@layer`
- `@variants`
- `@responsive`
- `@screen`
- `theme()`



