var tagged = function () {
    var formatted = tagged.format.apply(null, arguments);
    console.log(formatted);
};

var tags = { };

var definitions = { };

var constants = {
    start: '\u001b[',
    sc:    ';',
    end:   'm',
    off:   '\u001b[0m'
};

var ansi = { 'off':         0
           ,  0:            0
           , '0':           0
           , 'unset':       0
           , 'default':     0
           , 'clear':       0
           , 'none':        0
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
// [style]: styleString ('none')
// [borderLeft] and [borderRight]: string ('' and '')
// [borderStyle]: styleString|'inherit' ('inherit')
// [width]: number (undefined)
// [digits]: number (undefined)
// [radix]: number (10)
// [zeros]: true|false (false)
// [plus]: true|false (false)
// [align]: 'left'|'center'|'right' ('left')
// [trim]: true|false (true)
// [overflow]: 'visible'|'hidden'|'ellipsis' ('ellipsis')

tagged.add = function (name, o) {
    definitions[name] = o;
    var ext = o.extend,
        sup = definitions[ext],
        key;
    
    if (ext && sup) {
        for (key in sup)
            o[key] = sup[key];
    }
    
    var t = { };
    for (key in o)
        t[key] = o[key];
    
    // console.log(t);
    
    t.style = t.style ? tagged.parseStyle(t.style) : tagged.parseStyle('none');
    
    t.borderLeft = t.borderLeft || '';
    t.borderRight = t.borderRight || '';
    t.borderStyle = t.borderStyle || 'inherit';
    t.borderStyle = (t.borderStyle == 'inherit') ? t.style : tagged.parseStyle(t.borderStyle);
    
    t.borderLeft  = (t.borderLeft  === '') ? '' : (t.borderStyle + t.borderLeft  + constants.off);
    t.borderRight = (t.borderRight === '') ? '' : (t.borderStyle + t.borderRight + constants.off);
    
    t.radix = t.radix || 10;
    t.align = t.align || 'left';
    t.trim = (typeof t.trim === 'undefined') ? true : t.trim;
    t.overflow = t.overflow || 'ellipsis';
    
    tags[name] = t;
};

tagged.remove = function (name) {
    delete tags[name];
    delete definitions[name];
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
            
            if ((typeof x == 'string') || (typeof x == 'number') || (typeof x == 'boolean'))
                formatted += x + '\n';
            
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
                        
                        t = t.toString(tag.radix);
                        
                        var dot = t.indexOf('.');
                        if ((dot >= 0) && tag.digits)
                            t = t.substr(0, dot + 1 + tag.digits);
                    }
                    
                    t = t.toString();
                    t = tag.trim ? t.trim() : t;
                    
                    var w = t.length, width;
                    w = (negative || tag.plus) ? w + 1 : w;
                    width = tag.width || w;
                    
                    if ((!tag.zeros) || (tag.align == 'center') || (tag.align == 'left') || (w > width))
                        t = (negative ? '-' : '') + ((tag.plus && !negative) ? '+' : '') + t;
                    
                    if (w > width) {
                        if (tag.overflow == 'hidden') {
                            if (tag.align == 'right')
                                t = t.substr(w - width, width);
                            else
                                t = t.substr(0, width);
                        } else if (tag.overflow == 'ellipsis') {
                            if (tag.align == 'right')
                                t = '…' + t.substr(w - (width - 1), width - 1);
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
                } else {
                    formatted += x[key];
                }
            }
        } else {
            if (typeof arguments[0] == 'string')
                formatted += arguments[0];
            else
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
