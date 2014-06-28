var tagged = function () {
    //
};

var tags = {
    //
};

var constants = {
    start: '\u001b[',
    sc:    ';',
    end:   'm'
};

var ansi = { 'off':         0
           , '0':           0
           , 'unset':       0
           , 'default':     0
           , 'clear':       0
           , 'bold':        1
           , 'b':           1
           , 'bright':      1
           , 'italic':      3
           , 'i':           3
           , 'underline':   4
           , 'u':           4
           , 'blink':       5
           , 'inverse':     7
           , 'hidden':      8
           , 'black':      30
           , 'red':        31
           , 'green':      32
           , 'yellow':     33
           , 'blue':       34
           , 'magenta':    35
           , 'cyan':       36
           , 'white':      37
           , 'bg.black':   40
           , 'bg.red':     41
           , 'bg.green':   42
           , 'bg.yellow':  43
           , 'bg.blue':    44
           , 'bg.magenta': 45
           , 'bg.cyan':    46
           , 'bg.white':   47 };

tagged._tags = tags;
tagged._ansi = ansi;

// name: string
// [style]: styleString ('off')
// [left] and [right] parentheses: string ('' and '')
// [border]: styleString|'inherit' ('inherit')
// [width]: number (undefined)
// [precision]: number (undefined)
// [space]: symbol (' ')
// [plus]: true|false (false)
// [align]: 'left'|'center'|'right' ('left')
// [trim]: true|false (true)
// [box]: 'auto'|'fixed'|'overflow' ('fixed') ('a'|'f'|'o', -1|0|1)
// [padding]
// [margin]
tagged.add = function (options) {
    // tags[options.name];
};

tagged.format = function () {
    //
};

tagged.parseColorNumber = function (s) {
    var m = s.match(/(bg\.)?color\((\d{1,3})\)/);
    if (m)
        return (m[1] ? '48;5;' : '38;5;')
             + parseInt(m[2]);
};

tagged.parseHexColor = function (s) {
    var m = s.match(/(bg\.)?hex\(#([\dA-Fa-f]{6})\)/);
    if (m) {
        var rgb = parseInt(m[2], 16)
          , r   = (rgb >> 16) & 0xff
          , g   = (rgb >> 8)  & 0xff
          , b   =  rgb        & 0xff;

        return (m[1] ? '48;2;' : '38;2;')
            + r + ';' + g + ';' + b;
    }
};

/**
 * Parse style string to ansi codes string.
 * @param {string} style
 * @returns {string}
 */
tagged.parseStyle = function (style) {
    style = style || 0;
    style = style + '';

    return constants.start + style.split(',').map(function (x) {
        x = x.trim();
        return tagged.parseHexColor(x) || tagged.parseColorNumber(x) || ansi[x];
    }).join(constants.sc) + constants.end;
};

module.exports = tagged;
