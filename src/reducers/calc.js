/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

import { 
    CALC_INVERT, CALC_ACES, CALC_RADDEG, CALC_INPUT, CALC_PARSE, CALC_ECHO, CALC_AC, CALC_CE
 } from '../actions/calc.js';

import { store } from '../store.js';

const calc = (state = { 
    memo: '',
    text: '0',
    future: '',
    invert: false,
    aces: false,
    raddeg: false,
    input: null,
    parseText: null,
    parseFuture: null,
    history: []
}, action) => {
    switch (action.type) {
    case CALC_INVERT: return { ...state, invert: action.invert };
    case CALC_ACES: return { ...state, aces: action.aces };
    case CALC_RADDEG: return {...state, raddeg: action.raddeg };
    case CALC_INPUT: return {...state, input: action.key };
    case CALC_PARSE: return {...state, 
			     parseText: state.input[0],
			     parseFuture: state.input[1]||'',
			     input: null
			    };
    case CALC_ECHO: 
	// if the only thing in the accumulator is the default '0',
	// then treat it as an optional input
	// caution, mutating history in place
	state.history.push([state.text, state.future]);
	return {...state,
		text: state.text+state.parseText,
		future: state.parseFuture+state.future,
		parseText: null, 
		parseFuture: null
	       };
	//
    case CALC_AC: return {...state, text: '0', future: '', history: []};
    case CALC_CE: 
	// if we remove everything, then the default 0 should come back
	// caution, mutating history in place
	if (state.history.length) {
	    const [text, future] = state.history.pop()
	    return {...state, text: text, future: future};
	}
	return state;
    default: return state;
    }
}

export default calc;
