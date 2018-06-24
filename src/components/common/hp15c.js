var On = true;
var Display;		// the display handler
var DecimalSwap;
var Stack = [0, 0, 0, 0];
var StackI = [0, 0, 0, 0];
var LastX = 0;
var LastXI = 0;
var Reg = new Array(60);
var DisableKeys;
var Entry;
var DigitEntry = false;
var NewDigitEntry;
var StackLift = false;
var OldStackLift, NewStackLift;
var DelayUpdate = 0;
var DisplayTimeout = 0;
var TemporaryDisplay = false;
var Shift = 0;
var Prefix;
var OldPrefix;
var LcdDisplay;
var DisplayMode = 1; // 1=FIX 2=SCI 3=ENG
var DisplayDigits = 4;
var FullCircle = 360;
var TrigFactor = Math.PI / 180;
var Flags = [false, false, false, false, false, false, false, false, false, false];
var User = false;
var Prgm = false;
var Program = [null];
var PC = 0;
var Running = false;
var RunTimer = null;
var BlinkOn = false;
var Blinker = null;
var ReturnStack = [];
var Result = 0;

var MAX = 9.999999999e99;
var MAX_MAG = 99;

var OpcodeIndex = {'/':10, '*':20, '-':30, '+':40};

function CalcError(n) {
    this.name = "CalcError";
    this.message = "Error " + n;
    this.code = n;
}

function OpcodeInfo(keys, defn, programmable, user) {
    this.keys = keys;
    this.defn = defn;
    this.programmable = programmable !== false;
    this.user = user;
}

var OpSqrt      = new OpcodeInfo([11],      op_sqrt);
var OpA         = new OpcodeInfo([42,11],   op_A);
var OpX2        = new OpcodeInfo([43,11],   op_x2);
var OpEx        = new OpcodeInfo([12],      op_ex);
var OpB         = new OpcodeInfo([42,12],   op_B);
var OpLn        = new OpcodeInfo([43,12],   op_ln);
var Op10x       = new OpcodeInfo([13],      op_10x);
var OpC         = new OpcodeInfo([42,13],   op_C);
var OpLog       = new OpcodeInfo([43,13],   op_log);
var OpYx        = new OpcodeInfo([14],      op_yx);
var OpD         = new OpcodeInfo([42,14],   op_D);
var OpPct       = new OpcodeInfo([43,14],   op_pct);
var Op1x        = new OpcodeInfo([15],      op_1x);
var OpE         = new OpcodeInfo([42,15],   op_E);
var OpDpct      = new OpcodeInfo([43,15],   op_dpct);
var OpChs       = new OpcodeInfo([16],      op_chs);
//var OpMatrix
var OpAbs       = new OpcodeInfo([43,16],   op_abs);
var Op7         = new OpcodeInfo([7],       function() { op_input('7'); });
//var OpFix
var OpDeg       = new OpcodeInfo([43,7],    op_deg);
var Op8         = new OpcodeInfo([8],       function() { op_input('8'); });
//var OpSci
var OpRad       = new OpcodeInfo([43,8],    op_rad);
var Op9         = new OpcodeInfo([9],       function() { op_input('9'); });
//var OpEng
var OpGrd       = new OpcodeInfo([43,9],    op_grd);
var OpDiv       = new OpcodeInfo([10],      op_div);
//var OpSolve
var OpLe        = new OpcodeInfo([43,10],   op_le);
var OpSst       = new OpcodeInfo([21],      op_sst, false);
//var OpLbl
var OpBst       = new OpcodeInfo([43,21],   op_bst, false);
//var OpGto
//var OpHyp
//var OpAhyp
var OpSin       = new OpcodeInfo([23],      op_sin);
//var OpDim
var OpAsin      = new OpcodeInfo([43,23],   op_asin);
var OpCos       = new OpcodeInfo([24],      op_cos);
var OpIndex     = new OpcodeInfo([42,24],   op_index, false);
var OpAcos      = new OpcodeInfo([43,24],   op_acos);
var OpTan       = new OpcodeInfo([25],      op_tan);
var OpI         = new OpcodeInfo([42,25],   op_I);
var OpAtan      = new OpcodeInfo([43,25],   op_atan);
var OpEex       = new OpcodeInfo([26],      op_eex);
//var OpResult
var OpPi        = new OpcodeInfo([43,26],   op_pi);
var Op4         = new OpcodeInfo([4],       function() { op_input('4'); });
//var OpXchg
//var OpSf
var Op5         = new OpcodeInfo([5],       function() { op_input('5'); });
//var OpDse       = new OpcodeInfo([42,5],    op_dse);
//var OpCf
var Op6         = new OpcodeInfo([6],       function() { op_input('6'); });
//var OpIsg       = new OpcodeInfo([42,6],    op_isg);
//var OpFtest
var OpMul       = new OpcodeInfo([20],      op_mul);
//var OpIntegrate
var OpEq        = new OpcodeInfo([43,20],   op_eq);
var OpRs        = new OpcodeInfo([31],      op_rs);
var OpPse       = new OpcodeInfo([42,31],   op_pse);
var OpPr        = new OpcodeInfo([43,31],   op_pr, false);
//var OpGsb
var OpClearStat = new OpcodeInfo([42,32],   op_clear_stat);
var OpRtn       = new OpcodeInfo([43,32],   op_rtn);
var OpRoll      = new OpcodeInfo([33],      op_roll);
var OpClearPrgm = new OpcodeInfo([42,33],   op_clear_prgm, false);
var OpRollup    = new OpcodeInfo([43,33],   op_rollup);
var OpXy        = new OpcodeInfo([34],      op_xy);
var OpClearReg  = new OpcodeInfo([42,34],   op_clear_reg);
var OpRnd       = new OpcodeInfo([43,34],   op_rnd);
var OpBack      = new OpcodeInfo([35],      op_back, false);
var OpClearPrefix=new OpcodeInfo([42,35],   op_clear_prefix, false);
var OpClx       = new OpcodeInfo([43,35],   op_clx);
var OpEnter     = new OpcodeInfo([36],      op_enter);
var OpRand      = new OpcodeInfo([42,36],   op_rand);
var OpLastx     = new OpcodeInfo([43,36],   op_lastx);
var Op1         = new OpcodeInfo([1],       function() { op_input('1'); });
var OpToR       = new OpcodeInfo([42,1],    op_to_r);
var OpToP       = new OpcodeInfo([43,1],    op_to_p);
var Op2         = new OpcodeInfo([2],       function() { op_input('2'); });
var OpToHms     = new OpcodeInfo([42,2],    op_to_hms);
var OpToH       = new OpcodeInfo([43,2],    op_to_h);
var Op3         = new OpcodeInfo([3],       function() { op_input('3'); });
var OpToRad     = new OpcodeInfo([42,3],    op_to_rad);
var OpToDeg     = new OpcodeInfo([43,3],    op_to_deg);
var OpSub       = new OpcodeInfo([30],      op_sub);
var OpReIm      = new OpcodeInfo([42,30],   op_re_im);
//var OpTest
var OpOn        = new OpcodeInfo([41],      op_on, false);
//var OpSto
var OpFrac      = new OpcodeInfo([42,44],   op_frac);
var OpInt       = new OpcodeInfo([43,44],   op_int);
//var OpRcl
var OpUser      = new OpcodeInfo([42,46],   op_user, false);
var OpMem       = new OpcodeInfo([43,46],   op_mem, false);
var Op0         = new OpcodeInfo([0],       function() { op_input('0'); });
var OpFact      = new OpcodeInfo([42,0],    op_fact);
var OpMean      = new OpcodeInfo([43,0],    op_mean);
var OpDot       = new OpcodeInfo([48],      function() { op_input('.'); });
var OpYhat      = new OpcodeInfo([42,48],   op_yhat);
var OpS         = new OpcodeInfo([43,48],   op_s);
var OpSum       = new OpcodeInfo([49],      op_sum);
var OpLr        = new OpcodeInfo([42,49],   op_lr);
var OpSumsub    = new OpcodeInfo([43,49],   op_sumsub);
var OpAdd       = new OpcodeInfo([40],      op_add);
var OpPyx       = new OpcodeInfo([42,40],   op_Pyx);
var OpCyx       = new OpcodeInfo([43,40],   op_Cyx);

function _(x) { return function(k) { return new Opcode(x); }; }

var CharTable = {
    'q': [_(OpSqrt), _(OpA), _(OpX2)],
    'E': [_(OpEx), _(OpB), _(OpLn)],
    ')': [_(Op10x), _(OpC), _(OpLog)],
    '^': [_(OpYx), _(OpD), _(OpPct)],
    '\\':[_(Op1x), _(OpE), _(OpDpct)],
    '_': [_(OpChs), decode_matrix, _(OpAbs)],
    '7': [_(Op7), decode_fix, _(OpDeg)],
    '8': [_(Op8), decode_sci, _(OpRad)],
    '9': [_(Op9), decode_eng, _(OpGrd)],
    '/': [_(OpDiv), decode_solve, _(OpLe)],
    'T': [_(OpSst), decode_lbl, _(OpBst)],
    'G': [decode_gto, decode_hyp, decode_ahyp],
    's': [_(OpSin), decode_dim, _(OpAsin)],
    'c': [_(OpCos), _(OpIndex), _(OpAcos)],
    't': [_(OpTan), _(OpI), _(OpAtan)],
    'e': [_(OpEex), decode_result, _(OpPi)],
    '4': [_(Op4), decode_xchg, decode_sf],
    '5': [_(Op5), decode_dse, decode_cf],
    '6': [_(Op6), decode_isg, decode_ftest],
    '*': [_(OpMul), decode_integrate, _(OpEq)],
    'P': [_(OpRs), _(OpPse), _(OpPr)],
    'U': [decode_gsb, _(OpClearStat), _(OpRtn)],
    'r': [_(OpRoll), _(OpClearPrgm), _(OpRollup)],
    'x': [_(OpXy), _(OpClearReg), _(OpRnd)],
    '\b': [_(OpBack), _(OpClearPrefix), _(OpClx)],
    '\r': [_(OpEnter), _(OpRand), _(OpLastx)],
    '\n': [_(OpEnter), _(OpRand), _(OpLastx)],
    '1': [_(Op1), _(OpToR), _(OpToP)],
    '2': [_(Op2), _(OpToHms), _(OpToH)],
    '3': [_(Op3), _(OpToRad), _(OpToDeg)],
    '-': [_(OpSub), _(OpReIm), decode_test],
    '\x1b': [_(OpOn), _(OpOn), _(OpOn)],
    'f': [decode_f, decode_f, decode_f],
    'g': [decode_g, decode_g, decode_g],
    'S': [decode_sto, _(OpFrac), _(OpInt)],
    'R': [decode_rcl, _(OpUser), _(OpMem)],
    '0': [_(Op0), _(OpFact), _(OpMean)],
    '.': [_(OpDot), _(OpYhat), _(OpS)],
    ';': [_(OpSum), _(OpLr), _(OpSumsub)],
    '+': [_(OpAdd), _(OpPyx), _(OpCyx)],
    ' ': _(OpEnter),
    '!': _(OpFact),
    '@': _(OpX2),
    '%': _(OpPct),
    'A': _(OpA),
    'B': _(OpB),
    'C': _(OpC),
    'D': _(OpD),
    'L': _(OpLastx),
    'a': _(OpAbs),
    'i': _(OpInt),
    'I': _(OpI),
    'l': _(OpLn),
    'p': _(OpPi),
    '\x12': _(OpRand)
};

var KeyTable = [
    ['q', 'E', ')', '^', '\\','_', '7', '8', '9', '/'],
    ['T', 'G', 's', 'c', 't', 'e', '4', '5', '6', '*'],
    ['P', 'U', 'r', 'x', '\b','\r','1', '2', '3', '-'],
    ['\x1b', 'f', 'g', 'S', 'R', '\r','0', '.', ';', '+']
];
var ExtraKeyTable = [
    [3, 6, -1, '!'],
    [0, 0,  1, '@'],
    [0, 3,  1, '%'],
    [0, 0, -1, 'A'],
    [0, 1, -1, 'B'],
    [0, 2, -1, 'C'],
    [0, 3, -1, 'D'],
    [3, 5,  1, 'L'],
    [0, 5,  1, 'a'],
    [3, 3,  1, 'i'],
    [1, 4, -1, 'I'],
    [0, 1,  1, 'l'],
    [1, 5,  1, 'p']
];

function sign(x) {
    if (x === 0) {
        return 0;
    }
    return (x > 0) ? 1 : -1;
}

function sin_drg_mode(x) {
    if (FullCircle === 360 || FullCircle === 400) {
        // check for exact values in deg/grad mode to avoid roundoff errors
        var t = Math.abs(x % FullCircle);
        if (t === 0 || t === FullCircle/2) {
            return 0;
        }
    }
    return Math.sin(x * TrigFactor);
}

function cos_drg_mode(x) {
    if (FullCircle === 360 || FullCircle === 400) {
        // check for exact values in deg/grad mode to avoid roundoff errors
        var t = Math.abs(x % FullCircle);
        if (t === FullCircle/4 || t === FullCircle*3/4) {
            return 0;
        }
    }
    return Math.cos(x * TrigFactor);
}

function tan_drg_mode(x) {
    if (FullCircle === 360 || FullCircle === 400) {
        // check for exact values in deg/grad mode to avoid roundoff errors
        var t = Math.abs(x % FullCircle);
        if (t === 0 || t === FullCircle/2) {
            return 0;
        }
        if (t === FullCircle/4 || t === FullCircle*3/4) {
            Flags[9] = true;
            return MAX;
        }
    }
    return Math.tan(x * TrigFactor);
}

function sinh(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
}

function cosh(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
}

function tanh(x) {
    return (Math.exp(2*x) - 1) / (Math.exp(2*x) + 1);
}

function Complex(re, im) {
    this.re = re;
    this.im = im;

    this.acos = function() {
        var s1 = new Complex(1 - this.re, -this.im).sqrt();
        var s2 = new Complex(1 + this.re, this.im).sqrt();
        var r1 = 2 * Math.atan2(s1.re, s2.re);
        var i1 = (s2.re*s1.im) - (s2.im*s1.re);
        i1 = sign(i1) * Math.log(Math.abs(i1) + Math.sqrt(i1*i1 + 1));
        return new Complex(r1, i1);
    };

    this.acosh = function() {
        var s1 = new Complex(this.re - 1, this.im).sqrt();
        var s2 = new Complex(this.re + 1, this.im).sqrt();
        var r1 = (s1.re*s2.re) + (s1.im*s2.im);
        r1 = sign(r1) * Math.log(Math.abs(r1) + Math.sqrt(r1*r1 + 1));
        var i1 = 2 * Math.atan2(s1.im, s2.re);
        return new Complex(r1, i1);
    };

    this.abs = function() {
        return Math.sqrt(this.re*this.re + this.im*this.im);
    };

    this.add = function(that) {
        return new Complex(this.re + that.re, this.im + that.im);
    };

    this.arg = function() {
        return Math.atan2(this.im, this.re);
    };

    this.asin = function() {
        var s1 = new Complex(1 + this.re, this.im).sqrt();
        var s2 = new Complex(1 - this.re, -this.im).sqrt();
        var r1 = (s1.re*s2.im) - (s2.re*s1.im);
        r1 = sign(r1) * Math.log(Math.abs(r1) + Math.sqrt(r1*r1 + 1));
        var i1 = Math.atan2(this.re, (s1.re*s2.re) - (s1.im*s2.im));
        return new Complex(i1, -r1);
    };

    this.asinh = function() {
        var s1 = new Complex(1 + this.im, -this.re).sqrt();
        var s2 = new Complex(1 - this.im, this.re).sqrt();
        var r1 = (s1.re * s2.im) - (s2.re * s1.im);
        r1 = sign(r1) * Math.log(Math.abs(r1) + Math.sqrt(r1 * r1 + 1));
        var i1 = Math.atan2(this.im, (s1.re * s2.re) - (s1.im * s2.im));
        return new Complex(r1, i1);
    };

    this.atan = function() {
        if (this.re === 0 && Math.abs(this.im) === 1) {
            Flags[9] = true;
            return new Complex(0, sign(this.im) * MAX);
        }
        var rsign = 1;
        if (this.re === 0 && Math.abs(this.im) > 1) {
            rsign = -1;
        }
        var u = Complex.i.add(this).div(Complex.i.sub(this));
        var w = u.log();
        return new Complex(rsign * -w.im/2, w.re/2);
    };

    this.atanh = function() {
        if (this.im === 0 && Math.abs(this.re) === 1) {
            Flags[9] = true;
            return sign(this.re) * MAX;
        }
        var u = Complex.one.add(this).div(Complex.one.sub(this)).log();
        return new Complex(u.re/2, u.im/2);
    };

    this.cos = function() {
        return new Complex(Math.cos(this.re)*cosh(this.im), -Math.sin(this.re)*sinh(this.im));
    };

    this.cosh = function() {
        return new Complex(cosh(this.re)*Math.cos(this.im), sinh(this.re)*Math.sin(this.im));
    };

    this.div = function(that) {
        var d = that.re*that.re + that.im*that.im;
        return new Complex((this.re*that.re + this.im*that.im) / d, (this.im*that.re - this.re*that.im) / d);
    };

    this.exp = function() {
        var r = Math.exp(this.re);
        return new Complex(r * Math.cos(this.im), r * Math.sin(this.im));
    };

    this.exp10 = function() {
        var r = Math.pow(10, this.re);
        var t = this.im * Math.LN10;
        return new Complex(r * Math.cos(t), r * Math.sin(t));
    };

    this.inv = function() {
        var d = this.re*this.re + this.im*this.im;
        return new Complex(this.re/d, -this.im/d);
    };

    this.log = function() {
        return new Complex(Math.log(this.re*this.re + this.im*this.im)/2, this.arg());
    };

    this.log10 = function() {
        var u = this.log();
        return new Complex(u.re / Math.LN10, u.im / Math.LN10);
    };

    this.mul = function(that) {
        return new Complex(this.re * that.re - this.im * that.im, this.re * that.im + this.im * that.re);
    };

    this.pow = function(that) {
        var p = this.arg();
        var a = this.abs();
        var r = Math.pow(a, that.re) * Math.exp(-that.im * p);
        var t = that.re * p + that.im * Math.log(a);
        return new Complex(r * Math.cos(t), r * Math.sin(t));
    };

    this.sin = function() {
        return new Complex(Math.sin(this.re)*cosh(this.im), Math.cos(this.re)*sinh(this.im));
    };

    this.sinh = function() {
        return new Complex(sinh(this.re)*Math.cos(this.im), cosh(this.re)*Math.sin(this.im));
    };

    this.sub = function(that) {
        return new Complex(this.re - that.re, this.im - that.im);
    };

    this.sqrt = function() {
        var a = this.abs();
        return new Complex(Math.sqrt((this.re + a) / 2), (this.im < 0 ? -1 : 1) * Math.sqrt((-this.re + a) / 2));
    };

    this.square = function() {
        return new Complex(this.re*this.re - this.im*this.im, 2*this.re*this.im);
    };

    this.tan = function() {
        var u = new Complex(Math.tan(this.re), tanh(this.im));
        return u.div(new Complex(1, -u.re*u.im));
    };

    this.tanh = function() {
        var u = new Complex(tanh(this.re), Math.tan(this.im));
        return u.div(new Complex(1, u.re*u.im));
    };

    this.toString = function() {
        return "(" + this.re + "," + this.im + ")";
    };
}

