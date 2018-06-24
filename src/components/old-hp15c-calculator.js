/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

import { SharedStyles } from './shared-styles.js';

// attempt a raw import to see what happens
// what happened is it failed to find Matrix
// added one export to common/jsmat/matrix.js
// and one import to common/hp15c.js
// and this loaded without complaint.

import { key, init, start_tests } from './common/hp15c.js';

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

const _ignore = (e) => false;

class HP15CCalculator extends GestureEventListeners(PageViewElement) {
    /* hack to get GestureEventListeners activated */
    constructor() {
	super();
	Gestures.addListener(this, 'tap', _ignore);
	Gestures.addListener(this, 'down', _ignore);
	Gestures.addListener(this, 'up', _ignore);
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
		    aij[k].emit = aij[k].hotkey
		} else {
		    aij[k].emit = aij.n.emit;
		}
	    }
	    
	})));
	this._neg = ' ';
	this._digit = '          '.split('');	// ten spaces
	this._decimal = '          '.split(''); // ten spaces
	this._shift = ' ';
	this._complex = false;
	this._trigmode = null;
	this._prgm = false;
	this._user = false;
    }
    disconnectedCallback() {
	super.disconnectedCallback();
	Gestures.removeListener(this, 'tap', _ignore);
	Gestures.removeListener(this, 'down', _ignore);
	Gestures.removeListener(this, 'up', _ignore);
    }
    static get properties() {
	return {
	    _neg: String,
	    _digit: Array,
	    _decimal: Array,
	    _shift: String, 
	    _complex: Boolean,
	    _trigmode: String,
	    _prgm: Boolean,
	    _user: Boolean
	}
    }

    _render({_neg, _digit, _decimal, _shift, _complex, _trigmode, _prgm, _user}) {
	// quick constants
	const [_fshift, _gshift] = [_shift === 'f', _shift === 'g']
	// generate style
	const generateStyle = () =>
	      _fshift ? html`<style>span.btn.fshift{display:table-cell}span.btn.gshift{display:none}span.btn.nshift{display:none}</style>` :
	      _gshift ? html`<style>span.btn.fshift{display:none}span.btn.gshift{display:table-cell}span.btn.nshift{display:none}</style>` :
	                html`<style>span.btn.fshift{display:none}span.btn.gshift{display:none}span.btn.nshift{display:table-cell}</style>` ;
	const computedStyles =
	      html`${generateStyle()}`;
	// generate display
	// -8,8,8,8,8,8,8,8,8,8,
	// USER f g BEGIN GRAD D.MY C PRGM
	const display_digit = (d,i) =>
	      html`${d}${_decimal[i]}`;
	const display = () =>
	      html`${_neg}${_digit.map((d,i) => display_digit(d,i))}`;
	const display_flags = (u,f,g,b,t,d,c,p) =>
	      html`<pre>${u}  ${f} ${g} ${t} </pre>`;
	const flags = () =>
	      display_flags( _user?'USER':'    ',
			     _fshift?'f':' ',
			     _gshift?'g':' ',
			     '     ',		// BEGIN?
			     _trigmode === 'GRAD' ? 'GRAD' : _trigmode === 'RAD' ? ' RAD' : '    ', 
			     '    ',		// D.MY?
			     ' ',		// C?
			     _prgm?'PRGM':'    ');
	// generate keypad
	const span = (aijk,i,j,k) => {
	    if (! aijk) return html``;
	    var {code, sclass, alabel, label} = aijk;
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
	      html`<div class$="col ${side} col-${c}"><div class="in-col">${['n','f','g'].map(t => span(k[t],r,c,t))}</div></div>` :
	      html`<div class$="col ${side} col-${c}"><div class="in-col">${span(k.n,r,c,false)}</div></div>`
	const lftGenerate = (r) => /* .cwbr */
	      html`<div class$="row lft row-${r}">${[0,1,2,3,4].map(c => button(r,c,'lft',keypad[r][c]))}</div>`;
	const rgtGenerate = (r) => /* .cwbr */
	      html`<div class$="row rgt row-${r}">${[5,6,7,8,9].map(c => button(r,c,'rgt',keypad[r][c]))}</div>`;
	return html`
${SharedStyles}
${computedStyles}
<style>
  :host {
    --fshift-color: #c58720; /* goldenrod?; */
    --gshift-color: #479ea5; /* lightblue?; */
    --darker-background: #302b31;
    --darker-color: #444;
    --darker-border: 1px solid #c6c6c6;
    --lighter-background: #f5f5f5;
    --lighter-color: #444;
    --lighter-border: 1px solid #dedede;
    --highlight-background: #4d90fe;
    --highlight-color: #fefefe;
    --highlight-border: 1px solid #2f5bb7;
    --highlight-font-weight: bold;
  }
  /* enclosing frame */
  div.frm { /* data-hveid="40" */
    width:600px;
    height:354px;
    position: relative;
  }
  div.frm1 { /* .vk_c ... */
    padding: 20px 16px 24px 16px;
    margin-left: -16px;
    margin-right: -16px;
    min-height:72px;
    line-height:1;
    background-color: black;
    position: relative;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
  }
  div.frm11 { /* .cwmd */
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    height: 310px;
    position: relative;
  }
  div.frm111 { /* .cwed */
    width: 100%;
    height: 100%;
    direction: ltr;
  }
  /* text entry */
  div.txt { /* .cwtld */
    width: 100%;
    height: 27%;
    display: block;
    position: relative;
  }
  div.txt sup { /* .cwtld sup */
    position:relative;
    bottom:.4em;
    font-size:75%;
    vertical-align:baseline
  }
  div.txt1 { /* .cwtlb */
    -moz-border-radius: 1.1px;
    -webkit-border-radius: 1.1px;
    border-radius: 1.1px;
    background-color: none;
    border: 1px solid #d9d9d9;
    border-top: 1px solid #c0c0c0;
    color: #333;
    height: 75%;
    left: 15%;
    position: absolute;
    top: 12.5%;
    width: 50%;
  }
  div.txt1.hovered.focused, div.txt1.focused { /* .cwtlbh.cwtlbs,.cwtlbs */
    -moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);
    -webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);
    box-shadow:inset 0 1px 2px rgba(0,0,0,0.3);
    border:1px solid #4d90fe
  }
  div.txt1.hovered { /* .cwtlbh */
    -moz-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);
    -webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);
    box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);
    border:1px solid #b9b9b9;
    border-top:1px solid #a0a0a0
  }
  div#txt1i { /* #cwtlbb */
  }
  div.txt3 { /* .cwtltbl */
    transition: height .2s;
    -moz-transition: height .2s;
    -o-transition: height .2s;
    -webkit-transition: height .2s;
    color: #222;
    display: table;
    top: 12.5%;
    left: 15%;
    height: 75%;
    width: 50%;
    background-color: white;
    position: absolute;
    table-layout: fixed;
    z-index: 0;
  }
  div#txt3i { /* #cwotbl */
  }
  div#txt31i { /* #cwtltblr */
    display: table-row;
  }
  div#txt31i:focus { /* #cwtltblr */
    outline: none;
  }
  div.txt311 { /* .cwtlptc */
    display: table-cell;
    vertical-align: middle;
    width: 2.5%;
  }
  div.txt312 { /* .cwtlotc */
    display: table-cell;
    overflow: hidden;
    padding-right: 2%;
    vertical-align: baseline;
    width: 95%;
  }
  div.txt3121, div.txt3122 {
    display: block;
    width:100%;
    vertical-align: middle;
  }
  div.txt3121 {
    top: 20%;
    height:75%;
  }
  div.txt3122 {
    top: 55%;
    height:25%;
  }
  div.txt3121 span { /* .cwcot */
    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    float: left;
    /* font-family: Roboto-Regular,helvetica,arial,sans-serif; */
    font-size: 30px;
    font-weight: lighter;
    white-space: nowrap;
  }
  div.txt3122 span { /* _future */
    float: left;
    /* font-family: Roboto-Regular,helvetica,arial,sans-serif; */
    font-size: 10px;
    font-weight: lighter;
    white-space: nowrap;
  }
  span#txt3121i { /* #cwos */
  }

  /* keypad */
  div.kpd { /* .cwbsc */
    bottom: 0;
    height: 72%;
    position: absolute;
    width: 100%;
    z-index: 2;
    background-color: black;
  }
  /* left and right sides of keypad */
  div.side { /* .cwcd */
    display: inline-block;
    height:100%;
    overflow:hidden;
    position:absolute;
  }
  div.lft.side { /* .cwcd .cwsbc */
    width:50%; /* N columns change */
    left:0;
  }
  div.rgt.side { /* .cwcd .cwbbc */
    width:50%; /* N columns change */
    left:50%;
  }
  /* rows */
  div.row { /* .cwbr */
    display: block;
    height: 25%;		/* N rows change */
    position: relative;
  }
  /* columns and cells */
  div.col { /* .cwbd */
    display: inline-block;
    height:100%;
    position: absolute;
    vertical-align: bottom;
  }
  div.lft.col { /* .cwsbc-c */
    width:20%;		/* N columns change */
   }
  div.rgt.col { /* .cwbbc-c */
    width:20%;
  }
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
  div.col-0 { left:0%; }	/* cwsbc1 */ /* N columns change */
  div.col-1 { left:20%; }	/* cwsbc2 */
  div.col-2 { left:40%; }	/* cwsbc3 */
  div.col-3 { left:60%; }	/* cwbbc1 */
  div.col-4 { left:80%; }	/* cwbbc2 */
  div.col-5 { left:0%; }	/* cwbbc3 */
  div.col-6 { left:20%; }	/* cwbbc4 */
  div.col-7 { left:40%; }	/* cwbbc4 */
  div.col-8 { left:60%; }	/* cwbbc4 */
  div.col-9 { left:80%; }	/* cwbbc4 */

  /* unshifted button labels */
  div.in-col span { 
    background-color: var(--darker-background);
    color: white;
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
<section>
  <div class="frm">			<!-- data-hveid="40" -->
    <div class="frm1" id="frm1i">	<!-- .vk_c .card-section, #cwmcwd -->
      <div class="frm11">		<!-- .cwmd -->
	<div class="frm111">		<!-- .cwed -->

    <!-- expression accumulator -->
    <div class="txt">				<!-- .cwtld -->
      <div class="txt1" id="txt1i"></div>	<!-- .cwtlb, #cwtlbb -->
      <div class="txt3" id="txt3i">		<!-- .cwtltbl, #cwotbl -->
	<div aria-level="3" id="txt31i" role="heading" tabindex="0"> <!-- #cwtltblr -->
	  <div class="txt311"></div>		<!-- .cwtlptc -->
	  <div class="txt312">			<!-- .cwtlotc -->
            <div class="txt3121"><span>${display()}</span></div> <!-- .cwcot, #cwos -->
	    <div class="txt3122"><span>${flags()}</span></div>
	  </div>
	  <div class="txt311"></div>		<!-- .cwtlptc -->
	</div>
      </div>
    </div>

    <div class="wrp">
      <div class="kpd">		<!-- .cwbsc -->
        <div class="lft side">	<!-- .cwcd .cwsbc -->
          ${[0,1,2,3].map(r => lftGenerate(r))} <!-- N rows change -->
        </div>
        <div class="rgt side">
          ${[0,1,2,3].map(r => rgtGenerate(r))} <!-- N rows change -->
        </div>
      </div>
    </div>

	</div>
      </div>
    </div>
  </div>
  <div><button on-tap=${e => start_tests()}>Start Tests</button></div>
</section>`;
    }

    _didRender() {
	if ( ! this.focused) {
	    /* arrange to adjust the classes of an enclosing div when
	     * the text entry div gets hovered or focused */
	    const div31 = this.shadowRoot.getElementById('txt31i');
	    const div1 = this.shadowRoot.getElementById('txt1i');
	    div31.addEventListener('focus', _ => div1.classList.add('focused'));
	    div31.addEventListener('blur', _ => div1.classList.remove('focused'));
	    div31.addEventListener('mouseover', _ => div1.classList.add('hovered'));
	    div31.addEventListener('mouseout', _ => div1.classList.remove('hovered'));
	    /* arrange to monitor focus, keyboard, and touch events for everyone */
	    this.shadowRoot.addEventListener('focus', e => this._onFocus(e), true);
	    this.shadowRoot.addEventListener('blur', e => this._onBlur(e), true);
	    this.shadowRoot.addEventListener('keydown', e => this._onDown(e));
	    this.shadowRoot.addEventListener('tap', e => this._onTap(e));
	    /* and grab the focus on load, too. */
	    div31.focus();
	    /* hp15c related start up */
	    init(this);
	    /* mark us as done */
	    this.focused = true;
	}
    }
    // hp15c Display interface
    clear_digits() { 
	this._neg = ' ';
	for (let i = 0; i < 10; i += 1) {
	    this._digit[i] = ' ';
	    this._decimal[i] = ' ';
	}
	this._requestRender();
    }
    set_neg() { this._neg = '-'; }
    clear_digit(i) { this._digit[i] = ' '; this._requestRender(); }
    set_digit(i, d) { this._digit[i] = d; this._requestRender(); }
    set_comma(i) { this._decimal[i] = ','; this._requestRender(); }
    set_decimal(i) { this._decimal[i] = '.'; this._requestRender(); }
    clear_shift() { this._shift = ' '; }
    set_shift(mode) { this._shift = mode; } // mode in ['f', 'g']
    set_prgm(on) { this._prgm = on; } // on in [true, false]
    set_trigmode(mode) { this._trigmode = mode; } // mode in [null, 'RAD', 'GRAD']
    set_user(on) { this._user = on; } // on in [true, false]
    set_complex(on) { this._complex = on; }
    // included tests.js inside hp15c.js and exported start_tests()
    run_test() { start_tests(); }

    // event listeners
    _onFocus(event) {
	// console.log(`onFocus(${event.target.className})`);
	this._focusee = event.target;
	// if (this._focusee.aij) console.log(`onFocus(${this._focusee.aij})`);
    }
    _onBlur(event) {
	// console.log(`onBlur(${event.target.className})`);
	this._focusee = null;
    }
    _onTap(event) { 
	if (event.target.aijk) {
	    this._onEmit(event.target.aijk);
	    event.preventDefault();
	    return;
	}
	if (event.target.parentElement) {
	    if (event.target.parentElement.aijk) {
		console.log('found aijk on parent');
		this._onEmit(event.target.parentElement.aijk);
		event.preventDefault();
		return;
	    }
	    console.log(`_onTap(${event.target.tagName}.${event.target.className}) has no aijk property`);
	    for (let t = event.target; t.parentElement; t = t.parentElement) {
		if (t.aijk) {
		    console.log('found aijk on ancestor');
		    this._onEmit(t.aijk);
		    event.preventDefault();
		    return;
		}
	    }
	}
    }
    _onDown(event) { 
	/* 
	   don't even get me started, String.fromCharCode(event.which) converts to upper case 
	   on the Lenovo bluetooth keyboard which has upper case key caps, the chromebook
	   has lower case key caps, so it has lower case event.which.
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
	key(aijk.emit);
    }
}

window.customElements.define('hp15c-calculator', HP15CCalculator);
