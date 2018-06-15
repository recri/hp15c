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
    get keypad() {
	return [ 		// row 0
	    [ { label: 'Rad', alabel: "switch from radians to degrees", dclass:"angle rad", emit: () => ['Rad'] },
	      { label: 'Deg', alabel: "switch from degrees to radians", dclass:"angle deg", emit: () => ['Deg'] },
	      { label: 'a!', alabel: "factorial", hotkey: '!', emit: () => ['!'] },
	      { label: '(', alabel: "left parenthesis", dclass: "op", hotkey: '(', emit: () => ['(', ')'] },
	      { label: ')', alabel: "right parenthesis", dclass: "op", hotkey: ')', emit: () => [')'] },
	      { label: '%', alabel: "percentage", dclass: "op", hotkey: '%', emit: () => ['%'] },
	      { label: 'AC', alabel: "all clear", dclass: "erase", sclass: "acesAC", hotkey: '\x7f', emit: () => ['AC'], 
		alt: { label: 'CE', alabel: "clear entry", sclass: "acesCE", hotkey: '\b', emit: () => ['CE'] }
	      },
	    ],[			// row 1
		{ label: 'Inv', alabel: "inverse", dclass: "inverse", emit: () => ['Inv'] },
		{ label: 'sin', alabel: "sine", sclass: "uninvert", hotkey: 's', emit: () => ['sin(', ')'],
		  alt: { label: html`sin<sup>&minus;1</sup>`, alabel: 'arcsine', sclass: "doinvert", hotkey: 'S', emit: () => ['arcsin(', ')'] }
		},
		{ label: 'ln', alabel: "natural logarithm", sclass: "uninvert", hotkey: 'l', emit: () => ['ln(', ')'], 
		  alt: { label: html` e<sup>x</sup>`, alabel: "E to the power of X", sclass: "doinvert", emit: () => ['exp(', ')'] }
		},
		{ label: '7', dclass:"corepad", hotkey: '7', emit: () => ['7'] },
		{ label: '8', dclass:"corepad", hotkey: '8', emit: () => ['8'] },
		{ label: '9', dclass:"corepad", hotkey: '9', emit: () => ['9'] },
		{ label: '÷', alabel: "divide", dclass: "op", hotkey: '/', emit: () => ['÷'] },
	    ], [		// row 2
		{ label: 'π', alabel: "pi", hotkey: 'p', emit: () => ['π'] },
		{ label: 'cos', alabel: "cosine", sclass: "uninvert", hotkey: 'c', emit: () => ['cos(', ')'],
		  alt: { label: html`cos<sup>&minus;1</sup>`, alabel: "arccosine", sclass: "doinvert", hotkey: 'C', emit: () => ['arccos(', ')'] }
		},
		{ label: 'log', alabel: "logarithm", sclass: "uninvert", hotkey: 'g', emit: () => ['log(', ')'],
		  alt: { label: html` 10<sup>x</sup>`, alabel: "ten to the power of X", sclass: "doinvert", emit: () => ['pow(10,', ')'] }
		},
		{ label: '4', dclass:"corepad", hotkey: '4', emit: () => ['4'] },
		{ label: '5', dclass:"corepad", hotkey: '5', emit: () => ['5'] },
		{ label: '6', dclass:"corepad", hotkey: '6', emit: () => ['6'] },
		{ label: '×', alabel: "multiply", dclass: "op", hotkey: '*', emit: () => ['×'] },
	    ], [		// row 3
		{ label: 'e', alabel: "euler's number", hotkey: 'e', emit: () => ['e'] },
		{ label: 'tan', alabel: "tangent", sclass: "uninvert", hotkey: 't', emit: () => ['tan(',')'],
		  alt: { label: html` tan<sup>&minus;1`, alabel: "arctangent", sclass: "doinvert", hotkey: 'T', emit: () => ['arctan(',')'] }
		},
		{ label: '√', alabel: "square root", sclass: "uninvert", hotkey: 'r', emit: () => ['√(',')'],
		  alt: { label: html` x<sup>2</sup>`, alabel: "square", sclass: "doinvert", emit: () => ['pow(_,2)'] }
		},
		{ label: '1', dclass:"corepad", hotkey: '1', emit: () => ['1'] },
		{ label: '2', dclass:"corepad", hotkey: '2', emit: () => ['2'] },
		{ label: '3', dclass:"corepad", hotkey: '3', emit: () => ['3'] },
		{ label: '-', alabel: "minus", dclass: "op", hotkey: '-', emit: () => ['-'] },
	    ], [		// row 4
		{ label: 'Ans', alabel: "answer", sclass: "uninvert", hotkey: ['a', 'A'], emit: () => ['Ans'],
		  alt: { label: 'Rnd', alabel: "random", sclass: "doinvert", hotkey: 'R', emit: () => [Math.random()] }
		},
		{ label: 'EXP', alabel: "exponential", hotkey: 'E', emit: () => ['E'] },
		{ label: html`x<sup>y</sup>`, alabel: "X to the power of Y", sclass: "uninvert", emit: () => ['pow(_,',')'],
		  alt: { label: html` <sup>y</sup>√x`, alabel: "Y root of X", sclass: "doinvert", emit: () => ['pow(_,1÷',')'] }
		},
		{ label: '0', dclass:"corepad", hotkey: '0', emit: () => ['0'] },
		{ label: '.', alabel: "point", dclass:"corepad", hotkey: '.', emit: () => ['.'] },
		{ label: '=', alabel: "equals", dclass:"equals op", hotkey: ['=', '\n'], emit: () => ['='] },
		{ label: '+', alabel: "plus", dclass: "op", hotkey: '+', emit: () => ['+'] },
	    ]
	];
    }
    
    _render({_memo, _text, _invert, _aces}) {
	const computedStyles = () => {
	    var style = html``;
	    if (_invert)
		style = html`${style}<style>:host { --span-uninvert-display: none; --span-doinvert-display:table-cell; --div-invert-background:lightgrey;}</style>`;
	    else
		style = html`${style}<style>:host { --span-uninvert-display:table-cell; --span-doinvert-display:none; --div-invert-background:darkgrey;}</style>`;
	    if (_aces)
		style = html`${style}<style>:host { --span-acesAC-display:none; --span-acesCE-display:table-cell;}</style>`;
	    else
		style = html`${style}<style>:host { --span-acesAC-display:table-cell;--span-acesCE-display:none;}</style>`;
	    return style;
	}
	const button = (r,c,side) => {
	    var k = this.keypad[r][c], a = k.alt;
	    const span = (x,alt) => (! x) ? html`` :
		  html`<span class$="${x.sclass||''}" aria-label$="${x.alabel}" tabindex="0" on-tap=${e => this._onTap(e,r,c,alt)}>${x.label}</span>` ;
	    const spans = k && a ? html`${span(k,false)}${span(a,true)}` : html`${span(k,false)}`;
	    return html`<div class$="col ${side} col-${c} ${k.dclass||''}">
		          <div class="in-col">${spans}</div>
		        </div>`;
	}
	const lftGenerate = (r) =>  
	      html`<div class$="row lft row-${r}">${[0,1,2].map(c => button(r,c,'lft'))}</div>`;
	const rgtGenerate = (r) => 
	      html`<div class$="row rgt row-${r}">${[3,4,5,6].map(c => button(r,c,'rgt'))}</div>`;
	return html`
${SharedStyles}
${computedStyles()}
<style>
  :host {
    --div-darker-background: #d6d6d6;
    --div-darker-color: #444;
    --div-darker-border: 1px solid #c6c6c6;
    --div-lighter-background: #f5f5f5;
    --div-lighter-color: #444;
    --div-lighter-border: 1px solid #dedede;
    --div-highlight-background: #4d90fe;
    --div-highlight-color: #fefefe;
    --div-highlight-border: 1px solid #2f5bb7;
    --div-highlight-font-weight: bold;
  }
  div.frame { 
    width:600px;
    height:354px;
    position: relative;
  }
  div.mem {
    width:100%;
    height: 6%;
    display: block;
    position: relative;
    text-align:right;
  }    
  div.txt {
    width: 100%;
    height: 21%;
    display: block;
    position: relative;
    text-align:right;
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
  div.col.op { font-size: 20px; }
  div.col.angle, div.col.erase { font-size: 11px; }
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
  div.in-col span.uninvert { display: var(--span-uninvert-display); }
  div.in-col span.doinvert { display: var(--span-doinvert-display); }
  div.invert div.in-col { background: var(--div-invert-background); }
  div.in-col span.acesAC { display: var(--span-acesAC-display); }
  div.in-col span.acesCE { display: var(--span-acesCE-display); }
  div.col div.in-col { 
    background-color: var(--div-darker-background);
    color: var(--div-darker-color);
    font-size: 15px;
 }
  div.col.corepad div.in-col {
    background-color: var(--div-lighter-background);
    color: var(--span-lighter-color);
    border: var(--span-lighter-border);
  }
  div.col.equals div.in-col { 
    background-color: var(--div-highlight-background);
    color: var(--div-highlight-color);
    border: var(--div-highlight-border);
    font-weight: var(--div-hightlight-font-weight);
  }
</style>
<section>
  <div class="frame">
    <div class="mem"><span class="mems">${_memo}</span></div>
    <div class="txt"><span class="txts">${_text}</span></div>
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
	    const setEmit = (aij, i, j) => {
		if ( ! aij) return;
		if (aij.emit) return
		console.log(`no emit for ${i} ${j}, ${aij.alabel}`)
	    }
	    this.hotkey = {}
	    this.keypad.forEach( (ai, i) => {
		ai.forEach( (aij, j) => {
		    setHotkey(aij)
		    setHotkey(aij.alt);
		    setEmit(aij, i, j);
		    setEmit(aij.alt, i, j);
		});
	    });
	    console.log("setHotkey's and checked emits");
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

    _onTap(event, row, col, alt) { 
	const aij = alt ? this.keypad[row][col].alt : this.keypad[row][col];
	console.log(`_onTap(event, ${row}, ${col}, ${alt})`);
	switch (event.target.textContent) {
	case 'Inv': store.dispatch(calcInvert( ! this._invert )); break;
	case 'Rad': case 'Deg': store.dispatch(calcRadDeg( ! this._raddeg )); break;
	default: store.dispatch(calcKeypadInput(event.target.textContent)); break;
	}
	// console.log(`_onTap( { ${event.target.tagName}, ${event.target.textContent} } )`);
    }
    _onPress(event) {
	store.dispatch(calcKeyboardInput(event.char));
    }
}

window.customElements.define('calculator-base', CalculatorBase);
