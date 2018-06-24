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

class HP15CAbout extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>About</h2>
        <p>
	This app is a new front end for Greg Hewitt's <a href="http://hp15c.com">HP15C simulator</a>.
	It is built as a Progressive Web App using tools from Google's 
	<a href="https://polymer-project.org">Polymer Project</a>.
	The source is available at <a href="https://github.com/recri/hp15c#readme">github</a>.
	</p>
      </section>
    `
  }
}

window.customElements.define('hp15c-about', HP15CAbout);
