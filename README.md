# Matsumura Rohai

> Translate strings found in PO files

The name for this project is honouring one great [bushi, Matsumura 
Sokon](http://en.wikipedia.org/wiki/Matsumura_S%C5%8Dkon), who lived 
in Okinawa, Japan, and a [Karate Kata](http://en.wikipedia.org/wiki/Karate_kata) named after him.

Matsumura Sokon lived around ~1800 and was one very important contributor 
to the local martial art, which we today know as Karate and Ryukyu Kobujutsu.
The kata named after him is called _Matsumura Rohai_, also known 
as _Koshiki Rohai_ or _Matsumura no Rohai_, depending on who is writing it.


## Installation

While in Windows, different versions of Visual Studio might be problemativc, thus failing `iconv` installation.
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

* [Zepto](http://zeptojs.com/) taking care of the Ajax
* [Topcoat](http://topcoat.io) for making things look good by default
* [Microsoft Translate API](http://msdn.microsoft.com/en-us/library/dd576287.aspx) via [mstranslator for node.js](https://github.com/nanek/mstranslator)
* PO and MO file handling via [node-gettext](https://github.com/andris9/node-gettext)
* [Express](http://expressjs.com/) for making pages to route in certain methods
* [Hogan.js](https://github.com/twitter/hogan.js) for rendering client side templates

## Project structure

[![Initial plan sketch](https://raw.github.com/paazmaya/matsumura-rohai/master/initial-plan-thumb.jpg)](https://raw.github.com/paazmaya/matsumura-rohai/master/initial-plan.jpg)


## License

Copyright (c) [Juga Paazmaya](http://paazmaya.com)

Licensed under the [MIT license](https://github.com/paazmaya/matsumura-rohai/blob/master/LICENSE-MIT).
