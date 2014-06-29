var tagged = require('../lib/tagged');

module.exports = {
    parseColorNumber: function (test) {
        test.equals(tagged.parseColorNumber('color(128)'), '38;5;128');
        test.equals(tagged.parseColorNumber('bg.color(128)'), '48;5;128');
        test.done();
    },
    
    parseHexColor: function (test) {
        test.equals(tagged.parseHexColor('hex(#0080ff)'), '38;2;0;128;255');
        test.equals(tagged.parseHexColor('bg.hex(#0080ff)'), '48;2;0;128;255');
        test.done();
    },
    
    parseStyle: function (test) {
        test.equals(tagged.parseStyle('hex(#0080ff)'), '\u001b[38;2;0;128;255m');
        test.equals(tagged.parseStyle('bg.hex(#0080ff)'), '\u001b[48;2;0;128;255m');
        test.equals(tagged.parseStyle('bg.color(128)'), '\u001b[48;5;128m');
        test.equals(tagged.parseStyle('color(128)'), '\u001b[38;5;128m');
        test.equals(tagged.parseStyle('bg.color(128), hex(#0080ff)'), '\u001b[48;5;128;38;2;0;128;255m');
        test.equals(tagged.parseStyle('color(128), bg.hex(#0080ff)'), '\u001b[38;5;128;48;2;0;128;255m');
        test.equals(tagged.parseStyle('bg.color(128), red'), '\u001b[48;5;128;31m');
        test.equals(tagged.parseStyle('red, bg.hex(#0080ff)'), '\u001b[31;48;2;0;128;255m');
        test.done();
    },
    
    format: function (test) {
        tagged.add('borders', {
            style: 'red',
            borderLeft: '[ ',
            borderRight: ' ]'
        });
        
        test.equals(tagged.format({ undefinedTag: 'sample text', tag2: 'text2' }, { tag3: 'text3' }, [ { tag4: 'text4' }, { tag5: 'text5' } ]), 'sample text\ntext2\ntext3\ntext4\ntext5\n');
        test.equals(tagged.format({ borders: 'text' }), '\u001b[31m[ \u001b[0m\u001b[31mtext\u001b[0m\u001b[31m ]\u001b[0m\n');
        test.done();
    }
};