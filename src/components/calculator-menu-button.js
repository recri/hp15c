/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

/*
** This is the app-header menu button pulled out so it can be
** pasted into the page headers of the sub-pages rather than
** being displayed when app-header feels like it.
*/
import { html } from '@polymer/lit-element';
import { menuIcon } from './calculator-icons.js';
import { store } from '../store.js';
import { updateDrawerState } from '../actions/app.js';

export const calculatorMenuButton = html`
<button class="menu-btn" title="Menu" 
	style="background:none;border:none;fill:var(--app-header-text-color);cursor:pointer;height:44px;width: 44px" 
	on-tap="${_ => store.dispatch(updateDrawerState(true))}">${menuIcon}</button>
`;
