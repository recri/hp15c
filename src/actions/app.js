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

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_WIDE_LAYOUT = 'UPDATE_WIDE_LAYOUT';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';

export const INSTALL_PROMPT = 'INSTALL_PROMPT'
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (path) => (dispatch) => {
    // Extract the page name from path, 
    // and default to our main page
    var page = path === '/' ? 'hp15c' : path.slice(1);

    // Any other info you might want to extract from the path (like page type),
    // you can do here
    dispatch(loadPage(page));

    // Close the drawer - in case the *path* change came from a link in the drawer.
    dispatch(updateDrawerState(false));
};

const loadPage = (page) => async (dispatch) => {
    switch(page) {
    case 'hp15c': 
	// default page already imported aggressively
	// await import('../components/hp15c-calculator.js');
	break;
    case 'about': await import('../components/hp15c-about.js'); break;
    default: await import('../components/hp15c-404.js'); break;
    }
    dispatch(updatePage(page));
}

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
}

export const updateLayout = (wideLayout) => (dispatch, getState) => {
   dispatch({
     type: UPDATE_WIDE_LAYOUT,
     wideLayout
  })
  // Open the drawer when we are switching to wide layout and close it when we are
  // switching to narrow.
  dispatch(updateDrawerState(wideLayout));
}

export const updateDrawerState = (opened) => (dispatch, getState) => {
  const app = getState().app;
  // Don't allow closing the drawer when it's in wideLayout.
  if (app.drawerOpened !== opened && (!app.wideLayout || opened)) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
}

export const installPrompt = (install) => (dispatch) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    if (install) install.preventDefault();
    dispatch({type: INSTALL_PROMPT, install});
    dispatch(updateDrawerState(false));
}

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar, unless this is the first load of the page.
  if (getState().app.offline !== undefined) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

