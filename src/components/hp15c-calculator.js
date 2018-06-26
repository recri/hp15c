/*
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at 
https://github.com/recri/calculator/blob/master/LICENSE.txt.
*/
import { html, svg } from 'lit-html/lib/lit-extended.js'
import { PageViewElement } from './page-view-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { key, init } from './common/hp15c.js';

import { 
    hpUser, hpShift, hpTrigmode, hpComplex, hpProgram, hpNeg,
    hpDigits, hpDecimals, hpDigit, hpDecimal
} from '../actions/hp15c.js';

var hotkeys = {};		// built in first constructor

const KeyCap = (label, hotkey, alabel, hlabel) => {
    if (typeof label !== 'string') {
	console.log(`label is not a string: {${label}, ${hotkey}, ${alabel}, ${hlabel}}`);
    } else if (label === '') {
	/* ignore, it's a dummy */ 
    } else {
	if ( ! hlabel)
	    hlabel = label;
	if ( ! alabel) 
	    console.log(`no alabel for ${label}`);
	if ( hotkey ) {
	    if (typeof hotkey !== 'string') 
		console.log(`hotkey is not a string: {${label}, ${hotkey}, ${alabel}, ${hlabel}}`);
	}
    }
    return ({ label, hotkey, alabel, hlabel });
}

const KeyCaps = (n, f, g) => ({ n, f, g });

