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
// what happened is it failed to find Mat
import './common/hp15c.js';

const KeyCap = (code, label, hotkey) => ({ code, label, hotkey });

const KeyCaps = (n, f, g) => ({ n, f, g });

const keypad = [ [ // row 0
    KeyCaps(KeyCap(0, html`√<i>x</i>`, 'q'),
	    KeyCap(1, 'A', 'A'),
	    KeyCap(2, html`<i>x</i><sup>2</sup>`, '@')),
    KeyCaps(KeyCap(10, html`<i>e</i><sup><i>x</i><sup>`,'E'),
	    KeyCap(11,'B','B'),
	    KeyCap(12,'LN',)),
    KeyCaps(KeyCap(20,html`10<sup><i>x</i></sup>`,')'),
	    KeyCap(21,'C','C'),
	    KeyCap(22,'LOG')),
    KeyCaps(KeyCap(30,html`<i>y</i><sup><i>x</i></sup>`,'^'),
	    KeyCap(31,'D','D'),
	    KeyCap(32,'%','%')),
    KeyCaps(KeyCap(40,html`1/<i>x</i>`, '\\'),
	    KeyCap(41,'E'),
	    KeyCap(42,'Δ%')),
    KeyCaps(KeyCap(50,'CHS', '_'),
	    KeyCap(51,'MATRIX'),
	    KeyCap(52,'ABS', 'a')),
    KeyCaps(KeyCap(60,'7', '7'),
	    KeyCap(61,'DEG'),
	    KeyCap(62,'FIX')),
    KeyCaps(KeyCap(70,'8', '8'),
	    KeyCap(71,'SCI'),
	    KeyCap(72,'RAD')),
    KeyCaps(KeyCap(80,'9','9'),
	    KeyCap(81,'ENG'),
	    KeyCap(82,'GRD')),
    KeyCaps(KeyCap(90,'÷', '/'),
	    KeyCap(91,'SOLVE'),
	    KeyCap(92,html`<i>x</i>≤<i>y</i>`))
], [ // row 1
    KeyCaps(KeyCap(100,'SST','T'),
	    KeyCap(101,'LBL'),
	    KeyCap(102,'BST')),
    KeyCaps(KeyCap(110,'GTO'),
	    KeyCap(111,'HYP'),
	    KeyCap(112,html`HYP<sup>-1</sup>`)),
    KeyCaps(KeyCap(120,'SIN', 's'),
	    KeyCap(121,'DIM'),
	    KeyCap(122,html`SIN<sup>-1</sup>`)),
    KeyCaps(KeyCap(130,'COS', 'c'),
	    KeyCap(131,'(i)'),
	    KeyCap(132,html`COS<sup>-1</sup>`)),
    KeyCaps(KeyCap(140,'TAN', 't'),
	    KeyCap(141,'I', 'I'),
	    KeyCap(142,html`TAN<sup>-1</sup>`)),
    KeyCaps(KeyCap(150,'EEX', 'e'),
	    KeyCap(151,'RESULT'),
	    KeyCap(152,'π', 'p')),
    KeyCaps(KeyCap(160,'4', '4'),
	    KeyCap(161,'x↔'),
	    KeyCap(162,'SF')),
    KeyCaps(KeyCap(170,'5','5'),
	    KeyCap(171,'DSE'),
	    KeyCap(172,'CF')),
    KeyCaps(KeyCap(180,'6','6'),
	    KeyCap(181,'ISG'),
	    KeyCap(182,'F?')),
    KeyCaps(KeyCap(190,'×', '*'),
	    KeyCap(191,html`∫<sub><i>y</i></sub><sup><i>x</i></sup>`),
	    KeyCap(192,html`<i>x</i>=0`))
], [ // row 2
    KeyCaps(KeyCap(200,'R/S','P'),
	    KeyCap(201,'PSE'),
	    KeyCap(202,'P/R')),
    KeyCaps(KeyCap(210,'GSB', 'U'),
	    KeyCap(211,html`∑`),
	    KeyCap(212,'RTN')),
    KeyCaps(KeyCap(220,'R↓', 'r'),
	    KeyCap(221,'PRGM'),
	    KeyCap(222,'R↑')),
    KeyCaps(KeyCap(230,html`<i>x</i>↔<i>y</i>`, 'c'),
	    KeyCap(231,'REG'),
	    KeyCap(232,'RND')),
    KeyCaps(KeyCap(240,'←', '\b'),
	    KeyCap(241,'PREFIX'),
	    KeyCap(242,html`CL<i>x</i>`)),
    KeyCaps(KeyCap(250,html`E<br>N<br>T<br>E<br>R<br>`, ['\n', '\r', ' ']),
	    KeyCap(251,'RAN#'),
	    KeyCap(252,html`LST<i>x</i>`, 'L')),
    KeyCaps(KeyCap(260,'1', '1'),
	    KeyCap(261,'→R'),
	    KeyCap(262,'→P')),
    KeyCaps(KeyCap(270,'2','2'),
	    KeyCap(271,'→H.MS'),
	    KeyCap(272,'→H')),
    KeyCaps(KeyCap(280,'3','3'),
	    KeyCap(281,'→RAD'),
	    KeyCap(282,'→DEG')),
    KeyCaps(KeyCap(290,'-', '-'),
	    KeyCap(291,'Re↔Im'),
	    KeyCap(292,'TEST'))
], [ // row 3
    KeyCaps(KeyCap(300,'ON','\e')),
    KeyCaps(KeyCap(310,'f', 'f')),
    KeyCaps(KeyCap(320,'g', 'g')),
    KeyCaps(KeyCap(330,'STO', 'S'),
	    KeyCap(331,'FRAC'),
	    KeyCap(332,'INT', 'i')),
    KeyCaps(KeyCap(340,'RCL', 'R'),
	    KeyCap(341,'USER'),
	    KeyCap(342,'MEM')),
    KeyCaps(KeyCap(350,'')),		// descender of ENTER
    KeyCaps(KeyCap(360,'0', '0'),
	    KeyCap(361,html`<i>x</i>!`, '!'),
	    KeyCap(362,html`<i>x̄</i>`)),
    KeyCaps(KeyCap(370,'.','.'),
	    KeyCap(371,'ŷ,r'),
	    KeyCap(372,'s')),
    KeyCaps(KeyCap(380,html`∑+`,';'),
	    KeyCap(381,'L.R.'),
	    KeyCap(382,html`∑-`)),
    KeyCaps(KeyCap(390,'+', '+'),
	    KeyCap(391,html`P<i>y,x</i>`),
	    KeyCap(392,html`<i>Cy,x</i>`))
] ];

