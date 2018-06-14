/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

export const CALC_INVERT = 'CALC_INVERT';
export const CALC_ACES = 'CALC_ACES';
export const CALC_RADDEG = 'CALC_RADDEG';

export const calcInvert = (invert) => (dispatch) => dispatch({ type: CALC_INVERT, invert });
export const calcACES = (aces) => (dispatch) => dispatch({ type: CALC_ACES, aces });
export const calcRadDeg = (raddeg) => (dispatch) => dispatch({ type: CALC_RADDEG, raddeg });