const keypad = [ [ // row 0
    KeyCaps(KeyCap('x^.5',	'q',	'square root of x', html`√<i>x</i>`),
	    KeyCap('A',		'A',	'program or matrix label'),
	    KeyCap('x^2',	'@',	'x squared', html`<i>x</i><sup>2</sup>`)),
    KeyCaps(KeyCap('e^x',	'E',	'e raised to the x power', html`<i>e</i><sup><i>x</i><sup>`),
	    KeyCap('B',		'B',	'program or matrix label'),
	    KeyCap('LN',	null,	'natural logarithm of x')),
    KeyCaps(KeyCap('10^x',	')',	'ten raised to the x power', html`10<sup><i>x</i></sup>`),
	    KeyCap('C',		'C',	'program or matrix label'),
	    KeyCap('LOG',	null,	'logarithm to the base ten of x')),
    KeyCaps(KeyCap('y^x',	'^',	'y raised to the x power', html`<i>y</i><sup><i>x</i></sup>`),
	    KeyCap('D',		'D',	'program or matrix label'),
	    KeyCap('%',		'%',	'x per cent of y')),
    KeyCaps(KeyCap('1/x',	'\\',	'one divided by x', html`1/<i>x</i>`),
	    KeyCap('E',		null,	'program or matrix label'),
	    KeyCap('Δ%',	null,	'per cent change from y to x')),
    KeyCaps(KeyCap('CHS',	'_',	'change sign of x or exponent'),
	    KeyCap('MATRIX',	null,	'matrix operations, prefix'),
	    KeyCap('ABS',	'a',	'absolute value of x')),
    KeyCaps(KeyCap('7',		'7',	'numeral seven'),
	    KeyCap('FIX',	null,	'fixed point numeric display, prefix'),
	    KeyCap('DEG',	null,	'present angular measure in degrees')),
    KeyCaps(KeyCap('8',		'8',	'numeral eight'),
	    KeyCap('SCI',	null,	'scientific numeric display, prefix'),
	    KeyCap('RAD',	null,	'present angular measure in radians')),
    KeyCaps(KeyCap('9',		'9',	'numeral nine'),
	    KeyCap('ENG',	null,	'engineering numeric display, prefix'),
	    KeyCap('GRD',	null,	'present angular measure in grad')),
    KeyCaps(KeyCap('÷',		'/',	'y divided by x'),
	    KeyCap('SOLVE',	null,	'solves for the real root of a function, prefix'),
	    KeyCap('x≤y',	null,	'x less than or equal to y', html`<i>x</i>≤<i>y</i>`))
], [ // row 1
    KeyCaps(KeyCap('SST',	'T',	'single step program'),
	    KeyCap('LBL',	null,	'label program location, prefix'),
	    KeyCap('BST',	null,	'backward step')),
    KeyCaps(KeyCap('GTO',	'G',	'go to label, prefix'),
	    KeyCap('HYP',	null,	'hyperbolic trig, prefix'),
	    KeyCap('HYP^-1',	null,	'inverse hyperbolic trig, prefix', html`HYP<sup>-1</sup>`)),
    KeyCaps(KeyCap('SIN',	's',	'sine of x'),
	    KeyCap('DIM',	null,	'matrix dimension, prefix'),
	    KeyCap('SIN^-1',	null,	'arcsine of x',	html`SIN<sup>-1</sup>`)),
    KeyCaps(KeyCap('COS',	'c',	'cosine of x'),
	    KeyCap('(i)',	null,	'momentarily display imaginary part of x, or indirect indexing'),
	    KeyCap('COS^-1',	null,	'arccosine of x', html`COS<sup>-1</sup>`)),
    KeyCaps(KeyCap('TAN',	't',	'tangent of x'),
	    KeyCap('I',		'I',	'imaginary unit, or index register'),
	    KeyCap('TAN^-1',	null,	'arctangent of x', html`TAN<sup>-1</sup>`)),
    KeyCaps(KeyCap('EEX',	'e',	'enter exponent'),
	    KeyCap('RESULT',	null,	'speciy result matrix, prefix'),
	    KeyCap('π',		'p',	'constant pi')),
    KeyCaps(KeyCap('4',		'4',	'numeral four'),
	    KeyCap('x⇄',	null,	'x exchange with register, prefix'),
	    KeyCap('SF',	null,	'set flag, prefix')),
    KeyCaps(KeyCap('5',		'5',	'numeral five'),
	    KeyCap('DSE',	null,	'decrement and skip if equal to or less than, prefix'),
	    KeyCap('CF',	null,	'clear flag, prefix')),
    KeyCaps(KeyCap('6',		'6',	'numeral six'),
	    KeyCap('ISG',	null,	'increment and skip if greater than, prefix'),
	    KeyCap('F?',	null,	'test flag, prefix')),
    KeyCaps(KeyCap('×',		'*',	'y multiplied by x'),
	    KeyCap('∫_y^x',	null,	'definite integral from y to x, prefix', html`∫<sub><i>y</i></sub><sup><i>x</i></sup>`),
	    KeyCap('x=0',	null,	'x greater than or equal to zero', html`<i>x</i>=0`))
], [ // row 2
    KeyCaps(KeyCap('R/S',	'P',	'run or stop program'),
	    KeyCap('PSE',	null,	'pause program'),
	    KeyCap('P/R',	null,	'enter or run program')),
    KeyCaps(KeyCap('GSB',	'U',	'go to subroutine, prefix'),
	    KeyCap('∑',		null,	'clear summation'),
	    KeyCap('RTN',	null,	'return from subroutine')),
    KeyCaps(KeyCap('R↓',	'r',	'roll stack down'),
	    KeyCap('PRGM',	null,	'clear program'),
	    KeyCap('R↑',	null,	'roll stack up')),
    KeyCaps(KeyCap('x⇄y',	'x',	'x exchange y', html`<i>x</i>⇄<i>y</i>`),
	    KeyCap('REG',	null,	'clear register, prefix'),
	    KeyCap('RND',	null,	'round to current display format precision')),
    KeyCaps(KeyCap('←',		'\b',	'erase last digit entered'),
	    KeyCap('PREFIX',	null,	'clear prefix'),
	    KeyCap('CLx',	null,	'clear x', html`CL<i>x</i>`)),
    // add back  '\n', ' ' as hotkeys for enter, except not ' ' because keyboard traversal needs it
    KeyCaps(KeyCap('ENTER',	'\r',	'enter x onto stack',	html`<span style="line-height:1">E<br>N<br>T<br>E<br>R</span>`),
	    KeyCap('RAN#',	'\x12',	'random number'),
	    KeyCap('LSTx',	'L',	'last x entered', html`LST<i>x</i>`)),
    KeyCaps(KeyCap('1',		'1',	'numeral one'),
	    KeyCap('→R',	null,	'convert x and y into rectangular'),
	    KeyCap('→P',	null,	'convert x and y into polar')),
    KeyCaps(KeyCap('2',		'2',	'numeral two'),
	    KeyCap('→H.MS',	null,	'convert x.fraction into x.mmss (minutes and seconds)'),
	    KeyCap('→H',	null,	'convert x.mmss (minutes and seconds )into x.fraction')),
    KeyCaps(KeyCap('3',		'3',	'numeral 3'),
	    KeyCap('→RAD',	null,	'convert x into radians'),
	    KeyCap('→DEG',	null,	'convert x into degrees')),
    KeyCaps(KeyCap('-',		'-',	'subtract x from y'),
	    KeyCap('Re⇄Im',	null,	'real exchange imaginary'),
	    KeyCap('TEST',	null,	'conditional test on x, prefix'))
], [ // row 3
    KeyCaps(KeyCap('ON',	'\x1b',	'power on or off')),
    KeyCaps(KeyCap('f',		'f',	'access gold functions, prefix')),
    KeyCaps(KeyCap('g',		'g',	'access blue functions, prefix')),
    KeyCaps(KeyCap('STO',	'S',	'store x into a register, prefix'),
	    KeyCap('FRAC',	null,	'fractional part of x'),
	    KeyCap('INT',	'i',	'integer part of x')), 
    KeyCaps(KeyCap('RCL',	'R',	'recall x from a register, prefix'),
	    KeyCap('USER',	null,	'user mode'),
	    KeyCap('MEM',	null,	'memory status')),
    KeyCaps(KeyCap('',		null,	'button covered by ENTER, should not be seen')),
    KeyCaps(KeyCap('0',		'0',	'numeral zero'),
	    KeyCap('x!',	'!',	'factorial of x', html`<i>x</i>!`),
	    KeyCap('x̄',		null,	'compute mean of x and y values accumulated for summation', html`<i>x̄</i>`)),
    KeyCaps(KeyCap('.',		'.',	'decimal point'),
	    KeyCap('ŷ,r',	null,	"compute linear estimate and correlation coefficient"),
	    KeyCap('s',		null,	'compute sample standard deviations of x and y accumulated for summation')),
    KeyCaps(KeyCap('∑+',	';',	'add x and y to the summation'),
	    KeyCap('L.R.',	null,	'compute linear regression of x and y accumulated for summation'),
	    KeyCap('∑-',	null,	'remove x and y from summation')),
    KeyCaps(KeyCap('+',		'+',	'add y and x'),
	    KeyCap('Py,x',	null,	'permutations, number of possible arrangements of y items taken x at a time', html`P<i>y,x</i>`),
	    KeyCap('Cy,x',	null,	'combinations, number of possible sets of y items taken x at a time', html`<i>Cy,x</i>`))
] ];

