/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

import { CALC_INVERT, CALC_ACES, CALC_RADDEG } from '../actions/calc.js';

import { store } from '../store.js';

const calc = (state = { 
    memo: '',
    text: '0',
    invert: false,
    aces: false,
    raddeg: false,
}, action) => {
    switch (action.type) {
    case CALC_INVERT: return { ...state, invert: action.invert };
    case CALC_ACES: return { ...state, aces: action.aces };
    case CALC_RADDEG: return {...state, raddeg: action.raddeg };
    default: return state;
    }
}

export default calc;