Complex.one = new Complex(1, 0);
Complex.i = new Complex(0, 1);

var A = 0;
var B = 1;
var C = 2;
var D = 3;
var E = 4;

import { Matrix } from './jsmat/matrix.js';

function Mat() {
    if (typeof(arguments[0]) === "number" && typeof(arguments[1]) === "number") {
        this.rows = arguments[0];
        this.cols = arguments[1];
        this.m = new Matrix(this.rows, this.cols, arguments[2]);
    } else if (typeof(arguments[0]) === "object") {
        this.m = arguments[0];
        this.rows = this.m.getRowDimension();
        this.cols = this.m.getColumnDimension();
    }

    this.complex2 = function() {
        var r = new Matrix(this.rows, this.cols*2);
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                r.set(i, j, this.m.get(i, j));
                if (i < this.rows/2) {
                    r.set(this.rows/2+i, this.cols+j, this.m.get(i, j));
                } else {
                    r.set(i-this.rows/2, this.cols+j, -this.m.get(i, j));
                }
            }
        }
        return new Mat(r);
    };

    this.complex3 = function() {
        return new Mat(this.m.getMatrix(0, this.rows-1, 0, this.cols/2-1));
    };

    this.copy = function() {
        return new Mat(this.m.copy());
    };

    this.det = function() {
        return this.m.det();
    };

    this.get = function(row, col) {
        return this.m.get(row-1, col-1);
    };

    this.inverse = function() {
        return new Mat(this.m.inverse());
    };

    this.minus = function(B) {
        return new Mat(this.m.minus(B.m));
    };

    this.norm = function() {
        return this.m.normInf();
    };

    this.normF = function() {
        return this.m.normF();
    };

    this.partition = function() {
        var r = new Matrix(this.rows*2, this.cols/2);
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j += 2) {
                r.set(i, j/2, this.m.get(i, j));
                r.set(this.rows+i, j/2, this.m.get(i, j+1));
            }
        }
        return new Mat(r);
    };

    this.plus = function(B) {
        return new Mat(this.m.plus(B.m));
    };

    this.residual = function(Y, X) {
        return new Mat(this.m.minus(Y.m.times(X.m)));
    };

    this.set = function(row, col, value) {
        this.m.set(row-1, col-1, value);
    };

    this.times = function(B) {
        return new Mat(this.m.times(B.m));
    };

    this.timesScalar = function(s) {
        return new Mat(this.m.timesScalar(s));
    };

    this.transpose = function() {
        return new Mat(this.m.transpose());
    };

    this.toString = function() {
        return "<Mat " + this.rows + "," + this.cols + ">";
    };

    this.unpartition = function() {
        var r = new Matrix(this.rows/2, this.cols*2);
        for (var i = 0; i < this.rows/2; i++) {
            for (var j = 0; j < this.cols; j++) {
                r.set(i, j*2, this.m.get(i, j));
                r.set(i, j*2+1, this.m.get(this.rows/2+i, j));
            }
        }
        return new Mat(r);
    };
}

var g_Matrix = [new Mat(0, 0),
                new Mat(0, 0),
                new Mat(0, 0),
                new Mat(0, 0),
                new Mat(0, 0)];

function Descriptor(label) {
    this.label = label;

    this.toString = function() {
        return "<Descriptor " + this.label + " (" + g_Matrix[this.label].rows + "," + g_Matrix[this.label].cols + ")>";
    };
}

function Opcode(info, fn) {
    this.info = info;
    this.fn = fn;

    this.exec = function() {
        OldStackLift = StackLift;
        NewDigitEntry = false;
        NewStackLift = true;
        try {
            if (this.fn === undefined) {
                this.info.defn();
            } else {
                this.fn();
            }
        } finally {
            DigitEntry = NewDigitEntry;
            StackLift = NewStackLift;
            if (DigitEntry) {
                if (Entry.length > 0 && Entry.charAt(Entry.length-1) === 'e') {
                    Entry += "0";
                }
                Stack[0] = Number(Entry);
            }
        }
    };
}

function trunc(x) {
    if (x < 0) {
        return -Math.floor(-x);
    } else {
        return Math.floor(x);
    }
}

function log10int(x) {
    var mag = 0;
    x = Math.abs(x);
    if (x >= 1) {
        while (x >= 10) {
            mag++;
            x /= 10;
        }
    } else if (x > 0) {
        while (x < 1) {
            mag--;
            x *= 10;
        }
    }
    return mag;
}

import {sprintf} from './sprintf-0.6.js';

function update_lcd(s) {
    LcdDisplay = s;
    Display.clear_digits();
    if (!On) {
        return;
    }
    if (Flags[9] && !BlinkOn) {
        return;
    }
    var eex = null;
    var d = 0;
    for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'E') || c === 'o' || c === 'r' || c === 'u') {
            if (eex !== null) {
                eex = eex * 10 + c.charCodeAt(0) - "0".charCodeAt(0);
                var t = sprintf("%02d", eex);
                Display.set_digit(8, t.charAt(0));
                Display.set_digit(9, t.charAt(1));
            } else if (d < 10) {
                Display.set_digit(d, c);
                d++;
            }
        } else if (c === '.') {
            Display.set_decimal(d-1);
        } else if (c === ',') {
            Display.set_comma(d-1);
        } else if (c === '-') {
            if (eex !== null) {
                Display.set_digit(7, "-");
            } else if (d > 0) {
                Display.set_digit(d, "-");
                d++;
            } else {
                Display.set_neg();
            }
        } else if (c === 'e') {
            eex = 0;
            d = 9;
            Display.clear_digit(7);
            Display.set_digit(8, "0");
            Display.set_digit(9, "0");
        } else if (c === ' ') {
            d++;
        }
    }
}

function insert_commas(s) {
    var sign = "";
    if (s.charAt(0) === "-") {
        sign = s.charAt(0);
        s = s.substr(1);
    }
    var d = s.indexOf(".");
    if (d < 0) {
        d = s.indexOf("e");
        if (d < 0) {
            d = s.length;
        }
    }
    while (true) {
        d -= 3;
        if (d <= 0) {
            break;
        }
        s = s.substr(0, d) + "," + s.substr(d);
    }
    if (DecimalSwap) {
        for (var i = 0; i < s.length; i++) {
            if (s.charAt(i) === ".") {
                s = s.substr(0, i) + "," + s.substr(i+1);
            } else if (s.charAt(i) === ",") {
                s = s.substr(0, i) + "." + s.substr(i+1);
            }
        }
    }
    return sign + s;
}

function format_fix(n) {
    var x = Math.round(n * Math.pow(10, DisplayDigits));
    // DONE: var s
    var s = x.toString();
    while (s.length < DisplayDigits+1) {
        s = '0' + s;
    }
    s = s.substr(0, s.length-DisplayDigits) + '.' + s.substr(s.length-DisplayDigits);
    s = insert_commas(s);
    return s;
}

function format_sci(n, mag) {
    var x = Math.round(n * Math.pow(10, DisplayDigits - mag));
    // Not sure what case the following loop addresses
    while (log10int(x) > DisplayDigits) {
        if (mag >= MAX_MAG) {
            x = Math.floor(n * Math.pow(10, DisplayDigits - mag));
            break;
        }
        mag++;
        x /= 10;
    }
    var s = x.toString();
    while (s.length < DisplayDigits+1) {
        s = '0' + s;
    }
    s = s.substr(0, 1) + '.' + s.substr(1);
    s += "e" + mag;
    return s;
}

function format_eng(n, mag) {
    var x = Math.round(n * Math.pow(10, DisplayDigits - mag));
    var s = x.toString();
    while (s.length < DisplayDigits+1) {
        s = '0' + s;
    }
    var ilen = 1;
    while (mag % 3) {
        ilen++;
        if (s.length < ilen) {
            s += '0';
        }
        mag--;
    }
    s = s.substr(0, ilen) + '.' + s.substr(ilen);
    s += "e" + mag;
    return s;
}

function update_display_num(n) {
    if (n instanceof Descriptor) {
        update_lcd(sprintf("%c    %2d %2d",
            "A".charCodeAt(0) + n.label,
            g_Matrix[n.label].rows,
            g_Matrix[n.label].cols));
    } else {
        if (n > MAX) {
            n = MAX;
            Flags[9] = true;
        } else if (n < -MAX) {
            n = -MAX;
            Flags[9] = true;
        }
        var s = n.toString();
        var mag = log10int(n);
        var sign = "";
        if (n < 0) {
            n = -n;
            sign = "-";
        }
        var dm = DisplayMode;
        if (dm === 1 && (mag >= 10 || mag < -DisplayDigits)) {
            dm = 2;
        }
        switch (dm) {
        case 1:
            s = format_fix(n);
            break;
        case 2:
            s = format_sci(n, mag);
            break;
        case 3:
            s = format_eng(n, mag);
            break;
        }
        update_lcd(sign + s);
    }
}

function update_display() {
    if (Prgm) {
        var s = sprintf("%03d-", PC);
        if (PC > 0) {
            if (Program[PC].info.user) {
                s = s.substr(0, 3) + "u";
            }
            var keys = Program[PC].info.keys;
            switch (keys.length) {
                case 1:
                    s += sprintf("    %2d", keys[0]);
                    break;
                case 2:
                    if (Math.floor(keys[1]) === keys[1]) {
                        s += sprintf(" %2d %2d", keys[0], keys[1]);
                    } else {
                        s += sprintf(" %2d  .%d", keys[0], keys[1]*10);
                    }
                    break;
                case 3:
                    if (Math.floor(keys[2]) === keys[2]) {
                        s += sprintf("%2d,%2d,%2d", keys[0], keys[1], keys[2]);
                    } else {
                        s += sprintf("%2d,%2d,.%d", keys[0], keys[1], keys[2]*10);
                    }
                    break;
            }
        }
        update_lcd(s);
    } else {
        if (DigitEntry) {
            if (Entry !== "") {
                update_lcd(insert_commas(Entry));
            } else {
                update_display_num(0);
            }
        } else {
            update_display_num(Stack[0]);
        }
    }
    Display.set_complex(Flags[8]);
    Display.set_prgm(Prgm);
    if (Flags[9]) {
        if (Blinker === null) {
            Blinker = setInterval(function() {
                BlinkOn = !BlinkOn;
                update_display();
            }, 300);
        }
    } else {
        if (Blinker !== null) {
            clearInterval(Blinker);
            Blinker = null;
        }
    }
}

function push(x, forcelift) {
    if (forcelift || StackLift) {
        Stack[3] = Stack[2]; StackI[3] = StackI[2];
        Stack[2] = Stack[1]; StackI[2] = StackI[1];
        Stack[1] = Stack[0]; StackI[1] = StackI[0];
    }
    Stack[0] = x;
    StackI[0] = 0;
    StackLift = true;
}

function fill(x) {
    for (var i in Stack) {
        Stack[i] = x;
    }
}

function unop(f) {
    LastX = Stack[0];
    LastXI = StackI[0];
    var r = f(Stack[0]);
    if (isNaN(r) || r === Infinity || r === -Infinity) {
        throw new CalcError(0);
    }
    Stack[0] = r;
}

function binop(f) {
    LastX = Stack[0];
    LastXI = StackI[0];
    var r = f(Stack[1], Stack[0]);
    if (isNaN(r) || r === Infinity || r === -Infinity) {
        throw new CalcError(0);
    }
    Stack[0] = r;
    Stack[1] = Stack[2]; StackI[1] = StackI[2];
    Stack[2] = Stack[3]; StackI[2] = StackI[3];
}

function unopc(f) {
    LastX = Stack[0];
    LastXI = StackI[0];
    var r = f(new Complex(Stack[0], StackI[0]));
    if (r instanceof Complex) {
        Stack[0] = r.re;
        StackI[0] = r.im;
    } else {
        Stack[0] = r;
        StackI[0] = 0;
    }
}

function binopc(f) {
    LastX = Stack[0];
    LastXI = StackI[0];
    var r = f(new Complex(Stack[1], StackI[1]), new Complex(Stack[0], StackI[0]));
    Stack[0] = r.re;
    StackI[0] = r.im;
    Stack[1] = Stack[2]; StackI[1] = StackI[2];
    Stack[2] = Stack[3]; StackI[2] = StackI[3];
}

function unopm(f) {
    LastX = Stack[0];
    LastXI = StackI[0];
    var r = f(Stack[0]);
    g_Matrix[Result] = r;
    Stack[0] = new Descriptor(Result);
}

function binopm(f) {
    LastX = Stack[0];
    LastXI = StackI[0];
    var r = f(Stack[1], Stack[0]);
    g_Matrix[Result] = r;
    Stack[0] = new Descriptor(Result);
    Stack[1] = Stack[2]; StackI[1] = StackI[2];
    Stack[2] = Stack[3]; StackI[2] = StackI[3];
}

function op_sqrt() {
    if (Flags[8]) {
        unopc((x) => x.sqrt());
    } else {
        unop(Math.sqrt);
    }
}

function op_A() {
    op_gsb(11);
}

function op_x2() {
    if (Flags[8]) {
        unopc((x) => x.square());
    } else {
        unop((x) => x * x);
    }
}

function op_ex() {
    if (Flags[8]) {
        unopc((x) => x.exp());
    } else {
        unop(Math.exp);
    }
}

function op_B() {
    op_gsb(12);
}

function op_ln() { 
    if (Flags[8]) {
        unopc((x) => x.log());
    } else {
        unop(Math.log);
    }
}

function op_10x() {
    if (Flags[8]) {
        unopc((x) => x.exp10());
    } else {
        unop((x) => Math.pow(10, x));
    }
}

function op_C() {
    op_gsb(13);
}

function op_log() {
    if (Flags[8]) {
        unopc((x) => x.log10());
    } else {
        unop((x) => Math.log(x) / Math.LN10);
    }
}

function op_yx() {
    if (Flags[8]) {
        binopc((y, x) => y.pow(x));
    } else {
        binop(Math.pow);
    }
}

function op_D() {
    op_gsb(14);
}

function op_pct() {
    LastX = Stack[0];
    LastXI = StackI[0];
    Stack[0] = Stack[1] * Stack[0] / 100;
}

function op_1x() {
    if (Stack[0] instanceof Descriptor) {
        unopm((x) => g_Matrix[x.label].inverse());
    } else if (Flags[8]) {
        unopc((x) => x.inv());
    } else {
        unop((x) => 1 / x);
    }
}

function op_E() {
    op_gsb(15);
}

function op_dpct() {
    binop((y, x) => (x - y) / y * 100);
}

function op_chs() {
    if (DigitEntry) {
        var i = Entry.indexOf('e');
        if (i >= 0) {
            if (i+1 < Entry.length && Entry.charAt(i+1) === '-') {
                Entry = Entry.substr(0, i+1) + Entry.substr(i+2);
            } else {
                Entry = Entry.substr(0, i+1) + "-" + Entry.substr(i+1);
            }
        } else if (Entry.charAt(0) === '-') {
            Entry = Entry.substr(1);
        } else {
            Entry = '-' + Entry;
        }
        NewDigitEntry = true;
    } else if (Stack[0] instanceof Descriptor) {
        var x = Stack[0].label;
        g_Matrix[x] = g_Matrix[x].timesScalar(-1);
    } else {
        Stack[0] = -Stack[0];
    }
}

function op_matrix_clear() {
    g_Matrix = [new Mat(0, 0),
                new Mat(0, 0),
                new Mat(0, 0),
                new Mat(0, 0),
                new Mat(0, 0)];
}

function op_matrix_home() {
    Reg[0] = 1;
    Reg[1] = 1;
}

function op_matrix_complex2() {
    var m = Stack[0].label;
    g_Matrix[m] = g_Matrix[m].complex2();
}

function op_matrix_complex3() {
    var m = Stack[0].label;
    g_Matrix[m] = g_Matrix[m].complex3();
}

function op_matrix_transpose() {
    var m = Stack[0].label;
    g_Matrix[m] = g_Matrix[m].transpose();
}

function op_matrix_transmul() {
    binopm(function(y, x) {
        return g_Matrix[y.label].transpose().times(g_Matrix[x.label]);
    });
}

function op_matrix_residual() {
    binopm(function(y, x) {
        var Y = g_Matrix[y.label];
        var X = g_Matrix[x.label];
        var R = g_Matrix[Result];
        return R.residual(Y, X);
    });
}

function op_matrix_norm() {
    unop(function(x) {
        return g_Matrix[x.label].norm();
    });
}

function op_matrix_normf() {
    unop(function(x) {
        return g_Matrix[x.label].normF();
    });
}

function op_matrix_det() {
    unop(function(x) {
        return g_Matrix[x.label].det();
    });
}

