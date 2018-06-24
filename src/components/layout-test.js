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

const _ignore = (e) => false;

export class LayoutTest extends GestureEventListeners(PageViewElement) {
    /* hack to get GestureEventListeners activated */
    constructor() {
	super();
	Gestures.addListener(this, 'tap', _ignore);
	Gestures.addListener(this, 'down', _ignore);
	Gestures.addListener(this, 'up', _ignore);
	this._neg = '-';
	this._digits = ['8','8','8','8','8','8','8','8','8','8'];
	this._decimals = [',',',',',',',',',',',',',',',',',',','];
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
	    _fshift: Boolean,
	    _gshift: Boolean,
	    _trigmode: String,
	    _complex: Boolean,
	    _program: Boolean,
	    _neg: String,
	    _digits: Array,
	    _decimals: Array,
	}
    }

    _render({_neg, _digits, _decimals}) {
	const digits = [
	    [' _ ','   ',' _ ',' _ ','   ',' _ ',' _ ',' _ ',' _ ',' _ ','   ',' _ ','   ',' _ ','   ',' _ ','   ','   ','   ','   '],
	    ['| |','  |',' _|',' _|','|_|','|_ ','|_ ','  |','|_|','|_|',' _ ','|_|','|_ ','|  ',' _|','|_ ',' _ ',' _ ','|_|','   '],
	    ['|_|','  |','|_ ',' _|','  |',' _|','|_|','  |','|_|',' _|','   ','| |','|_|','|_ ','|_|','|_ ','|_|','|  ','   ','   '],
	]
	const segments = [
	    svg`<path class="top" d="M 3 1 L 17 1 13 5 7 5 Z" />`,
	    svg`<path class="lup" d="M 2 3 L 6 7 6 10 2 14 Z" />`,
	    svg`<path class="rup" d="M 18 3 L 18 14 14 10 14 7 Z" />`,
	    svg`<path class="mid" d="M 6.5 12.5 L 13.5 12.5 16 14.5 13.5 16.5 6.5 16.5 4 14.5 Z" />`,
	    svg`<path class="low" d="M 2 15 L 6 19 6 22 2 26 Z" />`,
	    svg`<path class="row" d="M 18 15 L 18 26 14 22 14 19 Z" />`,
	    svg`<path class="bot" d="M 3 28 L 17 28 13 24 7 24 Z" />`
	];
	const negsign = svg`<path class="neg" d="M 4 13 L 16 13 16 16 4 16 Z" />`;
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
	const decimal = (d) => {
	    const head = svg`<rect x="2" width="4" height="4" />`;
	    const tail = svg`<path class="comma" d="M 2 6 L 6 6 1 9 0 9" />`;
	    return svg`${d !== ' '?head:''}${d === ','?tail:''}`;
	}
	const neg_digits_and_decimals = (neg, digits, decimals) => {
	    const width = 11*27, height = 34;
	    const digit_top = 0, decimal_top = 24;
	    const digit_left = (i) => 17+i*27, decimal_left = (i) => 36+i*27;
	    const skew_x = -10;
	    const digit_and_decimal = (i) => {
		return svg`<g transform$="translate(${digit_left(i)} ${digit_top})">${digit(digits[i])}</g>
			   <g transform$="translate(${decimal_left(i)} ${decimal_top})">${decimal(decimals[i])}</g>`;
	    }
	    return html`<svg id="digits" viewBox="0 0 287 34">
			  <g transform="skewX(-5)">
			    ${neg === '-'?negsign:''}
			    ${digits.map((d,i) => digit_and_decimal(i))}
			  </g>
			</svg>`;
	}
	return html`
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
  .calc { 
    position:relative; 
    width:100%; /* 640px; */
    height:62.5vw; /* 400px; */
    background-color:#322;
  }
  .bezel {
    position:absolute;
    top: 1.25%;
    left: 3.3%;
    width: 93.5%;
    height: 27.5%;
    background-color:#f7f7f7;
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
    background-color:#878777;
  }
  .lcd svg { fill:#456; }
  .indicator {
    position:absolute;
    top:75%;
    left:0;
    width:100%;
    height:25%;
    font-size:10px;		/* at 640px overall width */
    background-color:transparent;
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
    left:3.5%;
    height:65%;
    width:92%;
    border-style:solid;
    border-width:3px 5px 10px 5px;
    border-color:#aaa;
  }
</style>
<section>
    <div class="calc">
      <div class="bezel">
        <div class="slot"><slot></slot></div>
	<div class="lcd">
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
      <div class="keypad"></div>
    </div>
</section>`;
    }

    _didRender(properties, changed, previous) {
	if ( ! this.focused) {
	    this.focused = true;
	}
	if (changed) {
	    for (let p in changed) {
		console.log(`_didRender: ${p} is in changeList`)
	    }
	}
    }
    
    _onFocus(event) { this._focusee = event.target; }
    _onBlur(event) { this._focusee = null; }
    _onTap(event, aij) { this._onEmit(aij); }
    _onDown(event) { 
	if (event.altKey || event.ctrlKey || event.metaKey) return;
	if (this.hotkey[event.key]) {
	    this._onEmit(this.hotkey[event.key]);
	    event.preventDefault()
	} else if (event.key === ' ' && this._focusee.aij) {
	    // if ' ' and we are focused on a button, fire that button
	    this._onEmit(this._focusee.aij);
	    event.preventDefault()
	} else {
	    // console.log(`_onDown('${event.key}') left to system`);
	}
    }
    
    _onEmit(aij) {
	// console.log(`_onEmit('${aij.label}')`);
	if (aij) {
	    const emit = aij.parser(this._text, this._future, this._history);
	    if (emit !== null) store.dispatch(calcInput(emit));
	}
    }
}

window.customElements.define('layout-test', LayoutTest);
