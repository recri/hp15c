/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

export const CALC_INVERT = 'CALC_INVERT'; // toggle Inv shift
export const CALC_RADDEG = 'CALC_RADDEG'; // toggle between Rad and Deg
export const CALC_INPUT = 'CALC_INPUT';	  // process an input expression
export const CALC_PARSE = 'CALC_PARSE';	  // parse, may be obsolete
export const CALC_ECHO = 'CALC_ECHO';	  // echo, may be obsolete
export const CALC_AC = 'CALC_AC';	  // process 'all clear'
export const CALC_CE = 'CALC_CE';	  // process 'clear entry'
export const CALC_EVAL = 'CALC_EVAL';	  // evaluate the expression

export const calcInvert = () => (dispatch) => dispatch({ type: CALC_INVERT });
export const calcRadDeg = () => (dispatch) => dispatch({ type: CALC_RADDEG });
export const calcInput = (key) => (dispatch) => dispatch({ type: CALC_INPUT, key });
export const calcParse = () => (dispatch) => dispatch({ type: CALC_PARSE });
export const calcEcho = () => (dispatch) => dispatch({ type: CALC_ECHO});
export const calcAC = () => (dispatch) => dispatch({ type: CALC_AC});
export const calcCE = () => (dispatch) => dispatch({ type: CALC_CE});
export const calcEval = () => (dispatch) => dispatch({ type: CALC_EVAL });