const _ignore = (e) => false;	// dummy event handler

export class HP15CCalculator extends connect(store)(GestureEventListeners(PageViewElement)) {
    /* hack to get GestureEventListeners activated */
    constructor() {
	super();
	Gestures.addListener(this, 'tap', _ignore);
	Gestures.addListener(this, 'down', _ignore);
	Gestures.addListener(this, 'up', _ignore);
	// map the hotkeys to the appropriate functions
	// and set up the emitted codes for each kay
	this.hotkey = {};
	keypad.forEach(ai => ai.forEach(aij => ['n', 'f', 'g'].forEach(k => {
	    if (aij[k]) {
		if (aij[k].hotkey) {
		    if (typeof aij[k].hotkey === 'string')
			this.hotkey[aij[k].hotkey] = aij[k];
		    else {
			aij[k].hotkey.forEach(key => this.hotkey[key] = aij[k]);
			aij[k].hotkey = aij[k].hotkey[0];
		    }
		    // the first hotkey is the primary code for the key
		    aij[k].emit = aij[k].hotkey
		} else {
		    // keys without dedicated hotkeys
		    // are activated by the shifted primary code
		    aij[k].emit = aij.n.emit;
		}
	    }
	    
	})));
	// initialize properties, mostly overwritten by redux
	this._shift = 'f';	// want to light up both, ah well
	this._complex = true;
	this._trigmode = 'GRAD';
	this._prgm = true;
	this._user = true;
	this._neg = '-';
	this._digits =   ['8','8','8','8','8','8','8','8','8','8'];
	this._decimals = [',',',',',',',',',',',',',',',',',',','];

	// initialize other local values
	this.shouldRenderCount = 0;
	
	// arrange to get some more work done later
	this.renderComplete.then(() => {
	    /* arrange to monitor focus, keyboard, and touch events for everyone */
	    this.shadowRoot.addEventListener('focus', e => this._onFocus(e), true);
	    this.shadowRoot.addEventListener('blur', e => this._onBlur(e), true);
	    this.shadowRoot.addEventListener('keydown', e => this._onDown(e));
	    // this.shadowRoot.addEventListener('tap', e => this._onTap(e));
	    /* hp15c related start up */
	    init(this);
	});
    }
    disconnectedCallback() {
	super.disconnectedCallback();
	Gestures.removeListener(this, 'tap', _ignore);
	Gestures.removeListener(this, 'down', _ignore);
	Gestures.removeListener(this, 'up', _ignore);
    }
    static get properties() {
	return {
	    _user: Boolean,
	    _shift: String,
	    _trigmode: String,
	    _complex: Boolean,
	    _program: Boolean,
	    _neg: String,
	    _digits: Array,
	    _decimals: Array,
	}
    }
    _updateIndicator(sel, on) {
	if (this.shadowRoot) {
	    // console.log(`_updateIndicator(${sel}, ${on})`);
	    const ind = this.shadowRoot.querySelector(sel);
	    if (ind) {
		// console.log(`found ${ind.tagName} ${ind.className}`);
		ind.style.display = on ? 'inline' : 'none';
	    }
	}
    }
    _updateShift(shift) {
	if (this.shadowRoot) {
	    // console.log(`updateShift('${shift}')`);
	    const indf = this.shadowRoot.querySelector('.indicator .fshift');
	    const indg = this.shadowRoot.querySelector('.indicator .gshift');
	    const clab = this.shadowRoot.querySelectorAll('.clearlabel');
	    const fshb = this.shadowRoot.querySelectorAll('.btn.fshift');
	    const gshb = this.shadowRoot.querySelectorAll('.btn.gshift');
	    const nshb = this.shadowRoot.querySelectorAll('.btn.nshift');
	    const [indf_d, indg_d, clab_d, fshb_d, gshb_d, nshb_d] =
		  shift === 'f' ? [ 'inline', 'none', 'block', 'table-cell', 'none', 'none' ] :
		  shift === 'g' ? [ 'none', 'inline', 'none', 'none', 'table-cell', 'none' ] :
		  [ 'none', 'none', 'none', 'none', 'none', 'table-cell' ];
	    if (indf) indf.style.display = indf_d;
	    if (indg) indg.style.display = indg_d;
	    if (clab) clab.forEach(b => b.style.display = clab_d);
	    if (fshb) fshb.forEach(b => b.style.display = fshb_d);
	    if (gshb) gshb.forEach(b => b.style.display = gshb_d);
	    if (nshb) nshb.forEach(b => b.style.display = nshb_d);
	}
    }
    _updateTrigmode(mode) {
	if (this.shadowRoot) {
	    // console.log(`updateTrigmode('${mode}')`);
	    const rad = this.shadowRoot.querySelector('.rad');
	    const grad = this.shadowRoot.querySelector('.grad');
	    const [rad_display, grad_display] = 
		  mode === 'RAD' ? ['inline','none'] :
		  mode === 'GRAD' ? ['none','inline'] :
		  ['none','none'];
	    if (rad) rad.style.display = rad_display;
	    if (grad) grad.style.display = grad_display;
	}
    }
    _updateNeg(neg) {
	if (this.shadowRoot) {
	    // console.log(`updateNeg('${neg}')`);
	    const sign = this.shadowRoot.querySelector('.neg');
	    if (sign) {
		// console.log(`found neg ${sign.tagName} ${sign.className}`);
		sign.setAttribute('visibility', neg === '-' ? 'visible' : 'hidden');
	    }
	}
    }
    _updateDigit(i, digit) {
	// compute a list of lit and unlit segments for a given digit/letter/space 
	const digits = [
	    [' _ ','   ',' _ ',' _ ','   ',' _ ',' _ ',' _ ',' _ ',' _ ','   ',' _ ','   ',' _ ','   ',' _ ','   ','   ','   ','   '],
	    ['| |','  |',' _|',' _|','|_|','|_ ','|_ ','  |','|_|','|_|',' _ ','|_|','|_ ','|  ',' _|','|_ ',' _ ',' _ ','|_|','   '],
	    ['|_|','  |','|_ ',' _|','  |',' _|','|_|','  |','|_|',' _|','   ','| |','|_|','|_ ','|_|','|_ ','|_|','|  ','   ','   '],
	]
	const digit_segments = (d) => {
	    // a digit, or a letter, or a space
	    let i = "0123456789-ABCDEoru ".indexOf(d);
	    if (i < 0) {
		console.log(`bad argument to digit_segments ${d}`);
		return null;
	    }
	    return [ digits[0][i][1] === '_',
		     digits[1][i][0] === '|',
		     digits[1][i][2] === '|',
		     digits[1][i][1] === '_',
		     digits[2][i][0] === '|',
		     digits[2][i][2] === '|',
		     digits[2][i][1] === '_' ];
	}
	
	if (this.shadowRoot) {
	    // console.log(`updateDigit(${i}, '${digit}')`);
	    const lit = digit_segments(digit)
	    if (lit) {
		const dig = this.shadowRoot.querySelector(`#dig${i}`)
		if (dig) {
		    // console.log('found #dig${i}');
		    let i = 0;
		    for (let e = dig.firstElementChild; e; e = e.nextElementSibling) {
			// console.log(`found ${e.tagName} ${e.className.baseVal}`)
			e.setAttribute('visibility', lit[i] ? 'visible' : 'hidden');
			i += 1;
		    }
		}
	    }
	}
    }
    _updateDecimal(i, decimal) {
	if (this.shadowRoot) {
	    // console.log(`updateDecimal(${i}, '${decimal}')`);
	    const dec = this.shadowRoot.getElementById(`dec${i}`)
	    if (dec) {
		// console.log(`found decimal[${i}] ${dec.tagName}`)
		const c = dec.firstElementChild;
		if (c) {
		    // console.log(`first child ${c.tagName} ${c.className}`)
		    const s = c.nextElementSibling
		    if (s) {
			// console.log(`sibling ${s.tagName} ${s.className}`);
			c.style.display = decimal !== ' ' ? 'inline' : 'none';
			s.style.display = decimal === ',' ? 'inline' : 'none';
			// console.log(`updateDecimal(${i}, '${decimal}') is done`);
		    }
		}
	    }
	}
    }
    _stateChanged(state) {
	if (this._user !== state.hp15c.user)
	    this._updateIndicator('.user', this._user = state.hp15c.user);
	if (this._shift !== state.hp15c.shift)
	    this._updateShift(this._shift = state.hp15c.shift);
	if (this._trigmode !== state.hp15c.trigmode)
	    this._updateTrigmode(this._trigmode = state.hp15c.trigmode);
	if (this._complex !== state.hp15c.complex)
	    this._updateIndicator(".complex", this._complex = state.hp15c.complex)
	if (this._program !== state.hp15c.program)
	    this._updateIndicator(".program", this._program = state.hp15c.program);
	if (this._neg !== state.hp15c.neg)
	    this._updateNeg(this._neg = state.hp15c.neg);
	if (this._digits !== state.hp15c.digits) {
	    if (state.hp15c.digits && this._digits)
		state.hp15c.digits.forEach((d,i) => d !== this._digits[i] ? this._updateDigit(i, d) : true);
	    else if (state.hp15c.digits)
		state.hp15c.digits.forEach((d,i) => this._updateDigit(i, d));
	    this._digits = state.hp15c.digits;
	}
	if (this._decimals != state.hp15c.decimals) {
	    if (state.hp15c.decimals && this._decimals)
		state.hp15c.decimals.forEach((d,i) => d != this._decimals[i] ? this._updateDecimal(i, d) : true);
	    else if (state.hp15c.decimals)
		state.hp15c.decimals.forEach((d,i) => this._updateDecimal(i, d))
	    this._decimals = state.hp15c.decimals;
	}
    }
    _render(props) {
	// sign, numbers, decimal points, and commas
	// all segments are generated once in svg
	// visibility is modified in stateChanged
	// when the values change
	const numeric_display = () => {
	    const width = 11*27, height = 34;
	    const digit_top = 0, decimal_top = 24;
	    const digit_left = (i) => 17+i*27, decimal_left = (i) => 36+i*27;
	    const digit_and_decimal = (i) => {
		return svg`<g id$="dig${i}" transform$="translate(${digit_left(i)} ${digit_top})">
			     <path class="s0" d="M 3 1 L 17 1 13 5 7 5 Z" />
			     <path class="s1" d="M 2 3 L 6 7 6 10 2 14 Z" />
			     <path class="s2" d="M 18 3 L 18 14 14 10 14 7 Z" />
			     <path class="s3" d="M 6.5 12.5 L 13.5 12.5 16 14.5 13.5 16.5 6.5 16.5 4 14.5 Z" />
			     <path class="s4" d="M 2 15 L 6 19 6 22 2 26 Z" />
			     <path class="s5" d="M 18 15 L 18 26 14 22 14 19 Z" />
			     <path class="s6" d="M 3 28 L 17 28 13 24 7 24 Z" />
			   </g>
			   <g id$="dec${i}" transform$="translate(${decimal_left(i)} ${decimal_top})">
			     <rect class="s0" x="2" width="4" height="4" />
			     <path class="s1" d="M 2 6 L 6 6 1 9 0 9" />
			   </g>`;
	    }
	    return html`<svg id="digits" viewBox="0 0 287 34">
			  <g transform="skewX(-5)">
			    <path class="neg" d="M 4 13 L 16 13 16 16 4 16 Z" />
			    ${[0,1,2,3,4,5,6,7,8,9].map((d,i) => digit_and_decimal(i))}
			  </g>
			</svg>`;
	}

	// generate keypad
	const span = (aijk,i,j,k) => {
	    if (! aijk) return html``;
	    var {alabel, hlabel} = aijk;
	    const kclass = k ? `${k}shift` : '';
	    return alabel ?
		html`<span aijk=${aijk} class$="btn ${kclass}" aria-label$="${alabel}" role="button" tabindex="0">${hlabel}</span>` :
		html`<span aijk=${aijk} class$="btn ${kclass}" role="button" tabindex="0">${hlabel}</span>` ;
	}
	const button = (r,c,side,k) => 
	      k.f && k.g ?
	      html`
		<div class$="col ${side} col-${c}" on-tap=${_ => this._onEmit(k.n)}>
		  <div class="in-col">${['n','f','g'].map(t => span(k[t],r,c,t))}</div>
		</div>` :
	      html`
		<div class$="col ${side} col-${c}" on-tap=${_ => this._onEmit(k.n)}>
		  <div class="in-col">${span(k.n,r,c,false)}</div>
		</div>`;
	const rowGenerate = (row, cols, side) =>
	      html`<div class$="row ${side} row-${row}">${cols.map(col => button(row,col,side,keypad[row][col]))}</div>`;

	// console.log('render called')
	return html`
<style>
  :host {
    --key-bezel-background:#322;
    --key-border-color:#aaa;
    --lcd-bezel-background:#f7f7f7;
    --lcd-panel-background:#878777;
    --lcd-panel-color:#456;
    --fshift-color: #c58720; /* goldenrod?; */
    --gshift-color: #479ea5; /* lightblue?; */
    --key-cap-color: #fff;
    --key-cap-background: #302b31;
  }
  .calc { 
    position:relative; 
    width:100%; /* 640px; */
    height:100vh; /* 400px; */
    background-color:var(--key-bezel-background);
  }
  .bezel {
    position:absolute;
    top: 1.25%;
    left: 3.3%;
    width: 93.4%;
    height: 27.5%;
    background-color:var(--lcd-bezel-background);
  }
  .slot {
    position:absolute;
    top:0;
    left:0;
    height:100%;
  }
  .lcd {
    position:absolute;
    top:25.4%;left:15.5%;height:56%;width:50%;
    background-color:var(--lcd-panel-background);
  }
  .lcd svg { fill:var(--lcd-panel-color); }
  .digit {
    position:absolute;
    top:5%;left:0;width:100%;
  }
  .indicator {
    position:absolute;
    top:65%;
    left:0;
    width:100%;
    height:25%;
    font-size:16px;		/* at 640px overall width */
    background-color:transparent;
    color:var(--lcd-panel-color);
  }
  .indicator .user { position:absolute; top:0; left:11%; display:none; }
  .indicator .fshift { position:absolute; top:0; left:24.6%; display:none; }
  .indicator .gshift { position:absolute; top:0; left:31.5%; display:none; }
  .indicator .rad { position:absolute; top:0; left:58%; display:none; }
  .indicator .grad { position:absolute; top:0; left:55%; display:none; }
  .indicator .complex { position:absolute; top:0; left:79.4%; display:none; }
  .indicator .program { position:absolute; top:0; left:86.3%; display:none; }
  .keypad {
    position:absolute;
    top:30%;
    left:3.3%;
    height:65%;
    width:91.7%;
    border-style:solid;
    border-width:3px 5px 10px 5px;
    border-color:var(--key-border-color);
  }
  /* keypad */
  div.kpd { /* .cwbsc */
    position: absolute;
    top:0;
    left:0;
    height:100%;    
    width:100%;
    background-color: black;
  }
  /* left and right sides of keypad */
  div.side {
    display: inline-block;
    height:100%;
    overflow:hidden;
    position:absolute;
  }
  div.lft.side { width:50%; left:0; }
  div.rgt.side { width:50%; left:50%; }
  div.btm.side { height:50%; top:50%; }
  /* rows */
  /* N rows changes this height% */
  div.row { display: block; height: 25%; position: relative; }
  /* columns and cells */
  div.col { display: inline-block; height:100%; width:20%; position: absolute; vertical-align: bottom; }
  /* inner column */
  div.in-col {
    width: 84%;
    height: 68%;
    top: 16%;
    -moz-border-radius: 1px;
    -webkit-border-radius: 1px;
    border-radius: 1px;
    cursor: pointer;
    display: table;
    margin: 0% 6%;
    padding: 0;
    position: relative;
    text-align: center;
  }
  div.col:hover div.in-col { /* .cwbd:hover .cwdgb-tpl */
    -moz-box-shadow:0 1px 1px rgba(0,0,0,0.1);
    -webkit-box-shadow:0 1px 1px rgba(0,0,0,0.1);
    box-shadow:0 1px 1px rgba(0,0,0,0.1);
    background-image:-moz-linear-gradient(top,#d9d9d9,#d0d0d0);
    background-image:-ms-linear-gradient(top,#d9d9d9,#d0d0d0);
    filter:progid:DXImageTransform.Microsoft.gradient(startColorStr=#d9d9d9,EndColorStr=#d0d0d0);
    background-image:-o-linear-gradient(top,#d9d9d9,#d0d0d0);
    background-image:-webkit-gradient(linear,left top,left bottom,from(#d9d9d9),to(#d0d0d0));
    background-image:-webkit-linear-gradient(top,#d9d9d9,#d0d0d0);
    background-color:#d9d9d9;
    background-image:linear-gradient(top,#d9d9d9,#d0d0d0);
    border:1px solid #b6b6b6;
    color:#222
  }
  span.btn { /* cwbts cwbg1|cwbg2 */
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    display: table-cell;
    vertical-align: middle;
  }
  span.btn.nshfit { display:table-cell }
  span.btn.fshift { display:none }
  span.btn.gshift { display:none }

  /* N columns changes these left% */
  div.col-0 { left: 0%; }
  div.col-1 { left:20%; }
  div.col-2 { left:40%; }
  div.col-3 { left:60%; }
  div.col-4 { left:80%; }
  div.col-5 { left: 0%; }
  div.col-6 { left:20%; }
  div.col-7 { left:40%; }
  div.col-8 { left:60%; }
  div.col-9 { left:80%; }

  /* unshifted button labels */
  div.in-col span { 
    background-color: var(--key-cap-background);
    color: var(--key-cap-color);
    font-size: 14px;
  }

  /* f shifted button labels */
  div.in-col span.fshift { 
    color: var(--fshift-color);
    font-size: 13px
  }

  /* g shifted button labels */
  div.in-col span.gshift { 
    color: var(--gshift-color);
    font-size: 13px
  }

  /* last chance to override */

  /* f shift key */
  .row.row-3 .col.col-1 .in-col span {
    background-color: var(--fshift-color);
    color: black;
  }

  /* g shift key */
  .row.row-3 .col.col-2 .in-col span {
    background-color: var(--gshift-color);
    color: black;
  }

  /* ENTER key */
  .row.row-2 .col.col-5 {
    height:200%;
  }
  .row.row-2 .col.col-5 .in-col {
    height: 84%;
    top: 8%;
    z-index: 2;	// move above the row that gets built later
  }
  .row.row-2 .col.col-5 div.in-col span.btn.nshift {
/* this appears to be completely screwed
   remedied by writing ENTER as 'ENTER'.split('').join('<br>')
    writing-mode: vertical-lr;
    -webkit-writing-mode: vertical-lr;
    -ms-writing-mode: vertical-lr;
    text-orientation: upright; */
  }
  .row.row-3 .col.col-5 { /* button beneath ENTER */
    display:none
  }

  div.clearlabel {
    position:absolute;
    left:20%;
    top:47.5%;
    width:80%;
    height:5%;
    color:var(--fshift-color);
    background-color:var(--key-bezel-color);
    font-size:10px;
    display:none;
  }
  div.clearlabel span { 
    display:block-inline;
    position:absolute;
    top:0;
    left:37.5%;
    width:25%;
    text-align:center;
  }
  div.clearlabel svg {
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    stroke:var(--fshift-color);
  }

  /* narrow */
  @media screen and (max-width:459px){
    div.bezel{top:1%;height:18%;}
    div.lcd{top:25%;left:15%;height:50%;width:80%;}
    /* make the lcd occupy more space */
    div.keypad{top:20%;height:75%;}
    div.lft.side{display:none;}
    div.rgt.side{left:0;top:0;width:100%;height:50%;}
    div.btm.side{display:inline-block;left:0;top:50%;width:100%;height:50%;}
  }

  /* wide */
  @media screen and (min-width:460px){
    div.bezel{top:1.25%;height:27.5%}
    div.lcd{top:25%;left:15%;height:50%;width:50%;}
    div.keypad{top:30%;height:65%}
    div.lft.side{display:block-inline;left:0;top:0;width:50%;height:100%;}
    div.rgt.side{left:50%;top:0;width:50%;height:100%}
    div.btm.side{display:none;}
 }
</style>
<section>
  <div class="calc">
    <div class="bezel">
      <div class="slot"><slot></slot></div>
      <div class="lcd" id="lcd" tabindex="0">
	<div class="digit">
	  ${numeric_display()}
	</div>
	<div class="indicator">
	  <span class="user">USER</span>
	  <span class="fshift">f</span>
	  <span class="gshift">g</span>
	  <span class="rad"> RAD</span>
	  <span class="grad">GRAD</span>
	  <span class="complex">C</span>
	  <span class="program">PRGM</span>
	</div>
      </div>
    </div>
    <div class="keypad">
      <div class="kpd">
	<div class="lft side">
	  ${[0,1,2,3].map(row => rowGenerate(row,[0,1,2,3,4],'lft'))}
	  <div class="fshift clearlabel">
	    <svg viewBox="0 0 100 20" preserveAspectRatio="none">
	      <polyline stroke-width="2" points="0,20 0,10 37.5,10" />
	      <polyline stroke-width="2" points="62.5,10 100,10 100,20" />
	    </svg>
	    <span>CLEAR</span>
          </div>
	</div>
	<div class="rgt side">
	  ${[0,1,2,3].map(row => rowGenerate(row,[5,6,7,8,9],'rgt'))}
	</div>
	<div class="btm side">
	  ${[0,1,2,3].map(row => rowGenerate(row,[0,1,2,3,4],'btm'))}
	  <div class="fshift clearlabel">
	    <svg viewBox="0 0 100 20" preserveAspectRatio="none">
	      <polyline stroke-width="2" points="0,20 0,10 37.5,10" />
	      <polyline stroke-width="2" points="62.5,10 100,10 100,20" />
	    </svg>
	    <span>CLEAR</span>
          </div>
	</div>

      </div>
    </div>
  </div>
</section>`;
    }