function op_abs() {
    if (Stack[0] instanceof Descriptor) {
        throw new CalcError(1);
    }
    if (Flags[8]) {
        unopc(function(x) {
            return new Complex(x.abs(), 0);
        });
    } else {
        unop(Math.abs);
    }
}

function op_fix(n) {
    DisplayMode = 1;
    DisplayDigits = n;
    StackLift = OldStackLift;
}

function op_fix_index() {
    op_fix(trunc(Reg.I));
}

function op_deg() {
    FullCircle = 360;
    TrigFactor = Math.PI / 180;
    Display.set_trigmode(null);
    StackLift = OldStackLift;
}

function op_sci(n) {
    DisplayMode = 2;
    DisplayDigits = n;
    StackLift = OldStackLift;
}

function op_sci_index() {
    op_sci(trunc(Reg.I));
}

function op_rad() {
    FullCircle = Math.PI * 2; // for consistency, but we will not use this value
    TrigFactor = 1;
    Display.set_trigmode("RAD");
    StackLift = OldStackLift;
}

function op_eng(n) {
    DisplayMode = 3;
    DisplayDigits = n;
    StackLift = OldStackLift;
}

function op_eng_index() {
    op_eng(trunc(Reg.I));
}

function op_grd() {
    FullCircle = 400;
    TrigFactor = Math.PI / 200;
    Display.set_trigmode("GRAD");
    StackLift = OldStackLift;
}

function op_div() {
    if (Stack[0] instanceof Descriptor && Stack[1] instanceof Descriptor) {
        binopm(function(y, x) {
            return g_Matrix[x.label].inverse().times(g_Matrix[y.label]);
        });
    } else if (Stack[0] instanceof Descriptor) {
        binopm(function(y, x) {
            return g_Matrix[x.label].inverse().timesScalar(y);
        });
    } else if (Stack[1] instanceof Descriptor) {
        binopm(function(y, x) {
            return g_Matrix[y.label].timesScalar(1/x);
        });
    } else if (Flags[8]) {
        binopc(function(y, x) {
            return y.div(x);
        });
    } else {
        binop(function(y, x) { return y / x; });
    }
}

function op_solve(n) {
    var call = function(n) {
        var r = ReturnStack.length;
        op_gsb(n);
        while (ReturnStack.length > r) {
            step();
        }
    };
    // This is http://mathworld.wolfram.com/SecantMethod.html
    var eps = 1e-9;
    var maxiter = 100;
    var x0, x1, x2, y0, y1, y2;
    x0 = Stack[1];
    x1 = Stack[0];
    if (x1 === x0) {
        x1 = x0 * 1.01;
    }
    while (true) {
        fill(x0);
        call(n);
        y0 = Stack[0];
        fill(x1);
        call(n);
        y1 = Stack[0];
        x2 = x1 - y1 * ((x1 - x0) / (y1 - y0));
        if (isNaN(x2) || x2 === Infinity || x2 === -Infinity) {
            if (Running) {
                PC++;
                return;
            } else {
                throw new CalcError(8);
            }
        }
        fill(x2);
        call(n);
        y2 = Stack[0];
        //alert("x0=" + x0 + " y0=" + y0 + "\n" +
        //      "x1=" + x1 + " y1=" + y1 + "\n" +
        //      "x2=" + x2 + " y2=" + y2 + "\n");
        x0 = x1;
        x1 = x2;
        if (Math.abs(x1 - x0) < eps) {
            break;
        }
        if (--maxiter <= 0) {
            if (Running) {
                PC++;
                return;
            } else {
                throw new CalcError(8);
            }
        }
    }
    push(y2);
    push(x1);
    push(x2);
}

function op_le() {
    if (Stack[0] <= Stack[1]) {
        // execute next opcode
    } else {
        PC++;
    }
}

function op_sst() {
    if (Prgm) {
        PC++;
        if (PC >= Program.length) {
            PC = 0;
        }
    } else {
        step();
    }
    StackLift = OldStackLift;
}

function op_bst() {
    if (PC > 0) {
        PC--;
    }
    StackLift = OldStackLift;
}

function op_gto_immediate(n) {
    PC = n;
}

function op_gto_label(n) {
    var p = PC + 1;
    while (true) {
        if (p >= Program.length) {
            p = 0;
        } else {
            //print(p + ": " + Program[p].info.keys);
            if (Program[p].info.keys.toString() === [42,21,n].toString()) {
                break;
            }
        }
        if (p === PC) {
            throw new CalcError(4);
        }
        p++;
    }
    PC = p;
}

function op_gto_index() {
    var i = trunc(Reg.I);
    if (i < 0) {
        PC = -i;
    } else if (i < 10) {
        op_gto_label(i);
    } else if (i < 20) {
        op_gto_label((i - 10) / 10);
    } else if (i < 24) {
        op_gto_label(i - 9);
    } else {
        alert("error 4 ");
    }
}

function op_sinh() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.sinh();
        });
    } else {
        unop(sinh);
    }
}

function op_cosh() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.cosh();
        });
    } else {
        unop(cosh);
    }
}

function op_tanh() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.tanh();
        });
    } else {
        unop(tanh);
    }
}

function op_asinh() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.asinh();
        });
    } else {
        unop(function(x) {
            return sign(x) * Math.log(Math.abs(x) + Math.sqrt(x*x + 1));
        });
    }
}

function op_acosh() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.acosh();
        });
    } else {
        unop(function(x) {
            return Math.log(x + Math.sqrt(x*x - 1));
        });
    }
}

function op_atanh() {
    if (Flags[8]) {
        unopc((x) => x.atanh());
    } else {
        unop((x) => Math.log((1 + x) / (1 - x)) / 2);
    }
}

function op_sin() {
    if (Flags[8]) {
        unopc((x) => x.sin());
    } else {
        unop(sin_drg_mode);
    }
}

function op_dim(m) {
    var oldmat = g_Matrix[m].m;
    var r = Stack[1];
    var c = Stack[0];
    var i, j;
    if (oldmat.getRowDimension() > 0 && r > 0 && c > 0) {
        var a = oldmat.getArray();
        if (c < a[0].length) {
            for (i = 0; i < a.length; i++) {
                a[i] = a[i].slice(0, c);
            }
        } else if (c > a[0].length) {
            for (i = 0; i < a.length; i++) {
                for (j = a[i].length; j < c; j++) {
                    a[i][j] = 0;
                }
            }
        }
        if (r < a.length) {
            a = a.slice(0, r);
        } else {
            while (r > a.length) {
                var b = new Array(a[0].length);
                for (i = 0; i < c; i++) {
                    b[i] = 0;
                }
                a[a.length] = b;
            }
        }
        g_Matrix[m] = new Mat(new Matrix(a));
    } else {
        g_Matrix[m] = new Mat(Stack[1], Stack[0]);
    }
}

function op_dim_i() {
    // noop
}

function op_asin() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.asin();
        });
    } else {
        unop(function(x) {
            return Math.asin(x) / TrigFactor;
        });
    }
}

function op_cos() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.cos();
        });
    } else {
        unop(cos_drg_mode);
    }
}

function op_index() {
    if (Flags[8]) {
        update_display_num(StackI[0]);
        DelayUpdate = 1000;
    }
    StackLift = OldStackLift;
}

function op_acos() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.acos();
        });
    } else {
        unop(function(x) {
            return Math.acos(x) / TrigFactor;
        });
    }
}

function op_tan() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.tan();
        });
    } else {
        unop(tan_drg_mode);
    }
}

function op_I() {
    Flags[8] = true;
    StackI[0] = Stack[0];
    Stack[0] = Stack[1];
    Stack[1] = Stack[2]; StackI[1] = StackI[2];
    Stack[2] = Stack[3]; StackI[2] = StackI[3];
}

function op_atan() {
    if (Flags[8]) {
        unopc(function(x) {
            return x.atan();
        });
    } else {
        unop(function(x) {
            return Math.atan(x) / TrigFactor;
        });
    }
}

function op_eex() {
    op_input('e');
}

function op_result(m) {
    Result = m;
}

function op_pi() {
    push(Math.PI);
}

function op_xchg(r) {
    var t = Reg[r];
    Reg[r] = Stack[0];
    Stack[0] = t;
}

function op_xchg_index() {
    op_xchg(Math.floor(Math.abs(Reg.I)));
}

function op_sf(f) {
    Flags[f] = true;
}

function op_sf_index() {
    op_sf(Math.floor(Math.abs(Reg.I)));
}

function op_dse(r) {
    var n = trunc(Reg[r]);
    var f = Reg[r] - n;
    var s = sprintf("%.5f", f);
    var x = +s.substr(2, 3);
    var y = +s.substr(5, 2);
    if (y === 0) {
        y = 1;
    }
    n -= y;
    Reg[r] = n + f;
    if (n <= x) {
        PC++;
    }
}

function op_dse_index() {
    op_dse(Math.floor(Math.abs(Reg.I)));
}

function op_cf(f) {
    Flags[f] = false;
}

function op_cf_index() {
    op_cf(Math.floor(Math.abs(Reg.I)));
}

function op_isg(r) {
    var n = trunc(Reg[r]);
    var f = Reg[r] - n;
    var s = sprintf("%.5f", f);
    var x = +s.substr(2, 3);
    var y = +s.substr(5, 2);
    if (y === 0) {
        y = 1;
    }
    n += y;
    Reg[r] = n + f;
    if (n > x) {
        PC++;
    }
}

function op_isg_index() {
    op_isg(Math.floor(Math.abs(Reg.I)));
}

function op_ftest(f) {
    if (!Flags[f]) {
        PC++;
    }
}

function op_ftest_index() {
    op_ftest(Math.floor(Math.abs(Reg.I)));
}

function op_mul() {
    if (Stack[0] instanceof Descriptor && Stack[1] instanceof Descriptor) {
        binopm(function(y, x) {
            return g_Matrix[y.label].times(g_Matrix[x.label]);
        });
    } else if (Stack[0] instanceof Descriptor) {
        binopm(function(y, x) {
            return g_Matrix[x.label].timesScalar(Stack[1]);
        });
    } else if (Stack[1] instanceof Descriptor) {
        binopm(function(y, x) {
            return g_Matrix[y.label].timesScalar(Stack[0]);
        });
    } else if (Flags[8]) {
        binopc(function(y, x) {
            return y.mul(x);
        });
    } else {
        binop(function(y, x) { return y * x; });
    }
}

function op_integrate(n) {
    var call = function(n) {
        var r = ReturnStack.length;
        op_gsb(n);
        while (ReturnStack.length > r) {
            step();
        }
    };
    // This is http://mathworld.wolfram.com/SimpsonsRule.html
    var eps = 1e-9;
    var x0 = Stack[1];
    var x1 = Stack[0];
    var d = 0;
    var prev = 0;
    var steps = 32;
    var r;
    while (true) {
        r = 0;
        for (var j = 0; j < steps; j += 2) {
            fill(x0 + (x1-x0)*j/steps);
            call(n);
            r += Stack[0];
            fill(x0 + (x1-x0)*(j+1)/steps);
            call(n);
            r += 4 * Stack[0];
            fill(x0 + (x1-x0)*(j+2)/steps);
            call(n);
            r += Stack[0];
        }
        r *= ((x1-x0)/steps) / 3;
        d = Math.abs(r - prev);
        if (d < eps) {
            break;
        }
        prev = r;
        steps *= 2;
    }
    Stack[3] = x0;
    Stack[2] = x1;
    Stack[1] = d;
    Stack[0] = r;
}

function op_eq() {
    if (Stack[0] === 0) {
        // execute next opcode
    } else {
        PC++;
    }
}

function op_rs() {
    Running = !Running;
    StackLift = OldStackLift;
}

function op_pse() {
    //alert("Unimplemented: PSE");
    // TODO set RunningPause?
    update_display();
    //if (!confirm("pause. keep going?")) {
    //    Running = false;
    //}
    StackLift = OldStackLift;
}

function op_pr() {
    Prgm = !Prgm;
    StackLift = OldStackLift;
}

function op_gsb(n) {
    if (Running) {
        ReturnStack.push(PC);
    } else {
        ReturnStack.push(0);
    }
    op_gto_label(n);
    Running = true;
}

function op_gsb_index() {
    if (Running) {
        ReturnStack.push(PC);
    } else {
        ReturnStack.push(0);
    }
    op_gto_index();
    Running = true;
}

function op_clear_stat() {
    var i;
    for (i in Stack) {
        Stack[i] = 0;
    }
    for (i = 2; i <= 7; i++) {
        Reg[i] = 0;
    }
    StackLift = OldStackLift;
}

function op_rtn() {
    if (ReturnStack.length > 0) {
        PC = ReturnStack.pop();
    } else {
        PC = 0;
    }
    if (PC === 0) {
        Running = false;
    }
}

function op_roll() {
    var t = Stack[0];
    var ti = StackI[0];
    Stack[0] = Stack[1]; StackI[0] = StackI[1];
    Stack[1] = Stack[2]; StackI[1] = StackI[2];
    Stack[2] = Stack[3]; StackI[2] = StackI[3];
    Stack[3] = t;
    StackI[3] = ti;
}

function op_clear_prgm() {
    if (Prgm) {
        Program = [null];
    }
    PC = 0;
}

function op_rollup() {
    var t = Stack[3];
    var ti = StackI[3];
    Stack[3] = Stack[2]; StackI[3] = StackI[2];
    Stack[2] = Stack[1]; StackI[2] = StackI[1];
    Stack[1] = Stack[0]; StackI[1] = StackI[0];
    Stack[0] = t;
    StackI[0] = ti;
}

function op_xy() {
    var t = Stack[0];
    var ti = StackI[0];
    Stack[0] = Stack[1]; StackI[0] = StackI[1];
    Stack[1] = t;
    StackI[1] = ti;
}

function op_clear_reg() {
    for (var i in Reg) {
        Reg[i] = 0;
    }
    StackLift = OldStackLift;
}

function op_rnd() {
    unop(function(x) {
        var factor = Math.pow(10, DisplayDigits + log10int(x));
        return Math.round(x * factor) / factor;
    });
}

function op_back() {
    if (Prgm) {
        if (PC > 0) {
            Program.splice(PC, 1);
            PC--;
        }
        return;
    } else if (Flags[9]) {
        Flags[9] = false;
        if (Stack[0] > MAX) {
            Stack[0] = MAX;
        } else if (Stack[0] < -MAX) {
            Stack[0] = -MAX;
        }
        return;
    } else if (DigitEntry && Entry.length > 0) {
        Entry = Entry.substr(0, Entry.length-1);
    } else {
        op_clx();
        Entry = "";
    }
    NewDigitEntry = true;
}

function op_clear_prefix() {
    Prefix = null;
    var x = Math.abs(Stack[0]);
    var s = sprintf("%.9e", x).replace(".", "").substr(0, 10);
    while (s.length < 10) {
        s += '0';
    }
    update_lcd(s);
    DelayUpdate = 1000;
    StackLift = OldStackLift;
}

function op_clx() {
    Stack[0] = 0;
    NewStackLift = false;
}

function op_enter() {
    push(Stack[0], true);
    // push() only pushes the real part,
    // so copy the imaginary part too
    StackI[0] = StackI[1];
    NewStackLift = false;
}

function op_rand() {
    push(Math.random());
}

function op_lastx() {
    push(LastX);
    StackI[0] = LastXI;
}

function op_to_r() {
    LastX = Stack[0];
    LastXI = StackI[0];
    var t, r;
    if (Flags[8]) {
        t = StackI[0];
        r = Stack[0];
        StackI[0] = r * sin_drg_mode(t);
        Stack[0] = r * cos_drg_mode(t);
    } else {
        t = Stack[1];
        r = Stack[0];
        Stack[1] = r * sin_drg_mode(t);
        Stack[0] = r * cos_drg_mode(t);
    }
}

function op_to_p() {
    LastX = Stack[0];
    LastXI = StackI[0];
    var x, y;
    if (Flags[8]) {
        y = StackI[0];
        x = Stack[0];
        StackI[0] = Math.atan2(y, x) / TrigFactor;
        Stack[0] = Math.sqrt(x*x + y*y);
    } else {
        y = Stack[1];
        x = Stack[0];
        Stack[1] = Math.atan2(y, x) / TrigFactor;
        Stack[0] = Math.sqrt(x*x + y*y);
    }
}

function op_to_hms() {
    unop(function(x) {
        var r = Math.floor(x);
        x -= r;
        x *= 60;
        r += Math.floor(x) / 100;
        x -= Math.floor(x);
        x *= 60;
        r += x / 10000;
        return r;
    });
}

function op_to_h() {
    unop(function(x) {
        var r = Math.floor(x);
        x -= Math.floor(x);
        x *= 100;
        r += Math.floor(x) / 60;
        x -= Math.floor(x);
        x *= 100;
        r += x / 3600;
        return r;
    });
}

function op_to_rad() {
    unop(function(x) { return x * Math.PI / 180; });
}

function op_to_deg() {
    unop(function(x) { return x * 180 / Math.PI; });
}

function op_sub() {
    if (Stack[0] instanceof Descriptor && Stack[1] instanceof Descriptor) {
        binopm(function(y, x) {
            return g_Matrix[y.label].minus(g_Matrix[x.label]);
        });
    } else if (Stack[0] instanceof Descriptor) {
        binopm(function(y, x) {
            var m = g_Matrix[x.label];
            return new Mat(m.rows, m.cols, Stack[1]).minus(m);
        });
    } else if (Stack[1] instanceof Descriptor) {
        binopm(function(y, x) {
            var m = g_Matrix[y.label];
            return m.minus(new Mat(m.rows, m.cols, Stack[0]));
        });
    } else if (Flags[8]) {
        binopc(function(y, x) {
            return y.sub(x);
        });
    } else {
        binop(function(y, x) { return y - x; });
    }
}

function op_re_im() {
    Flags[8] = true;
    var t = StackI[0];
    StackI[0] = Stack[0];
    Stack[0] = t;
}

