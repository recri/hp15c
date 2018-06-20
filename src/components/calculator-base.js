/*
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at 
https://github.com/recri/calculator/blob/master/LICENSE.txt.
*/
import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

import { SharedStyles } from './shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';
import { calcInvert, calcRadDeg, calcInput, calcAC, calcCE, calcEval } from '../actions/calc.js';

//import { Algebra } from './ganja.js';
import {Parser, Expression} from './expr-eval.js';
const _parser = new Parser();

const _ignore = (e) => false;

export class CalculatorBase extends connect(store)(GestureEventListeners(PageViewElement)) {
    /* hack to get GestureEventListeners activated */
    constructor() {
	super();
	Gestures.addListener(this, 'tap', _ignore);
	Gestures.addListener(this, 'down', _ignore);
	Gestures.addListener(this, 'up', _ignore);
	this.keypad = this.keypadInit();
	this.hotkey = this.hotkeyInit();
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
	    _future: String,	// Closing paren's deferred
	    _invert: Boolean,	// Show normal or inverted labels
	    _raddeg: Boolean,	// Use Rad or Deg for angle
	    _history: Array,	// History of input for the current expression
	    _ans: String,	// Last evaluation result
	}
    }

    _stateChanged(state) {
	this._memo = state.calc.memo;
	this._text = state.calc.text;
	this._future = state.calc.future;
	this._invert = state.calc.invert;
	this._raddeg = state.calc.raddeg;
	this._history = state.calc.history;
	this._ans = state.calc.ans;
    }

    // Keypad is a list of rows, 
    // each of which is a list of cells,
    // each of which is a stack of zero or more key definitions.
    // These are created left column group first, 
    // then right column group 
    // to set the tab order
    // some keys have alternate labels/functions
    // we overload the table with additional lexical analysis 
    // and syntactical parse information
    keypadInit() {
	// operators with funky unicode
	const multiply = '×';
	const divide = '÷';
	const radical = '√';
	const number = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/


	// the parser
	const parseExpression = (str) => {
	    try {
		return [true, _parser.evaluate(str.replace(/×/g, '*').replace(/÷/g, '/').replace(/√/, 'sqrt'), {Ans: this._ans})];
	    } catch(e) {
		return [false, e];
	    }
	}

	// parsing helpers, these are to construct the new text and future given
	// an input which might replace the existing text, be appended to the 
	// existing text, or appended with a free '×'.

	// go back through text counting open and close parens
	// to find the first unmatched open.  split the text
	// into the part up to and including the unmatched open
	// and the part after the unmatched open
	const findLastUnmatchedParen = (text, future, history) => {
	    let nopen = 0, nclose = 0;
	    for (let i = text.length-1; i >= 0; i -= 1) {
		const c = text.charAt(i);
		if (c == '(')
		    nopen += 1;
		else if (c == ')')
		    nclose += 1;
		if (nopen > nclose)
		    return [text.slice(0,i+1), text.slice(i+1)]
	    }
	    return ['', text];
	}

	// find the left hand side expression in text
	// return a list with text split into before the left hand side
	// and the left hand side.
	// or return null if there is no left hand side
	const findLHS = (text, future, history) => {
	    // if the acc contains nothing but the previous answer
	    if (history.length == 0) return ['', text];
	    // split at the last unmatched open paren
	    // which will be the split ['', text] 
	    // if everything matches.
	    const [llhs, lhs] = findLastUnmatchedParen(text);
	    const [success, ans] = parseExpression(lhs);
	    return success ? [ llhs, lhs ] : null;
	}

	// ensure that we have no left hand side
	// by throwing away the answer from the last evaluation
	// or by inserting an '×' 
	// return the part of text we keep
	const findNoLHS = (text, future, history) => {
	    // if the accumulator has the last result in it, just drop it
	    if (history.length === 0) return '';
	    // if findLHS finds a LHS
	    if (findLHS(text, future, history)) return `${text} ${multiply}`;
	    return text;
	}

	//
	// parsing functions for keypad entries
	//
	// the simplest ones do nothing to text and future, they simply twiddle the
	// calculator state and return null.
	const parseRadDeg = (op) => (text, future, history) => {
	    store.dispatch(calcRadDeg());
	    return null;
	}
	const parseAC = (op) => (text, future, history) => {
	    store.dispatch(calcAC());
	    return null;
	}
	const parseCE = () => (text, future, history) => {
	    store.dispatch(calcCE());
	    return null;
	}
	const parseInv = (op) => (text, future, history) => {
	    store.dispatch(calcInvert());
	    return null;
	}

	// if the input is an infix binary operator, a postfix unary operator, or a GrabLHS operator, 
	// then we need to have a left hand side for it to combine with.
	// that's fine, except that + and - are also unary operators and they can appear after E
	// in the exponential notation.
	const parseInfix = (op) => (text, future, history) =>
	      findLHS(text, future, history) ? [ `${text}${op}`, future ] : null ;
	const parsePostfix = (op) => (text, future, history) =>
	      findLHS(text, future, history) ? [ `${text}${op}`, future ] : null;
	const parseGrabLHS = (op) => (text, future, history) => {
	    // okay, so this should use the part of the text after the most recentlyu
	    // opened paren that has not closed, or the beginning of everything
	    const find = findLHS(text, future, history);
	    if (!find) return null;
	    const [llhs, lhs] = find;
	    return [ `${llhs}${op.replace(/_/, lhs)}`, future ] ;
	}
        const parseGrabLHS2 = (op, fut) => (text, future, history) => {
	    const find = findLHS(text, future, history);
	    if (!find) return null;
	    const [llhs, lhs] = find;
	    return [ `${llhs}${op.replace(/_/, lhs)}`, `${fut}${future}` ];
	}
	// rparen needs a complete LHS, too, and an rparen in the future
	const parseRparen = (op) => (text, future, history) =>
	      future.length && future.charAt(0) === ')' && findLHS(text, future, history) ?
	      [ `${text})`, future.slice(1) ] : null ;

	// open paren, prefix operators, and whole numbers need no left hand side
	const parseLparen = (op) => (text, future, history) =>
	      [ `${findNoLHS(text, future, history)}(`, `)${future}` ] ;
	const parsePrefix = (op) => (text, future, history) =>
	      [ `${findNoLHS(text, future, history)}${op}(`, `)${future}` ];
	const parsePrefix2 = (op, fut) => (text, future, history) =>
	      [ `${findNoLHS(text, future, history)}${op}`, `${fut}${future}` ];
	const parseConstant = (op) => (text, future, history) =>
	      [ `${findNoLHS(text, future, history)}${op}`, future ];
	const parseAns = (op) => (text, future, history) =>
	      [ `${findNoLHS(text, future, history)}${op}`, future ];
	const parseRnd = (op) => (text, future, history) =>
	      [ `${findNoLHS(text, future, history)}${Math.random().toFixed(7)}`, future ];

	// parts of numbers, also [-+],
	const parseDigit = (op) => (text, future, history) =>
	      history.length === 0 ? [ op, future ] : 
	      ! text.match(/([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/) ? [ `${findNoLHS(text, future, history)}${op}`, future ] :
	      [ `${text}${op}`, future ] ;
	const parseRadix = (op) => (text, future, history) =>
	      history.length === 0 ? [ op, future ] :
	      ! text.match(/([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/) ? [ `${findNoLHS(text, future, history)}${op}`, future ] :
	    text.match(/([0-9]*\.[0-9]+|[0-9]+\.[0-9]*)$/) ? null :
	    [ `${text}${op}`, future ];
	const parseExp = (op) => (text, future, history) =>
	      text.match(/([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$/) ?
	      [ `${text}E`, future ] : null;

	// minus and plus act as infix or prefix or as prefix in number exponents
	const parseInfixPrefix = (op) => (text, future, history) => {
	    console.log(`parseInfixPrefix(${op})(${text},...)`);
	    // take care of the numbers first
	    if (text.slice(-1) === 'E') return [`${text}${op}`, future]
	    // try to make an infix operator
	    const infix = parseInfix(op)(text, future, history);
	    if (infix) return infix;
	    return parsePrefix(op)(text, future, history);
	}
	
	// whole number sources, want no left hand side
	// the evaluate
	const parseEval = (op) => (text, future) => {
	    const [success, ans] = parseExpression(text)
	    if (success)
		store.dispatch(calcEval(ans.toFixed(7)));
	    else
		console.log(expr.toString());
	    // console.log(expr.toString().split('\n')[0]);
	    return null;
	}

	// full key definition
	const key = (label, alabel, sclass, hotkey, parser, alt) => {
	    var key = { label: label };		// key label
	    if (alabel) key.alabel = alabel;	// aria-label
	    if (sclass) key.sclass = sclass;	// class at span level
	    if (hotkey) key.hotkey = hotkey;	// keyboard accelerators
	    // text emitted, either text before insertion point
	    // or a list of two elements before and after insertion point
	    key.parser = parser;
	    if (alt) key.alt = alt;		// the alternate key definition under invert shift
	    return key;
	}

	// core keypad key definition
	const corepad = (label, alabel) =>
	      key(label, alabel, 'corepad', label, alabel ? parseRadix(label) : parseDigit(label));
	const keypad = 
	      [ [ // row 0
 		  key('Rad', "switch from radians to degrees", "angle rad", null, parseRadDeg('Rad')),
		  key('Deg', "switch from degrees to radians", "angle deg", 'D',  parseRadDeg('Deg')),
		  key('x!', "factorial", null, '!', parsePostfix('!')),
		  key('(', "left parenthesis", "op", '(', parseLparen('(')),
		  key(')', "right parenthesis", "op", ')', parseRparen(')')),
		  key('%', "percentage", "op", '%', parseInfix('%')),
		  key('AC',"all clear", "erase acesAC", 'Delete', parseAC('AC'),
		      key('CE', "clear entry",  "erase acesCE", 'Backspace', parseCE('CE')))
	      ],[ // row 1
		  key('Inv', "inverse", "inverse", null, parseInv('Inv')),
		  key('sin', "sine", "uninvert", 's', parsePrefix('sin'),
		      key(html`sin<sup>&minus;1</sup>`, 'arcsine', "doinvert", 'S', parsePrefix('arcsin'))),
		  key('ln', "natural logarithm", "uninvert", ['l','L'], parsePrefix('ln'), 
		      key(html` e<sup>x</sup>`, "e to the power of X", "doinvert", null, parsePrefix('exp'))),
		  corepad('7'),
		  corepad('8'),
		  corepad('9'),
		  key('÷', "divide", "op", '/', parseInfix('÷')),
	      ], [ // row 2
		  key('π', "pi", null, 'p', parseConstant('π')),
		  key('cos', "cosine", "uninvert", 'c', parsePrefix('cos'),
		      key(html`cos<sup>&minus;1</sup>`, "arccosine", "doinvert", 'C', parsePrefix('arccos') )),
		  key('log', "logarithm", "uninvert", ['g','G'], parsePrefix('log'),
		      key( html` 10<sup>x</sup>`, "ten to the power of X", "doinvert", null, parsePrefix2('pow(10,', ')'))),
		  corepad('4'),
		  corepad('5'),
		  corepad('6'),
		  key('×', "multiply", "op", '*', parseInfix('×')),
	      ], [ // row 3
		  key('e', "euler's number", null, 'e', parseConstant('e')),
		  key('tan', "tangent", "uninvert", 't', parsePrefix('tan'),
		      key( html` tan<sup>&minus;1`, "arctangent", "doinvert", 'T', parsePrefix('arctan'))),
		  key('√', "square root", "uninvert", ['q', 'Q'], parsePrefix('√'),
		      key( html` x<sup>2</sup>`, "square", "doinvert", null, parseGrabLHS('pow(_,2)'))),
		  corepad('1'),
		  corepad('2'),
		  corepad('3'),
		  key('-', "minus", "op", '-', parseInfixPrefix('-')),
	      ], [		// row 4
		  key('Ans', "answer", "uninvert", ['a', 'A'], parseAns('Ans'),
		      key('Rnd', "random", "doinvert", 'R', parseRnd('Rnd') )),
		  key('EXP', "enter exponential", null, 'E', parseExp('Exp')),
		  key( html`x<sup>y</sup>`, "X to the power of Y", "uninvert", '^', parseGrabLHS2('pow(_,',')'),
		       key( html` <sup>y</sup>√x`, "Y root of X", "doinvert", 'r', parseGrabLHS2('pow(_,1÷',')'))),
		  corepad('0'),
		  corepad('.', "point"),
		  key('=', "equals", "equals op", ['=', 'Enter'], parseEval('=')),
		  key('+', "plus", "op", '+', parseInfixPrefix('+')),
	      ] ];
	return keypad;
    }
    
    hotkeyInit() {
	// install keyboard accelerators
	var hotkey = {}
	const setHotkey = (aij) => {
	    if (aij && aij.hotkey) {
		if (typeof(aij.hotkey) === 'string') {
		    hotkey[aij.hotkey] = aij;
		} else {
		    aij.hotkey.forEach((k) => hotkey[k] = aij)
		}
	    }
	}
	this.keypad.forEach( (ai, i) => {
	    ai.forEach( (aij, j) => {
		setHotkey(aij)
		setHotkey(aij.alt);
	    });
	});
	return hotkey;
    }

    _render({_memo, _text, _future, _invert, _raddeg}) {
	const computedStyleInvert =  _invert ?
	      html`<style>:host {--uninvert-display:none;--doinvert-display:table-cell;--invert-background:white;}</style>` :
	      html`<style>:host {--uninvert-display:table-cell;--doinvert-display:none;--invert-background:var(--darker-background);}</style>` ;
	const computedStyleAces = _text !== '0'  ?
	      html`<style>:host { --acesAC-display:none;--acesCE-display:table-cell;}</style>` :
	      html`<style>:host { --acesAC-display:table-cell;--acesCE-display:none;}</style>` ;
	const computedStyleRadDeg = _raddeg ?
	      html`<style>:host {--angle-rad-color:darkgrey;--angle-deg-color:black}</style>` :
	      html`<style>:host {--angle-rad-color:black;--angle-deg-color:darkgrey}</style>` ;
	const computedStyles =
	      html`${computedStyleInvert}${computedStyleAces}${computedStyleRadDeg}`;
	const span = (x,r,c,alt) => {
	    if (! x) return html``;
	    const tap = (e) => this._onTap(e,x);
	    return x.sclass && x.alabel ?
		html`<span aij=${x} class$="btn ${x.sclass}" aria-label$="${x.alabel}" role="button" tabindex="0" on-tap=${e => tap(e)}>${x.label}</span>` :
		x.alabel ?
		html`<span aij=${x} class="btn" aria-label$="${x.alabel}" role="button" tabindex="0" on-tap=${e => tap(e)}>${x.label}</span>` :
		html`<span aij=${x} class$="btn ${x.sclass}" role="button" tabindex="0" on-tap=${e => tap(e)}>${x.label}</span>` ;
	}
	const button = (r,c,side,k) => 
	      html`<div class$="col ${side} col-${c}"><div class="in-col">${span(k,r,c,false)}${span(k.alt,r,c,true)}</div></div>`;
	const lftGenerate = (r) => /* .cwbr */
	      html`<div class$="row lft row-${r}">${[0,1,2].map(c => button(r,c,'lft',this.keypad[r][c]))}</div>`;
	const rgtGenerate = (r) => /* .cwbr */
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
  div.mem sup { /* .cwled sup */
    position:relative;
    bottom:.4em;
    font-size:75%;
    vertical-align:baseline
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
    display:table-cell;
    overflow:hidden;
    padding-right:2%;
    vertical-align:bottom;
    width:100%
  }
  span.mem211 { /* .cwclet */
    -moz-user-select:text;
    -webkit-user-select:text;
    -ms-user-select:text;
    position:absolute;
    bottom:0;
    font-family:Roboto-Regular,helvetica,arial,sans-serif;
    font-weight:lighter;
    right:0;
    white-space:nowrap
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
    left: 1%;
    position: absolute;
    top: 12.5%;
    width: 98%;
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
  span.txt31211 { /* _future */
    float: right;
    /* font-family: Roboto-Regular,helvetica,arial,sans-serif; */
    font-weight: lighter;
    white-space: nowrap;
    color: #888;
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
  }
  /* left and right sides of keypad */
  div.side { /* .cwcd */
    display: inline-block;
    height:100%;
    overflow:hidden;
    position:absolute;
  }
  div.lft.side { /* .cwcd .cwsbc */
    width:42.85%;
    left:0;
  }
  div.rgt.side { /* .cwcd .cwbbc */
    width:57.15%;
    left:42.85%;
  }
  /* rows */
  div.row { /* .cwbr */
    display: block;
    height: 20%;
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
    width:33.3%;
   }
  div.rgt.col { /* .cwbbc-c */
    width:25.0%;
  }
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
  div.col-0 { left:0%; }	/* cwsbc1 */
  div.col-1 { left:33.3%; }	/* cwsbc2 */
  div.col-2 { left:66.6%; }	/* cwsbc3 */
  div.col-3 { left:0%; }	/* cwbbc1 */
  div.col-4 { left:25%; }	/* cwbbc2 */
  div.col-5 { left:50%; }	/* cwbbc3 */
  div.col-6 { left:75%; }	/* cwbbc4 */
  div.in-col span { 
    background-color: var(--darker-background);
    color: var(--darker-color);
    font-size: 15px;
 }
  /* last chance to override */
  span.btn.op { font-size: 20px; }
  div.in-col span.angle, div.in-col span.erase { font-size: 11px; }
  div.in-col span.uninvert { display: var(--uninvert-display); }
  div.in-col span.doinvert { display: var(--doinvert-display); }
  div.in-col span.inverse { background-color: var(--invert-background); }
  div.in-col span.acesAC { display: var(--acesAC-display); }
  div.in-col span.acesCE { display: var(--acesCE-display); }
  div.in-col span.angle.rad { color: var(--angle-rad-color) }
  div.in-col span.angle.deg { color: var(--angle-deg-color) }
  span.btn.corepad {
    background-color: var(--lighter-background);
    color: var(--lighter-color);
    border: var(--lighter-border);
  }
  span.btn.equals { 
    background-color: var(--highlight-background);
    color: var(--highlight-color);
    border: var(--highlight-border);
    font-weight: var(--hightlight-font-weight);
  }
  @media screen and (max-width:459px){
    div.frm { width:100% }
    div.lft.side{display:none} /* .cwsbcm? */
    div.rgt.side{left:0%;width:100%} /* .cwbbcm? */
    div.txt1{left:2%;width:96%} /* .cwtlb */
    div.mem2{left:2%;width:96%} /* cwletbl */
  }
  @media screen and (min-width:460px) and (max-height:450px){
    div.frm(width:100%)
    div.lft.side{width:42.85%}	/* .cwsbcm? */
    div.rgt.side{left:42.85%;width:57.15%}	/* .cwbbcm>? */
    div.txt1{left:1%;width:98%}	/* .cwtlb */
    div.frm11{height:230px}	/* .cwmd */
    div.mem{height:7%}		/* .cwled */
    div.txt{height:25%}		/* .cwtld */
    div.kpd{height:68%}		/* .cwbsc */
  }
</style>
<section>
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
	    <span class="txt3121" id="txt3121i">
	      ${_text}  <span class="txt31211"> ${_future}</span>
	    </span>  <!-- .cwcot, #cwos -->
	    <script>
(function(){
    console.log("nonce-less nonce called");
    var a=this._shadowRoot.getElementById("txt331i"),b; /* refers to span above by id */
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
      <div class="kpd">		<!-- .cwbsc -->
        <div class="lft side">	<!-- .cwcd .cwsbc -->
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
	if ( ! this.focused) {
	    /* arrange to adjust the classes of an enclosing div when
	     * the text entry div gets hovered or focused */
	    const div31 = this.shadowRoot.getElementById('txt31i');
	    const div1 = this.shadowRoot.getElementById('txt1i');
	    div31.addEventListener('focus', _ => div1.classList.add('focused'));
	    div31.addEventListener('blur', _ => div1.classList.remove('focused'));
	    div31.addEventListener('mouseover', _ => div1.classList.add('hovered'));
	    div31.addEventListener('mouseout', _ => div1.classList.remove('hovered'));
	    /* arrange to monitor focus and keyboard events for the component */
	    this.shadowRoot.addEventListener('focus', e => this._onFocus(e), true);
	    this.shadowRoot.addEventListener('blur', e => this._onBlur(e), true);
	    this.shadowRoot.addEventListener('keydown', e => this._onDown(e));
	    /* and grab the focus on load, too. */
	    div31.focus();
	    this.focused = true;
	}
    }
    
    _onFocus(event) {
	// console.log(`onFocus(${event.target.className})`);
	this._focusee = event.target;
	// if (this._focusee.aij) console.log(`onFocus(${this._focusee.aij})`);
    }
    _onBlur(event) {
	// console.log(`onBlur(${event.target.className})`);
	this._focusee = null;
    }
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

window.customElements.define('calculator-base', CalculatorBase);
