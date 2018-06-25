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

import { LitElement, html } from '@polymer/lit-element';

import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { installRouter } from 'pwa-helpers/router.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

import { store } from '../store.js';
import { navigate, updateDrawerState, updateLayout, installPrompt, updateOffline } from '../actions/app.js';

import { menuIcon } from './hp15c-icons.js';
import { HP15CCalculator } from './hp15c-calculator.js'; // non-lazy import for default page

import { SharedStyles } from './shared-styles.js';

class HP15CApp extends connect(store)(LitElement) {

    static get properties() {
	return {
	    appTitle: String,
	    _page: String,
	    _drawerOpened: Boolean,
	    _wideLayout: Boolean,
	    _install: Object
	}
    }

    constructor() {
	super();
	// To force all event listeners for gestures to be passive.
	// See https://www.polymer-project.org/2.0/docs/devguide/gesture-events#use-passive-gesture-listeners
	setPassiveTouchGestures(true);
	// prepare for install to home screen event
	window.addEventListener('beforeinstallprompt', (e) => installPrompt(e))          
    }

    _render({appTitle, _page, _drawerOpened, _wideLayout, _install}) {
	// Anything that's related to rendering should be done in here.
	// construct an install button when it's been signaled
	const installPrompt = _install ?
	      html`<button on-click="${this._installPrompt.bind(this)(_install)}">Install</button>` :
	      html``;
	
	return html`
    <style>
      :host {
        --app-drawer-width: 192px;
        display: block;

        --app-primary-color: #E91E63;
        --app-secondary-color: #293237;
        --app-dark-text-color: var(--app-secondary-color);
        --app-light-text-color: white;
        --app-section-even-color: #f0f0f0;
        --app-section-odd-color: white;

        --app-header-background-color: white;
        --app-header-text-color: var(--app-dark-text-color);
        --app-header-selected-color: var(--app-primary-color);

        --app-drawer-background-color: var(--app-secondary-color);
        --app-drawer-text-color: var(--app-light-text-color);
        --app-drawer-selected-color: #78909C;
      }

      app-header {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
	right: 0;
        text-align: center;
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color);
        border-bottom: 1px solid #eee;
      }
      app-drawer { z-index: 4 }
      .toolbar-top {
        background-color: var(--app-header-background-color);
      }

      [main-title] {
	/* text-transform: lowercase; */
        font-size: 30px;
        margin-right: 44px;
      }

      .menu-btn {
        background: none;
        border: none;
        fill: var(--app-header-text-color);
        cursor: pointer;
        height: 44px;
        width: 44px;
      }

      .drawer-list {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 24px;
        background: var(--app-drawer-background-color);
        position: relative;
      }

      .drawer-list > a {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
        line-height: 40px;
        padding: 0 24px;
      }

      .drawer-list > a[selected] {
        color: var(--app-drawer-selected-color);
      }

      .drawer-list > button {
        display: block;
        text-decoration: none;
        color: var(--app-drawer-text-color);
	background-color: transparent;
        line-height: 40px;
        padding: 0 24px;
      }

      .main-content {
        /* padding-top: 64px; */
        min-height: 100vh;
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      footer {
        display:none;
        padding: 24px;
        background: var(--app-drawer-background-color);
        color: var(--app-drawer-text-color);
        text-align: center;
      }
      footer a {
        color: var(--app-drawer-text-color);
      }

      /* Wide layout */
      @media (min-width: 768px) {
        app-header,
        .main-content,
        footer {
          /* margin-left: var(--app-drawer-width); */
        }

        .menu-btn {
          /* display: none; */
        }

        [main-title] {
          margin-right: 0;
        }
      }
    </style>

    <!-- Header -->
    <app-header condenses reveals effects="waterfall">
      <app-toolbar class="toolbar-top">
        <button class="menu-btn" title="Menu" on-click="${_ => store.dispatch(updateDrawerState(true))}">${menuIcon}</button>
        <div main-title>${appTitle}</div>
      </app-toolbar>

    </app-header>

    <!-- Drawer content -->
    <app-drawer opened="${_drawerOpened}" persistent="${_wideLayout}"
        on-opened-changed="${e => store.dispatch(updateDrawerState(e.target.opened))}">
      <nav class="drawer-list">
	<a selected?="${_page === 'hp15c'}" href="/" title="Calculator">Calculator</a>
	<a selected?="${_page === 'about'}" href="/about" title="About the app.">About</a>
	${installPrompt}
      </nav>
    </app-drawer>

    <!-- Main content -->
    <main class="main-content">
      <hp15c-calculator class="page" active?="${_page === 'hp15c'}">
	<button class="delegated menu-btn" title="Menu" on-click="${_ => store.dispatch(updateDrawerState(true))}">${menuIcon}</button>
      </hp15c-calculator>
      <hp15c-about class="page" active?="${_page === 'about'}">
	<button class="delegated menu-btn" title="Menu" on-click="${_ => store.dispatch(updateDrawerState(true))}">${menuIcon}</button>
      </hp15c-about>
      <hp15c-404 class="page" active?="${_page === '404'}"></hp15c-404>
    </main>

    <footer>
      <p>
	<a href="https://elf.org/calculator" rel="noopener" target="_blank" title="home page">elf.org/calculator</a>
      <p>
    </footer>

    `;
    }

    _firstRendered() {
	installRouter((location) => store.dispatch(navigate(window.decodeURIComponent(location.pathname))));
	installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
	// installMediaQueryWatcher(`(min-width: 768px)`, (matches) => store.dispatch(updateLayout(matches)));
    }

    _didRender(properties, changeList) {
	if ('_page' in changeList) {
	    const pageTitle = properties.appTitle + ' - ' + changeList._page;
	    updateMetadata({
		title: pageTitle,
		description: pageTitle
		// This object also takes an image property, that points to an img src.
	    });
	}
    }

    _stateChanged(state) {
	this._page = state.app.page;
	this._drawerOpened = state.app.drawerOpened;
	this._wideLayout = false; // state.app.wideLayout;
	this._change = state.app.change;
	this._install = state.app.install;
	this._offline = state.app.offline;
	this._snackbarOpened = state.app.snackbarOpened;
    }

    _installPrompt(_install) {
	installPrompt(null);	// clear the prompt
	_install.prompt();	// Show the prompt
    }
}

window.customElements.define('hp15c-app', HP15CApp);
