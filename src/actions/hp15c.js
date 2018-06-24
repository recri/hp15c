/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

export const HP_USER = 'HP_USER';
export const HP_SHIFT = 'HP_SHIFT';
export const HP_TRIGMODE = 'HP_TRIGMODE';
export const HP_COMPLEX = 'HP_COMPLEX';
export const HP_PROGRAM = 'HP_PROGRAM';
export const HP_NEG = 'HP_NEG';
export const HP_DIGITS = 'HP_DIGITS';
export const HP_DECIMALS = 'HP_DECIMALS';

export const hpUser = (user) => (dispatch) => dispatch({ type: HP_USER, user });
export const hpShift = (shift) => (dispatch) => dispatch({ type: HP_SHIFT, shift });
export const hpTrigmode = (trigmode) => (dispatch) => dispatch({ type: HP_TRIGMODE, trigmode });
export const hpComplex = (complex) => (dispatch) => dispatch({ type: HP_COMPLEX, complex });
export const hpProgram = (program) => (dispatch) => dispatch({ type: HP_PROGRAM, program });
export const hpNeg = (neg) => (dispatch) => dispatch({ type: HP_NEG, neg });
export const hpDigits = (digits) => (dispatch) => dispatch({ type: HP_DIGITS, digits });
export const hpDecimals = (decimals) => (dispatch) => dispatch({ type: HP_DECIMALS, decimals });
export const hpDigit = (digits, i, d) => (dispatch) => 
    dispatch({ type: HP_DIGITS, digits: digits.map((old,iold) => iold===i?d:old) });
export const hpDecimal = (decimals, i, d) => (dispatch) =>
    dispatch({ type: HP_DECIMALS, decimals: decimals.map((old,iold) => iold===i?d:old) });
