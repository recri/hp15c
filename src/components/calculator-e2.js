import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';

export class CalculatorE2 extends PageViewElement {
    static get properties() {
	return {
	    _memo: String,
	    _text: String,
	    _shift: Boolean,
	}
    }
    static get keypad() {
	return { 
	    1: { 
		1: { label: 'Rad' },
		2: { label: 'Deg' },
		3: { label: 'a!' },
		4: { label: '(' },
		5: { label: ')' },
		6: { label: '%' },
		7: { label: 'AC' },
	    },
	    2: {
		1: { label: 'Inv' },
		2: { label: 'sin' },
		3: { label: 'ln' },
		4: { label: '7' },
		5: { label: '8' },
		6: { label: '9' },
		7: { label: '/' },
	    },
	    3: {
		1: { label: 'pi' },
		2: { label: 'cos' },
		3: { label: 'log' },
		4: { label: '4' },
		5: { label: '5' },
		6: { label: '6' },
		7: { label: '*' },
	    },
	    4: {
		1: { label: 'e' },
		2: { label: 'tan' },
		3: { label: 'sqrt' },
		4: { label: '1' },
		5: { label: '2' },
		6: { label: '3' },
		7: { label: '-' },
	    },
	    5: {
		1: { label: 'Ans' },
		2: { label: 'EXP' },
		3: { label: 'a<sup>b</sup>' },
		4: { label: '0' },
		5: { label: '.' },
		6: { label: '=' },
		7: { label: '+' },
	    },
	    6: {
		1: { label: '&lt;0>' },
		2: { label: '&lt;1>' },
		3: { label: '&lt;2>' },
		4: { label: 'x' },
		5: { label: 'y' },
		6: { label: 'z' },
		7: { label: '~' },
	    },
	};
    }
    _render({_memo, _text, _shift}) {
	const button = (r,c) => html`<button class="btn btn-${r}-${c}">${CalculatorE3.keypad[r][c].label}</button>`
	const leftGenerate = (r) =>  html`${button(r,1)}${button(r,2)}${button(r,3)}`;
	const rightGenerate = (n) => html`${button(r,4)}${button(r,5)}${button(r,6)}${button(r,7)}`;
	const rowGenerate = (n) =>
	      html`<div class="row row-${n}">
		     <div class="lft lft-${n}">${leftGenerate(n)}</div>
		     <div class="rgt rgt-${n}">${rightGenerate(n)}</div>
		   </div>`
      return html`
      ${SharedStyles}
      <section>
	<div class="frame">
	  <div class="memo">${_memo}</div>
	  <div class="text">${_text}</div>
	  <div class="keys">
	    ${[1,2,3,4,5,6].map(x => rowGenerate(x))}
	  </div>
	</div>
      </section>
    `
  }
}

window.customElements.define('calculator-e2', CalculatorE2);