function op_test(t) {
    var b;
    switch (t) {
        case 0: b = Stack[0] !== 0; break;
        case 1: b = Stack[0]  > 0; break;
        case 2: b = Stack[0]  < 0; break;
        case 3: b = Stack[0] >= 0; break;
        case 4: b = Stack[0] <= 0; break;
        case 5: b = Stack[0] == Stack[1]; break;
        case 6: b = Stack[0] != Stack[1]; break;
        case 7: b = Stack[0]  > Stack[1]; break;
        case 8: b = Stack[0]  < Stack[1]; break;
        case 9: b = Stack[0] >= Stack[1]; break;
    }
    if (!b) {
        PC++;
    }
}

function op_on() {
    On = !On;
}

function op_sto_reg(n) {
    Reg[n] = Stack[0];
}

function op_sto_op_reg(op, n) {
    switch (op) {
        case '+': Reg[n] += Stack[0]; break;
        case '-': Reg[n] -= Stack[0]; break;
        case '*': Reg[n] *= Stack[0]; break;
        case '/': Reg[n] /= Stack[0]; break;
    }
}

function op_sto_index(user) {
    if (Reg.I instanceof Descriptor) {
        op_sto_matrix(Reg.I.label, user);
    } else {
        op_sto_reg(Math.floor(Math.abs(Reg.I)));
    }
}

function op_sto_op_index(op) {
    op_sto_op_reg(op, Math.floor(Math.abs(Reg.I)));
}

function op_sto_matrix(m, user) {
    g_Matrix[m].set(Reg[0], Reg[1], Stack[0]);
    update_lcd(sprintf("%c %2d,%d", "A".charCodeAt(0) + m, Reg[0], Reg[1]));
    DelayUpdate = 1000;
    if (user) {
        if (Reg[1] < g_Matrix[m].cols) {
            Reg[1]++;
        } else if (Reg[0] < g_Matrix[m].rows) {
            Reg[0]++;
            Reg[1] = 1;
        } else {
            Reg[0] = 1;
            Reg[1] = 1;
            if (Running) {
                PC++;
            }
        }
    }
}

function op_sto_matrix_imm(m) {
    var x = Stack[0];
    var y = Stack[1];
    Stack[0] = Stack[2]; StackI[0] = StackI[2];
    Stack[1] = Stack[3]; StackI[1] = StackI[3];
    Stack[2] = Stack[3]; StackI[2] = StackI[3];
    g_Matrix[m].set(y, x, Stack[0]);
}

function op_sto_matrix_all(m) {
    if (Stack[0] instanceof Descriptor) {
        g_Matrix[m] = g_Matrix[Stack[0].label].copy();
    } else {
        for (var j = 1; j <= g_Matrix[m].rows; j++) {
            for (var i = 1; i <= g_Matrix[m].cols; i++) {
                g_Matrix[m].set(j, i, Stack[0]);
            }
        }
    }
}

function op_sto_result() {
    if (Stack[0] instanceof Descriptor) {
        Result = Stack[0].label;
    } else {
        // TODO: error
    }
}

function op_frac() {
    unop(function(x) {
        return x - trunc(x);
    });
}

function op_int() {
    unop(trunc);
}

function op_rcl_reg(r) {
    if (StackLift) {
        push(Reg[r]);
    } else {
        Stack[0] = Reg[r];
        StackI[0] = 0;
        StackLift = true;
    }
}

function op_rcl_op_reg(op, r) {
    switch (op) {
        case '+': Stack[0] += Reg[r]; break;
        case '-': Stack[0] -= Reg[r]; break;
        case '*': Stack[0] *= Reg[r]; break;
        case '/': Stack[0] /= Reg[r]; break;
    }
}

function op_rcl_index(user) {
    if (Reg.I instanceof Descriptor) {
        op_rcl_matrix(Reg.I.label, user);
    } else {
        op_rcl_reg(Math.floor(Math.abs(Reg.I)));
    }
}

function op_rcl_op_index(op) {
    op_rcl_op_reg(op, Math.floor(Math.abs(Reg.I)));
}

function op_rcl_descriptor(m) {
    push(new Descriptor(m));
}

function op_rcl_dim(m) {
    push(g_Matrix[m].rows);
    push(g_Matrix[m].cols);
}

function op_rcl_matrix(m, user) {
    if (StackLift) {
        push(g_Matrix[m].get(Reg[0], Reg[1]));
    } else {
        Stack[0] = g_Matrix[m].get(Reg[0], Reg[1]);
        StackLift = true;
    }
    update_lcd(sprintf("%c %2d,%d", "A".charCodeAt(0) + m, Reg[0], Reg[1]));
    DelayUpdate = 1000;
    if (user) {
        if (Reg[1] < g_Matrix[m].cols) {
            Reg[1]++;
        } else if (Reg[0] < g_Matrix[m].rows) {
            Reg[0]++;
            Reg[1] = 1;
        } else {
            Reg[0] = 1;
            Reg[1] = 1;
            if (Running) {
                PC++;
            }
        }
    }
}

function op_rcl_matrix_imm(m) {
    binop(function(y, x) {
        return g_Matrix[m].get(y, x);
    });
}

function op_rcl_result() {
    push(new Descriptor(Result));
}

function op_user() {
    User = !User;
    Display.set_user(User);
    StackLift = OldStackLift;
}

function op_mem() {
    alert("Unimplemented: MEM");
    StackLift = OldStackLift;
}

function op_fact() {
    unop(function(x) {
        if (x >= 0 && x === Math.floor(x)) {
            if (x > 69) {
                Flags[9] = true;
                return MAX;
            }
            var r = 1;
            while (x > 1) {
                r *= x;
                x -= 1;
            }
            return r;
        } else {
            x += 1;
            var gamma = function(z) {
                // Spouge approximation
                // https://en.wikipedia.org/wiki/Spouge's_approximation
                var kc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                var kf = 1.0;
                kc[0] = Math.sqrt(2.0 * Math.PI);
                for (var k = 1; k < 12; k++) {
                    kc[k] = Math.exp(12.0 - k) * Math.pow(12.0 - k, k - 0.5) / kf;
                    kf *= -k;
                }
                var acc = kc[0];
                for (k = 1; k < 12; k++) {
                    acc += kc[k] / (z + k);
                }
                acc *= Math.exp(-(z + 12)) * Math.pow(z + 12, z + 0.5);
                return acc / z;
            };
            if (x <= 0 && x === Math.floor(x)) {
                Flags[9] = true;
                return -MAX;
            }
            if (x < -70.06400563) {
                return 0;
            }
            if (x > 70.95757445) {
                Flags[9] = true;
                return MAX;
            }
            if (x >= -10) {
                return gamma(x);
            } else {
                return Math.PI / (gamma(1-x) * Math.sin(Math.PI * x));
            }
        }
    });
}

function op_mean() {
    push(Reg[5] / Reg[2]);
    push(Reg[3] / Reg[2]);
}

function op_yhat() {
    LastX = Stack[0];
    LastXI = StackI[0];
    var M = Reg[2] * Reg[4] - Reg[3] * Reg[3];
    var N = Reg[2] * Reg[6] - Reg[5] * Reg[5];
    var P = Reg[2] * Reg[7] - Reg[3] * Reg[5];
    push(P / Math.sqrt(M * N));
    push((M * Reg[5] + P * (Reg[2] * LastX - Reg[3])) / (Reg[2] * M));
}

function op_s() {
    var M = Reg[2] * Reg[4] - Reg[3] * Reg[3];
    var N = Reg[2] * Reg[6] - Reg[5] * Reg[5];
    push(Math.sqrt(N / (Reg[2] * (Reg[2] - 1))));
    push(Math.sqrt(M / (Reg[2] * (Reg[2] - 1))));
}

function op_sum() {
    LastX = Stack[0];
    LastXI = StackI[0];
    Reg[2] += 1;
    Reg[3] += Stack[0];
    Reg[4] += Stack[0] * Stack[0];
    Reg[5] += Stack[1];
    Reg[6] += Stack[1] * Stack[1];
    Reg[7] += Stack[0] * Stack[1];
    Stack[0] = Reg[2];
    NewStackLift = false;
}

function op_lr() {
    var M = Reg[2] * Reg[4] - Reg[3] * Reg[3];
    var N = Reg[2] * Reg[6] - Reg[5] * Reg[5];
    var P = Reg[2] * Reg[7] - Reg[3] * Reg[5];
    push(P / M);
    push((M * Reg[5] - P * Reg[3]) / (Reg[2] * M));
}

function op_sumsub() {
    LastX = Stack[0];
    LastXI = StackI[0];
    Reg[2] -= 1;
    Reg[3] -= Stack[0];
    Reg[4] -= Stack[0] * Stack[0];
    Reg[5] -= Stack[1];
    Reg[6] -= Stack[1] * Stack[1];
    Reg[7] -= Stack[0] * Stack[1];
    Stack[0] = Reg[2];
    NewStackLift = false;
}

function op_add() {
    if (Stack[0] instanceof Descriptor && Stack[1] instanceof Descriptor) {
        binopm(function(y, x) {
            return g_Matrix[y.label].plus(g_Matrix[x.label]);
        });
    } else if (Stack[0] instanceof Descriptor) {
        binopm(function(y, x) {
            var m = g_Matrix[x.label];
            return m.plus(new Mat(m.rows, m.cols, Stack[1]));
        });
    } else if (Stack[1] instanceof Descriptor) {
        binopm(function(y, x) {
            var m = g_Matrix[y.label];
            return m.plus(new Mat(m.rows, m.cols, Stack[0]));
        });
    } else if (Flags[8]) {
        binopc(function(y, x) {
            return y.add(x);
        });
    } else {
        binop(function(y, x) { return y + x; });
    }
}

function op_Pyx() {
    if (Stack[0] instanceof Descriptor) {
        var m = Stack[0].label;
        g_Matrix[m] = g_Matrix[m].partition();
    } else {
        binop(function(y, x) {
            var r = 1;
            var t = y - x;
            while (y > t) {
                r *= y;
                y--;
            }
            return r;
        });
    }
}

function op_Cyx() {
    if (Stack[0] instanceof Descriptor) {
        var m = Stack[0].label;
        g_Matrix[m] = g_Matrix[m].unpartition();
    } else {
        binop(function(y, x) {
            var r = 1;
            var t = y - x;
            while (y > t) {
                r *= y;
                y--;
            }
            while (x > 1) {
                r /= x;
                x--;
            }
            return r;
        });
    }
}

function op_input(c) {
    if (!DigitEntry) {
        if (StackLift) {
            push("");
        }
        Entry = "";
    }
    if (Entry.length === 0) {
        switch (c) {
            case 'e':
                Entry = "1";
                break;
            case '.':
                Entry = "0";
                break;
        }
    }
    Entry = Entry + c;
    NewDigitEntry = true;
}

function decode_matrix(k) {
    Prefix = function(k) {
        switch (k) {
            case '0': return new Opcode(new OpcodeInfo([42,16,0], op_matrix_clear));
            case '1': return new Opcode(new OpcodeInfo([42,16,1], op_matrix_home));
            case '2': return new Opcode(new OpcodeInfo([42,16,2], op_matrix_complex2));
            case '3': return new Opcode(new OpcodeInfo([42,16,3], op_matrix_complex3));
            case '4': return new Opcode(new OpcodeInfo([42,16,4], op_matrix_transpose));
            case '5': return new Opcode(new OpcodeInfo([42,16,5], op_matrix_transmul));
            case '6': return new Opcode(new OpcodeInfo([42,16,6], op_matrix_residual));
            case '7': return new Opcode(new OpcodeInfo([42,16,7], op_matrix_norm));
            case '8': return new Opcode(new OpcodeInfo([42,16,8], op_matrix_normf));
            case '9': return new Opcode(new OpcodeInfo([42,16,9], op_matrix_det));
        }
    };
    return null;
}

function decode_fix(k) {
    Prefix = function(k) {
        if (k >= '0' && k <= '9') {
            var i = Number(k);
            return new Opcode(new OpcodeInfo([42,7,i]), function() { op_fix(i); });
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([42,7,25]), op_fix_index);
        }
    };
    return null;
}

function decode_sci(k) {
    Prefix = function(k) {
        if (k >= '0' && k <= '9') {
            var i = Number(k);
            return new Opcode(new OpcodeInfo([42,8,i]), function() { op_sci(i); });
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([42,8,25]), op_sci_index);
        }
    };
    return null;
}

function decode_eng(k) {
    Prefix = function(k) {
        if (k >= '0' && k <= '9') {
            var i = Number(k);
            return new Opcode(new OpcodeInfo([42,9,i]), function() { op_eng(i); });
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([42,9,25]), op_eng_index);
        }
    };
    return null;
}

function decode_solve(k) {
    var f = 1;
    Prefix = function(k) {
        var i;
        if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            i = Number(k) / f;
            return new Opcode(new OpcodeInfo([42,10,i]), function() { op_solve(i); });
        } else {
            i = "qE)^\\".indexOf(k);
            if (i >= 0) {
                return new Opcode(new OpcodeInfo([42,10,11+i]), function() { op_solve(11+i); });
            }
        }
    };
    return null;
}

function decode_lbl(k) {
    var f = 1;
    Prefix = function(k) {
        var i;
        if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            i = Number(k) / f;
            return new Opcode(new OpcodeInfo([42,21,i]), function() {});
        } else {
            i = "qE)^\\".indexOf(k);
            if (i >= 0) {
                return new Opcode(new OpcodeInfo([42,21,11+i]), function() {});
            }
        }
    };
    return null;
}

function decode_gto() {
    var f = 1;
    var immediate = false;
    var n = 0;
    var i = 0;
    Prefix = function(k) {
        var x;
        if (k === '_' && n === 0) {
            immediate = true;
            Prefix = OldPrefix;
            return null;
        } else if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            x = Number(k);
            if (immediate) {
                n = n * 10 + x;
                i++;
                if (i === 3) {
                    return new Opcode(new OpcodeInfo([22], null, false), function() { op_gto_immediate(n); });
                }
                Prefix = OldPrefix;
                return null;
            } else {
                x /= f;
                return new Opcode(new OpcodeInfo([22,x]), function() { op_gto_label(x); });
            }
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([22,25]), function() { op_gto_index(); });
        } else {
            x = "qE)^\\".indexOf(k);
            if (x >= 0) {
                return new Opcode(new OpcodeInfo([22,11+x]), function() { op_gto_label(11+x); });
            }
        }
    };
    return null;
}

function decode_hyp(k) {
    Prefix = function(k) {
        switch (k) {
            case 's': return new Opcode(new OpcodeInfo([42,22,23], op_sinh));
            case 'c': return new Opcode(new OpcodeInfo([42,22,24], op_cosh));
            case 't': return new Opcode(new OpcodeInfo([42,22,25], op_tanh));
        }
    };
    return null;
}

function decode_ahyp(k) {
    Prefix = function(k) {
        switch (k) {
            case 's': return new Opcode(new OpcodeInfo([43,22,23], op_asinh));
            case 'c': return new Opcode(new OpcodeInfo([43,22,24], op_acosh));
            case 't': return new Opcode(new OpcodeInfo([43,22,25], op_atanh));
        }
    };
    return null;
}

function decode_dim(k) {
    Prefix = function(k) {
        if (k == 'c') {
            return new Opcode(new OpcodeInfo([42,23,24]), op_dim_i);
        } else {
            var i = "qE)^\\".indexOf(k);
            if (i >= 0) {
                return new Opcode(new OpcodeInfo([42,23,11+i]), function() { op_dim(i); });
            }
        }
    };
    return null;
}

function decode_result(k) {
    Prefix = function(k) {
        var i = "qE)^\\".indexOf(k);
        if (i >= 0) {
            return new Opcode(new OpcodeInfo([42,26,11+i]), function() { op_result(i); });
        }
    };
    return null;
}

function decode_xchg(k) {
    var f = 0;
    Prefix = function(k) {
        if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            var i = Number(k) + f;
            return new Opcode(new OpcodeInfo([42,4,i]), function() { op_xchg(i); });
        } else if (k === 'c') {
            return new Opcode(new OpcodeInfo([42,4,24]), op_xchg_index);
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([42,4,25]), function() { op_xchg('I'); });
        }
    };
    return null;
}

function decode_sf(k) {
    Prefix = function(k) {
        if (k >= '0' && k <= '9') {
            var i = Number(k);
            return new Opcode(new OpcodeInfo([43,4,i]), function() { op_sf(i); });
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([43,4,25]), op_sf_index);
        }
    };
    return null;
}

function decode_dse(k) {
    var f = 0;
    Prefix = function(k) {
        if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            var i = Number(k) + f;
            return new Opcode(new OpcodeInfo([42,5,i]), function() { op_dse(i); });
        } else if (k === 'c') {
            return new Opcode(new OpcodeInfo([42,5,24]), op_dse_index);
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([42,5,25]), function() { op_dse('I'); });
        }
    };
    return null;
}

function decode_cf(k) {
    Prefix = function(k) {
        if (k >= '0' && k <= '9') {
            var i = Number(k);
            return new Opcode(new OpcodeInfo([43,5,i]), function() { op_cf(i); });
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([43,5,25]), op_cf_index);
        }
    };
    return null;
}

function decode_isg(k) {
    var f = 0;
    Prefix = function(k) {
        if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            var i = Number(k) + f;
            return new Opcode(new OpcodeInfo([42,6,i]), function() { op_isg(i); });
        } else if (k === 'c') {
            return new Opcode(new OpcodeInfo([42,6,24]), op_isg_index);
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([42,6,25]), function() { op_isg('I'); });
        }
    };
    return null;
}

function decode_ftest(k) {
    Prefix = function(k) {
        if (k >= '0' && k <= '9') {
            var i = Number(k);
            return new Opcode(new OpcodeInfo([43,6,i]), function() { op_ftest(i); });
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([43,6,25]), op_ftest_index);
        }
    };
    return null;
}

function decode_integrate(k) {
    var f = 1;
    Prefix = function(k) {
        var i;
        if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            i = Number(k) / f;
            return new Opcode(new OpcodeInfo([42,20,i]), function() { op_integrate(i); });
        } else {
            i = "qE)^\\".indexOf(k);
            if (i >= 0) {
                return new Opcode(new OpcodeInfo([42,20,11+i]), function() { op_integrate(11+i); });
            }
        }
    };
    return null;
}

