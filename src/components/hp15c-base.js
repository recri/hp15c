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

import './hp15c-calculator.js';

import { 
    key, init,
    Stack, StackI, LastX, LastXI, Reg, Flags
 } from './common/hp15c.js';


class HP15CBase extends PageViewElement {
  _render(props) {
      return html`<hp15c-calculator calculator=${{key,init}}><slot></slot></hp15c-calculator>`;
  }
}

window.customElements.define('hp15c-base', HP15CBase);
