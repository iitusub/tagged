var tagged = function () {
    //
};

var tags = {
    //
};

var constants = {
    start: '\u001b[',
    sc:    ';',
    end:   'm',
    off:   '\u001b[0m'
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
// [borderLeft] and [borderRight]: string ('' and '')
// [borderStyle]: styleString|'inherit' ('inherit')
// [width]: number (undefined)
// [digits]: number (undefined)
// [base]: number (10)
// [zeros]: true|false (false)
// [plus]: true|false (false)
// [align]: 'left'|'center'|'right' ('left')
// [trim]: true|false (true)
// [overflow]: 'resize'|'hidden'|'ellipsis' ('ellipsis')

tagged.add = function (name, o) {
    o.style = o.style ? tagged.parseStyle(o.style) : tagged.parseStyle('off');
    
    o.borderLeft = o.borderLeft || '';
    o.borderRight = o.borderRight || '';
    o.borderStyle = o.borderStyle || 'inherit';
    o.borderStyle = (o.borderStyle == 'inherit') ? o.style : o.borderStyle;
    
    o.borderLeft = o.borderStyle + o.borderLeft + constants.off;
    o.borderRight = o.borderStyle + o.borderRight + constants.off;
    
    o.base = o.base || 10;
    o.align = o.align || 'left';
    o.trim = (typeof o.trim == 'undefined') ? true : o.trim;
    o.overflow = o.overflow || 'ellipsis';
    
    tags[name] = o;
};

tagged.remove = function (name) {
    // tags[options.name];
};

tagged.fillString = function (l, c) {
    if (l === 0) {
        return '';
    }
    var l2 = l / 2;
    var r = c;

    while (r.length <= l2) {
        r += r;
    }
    
    return r + r.substring(0, l - r.length);
};

tagged.format = function () {
    var formatted = '';
    
    if (arguments.length == 1) {
        if (typeof arguments[0].length !== 'number') {
            var x = arguments[0];
            
            for (var key in x) {
                var tag      = tags[key]
                  , t        = x[key]
                  , negative = false;
                
                if (tag) {
                    formatted += tag.borderLeft;
                    
                    formatted += tag.style;
                    
                    if (typeof t == 'number') {
                        if (t < 0) {
                            negative = true;
                            t = Math.abs(t);
                        }
                        
                        t = t.toString(tag.base);
                        
                        var dot = t.indexOf('.');
                        if ((dot >= 0) && tag.digits)
                            t = t.substr(0, dot + 1 + tag.digits);
                    }
                    
                    t = t.toString();
                    t = tag.trim ? t.trim() : t;
                    
                    var w = t.length, width = tag.width || w;
                    w = (negative || tag.plus) ? w + 1 : w;
                    
                    if ((!tag.zeros) || (tag.align == 'center') || (tag.align == 'left') || (w > width))
                        t = (negative ? '-' : '') + ((tag.plus && !negative) ? '+' : '') + t;
                    
                    console.log(w, width);
                    
                    if (w > width) {
                        if (tag.overflow == 'hidden') {
                            if (tag.align == 'right')
                                t = t.substr(w - width, width);
                            else
                                t = t.substr(0, width);
                        } else if (tag.overflow == 'ellipsis') {
                            if (tag.align == 'right')
                                t = '…' + t.substr(w - width - 1, width - 1);
                            else
                                t = t.substr(0, width - 1) + '…';
                        }
                    } else if (w < width) {
                        var d = width - w
                          , c = tag.zeros ? '0' : ' ';
                        
                        if (tag.align == 'right') {
                            t = tagged.fillString(d, c) + t;
                            if (tag.zeros)
                                t = (negative ? '-' : '') + ((tag.plus && !negative) ? '+' : '') + t;
                        } else if (tag.align == 'center') {
                            var fl, fr;
                            fl = fr = Math.floor(d / 2);
                            if ((fl + fr) != d)
                                fl++;
                            
                            t = tagged.fillString(fr, ' ') + t + tagged.fillString(fl, ' ');
                        } else {
                            t += tagged.fillString(d, ' ');
                        }
                    }
                    
                    formatted += t;
                    
                    
                    formatted += constants.off;
                    
                    formatted += tags[key].borderRight;
                    formatted += '\n';
                } else {
                    formatted += x[key] + '\n';
                }
            }
        } else {
            formatted += tagged.format.apply(null, arguments[0]);
        }
    } else if (arguments.length > 1) {
        for (var i = 0, l = arguments.length; i < l; i++)
            formatted += tagged.format(arguments[i]);
    }
    
    return formatted;
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