    // before each render, return true to render, false to defer
    _shouldRender(properties, changed, previous) {
	this.shouldRenderCount += 1;
	var render = false;
	for (let p in changed) {
	    switch (p) {
	    case '_neg':
	    case '_digits':
	    case '_decimals':
		render = true;
		continue;
	    case '_shift':
		render = true;
		continue;
	    case '_trigmode':
		render = true;
		continue;
	    case '_user':
	    case '_complex':
	    case '_program':
		render = true;
		continue;
	    case 'active':
		continue;
	    default:
		console.log(`_shouldRender[${this.shouldRenderCount}]: ${p} has changed from ${previous[p]} to ${changed[p]}`)
		continue;
	    }
	}
	return render;
    }
    // after each render, but most especially after the first
    _didRender(properties, changed, previous) {
	if ( ! this.focused) {
	    /* and grab the focus on load, too, whenever. */
	    const lcd = this.shadowRoot.getElementById('lcd');
	    if (lcd) {
		lcd.focus();
		this.focused = true;
	    }
	}
    }
    
    // hp15c Display interface
    clear_digits() { 
	store.dispatch(hpNeg(' '));
	store.dispatch(hpDigits([' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']));
	store.dispatch(hpDecimals([' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']));
    }
    set_neg() { store.dispatch(hpNeg('-')); }
    clear_digit(i) { this.set_digit(i, ' '); }
    set_digit(i, d) { store.dispatch(hpDigit(this._digits, i, d)); }
    set_comma(i) { store.dispatch(hpDecimal(this._decimals, i, ',')); }
    set_decimal(i) { store.dispatch(hpDecimal(this._decimals, i, '.')); } 
    clear_shift() { this.set_shift(' '); }
    set_shift(mode) { store.dispatch(hpShift(mode)); } // mode in ['f', 'g', ' ']
    set_prgm(on) { store.dispatch(hpProgram(on)); } // on in [true, false]
    set_trigmode(mode) { store.dispatch(hpTrigmode(mode)); } // mode in [null, 'RAD', 'GRAD']
    set_user(on) { store.dispatch(hpUser(on)); } // on in [true, false]
    set_complex(on) { store.dispatch(hpComplex(on)); }

