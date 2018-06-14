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

import { UPDATE_PAGE, UPDATE_WIDE_LAYOUT, UPDATE_DRAWER_STATE,
	 INSTALL_PROMPT, UPDATE_OFFLINE, OPEN_SNACKBAR, CLOSE_SNACKBAR
       } from '../actions/app.js';

const app = (state = { drawerOpened: false, 
		       install: null		 // install to home screen event
		     }, action) => {

    switch (action.type) {
    case INSTALL_PROMPT: return { ...state, install: action.install };
    case UPDATE_PAGE: return { ...state, page: action.page };
    case UPDATE_WIDE_LAYOUT: return { ...state, wideLayout: action.wideLayout };
    case UPDATE_DRAWER_STATE: return { ...state, drawerOpened: action.opened }
    case UPDATE_OFFLINE: return { ...state, offline: action.offline };
    case OPEN_SNACKBAR: return { ...state, snackbarOpened: true };
    case CLOSE_SNACKBAR: return { ...state, snackbarOpened: false };
    default: return state;
    }
}

export default app;
