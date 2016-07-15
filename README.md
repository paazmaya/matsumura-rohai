# Matsumura Rohai

> Translate strings found in PO files

[![wercker status](https://img.shields.io/wercker/ci/9800cce527c94842b78ad1d4c338f66b.svg?style=flat-square "wercker status")](https://app.wercker.com/project/bykey/9800cce527c94842b78ad1d4c338f66b)
[![Analytics](https://ga-beacon.appspot.com/UA-2643697-15/matsumura-rohai/index?flat)](https://github.com/igrigorik/ga-beacon)

## Background for the project name

The name for this project is honouring one great [bushi, Matsumura
Sokon](http://en.wikipedia.org/wiki/Matsumura_S%C5%8Dkon), who lived
in Okinawa, Japan, and a [Karate Kata](http://en.wikipedia.org/wiki/Karate_kata) named after him.

Matsumura Sokon lived around ~1800 and was one very important contributor
to the local martial art, which we today know as Karate and Ryukyu Kobujutsu.
The kata named after him is called _Matsumura Rohai_, also known
as _Koshiki Rohai_ or _Matsumura no Rohai_, depending on who is writing it.

## Getting started

The project provides a Node.js based server and a front-end for modifying translations.
The back-end makes requests to the Microsoft Translate API and caches the received translations
to a SQLite database.

## Installation

While in Windows, different versions of Visual Studio might be problematic, thus failing `iconv` installation.
With different options to `--msvs_version`, one might succeed. Such options are `auto`, `2010`, `2012` and so forth.

```sh
npm install --msvs_version=2012
```

## Usage

```sh
export MS_TRANSLATE_API_KEY=****
export MS_TRANSLATE_API_SECRET=****
node index.js
```

## Third party tools

* [jQuery](http://jquery.com) taking care of the Ajax
* [Bootstrap](http://getbootstrap.com/) for making things look good by default
* [Microsoft Translate API](http://msdn.microsoft.com/en-us/library/dd576287.aspx) via [mstranslator for node.js](https://github.com/nanek/mstranslator)
* PO and MO file handling via [node-gettext](https://github.com/andris9/node-gettext)
* [Express](http://expressjs.com/) for making pages to route to certain methods
* [Hogan.js](https://github.com/twitter/hogan.js) for rendering client side templates

## Project structure

[![Initial plan sketch](https://raw.github.com/paazmaya/matsumura-rohai/master/initial-plan-thumb.jpg)](https://raw.github.com/paazmaya/matsumura-rohai/master/initial-plan.jpg)

Visualisation of the project dependencies is available at
[paazmaya.github.io/matsumura-rohai](http://paazmaya.github.io/matsumura-rohai/ "Matsumura Rohai visualisation").

## Contributing

[Please refer to a GitHub blog post on how to create somewhat perfect pull request.](https://github.com/blog/1943-how-to-write-the-perfect-pull-request "How to write the perfect pull request")

## License

Copyright (c) [Juga Paazmaya](https://paazmaya.fi) <paazmaya@yahoo.com>

Licensed under the [MIT license](LICENSE).
