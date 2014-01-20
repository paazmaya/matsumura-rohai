# Matsumura Rohai

> Translate stuff

The name for this project is honouring one great [bushi]() who lived in Okinawa, Japan, and a [Karate Kata]() named after him.

Matsumura Sokon lived around 1800 and what is considered one of his contribution of Karate, is a predefined form called Matsumura Rohai, also known as Koshiki Rohai or Matsumura no Rohai, depending on who is writing it.


## Installation

While in Windows, different versions of Visual Studio might be problemativc, thus failing `iconv` installation.
With different options to `--msvs_version`, one might succeed. Such options are `auto`, `2010`, `2012` and so forth.

```sh
npm install --msvs_version=2012
```

## Third party tools

* [Zepto](http://zeptojs.com/) taking care of the Ajax
* [Pure CSS](http://purecss.io/) for making things look good by default
* [Microsoft Translate API](http://msdn.microsoft.com/en-us/library/dd576287.aspx) via [mstranslator for node.js](https://github.com/nanek/mstranslator)
* PO and MO file handling via [node-gettext](https://github.com/andris9/node-gettext)
* [Express](http://expressjs.com/) for making pages to route in certain methods
