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
    
    add: function (test) {
        tagged.add('testTag', {
            style: 'red'
        });
        test.deepEqual(tagged._tags.testTag, {
            style: '\u001b[31m',
            borderStyle: '\u001b[31m',
            borderLeft: '',
            borderRight: '',
            base: 10,
            align: 'left',
            trim: true,
            overflow: 'ellipsis'
        });
        
        tagged.add('testTag', {
            style: 'red',
            borderLeft: '[ ',
            borderRight: ' ]',
            borderStyle: 'green',
            width: 8,
            base: 16,
            zeroes: true,
            plus: true,
            align: 'right',
            trim: false,
            overflow: 'visible'
        });
        test.deepEqual(tagged._tags.testTag, {
            style: '\u001b[31m',
            borderStyle: '\u001b[32m',
            borderLeft: '\u001b[32m[ \u001b[0m',
            borderRight: '\u001b[32m ]\u001b[0m',
            width: 8,
            base: 16,
            zeroes: true,
            plus: true,
            align: 'right',
            trim: false,
            overflow: 'visible'
        });
        test.done();
    },
    
    remove: function (test) {
        tagged.add('testTag', {
            style: 'red'
        });
        tagged.remove('testTag');
        test.strictEqual(tagged._tags.testTag, undefined);
        test.done();
    },
    
    format: function (test) {
        // Multiple arguments + undefined tags
        test.equals(tagged.format({ undefinedTag: 'sample text', tag2: 'text2' }, { tag3: 'text3' }, [ { tag4: 'text4' }, { tag5: 'text5' } ]), 'sample text\ntext2\ntext3\ntext4\ntext5\n');
        
        // Borders + style
        tagged.add('borders', {
            style: 'red',
            borderLeft: '[ ',
            borderRight: ' ]'
        });
        test.equals(tagged.format({ borders: 'text' }), '\u001b[31m[ \u001b[0m\u001b[31mtext\u001b[0m\u001b[31m ]\u001b[0m\n');
        
        tagged.add('borderStyle', {
            style: 'red',
            borderStyle: 'green',
            borderLeft: '[ ',
            borderRight: ' ]'
        });
        test.equals(tagged.format({ borderStyle: 'text' }), '\u001b[32m[ \u001b[0m\u001b[31mtext\u001b[0m\u001b[32m ]\u001b[0m\n');
        
        // Align + width
        tagged.add('right', {
            style: 'red',
            align: 'right',
            width: 10
        });
        test.equals(tagged.format({ right: 'text' }), '\u001b[31m      text\u001b[0m\n');
        
        tagged.add('center', {
            style: 'red',
            align: 'center',
            width: 10
        });
        test.equals(tagged.format({ center: 'text' }), '\u001b[31m   text   \u001b[0m\n');
        
        tagged.add('left', {
            style: 'red',
            width: 10
        });
        test.equals(tagged.format({ left: 'text' }), '\u001b[31mtext      \u001b[0m\n');
        
        // Overflow + width
        tagged.add('visible', {
            style: 'red',
            width: 2,
            overflow: 'visible'
        });
        test.equals(tagged.format({ visible: 'text' }), '\u001b[31mtext\u001b[0m\n');
        
        tagged.add('ellipsis', {
            style: 'red',
            width: 2
        });
        test.equals(tagged.format({ ellipsis: 'text' }), '\u001b[31mt…\u001b[0m\n');
        
        tagged.add('hidden', {
            style: 'red',
            width: 2,
            overflow: 'hidden'
        });
        test.equals(tagged.format({ hidden: 'text' }), '\u001b[31mte\u001b[0m\n');
        
        tagged.add('ellipsisRight', {
            style: 'red',
            width: 5,
            align: 'right'
        });
        test.equals(tagged.format({ ellipsisRight: 'big text' }), '\u001b[31m…text\u001b[0m\n');
        
        tagged.add('hiddenRight', {
            style: 'red',
            width: 2,
            overflow: 'hidden',
            align: 'right'
        });
        test.equals(tagged.format({ hiddenRight: 'text' }), '\u001b[31mxt\u001b[0m\n');
        
        // Digits
        tagged.add('base', {
            style: 'red',
            base: 16
        });
        test.equals(tagged.format({ base: 255 }), '\u001b[31mff\u001b[0m\n');
        
        tagged.add('digits', {
            style: 'red',
            digits: 4
        });
        test.equals(tagged.format({ digits: Math.PI }), '\u001b[31m3.1415\u001b[0m\n');
        
        tagged.add('digitsBase', {
            style: 'red',
            base: 16,
            digits: 4
        });
        test.equals(tagged.format({ digitsBase: Math.PI }), '\u001b[31m3.243f\u001b[0m\n');
        
        tagged.add('zeroes', {
            style: 'red',
            width: 4,
            align: 'right',
            zeroes: true
        });
        test.equals(tagged.format({ zeroes: 3 }), '\u001b[31m0003\u001b[0m\n');
        test.equals(tagged.format({ zeroes: -3 }), '\u001b[31m-003\u001b[0m\n');
        
        tagged.add('zeroesPlus', {
            style: 'red',
            width: 4,
            align: 'right',
            zeroes: true,
            plus: true
        });
        test.equals(tagged.format({ zeroesPlus: 3 }), '\u001b[31m+003\u001b[0m\n');
        
        tagged.add('plus', {
            style: 'red',
            plus: true
        });
        test.equals(tagged.format({ plus: 3 }), '\u001b[31m+3\u001b[0m\n');
        test.equals(tagged.format({ plus: -3 }), '\u001b[31m-3\u001b[0m\n');
        
        // Trim
        tagged.add('trim', {
            style: 'red'
        });
        test.equals(tagged.format({ trim: ' \n   text  \n  ' }), '\u001b[31mtext\u001b[0m\n');
        
        tagged.add('noTrim', {
            style: 'red',
            trim: false
        });
        test.equals(tagged.format({ noTrim: ' \n   text  \n  ' }), '\u001b[31m \n   text  \n  \u001b[0m\n');
        
        
        test.done();
    }
};