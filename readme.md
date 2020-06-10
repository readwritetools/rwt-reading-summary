







<figure>
	<img src='/img/components/reading-summary/reading-summary-pexels-1555354.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

# Reading Summary

## Display a visitor's reading history


<address>
<img src='/img/rwtools.png' width=80 /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2020-01-20>Jan 20, 2020</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-reading-summary</span> web component is a popup dialog box showing a visitor's reading history, as captured via the <span class=product>rwt-reading-points</span> web component.</td></tr>
</table>

### Motivation

As the user moves from page to page within a website, the <span>
rwt-reading-points</span> component tracks which pages have been visited, what
percentage has been read, and how much time was spent reading each page. This
information is kept in the user's local storage.

The <span>rwt-reading-summary</span> web component displays the
information in summary form.

#### Prerequisites

The <span>rwt-reading-summary</span> web component works in any
browser that supports modern W3C standards. Templates are written using <span>
BLUE</span><span>PHRASE</span> notation, which can be compiled into HTML using the
free <a href='https://hub.readwritetools.com/desktop/rwview.blue'>Read Write View</a>
desktop app. It has no other prerequisites. Distribution and installation are
done with either NPM or via Github.

#### Installation using NPM

If you are familiar with Node.js and the `package.json` file, you'll be
comfortable installing the component just using this command:

```bash
npm install rwt-reading-summary
```

If you are a front-end Web developer with no prior experience with NPM, follow
these general steps:

   * Install <a href='https://nodejs.org'>Node.js/NPM</a>
on your development computer.
   * Create a `package.json` file in the root of your web project using the command:
```bash
npm init
```

   * Download and install the web component using the command:
```bash
npm install rwt-reading-summary
```


Important note: This web component uses Node.js and NPM and `package.json` as a
convenient *distribution and installation* mechanism. The web component itself
does not need them.

#### Installation using Github

If you are more comfortable using Github for installation, follow these steps:

   * Create a directory `node_modules` in the root of your web project.
   * Clone the <span>rwt-reading-summary</span> web component into it
      using the command:
```bash
git clone https://github.com/readwritetools/rwt-reading-summary.git
```


### Using the web component

After installation, you need to add several things to your HTML page to make use
of it.

   * Add a `script` tag to load the component's `rwt-reading-summary.js` file:
```html
<script src='/node_modules/rwt-reading-summary/rwt-reading-summary.js' type=module></script>             
```

   * Add the component tag somewhere on the page.

      * For scripting purposes, apply an `id` attribute.
      * Optionally, apply a `shortcut` attribute with something like `F1`, `F2`, etc. for
         hotkey access.
      * And for WAI-ARIA accessibility apply a `role=contentinfo` attribute.
```html
<rwt-reading-summary id=reading-summary role=contentinfo shortcut=F4></rwt-reading-summary>
```

   * Add a button to allow the visitor to show the dialog. Here the button contains
      the number '0' as its text. This will be replaced with the user's experience
      points when the `rwt-reading-summary-data` event is received.
```html
<a id='reading-summary-button' aria-haspopup='true' aria-controls='reading-summary'>0</a>
```

   * Add a listener to respond to the click event:
```html
<script type=module>
    document.getElementById('reading-summary-button').addEventListener('click', (e) => {
        document.getElementById('reading-summary').toggleDialog(e);
    });
</script>
```

   * Add a listener to capture the `rwt-reading-summary-data` event and show the
      experience points on the summary button:
```html
<script type=module>
    document.addEventListener('rwt-reading-summary-data', (e) => {
        var el = document.getElementById('reading-summary-button');
        el.innerHTML = e.detail.pointsObtained;
        el.title = `Reading Summary: ${e.detail.pagesRead} pages / ${e.detail.readingTime} / ${e.detail.pointsObtained} points / (${e.detail.shortcutKey}) for details`;
    });     
</script>
```


### Customization

#### Dialog size and position

The dialog is absolutely positioned towards the bottom left of the viewport. Its
size may be overridden using CSS by defining new values for the size and
position variables.

```css
rwt-reading-summary {
    --width: 70vw;
    --height: 50vh;
    --bottom: 1rem;
    --left: 1rem;
    --caption-bar-height: 1.5rem;
    --message-height: 1.5rem;
}
```

#### Dialog color scheme

The default color palette for the dialog uses a dark mode theme. You can use CSS
to override the variables' defaults:

```css
rwt-reading-summary {
    --color: var(--white);
    --accent-color1: var(--yellow);
    --accent-color2: var(--js-blue);
    --background: var(--black);
    --accent-background1: var(--medium-black);
    --accent-background2: var(--pure-black);
    --accent-background3: var(--nav-black);
    --accent-background4: var(--black);
}
```

### Event interface

The dialog box can be controlled with its event interface.

The component listens on DOM `document` for `toggle-reading-summary` messages. Upon
receipt it will show or hide the dialog box.

The component listens on DOM `document` for `keydown` messages. If the user presses
the configured shortcut key (<kbd>F1</kbd>, <kbd>F2</kbd>, etc) it will show/hide
the dialog box. The <kbd>Esc</kbd> key closes the dialog box.

The component listens on DOM `document` for `collapse-popup` messages, which are
sent by sibling dialog boxes. Upon receipt it will close itself.

The component listens on DOM `document` for `click` messages. When the user clicks
anywhere outside the dialog box, it closes itself.

### License

The <span>rwt-reading-summary</span> web component is licensed
under the MIT License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

### Availability


<table>
	<tr><td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-reading-summary'>github</a></td></tr>
	<tr><td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-reading-summary'>NPM</a></td></tr>
	<tr><td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/reading-summary.blue'>Read Write Hub</a></td></tr>
</table>

