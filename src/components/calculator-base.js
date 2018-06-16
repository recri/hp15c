/*
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/
import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

import { SharedStyles } from './shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { calcInvert, calcACES, calcRadDeg, calcKeypadInput, calcKeyboardInput } from '../actions/calc.js';

const _ignore = (e) => false;

export class CalculatorBase extends connect(store)(GestureEventListeners(PageViewElement)) {
    /* hack to get GestureEventListeners activated */
    constructor() {
	super();
	Gestures.addListener(this, 'tap', _ignore);
	Gestures.addListener(this, 'down', _ignore);
	Gestures.addListener(this, 'up', _ignore);
    }
    disconnectedCallback() {
	super.disconnectedCallback();
	Gestures.removeListener(this, 'tap', _ignore);
	Gestures.removeListener(this, 'down', _ignore);
	Gestures.removeListener(this, 'up', _ignore);
    }
    static get properties() {
	return {
	    _memo: String,	// Memo text displayed
	    _text: String,	// Text entered 
	    _invert: Boolean,	// Show normal or inverted labels
	    _aces: Boolean,	// Show AC or CE button label
	    _raddeg: Boolean,	// Use Rad or Deg for angle
	}
    }

    // keypad is a list of rows
    // created left column group first, then right column group to set tab order
    // some keys have alternate labels/functions
    get keypad() {
	// full key definition
	const key = (label, alabel, sclass, hotkey, emit, alt) => {
	    var key = { label: label };		// key label
	    if (alabel) key.alabel = alabel;	// aria-label
	    if (sclass) key.sclass = sclass;	// class at span level
	    if (hotkey) key.hotkey = hotkey;	// keyboard accelerators
	    // text emitted, either text before insertion point
	    // or a list of two elements before and after insertion point
	    if (emit) key.emit = (typeof(emit) === 'string') ? [emit] : emit ;
	    if (alt) key.alt = alt;		// the alternate key definition under invert shift
	    return key;
	}
	// core keypad key definition
	const corepad = (label, alabel) =>
	      key(label, alabel, 'corepad', label, label);
	const keypad = 
	      [ [ // row 0
 		  key('Rad', "switch from radians to degrees", "angle rad", null, 'Rad'),
		  key('Deg', "switch from degrees to radians", "angle deg", null, 'Deg'),
		  key('a!', "factorial", null, '!', '!'),
		  key('(', "left parenthesis", "op", '(', ['(', ')']),
		  key(')', "right parenthesis", "op", ')', ')'),
		  key('%', "percentage", "op", '%', '%'),
		  key('AC',"all clear", "erase acesAC", '\x7f', 'AC', 
		      key('CE', "clear entry",  "erase acesCE", '\b', 'CE'))
	      ],[ // row 1
		  key('Inv', "inverse", "inverse", null, 'Inv'),
		  key('sin', "sine", "uninvert", 's', ['sin(', ')'],
		      key(html`sin<sup>&minus;1</sup>`, 'arcsine', "doinvert", 'S', ['arcsin(', ')'])),
		  key('ln', "natural logarithm", "uninvert", 'l', ['ln(', ')'], 
		      key(html` e<sup>x</sup>`, "E to the power of X", "doinvert", null, ['exp(', ')'])),
		  corepad('7'),
		  corepad('8'),
		  corepad('9'),
		  key('÷', "divide", "op", '/', '÷'),
	      ], [ // row 2
		  key('π', "pi", null, 'p', 'π'),
		  key('cos', "cosine", "uninvert", 'c', ['cos(', ')'],
		      key(html`cos<sup>&minus;1</sup>`, "arccosine", "doinvert", 'C', ['arccos(', ')'] )),
		  key('log', "logarithm", "uninvert", 'g', ['log(', ')'],
		      key( html` 10<sup>x</sup>`, "ten to the power of X", "doinvert", null, ['pow(10,', ')'])),
		  corepad('4'),
		  corepad('5'),
		  corepad('6'),
		  key('×', "multiply", "op", '*', '×'),
	      ], [ // row 3
		  key('e', "euler's number", null, 'e', 'e'),
		  key('tan', "tangent", "uninvert", 't', ['tan(',')'],
		      key( html` tan<sup>&minus;1`, "arctangent", "doinvert", 'T', ['arctan(',')'])),
		  key('√', "square root", "uninvert", 'r', ['√(',')'],
		      key( html` x<sup>2</sup>`, "square", "doinvert", null, ['pow(_,2)'])),
		  corepad('1'),
		  corepad('2'),
		  corepad('3'),
		  key('-', "minus", "op", '-', '-'),
	      ], [		// row 4
		  key('Ans', "answer", "uninvert", ['a', 'A'], 'Ans',
		      key('Rnd', "random", "doinvert", 'R', 'Rnd' )),
		  key('EXP', "exponential", null, 'E', 'E'),
		  key( html`x<sup>y</sup>`, "X to the power of Y", "uninvert", null, ['pow(_,',')'],
		       key( html` <sup>y</sup>√x`, "Y root of X", "doinvert", null, ['pow(_,1÷',')'])),
		  corepad('0'),
		  corepad('.', "point"),
		  key('=', "equals", "equals op", ['=', 'Enter'], '='),
		  key('+', "plus", "op", '+', '+'),
	      ] ];
	return keypad;
    }
    
    _render({_memo, _text, _invert, _aces}) {
	const computedStyleInvert =  _invert ?
	      html`<style>:host {--uninvert-display:none;--doinvert-display:table-cell;--invert-background:lightgrey;}</style>` :
	      html`<style>:host {--uninvert-display:table-cell;--doinvert-display:none;--invert-background:darkgrey;}</style>` ;
	const computedStyleAces = _aces ?
	      html`<style>:host { --acesAC-display:none; --acesCE-display:table-cell;}</style>` :
	      html`<style>:host { --acesAC-display:table-cell;--acesCE-display:none;}</style>` ;
	const computedStyles =
	      html`${computedStyleInvert}${computedStyleAces}`;
	const span = (x) => (! x) ? html`` :
	      html`<span class$="${x.sclass||''}" aria-label$="${x.alabel || ''}" tabindex="0" on-tap=${e => this._onTap(e,x)}>${x.label}</span>`;
	const button = (r,c,side,k) => 
	      html`<div class$="col ${side} col-${c}"><div class="in-col">${span(k)}${span(k.alt)}</div></div>`;
	const lftGenerate = (r) =>  
	      html`<div class$="row lft row-${r}">${[0,1,2].map(c => button(r,c,'lft',this.keypad[r][c]))}</div>`;
	const rgtGenerate = (r) => 
	      html`<div class$="row rgt row-${r}">${[3,4,5,6].map(c => button(r,c,'rgt',this.keypad[r][c]))}</div>`;
	return html`
${SharedStyles}
${computedStyles}
<style>
  :host {
    --darker-background: #d6d6d6;
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
    margin-left: -8px;		/* ??? */
    margin-right: -35px;	/* ??? which margins */
    min-height:72px;
    line-height:1;
    background-color: #fff;
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
  /* memo bar */
  div.mem { /* .cwled */
    width: 100%;
    height: 6%;
    display: block;
    position: relative;
  }
  div#mem1i { /* #cwfleb */
    width: 100%;
    height: 200%;
    position: absolute;
    top: -50%;
    z-index: 2;
  }
  div.mem2 { /* .cwletbl
    transition: height .2s,font-size .2s,color .2s;
    -moz-transition: height .2s,font-size .2s,color .2s;
    -o-transition: height .2s,font-size .2s,color .2s;
    -webkit-transition: height .2s,font-size .2s,color .2s;
    color: #757575;
    display: table;
    font-size: 13px;
    height: 100%;
    left: 1%;
    overflow: hidden;
    position: absolute;
    table-layout: fixed;
    width: 98%;
  }
  div.mem2i { /* #cwletbl */
  }
  div.mem21 { /* .cwleotc */
  }
  span.mem211 { /* .cwclet */
  }
  span#mem211i { /* #cwles */
  }

  /* text entry */
  div.txt { /* .cwtld */
    width: 100%;
    height: 21%;
    display: block;
    position: relative;
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
    left: 1%;
    position: absolute;
    top: 12.5%;
    width: 98%;
  }
  div#txt1i { /* #cwtlbb */
  }
  div.txt2 { /* .cwtlwm */
    background-color: white;
    border: none;
    height: 100%;
    margin-top: 3px;
    position: absolute;
    top: 88%;
    width: 100%;
    z-index: 1;
  }
  div.txt3 { /* .cwtltbl */
    transition: height .2s;
    -moz-transition: height .2s;
    -o-transition: height .2s;
    -webkit-transition: height .2s;
    color: #222;
    display: table;
    font-size: 30px;
    height: 100%;
    position: absolute;
    table-layout: fixed;
    width: 100%;
    z-index: 0;
  }
  div#txt3i { /* #cwotbl */
  }
  div#txt31i { /* #cwtltblr */
    display: table-row;
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
    vertical-align: middle;
    width: 95%;
  }
  span.txt3121 { /* .cwcot */
    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    float: right;
    /* font-family: Roboto-Regular,helvetica,arial,sans-serif; */
    font-weight: lighter;
    white-space: nowrap;
  }
  span#txt3121i { /* #cwos */
  }

  /* keypad */
  div.kpd { 
    bottom: 0;
    height: 72%;
    position: absolute;
    width: 100%;
    z-index: 2;
  }
  /* left and right sides of keypad */
  div.side {
    display: inline-block;
    height:100%;
    overflow:hidden;
    position:absolute;
  }
  div.lft.side {
    left:0;
    width:42.85%;
  }
  div.rgt.side { 
    left:42.85%;
    width:57.15%;
  }
  /* rows */
  div.row {
    display: block;
    height: 20%;
    position: relative;
  }
  /* columns and cells */
  div.col { 
    display: inline-block;
    height:100%;
    position: absolute;
    vertical-align: bottom;
  }
  div.lft.col { width:33.3%; }
  div.rgt.col { width:25.0%; }
  /* inner column */
  div.in-col { 
    width: 88%;
    height: 85%;
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
  div.in-col span {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    display: table-cell;
    vertical-align: middle;
  }
  div.col-0 { left:0%; }
  div.col-1 { left:33.3%; }
  div.col-2 { left:66.6%; }
  div.col-3 { left:0%; }
  div.col-4 { left:25%; }
  div.col-5 { left:50%; }
  div.col-6 { left:75%; }
  /* last chance to override */
  span.op { font-size: 20px; }
  span.angle, span.erase { font-size: 11px; }
  div.in-col span.uninvert { display: var(--uninvert-display); }
  div.in-col span.doinvert { display: var(--doinvert-display); }
  div.in-col span.invert { background-color: var(--invert-background); }
  div.in-col span.acesAC { display: var(--acesAC-display); }
  div.in-col span.acesCE { display: var(--acesCE-display); }
  div.col div.in-col { 
    background-color: var(--darker-background);
    color: var(--darker-color);
    font-size: 15px;
 }
  div.col div.in-col span.corepad {
    background-color: var(--lighter-background);
    color: var(--lighter-color);
    border: var(--lighter-border);
  }
  div.col div.in-col span.equals { 
    background-color: var(--highlight-background);
    color: var(--highlight-color);
    border: var(--highlight-border);
    font-weight: var(--hightlight-font-weight);
  }
</style>
<section on-keypress=${e => this._onPress(e)}>
  <div class="frm">			<!-- data-hveid="40" -->
    <div class="frm1" id="frm1i">	<!-- .vk_c .card-section, #cwmcwd -->
      <div class="frm11">		<!-- .cwmd -->
	<div class="frm111">		<!-- .cwed -->

    <!-- memo bar -->
    <div class="mem">				<!-- .cwled -->
      <div id="mem1i"></div>			<!-- #cwfleb -->
      <div class="mem2" id="mem2i">		<!-- .cwletbl, #cwletbl -->
	<div class="mem21">			<!-- .cwleotc -->
	  <span class="mem211" id="mem211i"> ${_memo} </span>	<!-- .cwclet, #cwles -->
	</div>
      </div>
    </div>

    <!-- expression accumulator -->
    <div class="txt">				<!-- .cwtld -->
      <div class="txt1" id="txt1i"></div>	<!-- .cwtlb, #cwtlbb -->
      <div class="txt2"></div>			<!-- .cwtlwm -->
      <div class="txt3" id="txt3i">		<!-- .cwtltbl, #cwotbl -->
	<div aria-level="3" id="txt31i" role="heading" tabindex="0"> <!-- #cwtltblr -->
	  <div class="txt311"></div>		<!-- .cwtlptc -->
	  <div class="txt312">			<!-- .cwtlotc -->
	    <span class="txt3121" id="txt3121i">   ${_text}  </span>  <!-- .cwcot, #cwos -->
	    <script nonce="PS98yzrAeH4PLyc5tzKlHA==">
(function(){
    console.log("nonce called");
    var a=document.getElementById("txt331i"),b; /* refers to span above by id */
    var c=parseFloat(a.innerText||a.textContent),d=c.toString();
    if(12>=d.replace(/^-/,"").replace(/\./,"").length)
	b=d;
    else if(d=c.toPrecision(12),-1!=d.indexOf("e")) {
	var e=d.match(/e.*$/)[0].length;
	b=c.toPrecision(12-e-("0"==d[0]?1:0)).replace(/\.?0*e/,"e")
    } else {
	var f=d.match(/(^-|\.)/g),g=d.substr(0,12+(f?f.length:0));
	b=-1!=g.indexOf(".")?g.replace(/\.?0*$/,""):g
    }
    a.innerHTML=b;
}).call(this);
	    </script>
	  </div>
	  <div class="txt311"></div>		<!-- .cwtlptc -->
	</div>
      </div>
    </div>

    <div class="wrp">
      <div class="kpd">
        <div class="lft side">
          ${[0,1,2,3,4].map(r => lftGenerate(r))}
        </div>
        <div class="rgt side">
          ${[0,1,2,3,4].map(r => rgtGenerate(r))}
        </div>
      </div>
    </div>

	</div>
      </div>
    </div>
  </div>
</section>`;
    }
    _didRender() {
	if ( ! this.hotkey) {
	    // install keyboard accelerators

	    // check event emit strings
	    const setHotkey = (aij) => {
		if (aij && aij.hotkey) {
		    if (typeof(aij.hotkey) === 'string') {
			this.hotkey[aij.hotkey] = aij;
		    } else {
			aij.hotkey.forEach((k) => this.hotkey[k] = aij)
		    }
		}
	    }
	    this.hotkey = {}
	    this.keypad.forEach( (ai, i) => {
		ai.forEach( (aij, j) => {
		    setHotkey(aij)
		    setHotkey(aij.alt);
		});
	    });
	}
	// make a map from button spans to the keypad objects
	if ( ! this.button) {
	    this.button = {}
	    this.keypad.forEach( (ai, i) => {
		ai.forEach( (aij, j) => {
		    // this.button[`b${i}${j}`] = aij
		});
	    });
	}
    }
    
    _stateChanged(state) {
	this._memo = state.calc.memo;
	this._text = state.calc.text;
	this._invert = state.calc.invert;
	this._aces = state.calc.aces;
    }

    _onTap(event, aij) { 
	console.log(`_onTap(${aij.emit})`);
	switch (event.target.textContent) {
	case 'Inv': store.dispatch(calcInvert( ! this._invert )); break;
	case 'Rad': case 'Deg': store.dispatch(calcRadDeg( ! this._raddeg )); break;
	default: store.dispatch(calcKeypadInput(event.target.textContent)); break;
	}
    }
    _onPress(event) {
	// okay, this will require Enter instead of \n
	// console.log(`onPress(${event.type}, ${event.target}), ${event.charCode}, ${event.key})`);
	const aij = this.hotkey[event.key];
	console.log(`_onPress(${event.key} -> ${aij})`);
	if (aij) {
	    console.log(`_onPress(${aij.emit})`);
	    store.dispatch(calcKeyboardInput(aij.emit));
	}
    }
}

window.customElements.define('calculator-base', CalculatorBase);