function decode_gsb() {
    var f = 1;
    Prefix = function(k) {
        var i;
        if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            i = Number(k) / f;
            return new Opcode(new OpcodeInfo([32,i]), function() { op_gsb(i); });
        } else if (k === 't') {
            return new Opcode(new OpcodeInfo([32,25]), function() { op_gsb_index(); });
        } else {
            i = "qE)^\\".indexOf(k);
            if (i >= 0) {
                return new Opcode(new OpcodeInfo([32,11+i]), function() { op_gsb(11+i); });
            }
        }
    };
    return null;
}

function decode_test(k) {
    Prefix = function(k) {
        if (k >= '0' && k <= '9') {
            var i = Number(k);
            return new Opcode(new OpcodeInfo([43,30,i]), function() { op_test(i); });
        }
    };
    return null;
}

function decode_f() {
    Shift = 1;
    Display.clear_shift();
    Display.set_shift("f");
    return null;
}

function decode_g() {
    Shift = 2;
    Display.clear_shift();
    Display.set_shift("g");
    return null;
}

function decode_sto(k) {
    var f = 0;
    var op = null;
    var g = false;
    Prefix = function(k) {
        var i, u;
        if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            i = Number(k) + f;
            if (op !== null) {
                return new Opcode(new OpcodeInfo([44,OpcodeIndex[op],i]), function() { op_sto_op_reg(op, i); });
            } else {
                return new Opcode(new OpcodeInfo([44,i]), function() { op_sto_reg(i); });
            }
        } else if (k === '+' || k === '-' || k === '*' || k === '/') {
            op = k;
            Prefix = OldPrefix;
            return null;
        } else if (k === '_') {
            Prefix = function(k) {
                i = "qE)^\\".indexOf(k);
                if (i >= 0) {
                    return new Opcode(new OpcodeInfo([44,16,11+i]), function() { op_sto_matrix_all(i); });
                }
            };
            return null;
        } else if (k === 'c') {
            if (op !== null) {
                return new Opcode(new OpcodeInfo([44,OpcodeIndex[op],24]), function() { op_sto_op_index(op); });
            } else {
                u = User;
                return new Opcode(new OpcodeInfo([44,24]), function() { op_sto_index(u); });
            }
        } else if (k === 't') {
            if (op !== null) {
                return new Opcode(new OpcodeInfo([44,OpcodeIndex[op],25]), function() { op_sto_op_reg(op, 'I'); });
            } else {
                return new Opcode(new OpcodeInfo([44,25]), function() { op_sto_reg('I'); });
            }
        } else if (k === 'e') {
            return new Opcode(new OpcodeInfo([44,26]), op_sto_result);
        } else if (k === 'g') {
            g = true;
            Prefix = OldPrefix;
            return null;
        } else {
            i = "qE)^\\".indexOf(k);
            if (i >= 0) {
                if (g) {
                    return new Opcode(new OpcodeInfo([44,43,11+i]), function() { op_sto_matrix_imm(i); });
                } else {
                    u = User; // capture current value
                    return new Opcode(new OpcodeInfo([44,11+i], null, true, User), function() { op_sto_matrix(i, u); });
                }
            }
        }
    };
    return null;
}

function decode_rcl(k) {
    var f = 0;
    var op = null;
    var g = false;
    Prefix = function(k) {
        var i, u;
        if (k === '.') {
            f = 10;
            Prefix = OldPrefix;
            return null;
        } else if (k >= '0' && k <= '9') {
            i = Number(k) + f;
            if (op !== null) {
                return new Opcode(new OpcodeInfo([45,OpcodeIndex[op],i]), function() { op_rcl_op_reg(op, i); });
            } else {
                return new Opcode(new OpcodeInfo([45,i]), function() { op_rcl_reg(i); });
            }
        } else if (k === '+' || k === '-' || k === '*' || k === '/') {
            op = k;
            Prefix = OldPrefix;
            return null;
        } else if (k === '_') {
            Prefix = function(k) {
                i = "qE)^\\".indexOf(k);
                if (i >= 0) {
                    return new Opcode(new OpcodeInfo([45,16,11+i]), function() { op_rcl_descriptor(i); });
                }
            };
            return null;
        } else if (k === 's') {
            Prefix = function(k) {
                i = "qE)^\\".indexOf(k);
                if (i >= 0) {
                    return new Opcode(new OpcodeInfo([45,23,11+i]), function() { op_rcl_dim(i); });
                }
            };
            return null;
        } else if (k === 'c') {
            if (op !== null) {
                return new Opcode(new OpcodeInfo([45,OpcodeIndex[op],24]), function() { op_rcl_op_index(op); });
            } else {
                u = User;
                return new Opcode(new OpcodeInfo([45,24]), function() { op_rcl_index(u); });
            }
        } else if (k === 't') {
            if (op !== null) {
                return new Opcode(new OpcodeInfo([45,OpcodeIndex[op],25]), function() { op_rcl_op_reg(op, 'I'); });
            } else {
                return new Opcode(new OpcodeInfo([45,25]), function() { op_rcl_reg('I'); });
            }
        } else if (k === 'e') {
            return new Opcode(new OpcodeInfo([45,26]), op_rcl_result);
        } else if (k === 'g') {
            g = true;
            Prefix = OldPrefix;
            return null;
        } else {
            i = "qE)^\\".indexOf(k);
            if (i >= 0) {
                if (g) {
                    return new Opcode(new OpcodeInfo([45,43,11+i]), function() { op_rcl_matrix_imm(i); });
                } else {
                    u = User; // capture current value
                    return new Opcode(new OpcodeInfo([45,11+i], null, true, User), function() { op_rcl_matrix(i, u); });
                }
            }
        }
    };
    return null;
}

function decode(k) {
    var d = null;
    var s = Shift;
    Shift = -1;
    if (Prefix != null) {
        d = Prefix;
    } else if (typeof(CharTable[k]) === "object") {
        if (User && "qE)^\\".indexOf(k) >= 0) {
            switch (s) {
                case 0: s = 1; break;
                case 1: s = 0; break;
            }
        }
        d = CharTable[k][s];
    } else {
        d = CharTable[k];
        if (d === undefined) {
            return null;
        }
    }
    OldPrefix = Prefix;
    Prefix = null;
    var r = d(k);
    if (Shift === -1) {
        Shift = 0;
        Display.clear_shift();
    }
    return r;
}

function step() {
    if (PC === 0) {
        PC = 1;
    }
    if (PC < Program.length) {
        //console.log("PC", PC, Program[PC].info.defn);
        var p = PC;
        PC++;
        try {
            Program[p].exec();
        } catch (e) {
            Running = false;
            if (e.name === "CalcError") {
                update_lcd("Error " + e.code);
                DelayUpdate = -1;
            } else {
                throw e;
            }
        }
    } else {
        op_rtn();
    }
}

function run() {
    RunTimer = null;
    if (!Running) {
        alert("run() called when not Running");
        return;
    }
    step();
    if (Running) {
        RunTimer = setTimeout(run, 0);
    } else {
        update_display();
    }
}

function delay_update_timeout() {
    if (!TemporaryDisplay) {
        update_display();
    }
    DisplayTimeout = 0;
}

function key_up() {
    if (TemporaryDisplay) {
        TemporaryDisplay = false;
        if (DisplayTimeout === 0) {
            delay_update_timeout();
        }
    }
}

function key_down(k, override) {
    if (!On && k != '\x1b') {
        return;
    }
    if (DisableKeys && !override) {
        return;
    }
    var op = decode(k);
    if (op === undefined) {
        //console.log("undefined decode: "+k);
        return;
    }
    if (Running) {
        clearTimeout(RunTimer);
        Running = false;
        return;
    }
    if (op !== null) {
        try {
            if (Prgm && op.info.programmable) {
                PC++;
                Program.splice(PC, 0, op);
            } else {
                op.exec();
                if (Running) {
                    RunTimer = setTimeout(run, 0);
                }
            }
        } catch (e) {
            if (e.name === "CalcError") {
                update_lcd("Error " + e.code);
                DelayUpdate = -1;
            } else {
                throw e;
            }
        }
    }
    if (DelayUpdate === 0) {
        update_display();
    } else {
        if (DelayUpdate > 0) {
            TemporaryDisplay = true;
            DisplayTimeout = setTimeout(delay_update_timeout, DelayUpdate);
        }
        DelayUpdate = 0;
    }
}

export function key(k, override) {
    key_down(k, override);
    key_up();
}

function paste(s) {
    if (!Prgm) {
        new Opcode(null, function() { push(s); }).exec();
        update_display();
    }
}

