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
	    [ { label: 'Rad', alabel: "switch from radians to degrees", clnames:"angle" },
	      { label: 'Deg', alabel: "switch from degrees to radians", clnames:"angle" },
	      { label: 'a!', alabel: "factorial" },
	      { label: '(', alabel: "left parenthesis" },
	      { label: ')', alabel: "right parenthesis" },
	      { label: '%', alabel: "percentage" },
	      { label: 'AC', alabel: "all clear", clnames: "acesAC",
		alt: { label: 'CE', alabel: "clear entry", clnames: "acesCE" }
	      },
	    ],[			// row 1
		{ label: 'Inv', alabel: "inverse", clnames: "inverse" },
		{ label: 'sin', alabel: "sine", clnames: "uninvert",
		  alt: { label: html`sin<sup>&minus;1</sup>`, alabel: 'arcsine', clnames: "doinvert" }
		},
		{ label: 'ln', alabel: "natural logarithm", clnames: "uninvert", 
		  alt: { label: html` e<sup>x</sup>`, alabel: "E to the power of X", clnames: "doinvert" }
		},
		{ label: '7' },
		{ label: '8' },
		{ label: '9' },
		{ label: html`&#xf7;`, alabel: "divide" },
	    ], [		// row 2
		{ label: html`&pi;`, alabel: "pi" },
		{ label: 'cos', alabel: "cosine", clnames: "uninvert",
		  alt: { label: html`cos<sup>&minus;1</sup>`, alabel: "arccosine", clnames: "doinvert" }
		},
		{ label: 'log', alabel: "logarithm", clnames: "uninvert",
		  alt: { label: html` 10<sup>x</sup>`, alabel: "ten to the power of X", clnames: "doinvert" }
		},
		{ label: '4' },
		{ label: '5' },
		{ label: '6' },
		{ label: html`&#xd7;`, alabel: "multiply" },
	    ], [		// row 3
		{ label: 'e', alabel: "euler's number" },
		{ label: 'tan', alabel: "tangent", clnames: "uninvert",
		  alt: { label: html` tan<sup>&minus;1`, alabel: "arctangent", clnames: "doinvert" }
		},
		{ label: html`&#x221a;`, alabel: "square root", clnames: "uninvert",
		  alt: { label: html` x<sup>2</sup>`, alabel: "square", clnames: "doinvert" }
		},
		{ label: '1' },
		{ label: '2' },
		{ label: '3' },
		{ label: html`&minus;`, alabel: "minus" },
	    ], [		// row 4
		{ label: 'Ans', alabel: "answer", clnames: "uninvert",
		  alt: { label: 'Rnd', alabel: "random", clnames: "doinvert" }
		},
		{ label: 'EXP', alabel: "exponential" },
		{ label: html`x<sup>y</sup>`, alabel: "X to the power of Y", clnames: "uninvert",
		  alt: { label: html` <sup>y</sup>&#x221a;x`, alabel: "Y root of X", clnames: "doinvert" }
		},
		{ label: '0' },
		{ label: '.', alabel: "point" },
		{ label: '=', alabel: "equals" },
		{ label: '+', alabel: "plus" },
	    ]
	];
    }
    
    _render({_memo, _text, _invert, _aces}) {
	const computedStyles = () => {
	    var style = html``;
	    if (_invert)
		style = html`${style}<style>span.uninvert{display:none;}span.doinvert{display:inline;}div.invert{background:lightgrey;}</style>`;
	    else
		style = html`${style}<style>span.uninvert{display:inline;}span.doinvert{display:none;}div.invert{background:darkgrey;}</style>`;
	    if (_aces)
		style = html`${style}<style>span.acesAC{display:none;}span.acesCE{display:inline;}</style>`;
	    else
		style = html`${style}<style>span.acesAC{display:inline;}span.acesCE{display:none;}</style>`;
	    return style;
	}
	const button = (r,c) => {
	    var k = this.keypad[r][c], a = k.alt;
	    const span = (x) =>
		  (! x) ? html`` :
		  (! x.clnames) ? html`<span aria-label$="${x.alabel}" tabindex="0">${x.label}</span>` :
		  html`<span class$="${x.clnames}" aria-label$="${x.alabel}" tabindex="0">${x.label}</span>` ;
	    const spans = k && a ?
		  html`${span(k)}${span(a)}` :
		  html`${span(k)}`;
	    // console.log(`button(${r},${c}) -> ${k} -> ${k.label} ? ${k.clnames}?`);
	    return html`<div class$="col col-${c}" id="cell${r}${c}"><div>${spans}</div></div>`
	}
	const lftGenerate = (r) =>  
	      html`<div class$="row row-${r}">${[0,1,2].map(c => button(r,c))}</div>`;
	const rgtGenerate = (r) => 
	      html`<div class$="row row-${r}">${[3,4,5,6].map(c => button(r,c))}</div>`;
	return html`
${SharedStyles}
${computedStyles()}
<style>
  div.frame { width:600px; height:354px; }
  div.mem { width:100%; height: 6%; display: block; position: relative; text-align:right; }    
  div.txt { width: 100%; height: 21%; display: block; position: relative; text-align:right; }
  div.kpd { width:100%; height: 63%; display: block; position: relative; text-align:center; }
  div.lft, div.rgt { display: inline-block; top:0; height:100%; overflow:hidden; position:absolute; vertical-align:bottom; }
  div.lft { left: 0; width:42.85%; }
  div.rgt { left: 42.85%; width:57.15%; }
  div.row { display: block; height: 20%; width:100%; }
  div.lft div.col { width:33.3%; }
  div.rgt div.col { width:25.0%; }
  div.col { display: inline-block; position: absolute; vertical-align: bottom; }
  div.row-0 { top:0%; }
  div.row-1 { top:20%; }
  div.row-2 { top:40%; }
  div.row-3 { top:60%; }
  div.row-4 { top:80%; }
  div.col-0 { left:0%; }
  div.col-1 { left:33.3%; }
  div.col-2 { left:66.6%; }
  div.col-3 { left:0%; }
  div.col-4 { left:25%; }
  div.col-5 { left:50%; }
  div.col-6 { left:75%; }
  /* div.kpd span { display:inline; } */
</style>
<section>
  <div class="frame">
    <div class="mem"><span class="mems">${_memo}</span></div>
    <div class="txt"><span class="txts">${_text}</span></div>
    <div class="kpd">
      <div class="lft">
        ${[0,1,2,3,4].map(r => lftGenerate(r))}
      </div>
      <div class="rgt">
        ${[0,1,2,3,4].map(r => rgtGenerate(r))}
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
