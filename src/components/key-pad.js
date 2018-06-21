// this table reads out the keypad matrix
// foreach row, foreach column, 
//	the character that hotkey's this row and column position
//	the operator for the primary keycap
//	the operator for the f-shift, orange keycap
//	the operator for the g-shift, blue keycap
// followed by the hotkeys for f- and g- shifted keycaps
/*
var CharTable = {
    // first row: sqrt to /
    'q': [_(OpSqrt), _(OpA), _(OpX2)],
    'E': [_(OpEx), _(OpB), _(OpLn)],
    ')': [_(Op10x), _(OpC), _(OpLog)],
    '^': [_(OpYx), _(OpD), _(OpPct)],
    '\\':[_(Op1x), _(OpE), _(OpDpct)],
    '_': [_(OpChs), decode_matrix, _(OpAbs)],
    '7': [_(Op7), decode_fix, _(OpDeg)],
    '8': [_(Op8), decode_sci, _(OpRad)],
    '9': [_(Op9), decode_eng, _(OpGrd)],
    '/': [_(OpDiv), decode_solve, _(OpLe)],
    // second row: SST to *
    'T': [_(OpSst), decode_lbl, _(OpBst)],
    'G': [decode_gto, decode_hyp, decode_ahyp],
    's': [_(OpSin), decode_dim, _(OpAsin)],
    'c': [_(OpCos), _(OpIndex), _(OpAcos)],
    't': [_(OpTan), _(OpI), _(OpAtan)],
    'e': [_(OpEex), decode_result, _(OpPi)],
    '4': [_(Op4), decode_xchg, decode_sf],
    '5': [_(Op5), decode_dse, decode_cf],
    '6': [_(Op6), decode_isg, decode_ftest],
    '*': [_(OpMul), decode_integrate, _(OpEq)],
    // third row: R/S to -, with one row dup'ed
    'P': [_(OpRs), _(OpPse), _(OpPr)],
    'U': [decode_gsb, _(OpClearStat), _(OpRtn)],
    'r': [_(OpRoll), _(OpClearPrgm), _(OpRollup)],
    'x': [_(OpXy), _(OpClearReg), _(OpRnd)],
    '\b': [_(OpBack), _(OpClearPrefix), _(OpClx)],
    '\r': [_(OpEnter), _(OpRand), _(OpLastx)],
    '\n': [_(OpEnter), _(OpRand), _(OpLastx)],
    '1': [_(Op1), _(OpToR), _(OpToP)],
    '2': [_(Op2), _(OpToHms), _(OpToH)],
    '3': [_(Op3), _(OpToRad), _(OpToDeg)],
    '-': [_(OpSub), _(OpReIm), decode_test],
    // fourth row: on to +
    '\x1b': [_(OpOn), _(OpOn), _(OpOn)],
    'f': [decode_f, decode_f, decode_f],
    'g': [decode_g, decode_g, decode_g],
    'S': [decode_sto, _(OpFrac), _(OpInt)],
    'R': [decode_rcl, _(OpUser), _(OpMem)],
    '0': [_(Op0), _(OpFact), _(OpMean)],
    '.': [_(OpDot), _(OpYhat), _(OpS)],
    ';': [_(OpSum), _(OpLr), _(OpSumsub)],
    '+': [_(OpAdd), _(OpPyx), _(OpCyx)],
    // Now the keys normally f or g shifted, except the first,
    // which is only another alias for the enter key
    ' ': _(OpEnter),
    '!': _(OpFact),
    '@': _(OpX2),
    '%': _(OpPct),
    'A': _(OpA),
    'B': _(OpB),
    'C': _(OpC),
    'D': _(OpD),
    'L': _(OpLastx),
    'a': _(OpAbs),
    'i': _(OpInt),
    'I': _(OpI),
    'l': _(OpLn),
    'p': _(OpPi),
    '\x12': _(OpRand)
};
// now the primary hot keys in keypad order
// well, same order as above but in list rather than
// object so in guaranteed order
var KeyTable = [
    ['q', 'E', ')', '^', '\\','_', '7', '8', '9', '/'],
    ['T', 'G', 's', 'c', 't', 'e', '4', '5', '6', '*'],
    ['P', 'U', 'r', 'x', '\b','\r','1', '2', '3', '-'],
    ['\x1b', 'f', 'g', 'S', 'R', '\r','0', '.', ';', '+']
];
// row, column, ?, key, zero based indexes
// for the surplus keys which directly address shifted operations
var ExtraKeyTable = [
    [3, 6, -1, '!'],
    [0, 0,  1, '@'],
    [0, 3,  1, '%'],
    [0, 0, -1, 'A'],
    [0, 1, -1, 'B'],
    [0, 2, -1, 'C'],
    [0, 3, -1, 'D'],
    [3, 5,  1, 'L'],
    [0, 5,  1, 'a'],
    [3, 3,  1, 'i'],
    [1, 4, -1, 'I'],
    [0, 1,  1, 'l'],
    [1, 5,  1, 'p']
];
*/
const KeyCap = (label, hotkey) =>
      ({ label, hotkey });