const _ignore = (e) => false;

class HP15CCalculator extends GestureEventListeners(PageViewElement) {
    /* hack to get GestureEventListeners activated */
    constructor() {
	super();
	Gestures.addListener(this, 'tap', _ignore);
	Gestures.addListener(this, 'down', _ignore);
	Gestures.addListener(this, 'up', _ignore);
	this.keypad = keypad;
	this.hotkey = {};
	keypad.forEach(ai => ai.forEach(aij => ['n', 'f', 'g'].forEach(k => {
	    if (aij[k] && aij[k].hotkey) {
		if (typeof aij[k].hotkey === 'string')
		    this.hotkey[aij[k].hotkey] = aij[k];
		else
		    aij[k].hotkey.forEach(key => this.hotkey[key] = aij[k]);
	    }
	})));
	this._fshift = false;
	this._gshift = false;
    }
    disconnectedCallback() {
	super.disconnectedCallback();
	Gestures.removeListener(this, 'tap', _ignore);
	Gestures.removeListener(this, 'down', _ignore);
	Gestures.removeListener(this, 'up', _ignore);
    }
    static get properties() {
	return {
	    _memo: String,
	    _text: String,
	    _future: String,
	    _fshift: Boolean,	// f shift key entered
	    _gshift: Boolean,	// g shift key entered
	}
    }

