# tablemate-js

**Note: This jQuery library is in Alpha, the API may change without notice.**

*Allow any old table work on a mobile device!*

## How does it work?

At the core of Tablemate is an analysis system which iterates over every cell in the table. The default analyser picks up basic things like the type of cell (TD or TH), whether the cell is nested inside a THEAD and some basic styling rules.

While this takes a basic look at the table, a second level of analysis is performed looking more carefully for specific patterns in the data. All of this information is stored against the table for later use.

When the table can no longer fit within it's parent element, Tablemate starts to go to work with updating how the table renders, allowing it to resize with it's parent. This is only a temporary step as wide tables can only shrink so much by this method before they need to be changed completely.

When the table can not get any smaller, Tablemate uses the information from the analysis to work out the best renderer for displaying the data and executes it. The result is a mobile-friendly structure while maintaining the data as presented in the table.

## Table Support

Currently, Tablemate supports:

* Cross Tabulation / Advanced Cross Tabulation
* Heading/Data Pairs

Planned:

* Support for more common table layouts (eg. just headings across the top, just headings down the left-most column)


## Extendability

Tablemate works in such a way that you can add new analysis methods and renderers. The API is not stable enough for documentation yet however it will come soon!
