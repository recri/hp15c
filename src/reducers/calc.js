/**
@license
Copyright (c) 2018 Roger E Critchlow Jr.  All rights reserved.
This code may only be used under the BSD style license found at http://recri.github.io/change/LICENSE.txt
*/

import { 
    CALC_INVERT, CALC_RADDEG, CALC_INPUT, CALC_AC, CALC_CE, CALC_EVAL
 } from '../actions/calc.js';

import { store } from '../store.js';

const calc = (state = { 
    memo: '',
    text: '0',
    future: '',
    invert: false,
    raddeg: false,
    history: [],
    ans: '0',
    tape: [],
}, action) => {
    switch (action.type) {
    case CALC_INVERT: return { ...state, invert: ! state.invert };
    case CALC_RADDEG: return {...state, raddeg: ! state.raddeg };
    case CALC_INPUT:
	if (action.key) {
	    const [text, future] = action.key;
	    state.history.push([state.text, state.future]); // caution
	    return { ...state, text: text, future: future };
	} else
	    return state;
    case CALC_AC:
	return { ...state, text: '0', future: '', history: [], invert: false
	};
    case CALC_CE: 
	if (state.history.length) {
	    const [text, future] = state.history.pop(); // caution
 	    return { ...state, text: text, future: future };
	} else
	    return state;
    case CALC_EVAL:
	// okay, there needs to be another step after eval
	// where the text switches to the next text entry
	// and the memo switches to `Ans = ${ans}`
	const ans = action.ans;
	const memo = `${state.text}${state.future} = ${action.ans}`;
	state.tape.push(memo); // caution
	return {
	    ...state,
	    ans: ans,
	    text: ans,
	    future: '',
	    memo: memo,
	    history: []
	};
	    
	console.log(`eval ${state.text}`);
	return state;
    default:
	return state;
    }
}

export default calc;
