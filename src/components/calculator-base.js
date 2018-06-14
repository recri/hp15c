/*
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/
import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

export class CalculatorBase extends connect(store)(PageViewElement) {
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
	    [ { label: 'Rad', alabel: "switch from radians to degrees", dclass:"angle rad" },
	      { label: 'Deg', alabel: "switch from degrees to radians", dclass:"angle deg" },
	      { label: 'a!', alabel: "factorial" },
	      { label: '(', alabel: "left parenthesis", dclass: "op" },
	      { label: ')', alabel: "right parenthesis", dclass: "op" },
	      { label: '%', alabel: "percentage", dclass: "op" },
	      { label: 'AC', alabel: "all clear", dclass: "erase", sclass: "acesAC",
		alt: { label: 'CE', alabel: "clear entry", sclass: "acesCE" }
	      },
	    ],[			// row 1
		{ label: 'Inv', alabel: "inverse", dclass: "inverse" },
		{ label: 'sin', alabel: "sine", sclass: "uninvert",
		  alt: { label: html`sin<sup>&minus;1</sup>`, alabel: 'arcsine', sclass: "doinvert" }
		},
		{ label: 'ln', alabel: "natural logarithm", sclass: "uninvert", 
		  alt: { label: html` e<sup>x</sup>`, alabel: "E to the power of X", sclass: "doinvert" }
		},
		{ label: '7', dclass:"corepad" },
		{ label: '8', dclass:"corepad" },
		{ label: '9', dclass:"corepad" },
		{ label: html`&#xf7;`, alabel: "divide", dclass: "op" },
	    ], [		// row 2
		{ label: html`&pi;`, alabel: "pi" },
		{ label: 'cos', alabel: "cosine", sclass: "uninvert",
		  alt: { label: html`cos<sup>&minus;1</sup>`, alabel: "arccosine", sclass: "doinvert" }
		},
		{ label: 'log', alabel: "logarithm", sclass: "uninvert",
		  alt: { label: html` 10<sup>x</sup>`, alabel: "ten to the power of X", sclass: "doinvert" }
		},
		{ label: '4', dclass:"corepad" },
		{ label: '5', dclass:"corepad" },
		{ label: '6', dclass:"corepad" },
		{ label: html`&#xd7;`, alabel: "multiply", dclass: "op" },
	    ], [		// row 3
		{ label: 'e', alabel: "euler's number" },
		{ label: 'tan', alabel: "tangent", sclass: "uninvert",
		  alt: { label: html` tan<sup>&minus;1`, alabel: "arctangent", sclass: "doinvert" }
		},
		{ label: html`&#x221a;`, alabel: "square root", sclass: "uninvert",
		  alt: { label: html` x<sup>2</sup>`, alabel: "square", sclass: "doinvert" }
		},
		{ label: '1', dclass:"corepad" },
		{ label: '2', dclass:"corepad" },
		{ label: '3', dclass:"corepad" },
		{ label: html`&minus;`, alabel: "minus", dclass: "op" },
	    ], [		// row 4
		{ label: 'Ans', alabel: "answer", sclass: "uninvert",
		  alt: { label: 'Rnd', alabel: "random", sclass: "doinvert" }
		},
		{ label: 'EXP', alabel: "exponential" },
		{ label: html`x<sup>y</sup>`, alabel: "X to the power of Y", sclass: "uninvert",
		  alt: { label: html` <sup>y</sup>&#x221a;x`, alabel: "Y root of X", sclass: "doinvert" }
		},
		{ label: '0', dclass:"corepad" },
		{ label: '.', alabel: "point", dclass:"corepad" },
		{ label: '=', alabel: "equals", dclass:"equals op" },
		{ label: '+', alabel: "plus", dclass: "op" },
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
	    const span = (x) =>
		  (! x) ? html`` :
		  (! x.sclass) ? html`<span aria-label$="${x.alabel}" tabindex="0">${x.label}</span>` :
		  html`<span class$="${x.sclass}" aria-label$="${x.alabel}" tabindex="0">${x.label}</span>` ;
	    const spans = k && a ? html`${span(k)}${span(a)}` : html`${span(k)}`;
	    return k.dclass ? 
		html`<div class$="col ${side} col-${c} ${k.dclass}" id="cell${r}${c}"><div class="in-col">${spans}</div></div>` :
		html`<div class$="col ${side} col-${c}" id="cell${r}${c}"><div class="in-col">${spans}</div></div>`;
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

    _stateChanged(state) {
	this._memo = state.calc.memo;
	this._text = state.calc.text;
	this._invert = state.calc.invert;
	this._aces = state.calc.aces;
    }
}

window.customElements.define('calculator-base', CalculatorBase);