export function init(display) {
    Display = display;
    for (var i = 0; i < Reg.length; i++) {
        Reg[i] = 0;
    }
    update_display();
}
/*
** begin tests.
*/
var Tests = [
    // Page references from HP-15C Owner's Handbook (November 1985)
//]; var zz = [

    // p13
    ["9\r6-", 3],
    ["9\r6*", 54],
    ["9\r6/", 1.5],
    ["9\r6^", 531441],
    // p14
    ["300.51\r2*9.8/q", 7.8313, 0.0001],

    // Part I Fundamentals
    // p19
    ["123_\r", -123],
    ["1.2e3\r", 1200],
    ["1.2e_3\r", 0.0012],
    // p20
    ["6.6262e34_\r50*", 3.3131e-32, 0.0001],
    ["g\b", 0],
    ["12345", 12345],
    ["\b", 1234],
    ["9", 12349],
    ["q", 111.1261, 0.0001],
    ["\b", 0],
    // p22
    ["45g)", 1.6532, 0.0001],
    // p23
    ["9\r17+4-4/", 5.5],
    ["6\r7+9\r3-*", 78],
    // p24
    ["p", Math.PI],
    ["123.4567gS", 123],
    ["g\r_gS", -123],
    ["g\rfS", -0.4567, 1e-9],
    ["1.23456789_", -1.2346, 0.0001],
    ["gx", -1.2346],
    ["a", 1.2346],
    // p25
    ["25\\", 0.04],
    ["8!", 40320],
    ["3.9q", 1.9748, 0.0001],
    ["12.3@", 151.29, 1e-9],
    // p26
    ["g730s", 0.5, 1e-9],
    ["gs", 30, 1e-9],
    ["60c", 0.5, 1e-9],
    ["gc", 60, 1e-9],
    ["45t", 1, 1e-9],
    ["gt", 45],
    // rad, grad
    // p27
    ["1.2345f2", 1.1404, 0.0001],
    ["g2", 1.2345, 1e-9],
    ["40.5f3", 0.7069, 0.0001],
    ["g3", 40.5],
    // p28
    ["45l", 3.8067, 0.0001],
    ["3.4012E", 30.0001, 0.0001],
    ["12.4578g)", 1.0954, 0.0001],
    ["3.1354)", 1365.8405, 1e-6],
    // hyp functions
    // p29
    ["2\r1.4^", 2.6390, 0.0001],
    ["2\r1.4_^", 0.3789, 0.0001],
    ["2_\r3^", -8],
    ["2\r3\\^", 1.2599, 0.0001],
    // p30
    ["15.76\r3%+", 16.2328, 0.0001],
    ["15.76\r14.12g\\", -10.4061, 0.0001],
    // p31
    ["g75\r10g1", [11.1803, 26.5651], 0.0001],
    ["30\r12f1", [10.3923, 6], 0.0001],
    // p35
    ["287\r12.9/g\r*13.9/", 20.6475, 0.0001],
    // p41
    ["1.15\r\r\r1000****", 1749.0063, 1e-7],
    // p43
    ["3S0", 3],
    ["g\b", 0],
    ["R0", 3],
    // p45
    ["8S04S+03S+024R-0", 9],
    ["R0", 15],
    ["4\r5.2-8.33*g\r7.46-0.32*/3.15\r2.75-4.3*1.71\r2.01*-/q", 4.5728, 0.0001],
    // p47
    ["5\r3f+", 60],
    // p48
    ["52\r4g+", 270725],
    // p49
    // RAN# [".5764Sf\r"],
    // p51
    ["fU4.63\r0;", 1],
    ["4.78\r20;6.61\r40;7.21\r60;7.78\r80;", 5],
    ["R3", 200],
    ["R4", 12000],
    ["R5", 31.01],
    ["R6", 200.49, 0.0001],
    ["R7", 1415],
    // p52
    ["4.78\r20g;", 4],
    ["5.78\r20;", 5],
    // p53
    ["g0", [40, 6.4], 0.001],
    // p54
    ["g.", [31.62, 1.24], 0.01],
    // p55
    ["f;", [4.86, 0.04], 0.04],
    // p57
    ["70f.", [7.56, 0.99], 0.01],
    // p58
    ["123456f74", "123,456.0000"],
    ["f84", "1.2346e5"],
    ["f94", "123.46e3"],
    ["123.4567895f74", "123.4568"],
    ["f76", "123.456790"],
    ["f74", "123.4568"],
    ["f86", "1.234568e2"],
    ["f88", "1.23456790e2"],
    // p59
    [".012345f74", 0.012345],
    ["f91", "12.e-3"],
    ["f93", "12.35e-3"],
    ["10*", "123.5e-3"],
    ["f74", "0.1235"],
    // p60
    ["p", "3.1416"],
    ["f\b", "3141592654"],

    // Part II Programming
    // p67
    ["gP",  "000-"],
    ["fr",  "000-"],
    ["fTq", "001-42,21,11"],
    ["2",   "002-     2"],
    ["*",   "003-    20"],
    ["9",   "004-     9"],
    [".",   "005-    48"],
    ["8",   "006-     8"],
    ["/",   "007-    10"],
    ["q",   "008-    11"],
    ["gU",  "009- 43 32"],
    ["gP"],
    ["300.51", 300.51],
    ["fq", 7.8313, 0.0001],
    // p71
    ["gP"],
    ["fr",  "000-"],
    ["fTq", "001-42,21,11"],
    ["S0",  "002- 44  0"],
    ["gq",  "003- 43 11"],
    ["ge",  "004- 43 26"],
    ["*",   "005-    20"],
    ["S4",  "006- 44  4"],
    ["S+1", "007-44,40, 1"],
    ["P",   "008-    31"],
    ["*",   "009-    20"],
    ["fP",  "010- 42 31"],
    ["S+2", "011-44,40, 2"],
    ["R0",  "012- 45  0"],
    ["/",   "013-    10"],
    ["2",   "014-     2"],
    ["*",   "015-    20"],
    ["R4",  "016- 45  4"],
    ["2",   "017-     2"],
    ["*",   "018-    20"],
    ["+",   "019-    40"],
    ["S+3", "020-44,40, 3"],
    ["gU",  "021- 43 32"],
    ["gP"],
    ["fx"],
    ["2.5", 2.5],
    ["fq", 19.6350, 0.0001],
    ["8P", 164.9336, 0.0001],
    ["4P", 50.2655, 0.0001],
    ["10.5P", 364.4247, 0.0001],
    ["4.5P", 63.6173, 0.0001],
    ["4P", 240.3318, 0.0001],
    ["R1", 133.5177, 0.0001],
    ["R2", 939.3362, 0.0001],
    ["R3", 769.6902, 0.0001],
    // p84 (out of order: edits previous program)
    ["gP"],
    ["G_020",   "020-44,40, 3"],
    ["\b",      "019-    40"],
    ["gTgTgT",  "016- 45  4"],
    ["\b",      "015-    20"],
    ["R2",      "016- 45  2"],
    ["G_011",   "011-44,40, 2"],
    ["\b",      "010- 42 31"],
    ["gTgT",    "008-    31"],
    ["\b",      "007-44,40, 1"],
    ["R1",      "008- 45  1"],
    ["gT",      "007-44,40, 1"],
    ["\b",      "006- 44  4"],
    ["\b",      "005-    20"],
    ["S2",      "006- 44  2"],
    // p86
    ["gP", function() { return !Prgm; }],
    ["fx"],
    ["Gq", function() { return PC === 1; }],
    ["8S1", 8],
    ["2.5", 2.5],
    ["T", 2.5],
    ["T", function() { return Reg[0] === 2.5; }],
    ["T", 6.25],
    ["T", 3.1416, 0.0001],
    ["T", 19.6350, 0.0001],
    // p80
    ["gPfr", "000-"],
    ["fTE", "001-42,21,12"],
    ["5",   "002-     5"],
    ["*",   "003-    20"],
    ["2",   "004-     2"],
    ["+",   "005-    40"],
    ["*",   "006-    20"],
    ["*",   "007-    20"],
    ["*",   "008-    20"],
    ["gU",  "009- 43 32"],
    ["gP"],
    ["7\r\r\r", 7],
    ["fE", 12691],
    // p93
    ["gPfr","000-"],
    ["fTq", "001-42,21,11"],
    ["R0",  "002- 45  0"],
    ["fP",  "003- 42 31"],
    ["8",   "004-     8"],
    ["/",   "005-    10"],
    ["_",   "006-    16"],
    ["2",   "007-     2"],
    ["x",   "008-    34"],
    ["^",   "009-    14"],
    ["R*1", "010-45,20, 1"],
    ["fP",  "011- 42 31"],
    ["R2",  "012- 45  2"],
    ["g-9", "013-43,30, 9"],
    ["gU",  "014- 43 32"],
    ["3",   "015-     3"],
    ["S+0", "016-44,40, 0"],
    ["Gq",  "017- 22 11"],
    ["gP"],
    ["2S0", 2],
    ["100S1", 100],
    ["50S2", 50],
    ["fq", 50],
    // p96
    ["gPfr","000-"],
    ["fTE", "001-42,21,12"],
    ["g50", "002-43, 5, 0"],
    ["G1",  "003- 22  1"],
    ["fT\\","004-42,21,15"],
    ["g40", "005-43, 4, 0"],
    ["fT1", "006-42,21, 1"],
    ["S1",  "007- 44  1"],
    ["1",   "008-     1"],
    ["+",   "009-    40"],
    ["x",   "010-    34"],
    ["_",   "011-    16"],
    ["^",   "012-    14"],
    ["_",   "013-    16"],
    ["1",   "014-     1"],
    ["+",   "015-    40"],
    ["R/1", "016-45,10, 1"],
    ["*",   "017-    20"],
    ["g60", "018-43, 6, 0"],
    ["gU",  "019- 43 32"],
    ["R1",  "020- 45  1"],
    ["1",   "021-     1"],
    ["+",   "022-    40"],
    ["*",   "023-    20"],
    ["gU",  "024- 43 32"],
    ["gP"],
    ["250\r", 250],
    ["48\r", 48],
    [".005", 0.005],
    ["fE", 10698.3049, 0.0001],
    ["250\r", 250],
    ["48\r", 48],
    [".005", 0.005],
    ["f\\", 10645.0795, 0.0001],
    // p103
    ["gPfrfT9g8S0xS-0U.3_xU.3+R/0gUfT.3gqg\rs-gUgP"],
    ["0.52\r1.25U9", 1.1507, 0.0001],
    ["1_\r1U9", -0.8415, 0.0001],
    ["0.81\r0.98U9", 1.1652, 0.0001],
    // p104
    ["gPfrfT.4gqU.5U.5U.5qgUfT.5xgq+gUgP"],
    ["8\r1.3\r7.9\r4.3U.4", 12.1074, 0.0001],
    // p111
    ["fx12.3456", 12.3456],
    ["St", 12.3456],
    ["7q", 2.6458, 0.0001],
    ["Sc", function() { return Reg[12] === Stack[0]; }],
    ["Rt", 12.3456],
    ["Rc", 2.6458, 0.0001],
    ["f4.2", 2.6458, 0.0001],
    // p112
    ["f4t", 12.3456],
    ["Rt", 2.6458, 0.0001],
    ["f4c", 0],
    ["Rc", 2.6458, 0.0001],
    ["f42", 2.6458, 0.0001],
    ["10S+t", 10],
    ["Rt", 12.6458, 0.0001],
    ["geS/c", 3.1416, 0.0001],
    ["Rc", 0.8422, 0.0001],
    ["f4.2", 0.8422, 0.0001],
    // p113
    ["gPfrfTqR0fP8/_2x^R*1fPR2g-9gU3S+0GqgP"],
    ["gP"],
    ["G_013",   "013-43,30, 9"],
    ["\b\b",    "011- 42 31"],
    ["f52",     "012-42, 5, 2"],
    ["Gt",      "013- 22 25"],
    ["gP"],
    ["2S0", 2],
    ["100S1", 100],
    ["3.00001S2", 3.00001],
    ["15_St", -15],
    ["fq", 50],
    // p114
    ["gPfrfTE9StfT0f7tRtfPf5tG0g-1G0gUgP"],
    ["fE", 0],

    // Part III Advanced Functions
    // p121
    ["9\r8\r7\r6f\b"],
    ["2\r3I4\r5I+", new Complex(6, 8)],
    ["\b7-", new Complex(-1, -8)],
    ["f-\b5f-", new Complex(-1, 5)],
    ["\b4\r7I", new Complex(4, 7)],
    ["\b8f-\b9gq", new Complex(17, 144)],
    ["4\r", new Complex(4, 0)],
    ["10f-", new Complex(0, 10)],
    ["1.2\r4.7I2.7\r3.2I/q", new Complex(1.0491, 0.2406), 0.0001],
    // ["2.404gs", new Complex(1.5708, -1.5239), 0.0001],
    // p135
    ["g72\r65If1", 0.8452, 0.0001],
    ["3\r40If1", 2.2981, 0.0001],
    ["+", 3.1434, 0.0001],
    ["g1", new Complex(4.8863, 49.9612), 0.0001],
    // p136
    ["2f-", 0],
    ["8_\r", -8],
    ["6I", -8],
    ["3^", 352, 0.0001],
    ["*", -1872],
    ["4\r", 4],
    ["5q", 2.2361, 0.0001],
    ["2_*", -4.4721, 0.0001],
    ["I", 4],
    ["/", -295.4551, 0.0001],
    ["2\r5q", 2.2361, 0.0001],
    ["4_*", -8.9443, 0.0001],
    ["I", 2],
    ["/", new Complex(9.3982, -35.1344), 0.0001],
    ["g58"],
    // p139
    ["2\rfsq", 2],
    ["f_1", 2],
    ["fR", function() { return User; }],
    ["3.8Sq", "A  1,1"],
    ["7.2Sq", 7.2],
    ["1.3Sq", 1.3],
    [".9_Sq", -0.9],
    ["2\r1fsE", 1],
    ["16.5SE", 16.5],
    ["22.1_SE", -22.1],
    ["fe)", -22.1],
    ["R_E", new MatrixCheck(B, 2, 1)],
    ["R_q", new MatrixCheck(A, 2, 2)],
    ["/", new MatrixCheck(C, 2, 1)],
    ["R)", -11.2887, 0.0001],
    ["R)", 8.2496, 0.0001],
    ["fR", function() { return !User; }],
    ["f_0"],
    // p142
    ["2\r", 2],
    ["3", 3],
    ["fsq", 3],
    ["R_E", new MatrixCheck(B, 0, 0)],
    ["Rsq", [3, 2]],
    // p145
    ["f_1", function() { return Reg[0] === 1 && Reg[1] === 1; }],
    ["fR", function() { return User; }],
    ["1Sq", 1],
    ["2Sq", 2],
    ["3Sq", 3],
    ["4Sq", 4],
    ["5Sq", 5],
    ["6Sq", 6],
    ["Rq", 1],
    ["Rq", 2],
    ["Rq", 3],
    ["Rq", 4],
    ["Rq", 5],
    ["Rq", 6],
    ["fR", 6],
    // p146
    ["2S0", 2],
    ["3S1", 3],
    ["9", 9],
    ["Sq", function() { return g_Matrix[0].get(2, 3) === 9; }],
    // p147
    ["2\r1", 1],
    ["Rgq", 4],
    // p149
    ["R_q", new MatrixCheck(A, 2, 3, [[1, 2, 3], [4, 5, 9]])],
    ["S_E", new MatrixCheck(A, 2, 3, [[1, 2, 3], [4, 5, 9]])],
    ["R_E", new MatrixCheck(B, 2, 3, [[1, 2, 3], [4, 5, 9]])],
    // p151
    ["R_E", new MatrixCheck(B, 2, 3, [[1, 2, 3], [4, 5, 9]])],
    ["f_4", new MatrixCheck(B, 3, 2, [[1, 4], [2, 5], [3, 9]])],
    // p152
    ["feE"],
    ["R_q", new MatrixCheck(A, 2, 3, [[1, 2, 3], [4, 5, 9]])],
    ["2*", new MatrixCheck(B, 2, 3, [[2, 4, 6], [8, 10, 18]])],
    ["1-", new MatrixCheck(B, 2, 3, [[1, 3, 5], [7, 9, 17]])],
    // p153
    ["fe)"],
    ["R_E", new MatrixCheck(B, 2, 3, [[1, 3, 5], [7, 9, 17]])],
    ["R_q", new MatrixCheck(A, 2, 3, [[1, 2, 3], [4, 5, 9]])],
    ["-", new MatrixCheck(C, 2, 3, [[0, 1, 2], [3, 4, 8]])],
    // p155
    ["R_q", new MatrixCheck(A, 2, 3, [[1, 2, 3], [4, 5, 9]])],
    ["R_E", new MatrixCheck(B, 2, 3, [[1, 3, 5], [7, 9, 17]])],
    ["fe)"],
    ["f_5", new MatrixCheck(C, 3, 3, [[29, 39, 73], [37, 51, 95], [66, 90, 168]])],
    // p157
    ["2\rfsq", 2],
    ["f_1", 2],
    ["fR", function() { return User; }],
    ["1Sq", 1],
    ["Sq", 1],
    [".24Sq", 0.24],
    [".86Sq", 0.86],
    ["2\r3fsE", 3],
    ["274SE", 274],
    ["233SE", 233],
    ["331SE", 331],
    ["120.32SE", 120.32],
    ["112.96SE", 112.96],
    ["151.36SE", 151.36],
    ["fe^", 151.36],
    ["R_E", new MatrixCheck(B, 2, 3, [[274, 233, 331], [120.32, 112.96, 151.36]])],
    ["R_q", new MatrixCheck(A, 2, 2, [[1, 1], [0.24, 0.86]])],
    ["/", new MatrixCheck(D, 2, 3)],
    ["R^", 186, 0.0001],
    ["R^", 141, 0.0001],
    ["R^", 215, 0.0001],
    ["R^", 88, 0.0001],
    ["R^", 92, 0.0001],
    ["R^", 116, 0.0001],
    ["fR", function() { return !User; }],
    // p163
    ["f_0"],
    ["2\r4fsq", 4],
    ["f_1"],
    ["fR", function() { return User; }],
    ["4Sq", 4],
    ["3Sq", 3],
    ["7Sq", 7],
    ["2_Sq", -2],
    ["1Sq", 1],
    ["5Sq", 5],
    ["3Sq", 3],
    ["8Sq", 8],
    ["fR", function() { return !User; }],
    ["R_q", new MatrixCheck(A, 2, 4, [[4, 3, 7, -2], [1, 5, 3, 8]])],
    ["f+", new MatrixCheck(A, 4, 2, [[4, 7], [1, 3], [3, -2], [5, 8]])],
    // p165
    ["R_q", new MatrixCheck(A, 4, 2, [[4, 7], [1, 3], [3, -2], [5, 8]])],
    ["f_2", new MatrixCheck(A, 4, 4, [[4, 7, -3, 2], [1, 3, -5, -8], [3, -2, 4, 7], [5, 8, 1, 3]])],
    ["feE"],
    ["\\", new MatrixCheck(B, 4, 4, [[-0.0254, 0.2420, 0.2829, 0.0022], [-0.0122, -0.1017, -0.1691, 0.1315], [-0.2829, -0.0022, -0.0254, 0.2420], [0.1691, -0.1315, -0.0122, -0.1017]], 0.01)],
    ["f_3", new MatrixCheck(B, 4, 2, [[-0.0254, 0.2420], [-0.0122, -0.1017], [-0.2829, -0.0022], [0.1691, -0.1315]], 0.01)],
    // p167
    ["R_q", new MatrixCheck(A, 4, 4, [[4, 7, -3, 2], [1, 3, -5, -8], [3, -2, 4, 7], [5, 8, 1, 3]])],
    ["R_E", new MatrixCheck(B, 4, 2, [[-0.0254, 0.2420], [-0.0122, -0.1017], [-0.2829, -0.0022], [0.1691, -0.1315]], 0.01)],
    ["fe)"],
    ["*", new MatrixCheck(C, 4, 2)],
    ["fR", function() { return User; }],
    ["R)", 1, 0.0001],
    ["R)", 0, 0.0001],
    ["R)", 0, 0.0001],
    ["R)", 1, 0.0001],
    ["R)", 0, 0.0001],
    ["R)", 0, 0.0001],
    ["R)", 0, 0.0001],
    ["R)", 0, 0.0001],
    ["fR", function() { return !User; }],
    // p170
    ["4\r2fsq", 2],
    ["f_1", 2],
    ["fR", function() { return User; }],
    ["10Sq", 10],
    ["0Sq", 0],
    ["Sq", 0],
    ["Sq", 0],
    ["200Sq", 200],
    ["_Sq", -200],
    ["Sq", -200],
    ["170Sq", 170],
    ["4\r1fsE", 1],
    ["0S_E", 0],
    ["5\r1\r", 1],
    ["SgE", 5],
    ["R_E", new MatrixCheck(B, 4, 1, [[5], [0], [0], [0]])],
    ["R_q", new MatrixCheck(A, 4, 2, [[10, 0], [0, 0], [200, -200], [-200, 170]])],
    ["f_2", new MatrixCheck(A, 4, 4)],
    ["fe)"],
    ["/", new MatrixCheck(C, 4, 1)],
    ["g+", new MatrixCheck(C, 2, 2)],
    ["R)", 0.0372, 0.002],
    ["R)", 0.1311, 0.002],
    ["R)", 0.0437, 0.002],
    ["R)", 0.1543, 0.002],
    ["fR", function() { return !User; }],
    ["f_0"],
    // p181
    ["gPfr","000-"],
    ["fT0", "001-42,21, 0"],
    ["3",   "002-     3"],
    ["-",   "003-    30"],
    ["*",   "004-    20"],
    ["1",   "005-     1"],
    ["0",   "006-     0"],
    ["-",   "007-    30"],
    ["gU",  "008- 43 32"],
    ["gP"],
    ["0\r", 0],
    ["10", 10],
    ["f/0", 5],
    ["r", 5],
    ["r", 0],
    ["0\r", 0],
    ["10_", -10],
    ["f/0", -2],
    ["r", -2],
    ["r", 0],
    // p184
    ["gPfr","000-"],
    ["fTq", "001-42,21,11"],
    ["2",   "002-     2"],
    ["0",   "003-     0"],
    ["/",   "004-    10"],
    ["_",   "005-    16"],
    ["E",   "006-    12"],
    ["_",   "007-    16"],
    ["1",   "008-     1"],
    ["+",   "009-    40"],
    ["5",   "010-     5"],
    ["0",   "011-     0"],
    ["0",   "012-     0"],
    ["0",   "013-     0"],
    ["*",   "014-    20"],
    ["x",   "015-    34"],
    ["2",   "016-     2"],
    ["0",   "017-     0"],
    ["0",   "018-     0"],
    ["*",   "019-    20"],
    ["-",   "020-    30"],
    ["gU",  "021- 43 32"],
    ["gP"],
    ["5\r", 5],
    ["6", 6],
    ["f/q", 9.2843, 0.0001],
    ["r", 9.2843, 0.0001],
    ["r", 0, 1e-9],
    // p186
    ["gPfr","000-"],
    ["fT1", "001-42,21, 1"],
    ["g_",  "002- 43 16"],
    ["1",   "003-     1"],
    ["+",   "004-    40"],
    ["gU",  "005- 43 32"],
    ["gP"],
    ["1\r", 1],
    ["1_", -1],
    ["f/1", "Error 8"],
    // p195
    ["gPfr","000-"],
    ["fT0", "001-42,21, 0"],
    ["s",   "002-    23"],
    ["c",   "003-    24"],
    ["gU",  "004- 43 32"],
    ["gP"],
    ["0\r", 0],
    ["ge", 3.1416, 0.0001],
    ["g8", 3.1416, 0.0001],
    ["f*0", 2.4040, 0.0001],
    ["ge", 3.1416, 0.0001],
    ["/", 0.7652, 0.0001],
    // p197
    ["gPfr","000-"],
    ["fT1", "001-42,21, 1"],
    ["s",   "002-    23"],
    ["-",   "003-    30"],
    ["c",   "004-    24"],
    ["gU",  "005- 43 32"],
    ["gP"],
    ["0\r", 0],
    ["ge", 3.1416, 0.0001],
    ["g8", 3.1416, 0.0001],
    ["f*1", 1.3825, 0.0001],
    ["ge/", 0.4401, 0.001],
    // p199
    ["gPfr","000-"],
    ["fT.2","001-42,21,.2"],
    ["s",   "002-    23"],
    ["x",   "003-    34"],
    ["/",   "004-    10"],
    ["gU",  "005- 43 32"],
    ["gP"],
    ["0\r", 0],
    ["2", 2],
    ["g8", 2],
    //["f*.2", 1.6054, 0.0001], // TODO: integrate against limit where function is undefined

    // Page references from HP-15C Advanced Functions Handbook (November 1985)
    // Section 1: Using Solve Effectively
    // p12
    ["fr"],
    ["\b", 0],
    ["gP",  "000-"],
    ["fTq", "001-42,21,11"],
    ["R4",  "002- 45  4"],
    ["*",   "003-    20"],
    ["R3",  "004- 45  3"],
    ["+",   "005-    40"],
    ["*",   "006-    20"],
    ["R2",  "007- 45  2"],
    ["+",   "008-    40"],
    ["*",   "009-    20"],
    ["R1",  "010- 45  1"],
    ["+",   "011-    40"],
    ["*",   "012-    20"],
    ["R0",  "013- 45  0"],
    ["+",   "014-    40"],
    ["gU",  "015- 43 32"],
    ["gP"],
    ["4.2725e8_", 4.2725e-8],
    ["S4", 4.2725e-8],
    ["1.9931_e5_S3", -1.9931e-5],
    ["1.0229e3_S2", 1.0229e-3],
    ["3.7680e1_S1", 3.7680e-1],
    ["2.8806_S0", -2.8806],
    ["1\r32f/q", 7.5137, 0.0001],
    ["r", 7.5137, 0.0001],
    ["r", 0],
    ["grgr", 7.5137, 0.0001],
    ["fS", 0.5137, 0.0001],
    ["24*", 12.3293, 0.0001],
    ["f2", 12.1945, 0.0001],
    ["1000_\r1100_", -1100],
    ["f/q", -108.9441, 0.0001],
    ["r", -108.9441, 0.0001],
    ["r", 0, 0.0001],
    // p18
    ["gP"],
    ["fr",  "000-"],
    ["fT0", "001-42,21, 0"],
    ["c",   "002-    24"],
    ["R0",  "003- 45  0"],
    ["*",   "004-    20"],
    ["c",   "005-    24"],
    ["R1",  "006- 45  1"],
    ["-",   "007-    30"],
    ["x",   "008-    34"],
    ["s",   "009-    23"],
    ["/",   "010-    10"],
    ["x",   "011-    34"],
    ["t",   "012-    25"],
    ["/",   "013-    10"],
    ["_",   "014-    16"],
    ["x",   "015-    34"],
    ["c",   "016-    24"],
    ["R0",  "017- 45  0"],
    ["*",   "018-    20"],
    ["s",   "019-    23"],
    ["R0",  "020- 45  0"],
    ["*",   "021-    20"],
    ["+",   "022-    40"],
    ["R2",  "023- 45  2"],
    ["*",   "024-    20"],
    ["gU",  "025- 43 32"],
    ["gP"],
    ["g8"],
    ["2p*", 6.2832, 0.0001],
    [".6*S0", 3.7699, 0.0001],
    ["cS1", -0.8090, 0.0001],
    ["_1+", 1.8090, 0.0001],
    ["\\S2", 0.5528, 0.0001],
    ["10f3", 0.1745, 0.001],
    ["60f3", 1.0472, 0.0001],
    ["f/0", 0.4899, 0.0001],
    ["rr", 0, 1e-9],
    ["grgr", 0.4899, 0.0001],
    ["g3", 28.0680, 0.0001],
    // p21
    ["gPfrfTqe_3+\rUExe_3-\rUE-2e_3/gUfTEcR0*cR1-xs/R2*gUgP"],
    ["10f3", 0.1745, 0.001],
    ["60f3", 1.0472, 0.0001],
    ["f/q", 0.4899, 0.0001],
    ["rr", 0, 1e-9],
    ["grgr", 0.4899, 0.0001],
    ["\r\rfE", -0.2043, 0.001],
    ["x", 0.4899, 0.0001],
    ["g3", 28.0679, 0.0001],
    // p29
    ["gPfrfTqS1PU1g\rR*0R5x-g\rR+3g*G0/_g-4G0lR6l/S1gU"],
    ["fTES2P.2\re_3g51f/3G4G0"],
    ["fT4e2*S2gU"],
    ["fT)S3PU1U2_S3gU"],
    ["fT^S4P1S4U1R3U2x/_S4gU"],
    ["fT\\S5PU1R+3R/7_S5gU"],
    ["fT1g411R2%fT3S81S0+g-4G0S6g60S0R1_^S71x-g*G0R*0R4R/8*g61gU"],
    ["R+3fT2R5R*7+gUgP"],
    // p34
    ["fxf72fRg50"],
    ["9\r12*q", 108],
    ["5.75\r12/E", 0.48, 0.002],
    ["155_)", -155],
    ["\\P", 259.74, 0.001],
    ["275\\", 275],
    // TODO: off by 100x? ["EP", 0.53, 0.01],
    // TODO ["12*", 6.39, 0.01],
    // p35
    ["fx"],
    ["30\r12*q", 360],
    ["13\r12/E", 1.08, 0.01],
    ["30000)", 30000],
    ["^P", -331.86, 0.001],
    // p36
    ["fx"],
    ["36q", 36],
    ["10\r12/E", 0.83, 0.01],
    ["3600_)", -3600],
    ["100^", 100],
    ["\\P", 675.27, 0.0001],
    // p37
    ["fx"],
    ["360q", 360],
    ["14\r12/E", 1.17, 0.01],
    ["50000_)", -50000],
    ["^P", 592.44, 0.0001],
    ["24q", 24],
    ["\\P", 49749.56, 0.0001],
    ["St", 49749.56, 0.0001],
    ["12q", 12],
    ["\\P", 49883.48, 0.0001],
    ["Rt", 49749.56, 0.0001],
    ["-", 133.92, 0.0001],
    ["R4", 592.44, 0.0001],
    ["12*", 7109.23, 0.0001],
    ["x-", 6975.31, 0.0001],
    // p38
    ["fxg40"],
    ["5\r12*q", 60],
    ["13\r12/E", 1.08, 0.01],
    ["63000_)", -63000],
    ["10000\\", 10000],
    ["^P", 1300.16, 0.0001],
    ["70000_)", -70000],
    ["^P", 1457.73, 0.0001],
    ["1500^", 1500],
    // TODO ["EP", 1.18, 0.01],
    // TODO ["12*", 14.12, 0.01],
    ["fR"],
    // p40
    ["gPfrfTqe2/U2PfTE1\re_3f/2G1G0fT1e2*PfT2g50S21S4+g-4G0S30S5f_1fT3g60G7U6R2g*G41+U6_^S41x-R/2R*3G5fT4xU6fT5*S+5R4S*3G3fT6fRR)fRgUg40gUfT7R5gU", "068- 43 32"],
    ["gPf72"],
    // TODO: DIM ["5fsc", 5],
    ["6\r2", 2],
    ["fs)", 2],
    ["f_1", 2],
    ["fR", function() { return User; }],
    ["80000_S)", -80000],
    ["1S)", 1],
    ["600_S)", -600],
    ["1S)", 1],
    ["6500S)", 6500],
    ["1S)", 1],
    ["8000S)", 8000],
    ["2S)", 2],
    ["7500S)", 7500],
    ["2S)", 2],
    ["91000S)", 91000],
    ["1S)", 1],
    ["9", 9],
    // TODO: this takes a long time to run ["q", -4108.06, 0.0001],
    // TODO: this takes a long time to run ["E", 8.04, 0.001],
    // p44
    ["3\r2", 2],
    ["fs)", 2],
    ["f_1", 2],
    ["620000000_", -620000000],
    ["S)", -620000000],
    ["1S)", 1],
    ["100000000S)", 100000000],
    ["10S)", 10],
    ["5000000S)", 5000000],
    ["5S)", 5],
    // TODO: this takes a long time to run ["fE", 10.06],
    ["f74"],
    ["fR", function() { return !User; }],
    // Section 2: Working with Integration
    // Section 3: Calculating in Complex Mode
    // p66
    ["gPfr","000-"],
    ["fTq", "001-42,21,11"],
    ["6",   "002-     6"],
    ["St",  "003- 44 25"],
    ["x",   "004-    34"],
    ["\r",  "005-    36"],
    ["\r",  "006-    36"],
    ["\r",  "007-    36"],
    ["R6",  "008- 45  6"],
    ["fT1", "009-42,21, 1"],
    ["+",   "010-    40"],
    ["Rc",  "011- 45 24"],
    ["x",   "012-    34"],
    ["/",   "013-    10"],
    ["f5t", "014-42, 5,25"],
    ["G1",  "015- 22  1"],
    ["R0",  "016- 45  0"],
    ["+",   "017-    40"],
    ["x",   "018-    34"],
    ["-",   "019-    30"],
    ["g\r", "020- 43 36"],
    ["gE",  "021- 43 12"],
    ["g\r", "022- 43 36"],
    [".",   "023-    48"],
    ["5",   "024-     5"],
    ["-",   "025-    30"],
    ["*",   "026-    20"],
    ["+",   "027-    40"],
    ["gU",  "028- 43 32"],
    ["gP"],
    ["2p*", 6.2832, 0.0001],
    ["gE2/", 0.9189, 0.0001],
    ["S0", 0.9189, 0.0001],
    ["12\\S1", 0.0833, 0.001],
    ["30\\S2", 0.0333, 0.002],
    ["53\r210/S3", 0.2524, 0.0001],
    ["195\r371/S4", 0.5256, 0.0001],
    ["1.011523068S5", 1.0115, 0.0001],
    ["1.517473649S6", 1.5175, 0.0001],
    ["4.2fq", 2.0486, 0.0001],
    ["f79", 2.048555637, 1e-9],
    ["3.2f0", 7.756689536, 1e-9],
    ["gE", 2.048555637, 1e-9],
    ["1\r", 1],
    ["5I", new Complex(1, 5)],
    ["fq", new Complex(-6.130324145, 3.815898575), 1e-9],
    // p76
    ["gPfr","000-"],
    ["fT^", "001-42,21,14"],
    ["f_1", "002-42,16, 1"],
    ["S0",  "003- 44  0"],
    ["r",   "004-    33"],
    ["0",   "005-     0"],
    ["+",   "006-    40"],
    ["fRS)","007u 44 13"],
    ["fR"],
    ["f-",  "008- 42 30"],
    ["S)",  "009- 44 13"],
    ["f-",  "010- 42 30"],
    ["gU",  "011- 43 32"],
    ["fT\\", "012-42,21,15"],
    ["S0",  "013- 44  0"],
    ["g\b", "014- 43 35"],
    ["2",   "015-     2"],
    ["S1",  "016- 44  1"],
    ["r",   "017-    33"],
    ["0",   "018-     0"],
    ["+",   "019-    40"],
    ["R)",  "020- 45 13"],
    ["f-",  "021- 42 30"],
    ["f51", "022-42, 5, 1"],
    ["g\b", "023- 43 35"],
    ["R)",  "024- 45 13"],
    ["gU",  "025- 43 32"],
    ["gP"],
    ["5\r2", 2],
    ["fs)", 2],
    ["2\r3I", new Complex(2, 3)],
    ["1f^", 2],
    ["7\r4I", new Complex(7, 4)],
    ["2f^", 7],
    ["1f\\", new Complex(2, 3)],
    ["2f\\", new Complex(7, 4)],
    ["+", new Complex(9, 7)],
    // p78
    ["gPfr","000-"],
    ["fTq", "001-42,21,11"],
    ["x",   "002-    34"],
    ["\\",  "003-    15"],
    ["g\r", "004- 43 36"],
    ["r",   "005-    33"],
    ["g48", "006-43, 4, 8"],
    ["^",   "007-    14"],
    ["S2",  "008- 44  2"],
    ["f-",  "009- 42 30"],
    ["S3",  "010- 44  3"],
    ["3",   "011-     3"],
    ["6",   "012-     6"],
    ["0",   "013-     0"],
    ["gr",  "014- 43 33"],
    ["/",   "015-    10"],
    ["S4",  "016- 44  4"],
    ["0",   "017-     0"],
    ["St",  "018- 44 25"],
    ["fT0", "019-42,21, 0"],
    ["R4",  "020- 45  4"],
    ["R*t", "021-45,20,25"],
    ["f-",  "022- 42 30"],
    ["g\b", "023- 43 35"],
    ["1",   "024-     1"],
    ["g7",  "025- 43  7"],
    ["f1",  "026- 42  1"],
    ["R2",  "027- 45  2"],
    ["R3",  "028- 45  3"],
    ["ft",  "029- 42 25"],
    ["*",   "030-    20"],
    ["Rt",  "031- 45 25"],
    ["x",   "032-    34"],
    ["1",   "033-     1"],
    ["S+t", "034-44,40,25"],
    ["r",   "035-    33"],
    ["P",   "036-    31"],
    ["G0",  "037- 22  0"],
    ["gP"],
    ["100\r1", 1],
    ["fq", new Complex(1, 0)],
    ["P", new Complex(0.9980, 0.0628), 0.001],
    ["50St", 50],
    ["P", new Complex(-1, 0), 0.0001],
    // p82
    ["gPfr"],
    ["fTqg58\r+.5+p*\rS18/l_S0xIgU"],
    ["fTE\r\rR1f-x9+/g\rxl*xR1f-R+0-g\rr+x10+/+gU"],
    ["fT)\rE9g\r+8x/+g_gU"],
    ["gPfR", function() { return User; }],
    ["0q", 1.6279, 0.0001],
    ["E", -0.1487, 0.001],
    ["E", -0.1497, 0.001],
    ["E", new Complex(-0.1497, 2.8319), 0.001],
    [")", 0, 1e-10],
    ["x", -0.1497, 0.001],
    ["fR"],
    // p85
    ["gPfr"],
    ["fTqx-S4f-S5g\rS6f-S70\r1f*0S2rS3rf*1R2IxR3IxgU"],
    ["fT0U1f-gU"],
    ["fT1R4R5I*R6R7I+UER4R5I*gU"],
    ["fTE\\g\r+g\r1f-*Ex/gU"],
    ["gPf82"],
    ["1\r", 1],
    ["1\r6", 6],
    ["I", new Complex(1, 6)],
    // TODO: takes too long to run ["fq", new Complex(-3.24e-1, 3.82e-1)],
    // TODO ["x", new Complex(7.87e-4, 1.23e-3)],
    ["f74"],
    // p90
    ["gPfr"],
    ["fTqrS4r2fsqg\bS_qStf_1grS2fRSqfRf-S3fRSqfRG1"],
    ["fT0R_qgU"],
    ["fT1f-UES5fT21S+tR4Rt*R2+S6R3\rf/3G41S-t4S/4S*tG2"],
    ["fT4R6fPfRSqfRrfPS3fRSqfRG2G0"],
    ["fT3R6xIUER5-gU"],
    ["fTE\r\\+f-gU"],
    ["gP"],
    ["9\r", 9],
    [".5\r", 0.5],
    ["2_\r", -2],
    [".1I", new Complex(-2, 0.1)],
    ["fqR_q", new MatrixCheck(A, 9, 2, [
        [-2.0, 0.1000],
        [-1.5, 0.1343],
        [-1.0, 0.4484],
        [-0.5, 0.9161],
        [ 0.0, 1.0382],
        [ 0.5, 0.9161],
        [ 1.0, 0.4484],
        [ 1.5, 0.1343],
        [ 2.0, 0.1000]
    ], 0.001)],
    ["g58"],
    // Section 4: Using Matrix Operations
    // p99
    ["2\r3fsqfRf_11Sq2Sq3Sq4Sq5Sq9SqfR"],
    ["2\r3fsEfRf_12SE2SE2SE4SE5SE6SEfR"],
    ["fe)R_qR_E-", new MatrixCheck(C, 2, 3, [[-1, 0, 1], [0, 0, 3]])],
    ["R_)f_8", 3.3166, 0.0001],
    ["R_)f_7", 3],
    // p119
    ["gPfrfT8f_1fT9R0R1g-6g\bg-5efRScfRG9gUgP"],
    ["3\r3fsqR_qStU8R_q", new MatrixCheck(A, 3, 3, [[1, 0, 0], [0, 1, 0], [0, 0, 1]])],
    // p120
    ["gPfrfTqR_qS_^R_ER_^fe)/feEf_6R_^/R_)+gUgP"],
    ["3\r3fsqf_1fR33Sq16Sq72Sq24_Sq10_Sq57_Sq8_Sq4_Sq17_SqfR"],
    ["3\r3fsEf_1fR1SE0SE0SE0SE1SE0SE0SE0SE1SEfR"],
    ["UqR_)", new MatrixCheck(C, 3, 3, [[-9.6666666, -2.6666666, -32], [8, 2.5, 25.5], [2.6666666, 0.6666666, 9]], 0.000001)],
    // p123
    ["gPfrfTq2\rfs)1fsEUER_qR_ER_)fe^/feq-g\rf_8R_Ef_8gU"],
    ["fTEf_1fRRqfRS4fRRqfRS5S5-R5R/4lR21-*+SE1R21-R/4-fRS)fRR21-R/51-fRS)fRR4R5f*)R31-2*R23-2/f0*+SER4U)_fRS)fRR5U)fRS)fRgUgU"],
    ["fT)2/_Eg\r_R23-2/^*gU"],
    ["gP"],
    ["5fsc", 5],
    ["11S2", 11],
    [".05S3", 0.05],
    ["2\r1", 1],
    ["fsq", 1],
    ["fR", 1],
    ["f_1", 1],
    ["3.25Sq", 3.25],
    ["20.5Sq", 20.5],
    ["f84", 2.05e1],
    ["Uq", 1.1677, 0.0001],
    ["r", 1.098, 0.0001],
    ["Rq", 3.5519, 0.0001],
    ["Rq", 2.1556e1, 0.0001],
    ["f74fR"],
    // p128
    ["gPfrgP"],
    ["0fsc", 0],
    ["f_0", 0],
    ["4\r8", 8],
    ["fsq", 8],
    ["f_1", 8],
    ["fR", function() { return User; }],
    [function() {
        var R1 = 100;
        var R2 = 1e6;
        var R3 = 1e5;
        var wL = 150;
        var wC1 = 800/3;
        var wC2 = 8/3;
        g_Matrix[0].m = new Matrix([
            [R1, wL-wC1, 0, wC1, 0, 0, 0, 0],
            [0, wC1, R2, wL-wC1, -R2, 0, 0, 0],
            [0, 0, -R2, 0, R2, -wC2+wL, 0, -wL],
            [0, 0, 0, 0, 0, -wL, R3, wL-wC2]
        ]);
    }],
    ["R_q", new MatrixCheck(A, 4, 8)],
    ["f+", new MatrixCheck(A, 8, 4)],
    ["f_2", new MatrixCheck(A, 8, 8)],
    ["Se", new MatrixCheck(A, 8, 8)],
    ["f\\", new MatrixCheck(A, 8, 8)],
    ["4\r8fsq", 8],
    ["4\r2fsE", 2],
    ["f_1", 2],
    ["10SE", 10],
    ["R_q", new MatrixCheck(A, 4, 8)],
    ["R_E", new MatrixCheck(B, 4, 2)],
    ["f+", new MatrixCheck(B, 8, 1)],
    ["f_2", new MatrixCheck(B, 8, 2)],
    ["fe)", new MatrixCheck(B, 8, 2)],
    ["*", new MatrixCheck(C, 4, 2)],
    ["f_4", new MatrixCheck(C, 2, 4)],
    ["f_2", new MatrixCheck(C, 2, 8)],
    ["1\r8fs)", 8],
    ["Re", new MatrixCheck(C, 1, 8)],
    ["f_4", new MatrixCheck(C, 8, 1)],
    ["g+", new MatrixCheck(C, 4, 2)],
    ["f_1", new MatrixCheck(C, 4, 2)],
    ["f84", new MatrixCheck(C, 4, 2)],
    ["R)", 1.9950e-4, 0.001],
    ["R)", 4.0964e-3, 0.0001],
    ["xg1", 4.1014e-3, 0.0001],
    ["x", 8.7212e1, 0.0001],
    ["R)", -1.4489e-3, 0.0001],
    ["R)", -3.5633e-2, 0.0001],
    ["xg1", 3.5662e-2, 0.0001],
    ["x", -9.2328e1, 0.0001],
    ["R)", -1.4541e-3, 0.0001],
    ["R)", -3.5633e-2, 0.0001],
    ["xg1", 3.5662e-2, 0.0001],
    ["x", -9.2337e1, 0.0001],
    ["R)", 5.3446e-5, 0.0001],
    ["R)", -2.2599e-6, 0.0001],
    ["xg1", 5.3494e-5, 0.0001],
    ["x", -2.4212, 0.0001],
    ["xe5*", 5.3494, 0.0001],
    ["f74fR"],
    // p135
    ["gPfr"],
    ["fTqR_Ef_8gqR_q\rfe)f_5g\rR_Efe^f_5x/R_qxfeEf_6f_8gqRsq-/\r\rR_)fe)/grR_Ef_8gq-g\rgU"],
    ["fTER_qR_^_feEf_6R_^_gU"],
    ["gP"],
    ["f_0"],
    ["11\r3", 3],
    ["fsq", 3],
    ["11\r1", 1],
    ["fsE", 1],
    ["f_1", 1],
    ["fR", 1],
    [function() {
        g_Matrix[0].m = new Matrix([
            [1, 3.9, 3.5],
            [1, 3.7, 4.9],
            [1, 3.3, 5.9],
            [1, 4.5, 5.6],
            [1, 13.1, 4.9],
            [1, 18.9, 5.6],
            [1, 9.2, 8.5],
            [1, 4.6, 7.7],
            [1, 6.1, 7.0],
            [1, 7.8, 6.0],
            [1, 19.3, 5.8]
        ]);
        g_Matrix[1].m = new Matrix([
            [5.4],
            [5.9],
            [4.3],
            [3.3],
            [6.2],
            [11.0],
            [9.1],
            [5.8],
            [6.5],
            [7.6],
            [11.5]
        ]);
    }],
    ["qf79", 13.51217504, 1e-9],
    ["r", 587.9878252, 1e-9],
    ["rr", 1.689021880, 1e-9],
    ["R^", 1.245864326, 1e-7],
    ["R^", 0.379758235, 1e-8],
    ["R^", 0.413552218, 1e-8],
    ["E", new MatrixCheck(D, 3, 1)],
    ["R_q", new MatrixCheck(A, 11, 3)],
    ["f_4", new MatrixCheck(A, 3, 11)],
    ["2\r11", 11],
    ["fsq", 11],
    ["R_q", new MatrixCheck(A, 2, 11)],
    ["f_4", new MatrixCheck(A, 11, 2)],
    ["q", 16.78680552, 1e-9],
    ["r", 584.7131947, 1e-9],
    ["rr", 1.865200613, 1e-9],
    ["R^", 3.701730745, 1e-9],
    ["R^", 0.380094935, 1e-9],
    ["E", new MatrixCheck(D, 2, 1)],
    ["R_q", new MatrixCheck(A, 11, 2)],
    ["f_4", new MatrixCheck(A, 2, 11)],
    ["1\r11", 11],
    ["fsq", 11],
    ["R_q", new MatrixCheck(A, 1, 11)],
    ["f_4", new MatrixCheck(A, 11, 1)],
    ["q", 68.08545454, 1e-9],
    ["r", 533.4145457, 1e-9],
    ["rr", 6.808545454, 1e-9],
    ["R^", 6.963636364, 1e-9],
    ["fRf74"],
    // p143
    ["gPfr"],
    ["fTqS21S1fT4RsqxS0fT5R1PR2*fRSqfRG5G4"],
    ["fTERsqxS2f_1fT1g50R2R0RgqRqg-2g40g_g1g\b1f1g60_IrfT2grRqR2R1RgqI*R2R1Sgqf-fRSqfRR1R0g/G2g58S1R2g/gUG1"],
    ["fT)Rsq\rfsqS0S11fs)0S_)e99_Rqg*r_R01Sg)R_)R_qfe)/R01+R0fsq1-1fs)Rqf_1gU"],
    ["gP"],
    ["2fsc", 2],
    ["fR", 2],
    ["f_0", 2],
    ["5\r4", 4],
    ["fsq", 4],
    ["0S_q", 0],
    ["1q", 1], ["1P", 2], [ "3.9P", 3], ["3.5P", 4], [ "5.4P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], [ "3.7P", 3], ["4.9P", 4], [ "5.9P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], [ "3.3P", 3], ["5.9P", 4], [ "4.3P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], [ "4.5P", 3], ["5.6P", 4], [ "3.3P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], ["13.1P", 3], ["4.9P", 4], [ "6.2P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], ["18.9P", 3], ["5.6P", 4], ["11.0P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], [ "9.2P", 3], ["8.5P", 4], [ "9.1P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], [ "4.6P", 3], ["7.7P", 4], [ "5.8P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], [ "6.1P", 3], ["7.0P", 4], [ "6.5P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], [ "7.8P", 3], ["6.0P", 4], [ "7.6P", 1], ["E", 5],
    ["1q", 1], ["1P", 2], ["19.3P", 3], ["5.8P", 4], ["11.5P", 1], ["E", 5],
    [")", 3.6759, 0.0001],
    ["f79", 3.675891055, 1e-9],
    ["gq", 13.51217505, 1e-9],
    ["R)", 1.245864306, 1e-9],
    ["R)", 0.379758235, 1e-9],
    ["R)", 0.413552221, 1e-9],
    ["1q", 1], ["1P", 2], ["2.5P", 3], ["3.6P", 4], ["4.2P", 1], ["E", 5],
    [")", 3.700256908, 1e-9],
    ["gq", 13.69190119, 1e-9],
    ["R)", 1.581596327, 1e-9],
    ["R)", 0.373826487, 1e-8],
    ["R)", 0.370971848, 1e-9],
    ["f74fR"],
    // p150
    ["gPfr"],
    ["fTqR_qS_ES_)f_4R_ESe+2/S_qf_8S2g\bS3S_)f_1fT0R0R1g-5G3g-7G1xRgE_fRSEfRG0fT1Rgqg_S+3g\r\r+R0\rRgqR1\rRgq-g-3G2_x_xfT2g1g\b4/tfRSEfRG0fT31S)fRSEfRG0R3R/2P2R_E/R_)-R_qfe)f_5R_Efeq*Gq"],
    ["gP4fsc", 4],
    ["fR", 4],
    ["3\rfsq", 3],
    ["f_1", 3],
    ["0Sq1Sq2Sq1Sq2Sq3Sq2Sq3Sq4Sq", 4],
    ["q", 0.8660, 0.0001],
    ["P", 0.2304, 0.001],
    ["P", 0.1039, 0.001],
    ["P", 0.0060, 0.01],
    ["P", 3.0463e-5, 0.0001],
    ["P", 5.8257e-10, 0.0001],
    ["Rq", -0.8730, 0.0001],
    ["Rq", -9.0006e-10, 0.0001],
    ["Rq", -2.0637e-9 , 0.0001],
    ["Rq", -9.0006e-10, 0.0001],
    ["Rq",  0         , 0.0001],
    ["Rq",  1.0725e-9 , 0.001],
    ["Rq", -2.0637e-9 , 0.0001],
    ["Rq",  1.0725e-9 , 0.001],
    ["Rq",  6.8730, 0.0001],
    ["fR"],
    // p155
    // this sample tends to get stuck in an infinite loop, so skip it
    /*
    ["gPfr"],
    ["fT)S2R_qS_ERsqS0fT4R0S1RER-2SEf50G4Rsq1fs)f_1fT5f\rfRS)fRG5fT6R_)S_^SeR_E/\rf_7/f_1fT7fRR)fR\rg_1g-6G7R_)g\r/R_^Se-f_7f_1PG6"],
    ["gP2fsc", 2],
    ["fR", 2],
    ["3\rfsq", 3],
    ["f_1", 3],
    ["0Sq1Sq2Sq1Sq2Sq3Sq2Sq3Sq4Sq", 4],
    [".8730_", -0.8730],
    ["f)", 0.8982, 0.0001],
    ["P", 0.0001],
    ["P", 2.4e-9],
    ["P", 1e-10],
    ["P", 0],
    ["R)", 1],
    ["R)", 0.2254],
    ["R)", -0.5492],
    ["0F)", 0.8485],
    ["P", 0],
    ["R)", -0.5],
    ["R)", 1],
    ["R)", -0.5],
    ["6.8730f)", 0.7371],
    ["P", 1.9372e-6],
    ["P", 1e-10],
    ["P", 0],
    ["R)", 0.3923],
    ["R)", 0.6961],
    ["R)", 1],
    ["fR"],
    */
    // p163
    ["gPfr"],
    ["fT8R_)S_\\R_qS_)R_\\S_qgU"],
    ["fT7R4R/6S8U\\R_\\S_^R_^g60_f_8g*gU\\R*8S.10S.0R5S7fT6R.1U3fPg60_g-4G5U8R.1S.0R2S*.1f57G6R_qg_G6fT5R6S7fT4U8R.0R+.12/S8U3g60_11Strg-1f5tR8Scf57G4gU"],
    ["fT3R_^fe)*R_q+U8U\\S9R_\\R_^feEf_51\rRgEgU"],
    ["fTq0S6fT21S+6f83U7R6f70fPf_1f83R9PR3R_\\f_8g/GEfPR5R6g-8G2R_)g_G2fTEg49PGE"],
    ["fT\\Rsqfs\\f_1fRRqfRS.2S\\RqS.3f_1S\\+50-_2*f4.2S*.3R.2R_\\fe\\*R.3R+.3-R.2R*.3gU"],
    ["gP13fsc", 13],
    ["g50", 13],
    ["fR", 13],
    ["f_1", 13],
    ["2\r1", 1],
    ["fsq", 1],
    ["15Sq", 15],
    ["Sq", 15],
    ["3S2", 3],
    ["0.1S3", 0.1],
    ["0.05S4", 0.05],
    ["4S5", 4],
    ["q", "Error 1"],
    ["5S7", 5],
    ["8S5", 8],
    ["P", 9.253e3, 0.0001],
    ["P", 9.259e3, 0.0001],
    ["P", 9.259e3, 0.0001],
    ["P", function() { return Math.abs(1-Stack[0]/7.726e-2) < 0.0001 && Flags[9]; }, 0.0001],
    ["\b", 7.726e-2, 0.0001],
    ["f74", 0.0773, 0.001],
    ["Rq", 16.6661, 0.0001],
    ["Rq", 16.6661, 0.0001],
    ["fRf_0"],

    // miscellaneous tests not covered by user manual
    // complex inverse trig functions
    ["1\r2Isgs", new Complex(1, 2), 1e-9],
    ["1\r2Icgc", new Complex(1, 2), 1e-9],
    ["1\r2Itgt", new Complex(1, 2), 1e-9],
    ["2\r1IfGsgGs", new Complex(2, 1), 1e-9],
    ["2\r1IfGcgGc", new Complex(2, 1), 1e-9],
    ["2\r1IfGtgGt", new Complex(2, 1), 1e-9],
    ["g58"],
    // matrix determinant
    ["2\rfsq"],
    [function() {
        g_Matrix[0].m = new Matrix([
            [6, 3],
            [4, 3]
        ]);
    }],
    ["R_q", new MatrixCheck(A, 2, 2)],
    ["f_9", 6],
    ["3\rfsq"],
    [function() {
        g_Matrix[0].m = new Matrix([
            [-2, 2, -3],
            [-1, 1,  3],
            [ 2, 0, -1]
        ]);
    }],
    ["R_q", new MatrixCheck(A, 3, 3)],
    ["f_9", 18],

    // various particular value tests
    ["g48"],
    // complex sin
    ["0s", new Complex(0, 0)],
    ["p\r2/s", new Complex(1, 0)],
    ["p\r2/_s", new Complex(-1, 0)],
    ["p\r4/s", new Complex(1/Math.sqrt(2), 0)],
    ["p\r6/s", new Complex(0.5, 0), 1e-10],
    // complex tanh
    ["0fGt", new Complex(0, 0)],
    ["5q1+2/lfGt", new Complex(Math.sqrt(5)/5, 0), 1e-10],
    // check that real and complex results match
    ["g58g8"],
    ["1sS01cS11tS2"],
    ["g48"],
    ["1sS31cS41tS5"],
    ["R0R3/", 1],
    ["R1R4/", 1],
    ["R2R5/", 1],

    // http://en.wikipedia.org/wiki/Gamma_function#Particular_values
    ["5\r2/_1-f0", -0.945, 0.001],
    ["3\r2/_1-f0", 2.363, 0.001],
    ["1\r2/_1-f0", -3.545, 0.001],
    ["1\r2/1-f0", 1.772, 0.001],
    ["0f0", 1, 0.001],
    ["3\r2/1-f0", 0.886, 0.001],
    ["1f0", 1, 0.001],
    ["5\r2/1-f0", 1.329, 0.001],
    ["2f0", 2, 0.001],
    ["7\r2/1-f0", 3.323, 0.001],
    ["3f0", 6, 0.001],

    // Test cases from Barry Mead
    ["g58"],
    // asinh(sinh(-100)) (Should be -100)
    ["100_fGsgGs", -100],
    // asinh(sinh(-200 + i1)) (Complex Mode) (Should be -200 + i1)
    ["200_\r1IfGsgGs", new Complex(-200, 1), 1e-9],
    // asinh(sinh(-100 + i1)) (Complex Mode) (Should be -100 + i1)
    ["100_\r1IfGsgGs", new Complex(-100, 1), 1e-9],
    // atanh(1 + i0) (Complex Mode) (Should show blinking positive infinity)
    ["1gGt", "9.9999e99"],
    // asin(-10000 + i1) (Should be -1.570696327 + i9.903487555)
    ["10000_\r1Igs", new Complex(-1.570696327, 9.903487555), 1e-9],
    // sin(asin(-10000 + i1) (Should be -10000 + i1)
    ["10000_\r1Igss", new Complex(-10000, 1), 1e-8],
    // acosh(-100000 + i1) (Should be 12.20607265 + i3.141582654)
    ["100000_\r1IgGc", new Complex(12.20607265, 3.141582654), 1e-9],
    // cosh(acosh(-100000 + i1)) (Should be about -100000 + i1)
    ["100000_\r1IgGcfGc", new Complex(-100000, 1), 1e-6],
    ["g58"],

    // Test rounding issues in DSE/ISG
    ["gPfr"],
    ["gS.001+S00S1fTq1S+1f50GqgUgPfr"],
    ["10PR1", 9],

    // reset complex mode
    ["g58"]
];

var TestStart;
var TestIndex;
var TestPass;

function test_log(msg) {
    if (window.console) {
        console.log(msg);
    }
}

function tolerance(r, e, t) {
    if (t === undefined) {
        return r === e;
    } else if (e === 0) {
        return Math.abs(r) < t;
    } else {
        return Math.abs(r / e - 1) < t;
    }
}

function MatrixCheck(label, rows, cols, elements, eps) {
    this.label = label;
    this.rows = rows;
    this.cols = cols;
    this.elements = elements;

    this.check = function(m) {
        if (m.rows !== this.rows || m.cols !== this.cols) {
            return false;
        }
        if (this.elements !== undefined) {
            for (var i = 1; i <= this.rows; i++) {
                for (var j = 1; j <= this.cols; j++) {
                    if (!tolerance(m.get(i, j), this.elements[i-1][j-1], eps)) {
                        alert("matrix check expected " + this.elements[i-1][j-1] + " but got " + m.get(i, j));
                        return false;
                    }
                }
            }
        }
        return true;
    }

    this.toString = function() {
        return "<MatrixCheck " + this.label + " " + this.rows + "," + this.cols + ">";
    };
}

function verify(test, result, resulti, expected) {
    if (expected instanceof MatrixCheck) {
        return result instanceof Descriptor
            && result.label === expected.label
            && expected.check(g_Matrix[result.label]);
    } else if (expected instanceof Complex) {
        if (test.length >= 3) {
            return tolerance(result, expected.re, test[2])
                && tolerance(resulti, expected.im, test[2]);
        } else {
            return result === expected.re && resulti === expected.im;
        }
    } else {
        if (test.length >= 3) {
            return tolerance(result, expected, test[2]);
        } else {
            return result === expected;
        }
    }
}

export function start_tests() {
    key('f'); key('7'); key('4');
    key('g'); key('5'); key('8');
    key('f'); key('r');
    //var oldalert = alert;
    //alert = function(msg) { test_log(msg); };
    TestStart = new Date();
    TestIndex = 0;
    TestPass = true;
    run_tests();
}

function run_tests() {
    if (TestIndex < Tests.length) {
        var test = Tests[TestIndex];
        var keys = test[0];
        if (typeof(keys) === "string") {
            test_log(keys);
            for (var i = 0; i < keys.length; i++) {
                key(keys.substr(i, 1), true);
                while (Running) {
                    if (RunTimer !== null) {
                        clearTimeout(RunTimer);
                        RunTimer = null;
                    }
                    var p = PC;
                    if (p === 0) {
                        p = 1;
                    }
                    test_log(sprintf("%03d-%s", p, Program[p].info.keys));
                    step();
                }
            }
        } else if (typeof(keys) === "function") {
            keys();
        }
        if (test.length > 1) {
            var expected = test[1];
            if (typeof(expected) === "string") {
                if (expected !== LcdDisplay) {
                    alert("fail: " + keys + "\nresult: " + LcdDisplay + "\nexpected: " + expected);
                    TestPass = false;
                }
            } else if (typeof(expected) === "function") {
                if (!expected()) {
                    alert("fail: " + keys + "\nresult: " + LcdDisplay + "\nexpected: " + expected);
                    TestPass = false;
                }
            } else {
                if (expected[0] === undefined) {
                    expected = [expected];
                }
                for (var i in expected) {
                    if (!verify(test, Stack[i], StackI[i], expected[i])) {
                        alert("fail: " + keys + "\n" +
                            "result: " + (Flags[8] ? new Complex(Stack[i], StackI[i]) : Stack[i]) + "\n" +
                            "expected: " + expected[i] + "\n" +
                            "diff: " + Math.abs(Stack[i] / expected[i] - 1) + "\n" +
                            "modes: " + (User ? "USER " : "") + (Flags[8] ? "C " : "")
                        );
                        TestPass = false;
                    }
                }
            }
        }
        TestIndex++;
        if (TestPass) {
            setTimeout(run_tests, 0);
        } else {
            alert("fail");
            DisableKeys = false;
        }
    } else {
        //alert = oldalert;
        if (TestPass) {
            var end = new Date();
            alert("pass: " + ((end.getTime() - TestStart.getTime()) / 1000) + " s");
        }
        DisableKeys = false;
    }
}
