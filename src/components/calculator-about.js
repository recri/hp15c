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

class ChangeAbout extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>About</h2>
        <p>
	Back in the days when prehistory was becoming history,
	the Chinese formalized a method of divination that is
	now known as the <i>I Ching</i>, or <i>Yi Jing</i>, or 
	<i>Yi Zhou</i>, or in english the <i>Book of Changes</i>.
	You may read about this at length in
	<a rel="noopener" target="_blank" href="https://en.wikipedia.org/wiki/I_Ching">Wikipedia</a>.
	</p><p>
	This web app randomly generates numbers of 6 digits chosen 
	from 6, 7, 8, and 9, and associates these numbers to parts of
	the <i>I Ching</i>.  You can also generate a number yourself,
	or a sequence of numbers separated by commas, and enter them
	into the web app for interpretation.
	</p><p>
	The translation is from Richard Wilhelm's and Cary F. Baynes translation
	 "I Ching: Or, Book of Changes" 3rd. ed., Bollingen Series XIX, 
	(Princeton NJ: Princeton University Press, 1967, 1st ed. 1950).
	</p><p>
	The text was originally taken from 
	<a rel="noopener" target="_blank" href="http://www.akirarabelais.com/i/i.html">Akira Rabelais</a> 
	and 
	<a rel="noopener" target="_blank" href="http://www.pantherwebworks.com/i_ching/">Panther Web Works</a>.
	The form of the readings was influenced by
	<a rel="noopener" target="_blank" href="https://www.eclecticenergies.com/iching/virtualcoins">Ewald Berkers</a>
	web site.
	</p><p>
	The readings here are confined to the oldest parts of the I Ching, 
	the original texts for the hexagrams and moving lines which inspired
	the many books of commentary which followed.  The hexagram judgment text
	is given if there are no moving lines, but only the line judgments are
	given if there are moving lines.  This makes things small and uncluttered.
	</p><p>
	The settings page will let you specify various choices for how the app works.
	</p><p>

	</p><p>
	More details can be found at <a rel="noopener" target="_blank" href="https://elf.org">elf.org</a>.
        </p>
      </section>
    `
  }
}

window.customElements.define('change-about', ChangeAbout);
