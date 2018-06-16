/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

export const CALC_INVERT = 'CALC_INVERT';
export const CALC_ACES = 'CALC_ACES';
export const CALC_RADDEG = 'CALC_RADDEG';
export const CALC_INPUT = 'CALC_INPUT';
export const CALC_PARSE = 'CALC_PARSE';
export const CALC_ECHO = 'CALC_ECHO';
export const CALC_AC = 'CALC_AC';
export const CALC_CE = 'CALC_CE';

export const calcInvert = (invert) => (dispatch) => dispatch({ type: CALC_INVERT, invert });
export const calcACES = (aces) => (dispatch) => dispatch({ type: CALC_ACES, aces });
export const calcRadDeg = (raddeg) => (dispatch) => dispatch({ type: CALC_RADDEG, raddeg });
export const calcInput = (key) => (dispatch) => dispatch({ type: CALC_INPUT, key });
export const calcParse = () => (dispatch) => dispatch({ type: CALC_PARSE });
export const calcEcho = () => (dispatch) => dispatch({ type: CALC_ECHO});
export const calcAC = () => (dispatch) => dispatch({ type: CALC_AC});
export const calcCE = () => (dispatch) => dispatch({ type: CALC_CE});
