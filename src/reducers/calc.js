/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

import { 
    CALC_INVERT, CALC_ACES, CALC_RADDEG, CALC_KEYPAD_INPUT, CALC_KEYBOARD_INPUT
 } from '../actions/calc.js';

import { store } from '../store.js';

const calc = (state = { 
    memo: '',
    text: '0',
    invert: false,
    aces: false,
    raddeg: false,
    keypad: '',
    keyboard: '',
}, action) => {
    switch (action.type) {
    case CALC_INVERT: return { ...state, invert: action.invert };
    case CALC_ACES: return { ...state, aces: action.aces };
    case CALC_RADDEG: return {...state, raddeg: action.raddeg };
    case CALC_KEYPAD_INPUT: return {...state, keypad: action.key };
    case CALC_KEYBOARD_INPUT: return {...state, keyboard: action.key };
    default: return state;
    }
}

export default calc;