const KeyCaps = (n, f, g) =>
      ({ n, f, g }};
const keycaps = [ [
    KeyCaps(KeyCap(html`√<i>x</i>`, 'q'),
	    KeyCap('A', 'A'),
	    KeyCap(html`<i>x</i><sup>2</sup>`, '@')),
    KeyCaps(KeyCap(html`<i>e</i><sup><i>x</i><sup>`,'E'),
	    KeyCap('B','B'),
	    KeyCap('LN',)),
    KeyCaps(KeyCap(html`10<sup><i>x</i></sup>`,')'),
	    KeyCap('C','C'),
	    KeyCap('LOG')),
    KeyCaps(KeyCap(html`<i>y</i><sup><i>x</i></sup>`,'^'),
	    KeyCap('D','D'),
	    KeyCap('%','%')),
    KeyCaps(KeyCap(html`1/<i>x</i>`, '\\'),
	    KeyCap('E'),
	    KeyCap('Δ%')),
    KeyCaps(KeyCap('CHS', '_'),
	    KeyCap('MATRIX'),
	    KeyCap('ABS', 'a')),
    KeyCaps(KeyCap('7', '7'),
	    KeyCap('DEG'),
	    KeyCap('FIX')),
    KeyCaps(KeyCap('8', '8'),
	    KeyCap('SCI'),
	    KeyCap('RAD')),
    KeyCaps(KeyCap('9','9'),
	    KeyCap('ENG'),
	    KeyCap('GRD')),
    KeyCaps(KeyCap('÷', '/'),
	    KeyCap('SOLVE'),
	    KeyCap(html`<i>x</i>≤<i>y</i>`))
], [
    KeyCaps(KeyCap('SST','T'),
	    KeyCap('LBL'),
	    KeyCap('BST')),
    KeyCaps(KeyCap('GTO'),
	    KeyCap('HYP'),
	    KeyCap(html`HYP<sup>-1</sup>`)),
    KeyCaps(KeyCap('SIN', 's'),
	    KeyCap('DIM'),
	    KeyCap(html`SIN<sup>-1</sup>`)),
    KeyCaps(KeyCap('COS', 'c'),
	    KeyCap('(i)'),
	    KeyCap(html`COS<sup>-1</sup>`)),
    KeyCaps(KeyCap('TAN', 't'),
	    KeyCap('I', 'I'),
	    KeyCap(html`TAN<sup>-1</sup>`)),
    KeyCaps(KeyCap('EEX', 'e'),
	    KeyCap('RESULT'),
	    KeyCap('π', 'p')),
    KeyCaps(KeyCap('4', '4'),
	    KeyCap('x↔'),
	    KeyCap('SF')),
    KeyCaps(KeyCap('5','5'),
	    KeyCap('DSE'),
	    KeyCap('CF')),
    KeyCaps(KeyCap('6','6'),
	    KeyCap('ISG'),
	    KeyCap('F?')),
    KeyCaps(KeyCap('×', '*'),
	    KeyCap(html`∫<sup><i>x</i></sup><sub><i>y</i></sub>`),
	    KeyCap(html`<i>x</i>=0`))
], [
    KeyCaps(KeyCap('R/S','P'),
	    KeyCap('PSE'),
	    KeyCap('P/R')),
    KeyCaps(KeyCap('GSB', 'U'),
	    KeyCap(html`∑`),
	    KeyCap('RTN')),
    KeyCaps(KeyCap('R↓', 'r'),
	    KeyCap('PRGM'),
	    KeyCap('R↑')),
    KeyCaps(KeyCap(html`<i>x</i>↔<i>y</i>`, 'c'),
	    KeyCap('REG'),
	    KeyCap('RND')),
    KeyCaps(KeyCap('←', '\b'),
	    KeyCap('PREFIX'),
	    KeyCap(html`CL<i>x</i>`)),
    KeyCaps(KeyCap('ENTER', ['\n', '\r', ' ']),
	    KeyCap('RAN#'),
	    KeyCap(html`LST<i>x</i>`, 'L')),
    KeyCaps(KeyCap('1', '1'),
	    KeyCap('→R'),
	    KeyCap('→P')),
    KeyCaps(KeyCap('2','2'),
	    KeyCap('→H.MS'),
	    KeyCap('→H')),
    KeyCaps(KeyCap('3','3'),
	    KeyCap('→RAD'),
	    KeyCap('→DEG')),
    KeyCaps(KeyCap('-', '-'),
	    KeyCap('Re↔Im'),
	    KeyCap('TEST'))
], [
    KeyCaps(KeyCap('ON','\e')),
    KeyCaps(KeyCap('f', 'f')),
    KeyCaps(KeyCap('g', 'g')),
    KeyCaps(KeyCap('STO', 'S'),
	    KeyCap('FRAC'),
	    KeyCap('INT', 'i')),
    KeyCaps(KeyCap('RCL', 'R'),
	    KeyCap('USER'),
	    KeyCap('MEM')),
    KeyCaps(KeyCap('')),		// descender of ENTER
    KeyCaps(KeyCap('0', '0'),
	    KeyCap(html`<i>x</i>!`, '!'),
	    KeyCap(html`<i>x</i>bar`)),
    KeyCaps(KeyCap('.','.'),
	    KeyCap('yhat,r'),
	    KeyCap('s')),
    KeyCaps(KeyCap(html`∑+`,';'),
	    KeyCap('L.R.'),
	    KeyCap(html`∑-`)),
    KeyCaps(KeyCap('+', '+'),
	    KeyCap(html`P<i>y,x</i>`),
	    KeyCap(html`<i>Cy,x</i>`))
] ];
/*
** pertinent props would be display contents,
** though most of the fidgety stuff could be
** done with css. fshift and gshift would control
** the keycap displayed.
*/
_render(props) {
    const generateCaps = (row, col) =>
	  return html`
<div class="row${row} col${col} cap">
  <span class="n-shift">${keycaps[row][col].n.label}</span>
  <span class="f-shift">${keycaps[row][col].f.label}</span>
  <span class="g-shift">${keycaps[row][col].g.label}</span>
</div>
`;
    const generateStyle = () =>
	  _fshift ? html`<style>.f-shift{display:inline}.g-shift{display:none}.n-shift{display:none}</style` :
	  _gshift ? html`<style>.f-shift{display:none}.g-shift{display:inline}.n-shift{display:none}</style` :
	  html`<style>.f-shift{display:none}.g-shift{display:none}.n-shift{display:inline}</style` ;
    return html`
<style>
  .frame { height: 100%; width: 100% }
  .display { height: 33.3%; width: 100% }
  .leftside, .rightside { height: 66.7%; width: 50% }
  .cap { width: 10%; height: 25% }
</style>
<div class="frame">
  <div class="display"></div>
  <div class="leftside">
    ${repeat([0,1,2,3], row => (repeat([0,1,2,3,4], col => generateCaps(row, col))))}
  </div>
  <div class="rightside">
    ${repeat([0,1,2,3], row => (repeat([5,6,7,8,9], col => generateCaps(row, col))))}
  </div>
</div>
`;
}