    // event listeners
    _onFocus(event) { this._focusee = event.target; }
    _onBlur(event) { this._focusee = null; }
    _onTap(event) { 
	if (event.target.aijk) {
	    this._onEmit(event.target.aijk);
	    event.preventDefault();
	    return;
	}
	switch (event.target.className) {
	case 'calc':
	case 'bezel':
	case 'slot':
	case 'lcd': 
	case 'digit':
	case 'indicator':
	case 'keypad':
	case 'kpd':
	case 'lft side':
	case 'rgt side':
	case 'row lft row-0': case 'row lft row-1': case 'row lft row-2': case 'row lft row-3':
	case 'row rgt row-0': case 'row rgt row-1': case 'row rgt row-2': case 'row rgt row-3':
	    break;
	default:
	    for (let t = event.target; t.parentElement; t = t.parentElement) {
		console.log(`search ${t.tagName} class ${t.className} for aijk`);
		if (t.aijk) {
		    console.log('found aijk on ancestor');
		    this._onEmit(t.aijk);
		    event.preventDefault();
		    return;
		}
	    }
	    for (let t = event.target; t.firstElementChild; t = t.firstElementChild) {
		console.log(`search ${t.tagName} class ${t.className} for aijk`);
		if (t.aijk) {
		    console.log('found aijk on descendent');
		    this._onEmit(t.aijk);
		    event.preventDefault();
		    return;
		}
	    }
	    console.log(`_onTap(${event.target.tagName}.${event.target.className}) has no aijk property`);
	}
    }
    _onDown(event) { 
	/* 
	   don't even get me started, String.fromCharCode(event.which) converts to upper case 
	   on the Lenovo bluetooth keyboard which has upper case key caps, the chromebook
	   has lower case key caps, so it has lower case event.which codes.
	*/
	let key = event.key;
	if (event.altKey || event.metaKey) return false;
	if (event.ctrlKey) {
	    // special dispensation for the ^R random key code
	    if (key !== 'r') return false;
	    key = String.fromCharCode(event.which&0x1f);
	} else if (key.length > 1) {
	    switch (key) {
	    case 'Backspace': key = '\b'; break;
	    case 'Enter': key = '\r'; break;
	    case 'Escape': key = '\x1b'; break;
	    default: return false;
	    }
	}
	// console.log(`_onDown reports ${event.key}, raw=${event.which}, ctrl=${event.ctrlKey}, key=${key} struck`);
	if (key === ' ' && this._focusee.aijk) {
	    // if ' ' and we are focused on a button, fire that button
	    this._onEmit(this._focusee.aijk);
	    event.preventDefault()
	} else if (this.hotkey[key]) {
	    this._onEmit(this.hotkey[key]);
	    event.preventDefault()
	} else {
	    console.log(`_onDown('${event.key}') left to system`);
	}
    }
    
    _onEmit(aijk) {
	// console.log(`_onEmit('${aijk.label}')`);
	if ( ! aijk) {
	    throw new Error("aijk is undefined in emit");
	}
	if ( ! aijk.emit) {
	    throw new Error("aijk.emit is undefined in emit");
	}
	key(aijk.emit);
    }
}

window.customElements.define('hp15c-calculator', HP15CCalculator);
