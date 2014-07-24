var tagged = require('../');

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