    _render({_memo, _text, _future, _fshift, _gshift}) {
	const generateStyle = () =>
	      _fshift ? html`<style>span.btn.fshift{display:table-cell}span.btn.gshift{display:none}span.btn.nshift{display:none}</style>` :
	      _gshift ? html`<style>span.btn.fshift{display:none}span.btn.gshift{display:table-cell}span.btn.nshift{display:none}</style>` :
	                html`<style>span.btn.fshift{display:none}span.btn.gshift{display:none}span.btn.nshift{display:table-cell}</style>` ;
	const computedStyles =
	      html`${generateStyle()}`;
	const span = (aijk,i,j,k) => {
	    if (! aijk) return html``;
	    var {code, sclass, alabel, label} = aijk;
	    if ( ! sclass) sclass = '';
	    const kclass = k ? `${k}shift` : '';
	    return sclass && alabel ?
		html`<span aijk=${aijk} id="b${code}" class$="btn ${kclass} ${sclass}" aria-label$="${alabel}" role="button" tabindex="0">${label}</span>` :
		alabel ?
		html`<span aijk=${aijk} id="b${code}" class$="btn ${kclass}" aria-label$="${alabel}" role="button" tabindex="0">${label}</span>` :
		html`<span aijk=${aijk} id="b${code}" class$="btn ${kclass} ${sclass}" role="button" tabindex="0">${label}</span>` ;
	}
	const button = (r,c,side,k) => 
	      k.f && k.g ?
	      html`<div class$="col ${side} col-${c}"><div class="in-col">${['n','f','g'].map(t => span(k[t],r,c,t))}</div></div>` :
	      html`<div class$="col ${side} col-${c}"><div class="in-col">${span(k.n,r,c,false)}</div></div>`
	const lftGenerate = (r) => /* .cwbr */
	      html`<div class$="row lft row-${r}">${[0,1,2,3,4].map(c => button(r,c,'lft',this.keypad[r][c]))}</div>`;
	const rgtGenerate = (r) => /* .cwbr */
	      html`<div class$="row rgt row-${r}">${[5,6,7,8,9].map(c => button(r,c,'rgt',this.keypad[r][c]))}</div>`;
	return html`
${SharedStyles}
${computedStyles}
<style>
  :host {
    --fshift-color: #c58720;
    --gshift-color: #479ea5;
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
  div.in-col span { 
    background-color: var(--darker-background);
    color: white;
    font-size: 14px;
  }
  div.in-col span.fshift { 
    color: var(--fshift-color);
    font-size: 13px
  }
  div.in-col span.gshift { 
    color: var(--gshift-color);
    font-size: 13px
  }

  /* last chance to override */
  #b310 { /* f */
    background-color: var(--fshift-color);
    color: black;
  }
  #b320 { /* g */
    background-color: var(--gshift-color);
    color: black;
  }
  .row.row-2 .col.col-5 .in-col { /* ENTER */
    height:165%;
  }
  .row.row-2 .col.col-5 div.in-col span.btn.nshift {
/* this appears to be completely screwed
    writing-mode: vertical-lr;
    -webkit-writing-mode: vertical-lr;
    -ms-writing-mode: vertical-lr;
    text-orientation: upright; */
  }
  .row.row-3 .col.col-5 { /* button beneath ENTER */
    display:none
  }
  span.btn.gshift { font-size: 20px; }
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
    div.lft.side{width:50%}	/* .cwsbcm? */
    div.rgt.side{left:50%;width:50%}	/* .cwbbcm>? */
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
    _onTap(event) { this._onEmit(event.target.aijk); }
    _onDown(event) { 
	if (event.altKey || event.ctrlKey || event.metaKey) return;
	if (this.hotkey[event.key]) {
	    this._onEmit(this.hotkey[event.key]);
	    event.preventDefault()
	} else if (event.key === ' ' && this._focusee.aijk) {
	    // if ' ' and we are focused on a button, fire that button
	    this._onEmit(this._focusee.aijk);
	    event.preventDefault()
	} else {
	    // console.log(`_onDown('${event.key}') left to system`);
	}
    }
    
    _onEmit(aijk) {
	// console.log(`_onEmit('${aijk.label}')`);
	if (aijk) {
	    switch (aijk.code) {
	    case 310: this._fshift = true; this._gshift = false; break;
	    case 320: this._gshift = true; this._fshift = false; break;
	    case 240: case 241: case 242:  this._fshift = this._gshift = false; break
	    }
	}
    }

}

window.customElements.define('hp15c-calculator', HP15CCalculator);
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
    '\x12': _(OpRand) // ctl-r
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
/*
** pertinent props would be display contents,
** though most of the fidgety stuff could be
** done with css. fshift and gshift would control
** the keycap displayed.
*/

