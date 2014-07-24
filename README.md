# Tagged

Logger for Node.js with styles and inheritance support.

````bash
npm install tagged
````

````javascript
var tagged = require('tagged');

tagged.add('plain',   { trim: false });

tagged.add('em',      { style:  'i',
                        extend: 'plain' });

tagged.add('strong',  { style:  'b',
                        extend: 'plain' });

tagged.add('braces',  { borderStyle: 'none',
                        borderLeft:  '[ ',
                        borderRight: ' ] ',
                        width:        7,
                        align:       'center',
                        extend:      'plain' });

tagged.add('error',   { style:  'red, bright',
                        extend: 'braces' });

tagged.add('warning', { style:  'yellow, bright',
                        extend: 'braces' });

tagged.add('info',    { style:  'blue, bright',
                        extend: 'braces' });

tagged.add('success', { style:  'green, bright',
                        extend: 'braces' });

tagged.add('error2',  { borderRight: ': ' });

var tags = { error:   { error:   'error'  },
             warning: { warning: 'warning' },
             info:    { info:    'info' },
             success: { success: 'success' },
             error2:  { error2:  'my_program' } };

tagged(tags.error,   'Error message');
tagged(tags.warning, 'Some text');
tagged(tags.info,    'Info message 1');
tagged(tags.info,    'Info message 2');
tagged(tags.success, 'Completed');
tagged(tags.error2,  'Error decription');
tagged({ em: 'Some text.\n', plain: 'Some other text.\n', strong: 'Bold text.' });
````

## API

### tagged.add(name, options)

Add style definition.

 *  `string name`            — style name.
 *  `object options`         — style definition.
     *  `string extend`      — parent style name.
     *  `string style`       — style definition string.
     *  `string borderLeft`  — left border string.
     *  `string borderRight` — right border string.
     *  `string borderStyle` — style definition for borders.
     *  `number width`       — number of symbols of resulting string.
     *  `number digits`      — number of digits after comma.
     *  `number radix`       — radix desu.
     *  `boolean zero `      — fill left space with zeros.
     *  `boolean plus`       — add plus sign to positive numbers.
     *  `string align`       — horisontal align (left, center, right).
     *  `boolean trim`       — trim whitespace at start and end of string.
     *  `string overflow`    — overflow style if width is defined and string width greater then defined width (visible, hidden, ellipsis).

#### Style definition string

 *  Colors:
     *  By name: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`.
     *  By code: `color(<0..255>)`. ANSI color code.
     *  By HEX value: `hex(<#rrggbb>)`. CSS-like color.
     *  Background color: `bg.red`, `bg.hex(#0080ff)`.
 *  Font styles:
     *  Bold: `bold`, `b`, `bright`.
     *  Italic: `italic`, `i`.
     *  Underline: `underline`, `u`.
 *  Other:
     *  `blink`;
     *  `inverse`;
     *  `hidden`.
     *  Clear style: `0`, `unset`, `clear`, `off`, `none`, `default`.

Style rules can be combined with comma: `red, bg.hex(#0080ff), u, i`.

### tagged.remove(name)

Remove style definition.

 *  `string name` — style name.

### tagged([<object>|<string>]*)

`<object>` can contain one or more name-value pairs.
Examples: `{ em: 'Some text.\n', plain: 'Some other text.\n', strong: 'Bold text.' }`.
























## TODO

 *  Write tests for `extend` property.




