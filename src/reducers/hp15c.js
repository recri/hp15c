/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

import { 
    HP_USER, HP_SHIFT, HP_TRIGMODE, HP_COMPLEX, HP_PROGRAM, 
    HP_NEG, HP_DIGITS, HP_DECIMALS
} from '../actions/hp15c.js';

import { store } from '../store.js';

const hp15c = (state = { 
    user: false,
    shift: 'f',
    trigmode: null,
    complex: false,
    program: false,
    neg: '-',
    digits:  ['8','8','8','8','8','8','8','8','8','8'],
    decmals: [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']
}, action) => {
    switch (action.type) {
    case HP_USER: return { ...state, user: action.user };
    case HP_SHIFT: return {...state, shift: action.shift };
    case HP_TRIGMODE: return {...state, trigmode: action.trigmode };
    case HP_COMPLEX: return {...state, complex: action.complex };
    case HP_PROGRAM: return {...state, program: action.program };
    case HP_NEG: return {...state, neg: action.neg };
    case HP_DIGITS: return {...state, digits: action.digits };
    case HP_DECIMALS: return {...state, decimals: action.decimals };
    default: return state;
    }
}

export default hp15c;
