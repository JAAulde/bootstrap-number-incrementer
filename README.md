# bootstrap-number-incrementer

A jQuery/Boostrap based widget for use on text and number inputs to turn them into Bootstrap input groups with plus and minus buttons for incrementing and decrementing the input's numeric value.

![screenshot](docs/images/screenshot_1.png)

## dependencies
 * [jquery](https://jquery.com) _1.9.1_ - _3_
 * [bootstrap](https://getbootstrap.com) _~3.3.7_
 * [jaaulde-template-manager](https://github.com/JAAulde/template-manager) _~1.0.0_

## installation
### [bower](http://bower.io)
````bash
bower install bootstrap-number-incrementer
````

### [npm](https://www.npmjs.com)
````bash
npm install bootstrap-number-incrementer
````

### html
Download the code, link it in your HTML file (after [dependencies](#dependencies)).
````html
<script src="/path/to/bootstrap-number-incrementer.js"></script>
````

## usage
###options

|Option|Description|Default|Note|
|:-----|:----------|:------|:---|
|`width_factor`|How to maintain the width of the widget.|`'dynamic'`|`dynamic` changes the width as the length of the input's value changes, and center-aligns the text. `range` sets the width based on the maximum possible length of value (determined by the input's `min` and `max` attributes) and right-aligns the text. Any other value tells the widget to avoid dealing with width (you can control it yourself by CSS or other means).|
|`input_class`|Additional class(es) to add to the input element|`null`|Whitespace separated list|
|`wrapper_class`|Additional class(es) to add to the element that is wrapped around the widget|`null`|Whitespace separated list|
|`incrementer_class`|Additional class(es) to add to the increment (+) button|`null`|Whitespace separated list|
|`decrementer_class`|Additional class(es) to add to the decrement (-) button|`null`|Whitespace separated list|
