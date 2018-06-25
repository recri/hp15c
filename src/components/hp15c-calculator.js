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

import { SharedStyles } from './shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { key, init } from './common/hp15c.js';

import { 
    hpUser, hpShift, hpTrigmode, hpComplex, hpProgram, hpNeg,
    hpDigits, hpDecimals, hpDigit, hpDecimal
} from '../actions/hp15c.js';

const KeyCap = (label, hotkey) => ({ label, hotkey });

const KeyCaps = (n, f, g) => ({ n, f, g });

const keypad = [ [ // row 0
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
	    KeyCap('FIX'),
	    KeyCap('DEG')),
    KeyCaps(KeyCap('8', '8'),
	    KeyCap('SCI'),
	    KeyCap('RAD')),
    KeyCaps(KeyCap('9','9'),
	    KeyCap('ENG'),
	    KeyCap('GRD')),
    KeyCaps(KeyCap('÷', '/'),
	    KeyCap('SOLVE'),
	    KeyCap(html`<i>x</i>≤<i>y</i>`))
], [ // row 1
    KeyCaps(KeyCap('SST','T'),
	    KeyCap('LBL'),
	    KeyCap('BST')),
    KeyCaps(KeyCap('GTO','G'),
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
	    KeyCap('x⮀'),
	    KeyCap('SF')),
    KeyCaps(KeyCap('5','5'),
	    KeyCap('DSE'),
	    KeyCap('CF')),
    KeyCaps(KeyCap('6','6'),
	    KeyCap('ISG'),
	    KeyCap('F?')),
    KeyCaps(KeyCap('×', '*'),
	    KeyCap(html`∫<sub><i>y</i></sub><sup><i>x</i></sup>`),
	    KeyCap(html`<i>x</i>=0`))
], [ // row 2
    KeyCaps(KeyCap('R/S','P'),
	    KeyCap('PSE'),
	    KeyCap('P/R')),
    KeyCaps(KeyCap('GSB', 'U'),
	    KeyCap('∑'),
	    KeyCap('RTN')),
    KeyCaps(KeyCap('R⭣', 'r'),
	    KeyCap('PRGM'),
	    KeyCap('R⭡')),
    KeyCaps(KeyCap(html`<i>x</i>⮀<i>y</i>`, 'x'),
	    KeyCap('REG'),
	    KeyCap('RND')),
    KeyCaps(KeyCap('⭠', '\b'),
	    KeyCap('PREFIX'),
	    KeyCap(html`CL<i>x</i>`)),
    KeyCaps(KeyCap(html`E<br>N<br>T<br>E<br>R`, ['\r', '\n', ' ']),
	    KeyCap('RAN#','\x12'),
	    KeyCap(html`LST<i>x</i>`, 'L')),
    KeyCaps(KeyCap('1', '1'),
	    KeyCap('⭢R'),
	    KeyCap('⭢P')),
    KeyCaps(KeyCap('2','2'),
	    KeyCap('⭢H.MS'),
	    KeyCap('⭢H')),
    KeyCaps(KeyCap('3','3'),
	    KeyCap('⭢RAD'),
	    KeyCap('⭢DEG')),
    KeyCaps(KeyCap('-', '-'),
	    KeyCap('Re⮀Im'),
	    KeyCap('TEST'))
], [ // row 3
    KeyCaps(KeyCap('ON','\x1b')),
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
	    KeyCap(html`<i>x̄</i>`)),
    KeyCaps(KeyCap('.','.'),
	    KeyCap('ŷ,r'),
	    KeyCap('s')),
    KeyCaps(KeyCap('∑+',';'),
	    KeyCap('L.R.'),
	    KeyCap('∑-')),
    KeyCaps(KeyCap('+', '+'),
	    KeyCap(html`P<i>y,x</i>`),
	    KeyCap(html`<i>Cy,x</i>`))
] ];
var hotkeys = {};		// built in first constructor

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
	// initialize properties
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
	// const generateUser = () =>
	// _user ? 
	// html`<style>.indicator .user{display:inline}</style>` :
	// html`<style>.indicator .user{display:none}</style>`;
	// const generateComplex = () =>
	//	  _complex ? 
	//	  html`<style>.indicator .complex{display:inline}</style>` :
	//	  html`<style>.indicator .complex{display:none}</style>`;
	//  const generateProgram = () =>
	//	  _program ? 
	//	  html`<style>.indicator .program{display:inline}</style>` :
	//	  html`<style>.indicator .program{display:none}</style>`;
	if (this.shadowRoot) {
	    console.log(`_updateIndicator(${sel}, ${on})`);
	    const ind = this.shadowRoot.querySelector(sel);
	    if (ind) {
		console.log(`found ${ind.tagName} ${ind.className}`);
		ind.style.display = on ? 'inline' : 'none';
	    }
	}
    }
    _updateShift(shift) {
	if (this.shadowRoot) {
	    console.log(`updateShift('${shift}')`);
	}
    }
    _updateTrigmode(mode) {
	if (this.shadowRoot) {
	    console.log(`updateTrigmode('${mode}')`);
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
	if (this.shadowRoot) {
	    console.log(`updateDigit(${i}, '${digit}')`);
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
    _render({_user, _shift, _trigmode, _complex, _program, _neg, _digits, _decimals}) {
	// generate styles
	const generateStyles = () => {
	    const generateShift = () =>
		  _shift==='f' ? html`
		<style>
		  .indicator .fshift{display:inline}
		  .indicator .gshift{display:none}
		  span.btn.fshift{display:table-cell}
		  span.btn.gshift{display:none}
		  span.btn.nshift{display:none}
		  #clearlabel{display:block}
		</style>` :
		  _shift==='g' ? html`
		<style>
		  .indicator .fshift{display:none}
		  .indicator .gshift{display:inline}
		  span.btn.fshift{display:none}
		  span.btn.gshift{display:table-cell}
		  span.btn.nshift{display:none}
		  #clearlabel{display:none}
		</style>` :
		  html`
		<style>
		  .indicator .fshift{display:none}
		  .indicator .gshift{display:none}
		  span.btn.fshift{display:none}
		  span.btn.gshift{display:none}
		  span.btn.nshift{display:table-cell}
		  #clearlabel{display:none}
		</style>` ;
	    const generateTrigmode = () =>
		  _trigmode==='RAD' ? 
		  html`<style>.indicator .rad{display:inline}.indicator .grad{display:none}</style>` :
		  _trigmode==='GRAD' ? 
		  html`<style>.indicator .rad{display:none}.indicator .grad{display:inline}</style>` :
		  html`<style>.indicator .rad{display:none}.indicator .grad{display:none}</style>` ;
	    return html`
		${generateShift()}
		${generateTrigmode()}`;
	}

	// generate display
	const digits = [
	    [' _ ','   ',' _ ',' _ ','   ',' _ ',' _ ',' _ ',' _ ',' _ ','   ',' _ ','   ',' _ ','   ',' _ ','   ','   ','   ','   '],
	    ['| |','  |',' _|',' _|','|_|','|_ ','|_ ','  |','|_|','|_|',' _ ','|_|','|_ ','|  ',' _|','|_ ',' _ ',' _ ','|_|','   '],
	    ['|_|','  |','|_ ',' _|','  |',' _|','|_|','  |','|_|',' _|','   ','| |','|_|','|_ ','|_|','|_ ','|_|','|  ','   ','   '],
	]
	const segments = [
	    // 7 segments of the digit display
	    svg`<path class="s0" d="M 3 1 L 17 1 13 5 7 5 Z" />`,
	    svg`<path class="s1" d="M 2 3 L 6 7 6 10 2 14 Z" />`,
	    svg`<path class="s2" d="M 18 3 L 18 14 14 10 14 7 Z" />`,
	    svg`<path class="s3" d="M 6.5 12.5 L 13.5 12.5 16 14.5 13.5 16.5 6.5 16.5 4 14.5 Z" />`,
	    svg`<path class="s4" d="M 2 15 L 6 19 6 22 2 26 Z" />`,
	    svg`<path class="s5" d="M 18 15 L 18 26 14 22 14 19 Z" />`,
	    svg`<path class="s6" d="M 3 28 L 17 28 13 24 7 24 Z" />`,
	];
	const digit = (d) => {
	    // a digit, or a letter, or a space
	    let i = "0123456789-ABCDEoru ".indexOf(d);
	    if (i < 0) {
		console.log(`bad argument to digit ${d}`);
		return svg``;
	    }
	    return svg`
		${digits[0][i][1] === '_'?segments[0]:''} 
		${digits[1][i][0] === '|'?segments[1]:''}${digits[1][i][2] === '|'?segments[2]:''}
		${digits[1][i][1] === '_'?segments[3]:''}
		${digits[2][i][0] === '|'?segments[4]:''}${digits[2][i][2] === '|'?segments[5]:''}
		${digits[2][i][1] === '_'?segments[6]:''}`;
	}
	
	const neg_digits_and_decimals = (neg, digits, decimals) => {
	    const width = 11*27, height = 34;
	    const digit_top = 0, decimal_top = 24;
	    const digit_left = (i) => 17+i*27, decimal_left = (i) => 36+i*27;
	    const skew_x = -10;
	    const digit_and_decimal = (i) => {
		return svg`<g id$="dig${i}" transform$="translate(${digit_left(i)} ${digit_top})">
			     ${digit(digits?digits[i]:' ')}
			   </g>
			   <g id$="dec${i}" transform$="translate(${decimal_left(i)} ${decimal_top})">
			     <rect class="s0" x="2" width="4" height="4" />
			     <path class="s1" d="M 2 6 L 6 6 1 9 0 9" />
			   </g>`;
	    }
	    return html`<svg id="digits" viewBox="0 0 287 34">
			  <g transform="skewX(-5)">
			    <path class="neg" d="M 4 13 L 16 13 16 16 4 16 Z" />
			    ${digits.map((d,i) => digit_and_decimal(i))}
			  </g>
			</svg>`;
	}
	// generate keypad
	const span = (aijk,i,j,k) => {
	    if (! aijk) return html``;
	    var {sclass, alabel, label} = aijk;
	    if ( ! sclass) sclass = '';
	    const kclass = k ? `${k}shift` : '';
	    return sclass && alabel ?
		html`<span aijk=${aijk} class$="btn ${kclass} ${sclass}" aria-label$="${alabel}" role="button" tabindex="0">${label}</span>` :
		alabel ?
		html`<span aijk=${aijk} class$="btn ${kclass}" aria-label$="${alabel}" role="button" tabindex="0">${label}</span>` :
		html`<span aijk=${aijk} class$="btn ${kclass} ${sclass}" role="button" tabindex="0">${label}</span>` ;
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
    height:62.5vw; /* 400px; */
    background-color:var(--key-bezel-background);
  }
  .bezel {
    position:absolute;
    top: 1.25%;
    left: 3.3%;
    width: 93.5%;
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
    top:25.4%;
    left:15.5%;
    height:56%;
    width:50%;
    background-color:var(--lcd-panel-background);
  }
  .lcd svg { fill:var(--lcd-panel-color); }
  .indicator {
    position:absolute;
    top:75%;
    left:0;
    width:100%;
    height:25%;
    font-size:10px;		/* at 640px overall width */
    background-color:transparent;
    color:var(--lcd-panel-color);
  }
  .indicator .user { position:absolute; top:0; left:11%; display:inline; }
  .indicator .fshift { position:absolute; top:0; left:24.6%; display:inline; }
  .indicator .gshift { position:absolute; top:0; left:31.5%; display:inline; }
  .indicator .rad { position:absolute; top:0; left:58%; display:inline; }
  .indicator .grad { position:absolute; top:0; left:55%; display:inline; }
  .indicator .complex { position:absolute; top:0; left:79.4%; display:inline; }
  .indicator .program { position:absolute; top:0; left:86.3%; display:inline; }
  .keypad {
    position:absolute;
    top:30%;
    left:3.5%;
    height:65%;
    width:92%;
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
  /* N columns changes this width% */
  div.lft.side { width:50%; left:0; }
  /* N columns changes this width% */
  div.rgt.side { width:50%; left:50%; }
  /* rows */
  /* N rows changes this height% */
  div.row { display: block; height: 25%; position: relative; }
  /* columns and cells */
  div.col { display: inline-block; height:100%; position: absolute; vertical-align: bottom; }
  /* N columns changes this width% */
  div.lft.col { width:20%; }
  div.rgt.col { width:20%; }
  /* inner column */
  div.in-col {
    width: 84%;
    height: 65%;
    top: 17%;
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
    height: 80%;
    top: 10%;
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

  div#clearlabel {
    position:absolute;
    left:20%;
    top:47.5%;
    width:80%;
    height:5%;
    color:var(--fshift-color);
    background-color:var(--key-bezel-color);
    font-size:10px;
  }
  div#clearlabel span { 
    display:block-inline;
    position:absolute;
    top:0;
    left:37.5%;
    width:25%;
    text-align:center;
  }
  div#clearlabel svg {
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    stroke:var(--fshift-color);
  }
  @media screen and (max-width:459px){
    div.frm { width:100% }
    div.lft.side{display:none} /* .cwsbcm? */
    div.rgt.side{left:0%;width:100%} /* .cwbbcm? */
    div.txt1{left:2%;width:96%} /* .cwtlb */
  }
  @media screen and (min-width:460px) and (max-height:450px){
    div.frm(width:100%)
    div.lft.side{width:50%}	/* .cwsbcm? */
    div.rgt.side{left:50%;width:50%}	/* .cwbbcm>? */
    div.txt1{left:1%;width:98%}	/* .cwtlb */
    div.frm11{height:230px}	/* .cwmd */
    div.txt{height:32%}		/* .cwtld */
    div.kpd{height:68%}		/* .cwbsc */
  }
</style>
${SharedStyles}
${generateStyles()}
<section>
  <div class="calc">
    <div class="bezel">
      <div class="slot"><slot></slot></div>
      <div class="lcd" id="lcd" tabindex="0">
	<div class="digit">
	  ${neg_digits_and_decimals(_neg, _digits, _decimals)}
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
	  <div id="clearlabel" class="fshift">
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
	console.log('clear_digits');
	store.dispatch(hpNeg(' '));
	store.dispatch(hpDigits([' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']));
	store.dispatch(hpDecimals([' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']));
    }
    set_neg() { 
	console.log('set_neg');
	store.dispatch(hpNeg('-')); }
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
