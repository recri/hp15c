/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';
import { SharedStyles } from './shared-styles.js';

class CalculatorSettings extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Settings</h2>
        <p>
	  The options for the algebra should be: 
	    <ul>
	      <li><b>R</b> - Keep it real.</li>
	      <li><b>C</b> - Make it complex.</li>
	      <li><b>R<sup>2</sup></b> - In the plane.</li>
	      <li><b>Q</b> - Quaternionic.</li>
	      <li><b>R<sup>3</dup></b> - Free to fly.</li>
	   </ul>
	  with the appropriate basis elements available, and the
	  reversion/conjugation operation.  The rest of the apparatus
	  can be stripped.
	</p>
	<p>
	  The only other option I see so far is the number of
	  digits to display when the fractions get fractious.
	  Should arrange to use the numbers in full precision
	  regardless of the precision displayed.
        </p>
        <p>
	  The printout tape should just be kept, you can erase it
	  from the calculator-tape viewer.
	</p>
	<p>
	  The unused buttons can be used for value memories, or
	  for keystroke macros.  Not sure how that will work.
	</p>
	<p>
	  I suppose that the user could be allowed to add another
	  row or column if more buttons were wanting
	</p>
	<p>
	  I guess we want a keyboard accelerator table, too.
        </p>
      </section>
    `
  }
}

window.customElements.define('calculator-settings', CalculatorSettings);
