# iCalendar (.ics) File Generator

## Demo
See live demo [here](http://icalgen.yc.sg)!

## Why?
There are numerous iCalendar (.ics) generators already available, but I could not find one that met my needs:
* Most of the existing .ics generators don't support timezones.
* Most of the existing .ics generators don't handle timezones correctly, even if they had some support for it.
* Most of the existing .ics generators that support timezones require the user to convert it to UTC, EST or some other timezone first, manually.
* None of them allowed creating an .ics file directly from the URL. I really wanted this function as I did not like the constant hassle of creating an .ics file, hosting it, and then linking to it.

## And?
The iCalendar generator I made is based entirely on JavaScript and does not require any server-side components. It supports various timezones by storing the date and time in UTC, and you can also generate a link that will automatically generate and download an ICS file.

## External Libraries
This uses a number of other libraries (bower.json shows all of them), key ones being:
* [ics.js](https://github.com/nwcell/ics.js/) - My fork of it (which I am using) is [here](https://github.com/Wysie/ics.js/).
* [moment.js](http://momentjs.com/) and [moment-timezone](http://momentjs.com/timezone/)
* [URI.js](https://github.com/medialize/URI.js)