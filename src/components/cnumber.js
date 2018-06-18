//
// CNumber - clifford numbers in euclidean 3 space
// Copyright 1999 by Roger E Critchlow Jr, Santa Fe, New Mexico.
//


function CNumber(s, x, y, z, yz, zx, xy, xyz) {
  this[0] = s || 0;
  this[1] = x || 0;
  this[2] = y || 0;
  this[3] = z || 0;
  this[4] = yz || 0;
  this[5] = zx || 0;
  this[6] = xy || 0;
  this[7] = xyz || 0;
  return this;
}

CNumber.basis = new Object();
CNumber.basis.value = new Object();
CNumber.basis.name = new Array("1", "x", "y", "z", "yz", "zx", "xy", "xyz");

for (i = 0; i < 8; i += 1) {
  var base = CNumber.basis.name[i];
  CNumber.basis.value[base] = new CNumber(0);
  CNumber.basis.value[base][i] = 1;
  if (base.length == 2) {
    base = base.substring(1,2) + base.substring(0,1);
    CNumber.basis.value[base] = new CNumber(0);
    CNumber.basis.value[base][i] = -1;
  } else if (base.length == 3) {
    var s = 1;
    var j;
    for (j = 0; j < 5; j += 1) {
      if ((j & 1) == 0)
        base = base.substring(1,2) + base.substring(0,1) + base.substring(2,3);
      else
        base = base.substring(0,1) + base.substring(2,3) + base.substring(1,2);
      s = -s;
      CNumber.basis.value[base] = new CNumber(0);
      CNumber.basis.value[base][i] = s;
    }
  }     
}

CNumber.prototype.prototype = Array.prototype;

CNumber.prototype.toString = function() {
  var a = this;
  var s = "";
  for (i = 0; i < 8; i += 1) {
    if (a[i] == 0) {
      ;
    } else if (i == 0) {
      s += a[i].toString();
    } else if (a[i] == 1) {
      s += "+" + CNumber.basis.name[i];
    } else if (a[i] == -1) {
      s += "-" + CNumber.basis.name[i];
    } else if (a[i] > 0) {
      s += "+" + a[i].toString() + CNumber.basis.name[i];
    } else {
      s += a[i].toString() + CNumber.basis.name[i];
    }
  }
  return s == "" ? "0" : s;
}

//
// convert a string of [xyz]+ into a basis element
//
CNumber.baseReduce = function(base) {
  if ( ! CNumber.basis.value[base]) {
    CNumber.basis.value[base] =
      CNumber.baseReduce(base.substring(0,1)).multiply(CNumber.baseReduce(base.substring(1)));
  }
  return CNumber.basis.value[base];
}

CNumber.ei = function(base, scalar) {
  return CNumber.baseReduce(base).multiply(new CNumber(scalar));
}

CNumber.re0 = new RegExp("^[-+]");
CNumber.re0.compile(CNumber.re0.source);
CNumber.re1 = new RegExp("^([-+])(([0-9]+)?([.][0-9]+)?([eE][-+]?[0-9]+)?)([xyz]+)?(.*)$");
CNumber.re1.compile(CNumber.re1.source);
CNumber.re2 = new RegExp("^([-+])(Infinity)([xyz]+)?(.*)$");
CNumber.re2.compile(CNumber.re2.source);

function parseCNumber(s) {
  // insert leading sign if necessary
  if (s != "" && ! CNumber.re0.test(s)) {
    s = "+" + s;
  }
  // initialize accumulator
  var acc = new CNumber();
  // peel off terms
  while (s && s != "") {
    var a, sign, number, base;
    
    if ((a = CNumber.re1.exec(s)) != null && a[2]+a[6] != "") {
      sign = a[1];
      if ((number = a[2]) == "") number = "1";
      if ((base = a[6]) == "") base = "1";
      acc = acc.add(CNumber.ei(base, parseFloat(sign + number)));
      s = a[7];
    } else if ((a = CNumber.re2.exec(s)) != null) {
      sign = a[1];
      number = a[2];
      if ((base  = a[3]) == "") base = "1";
      acc = acc.add(CNumber.ei(base, parseFloat(sign + number)));
      s = a[7];
    } else {
      alert("parseCNumber could not parse: " + s);
      return acc;
    }
  }
  return acc;
}

CNumber.prototype.negate = function() {
  var a = this;
  return new CNumber(-a[0], -a[1], -a[2], -a[3], -a[4], -a[5], -a[6], -a[7]);
}

// reversion - reverse vector factors
CNumber.prototype.reverse = function() {
  var a = this;
  return new CNumber(a[0], a[1], a[2], a[3], -a[4], -a[5], -a[6], -a[7]);
}

// clifford conjugation - combine above and below
CNumber.prototype.conjugate = function() {
  var a = this;
  return new CNumber(a[0], -a[1], -a[2], -a[3], -a[4], -a[5], -a[6], a[7]);
}
// grade involution - odd grades are negated
CNumber.prototype.involution = function() {
  var a = this;
  return new CNumber(a[0], -a[1], -a[2], -a[3], a[4], a[5], a[6], -a[7]);
}

CNumber.prototype.grade = function(r) {
  var a = this;
  if (r == 0) return new CNumber(a[0]);
  if (r == 1) return new CNumber(0, a[1], a[2], a[3]);
  if (r == 2) return new CNumber(0, 0, 0, 0, a[4], a[5], a[6]);
  if (r == 3) return new CNumber(0, 0, 0, 0, 0, 0, 0, a[7]);
  if (r == "even") return new CNumber(a[0], 0, 0, 0, a[4], a[5], a[6]);
  if (r == "odd")  return new CNumber(0, a[1], a[2], a[3], 0, 0, 0, a[7]);
  return new CNumber();
}

CNumber.prototype.add = function(b) {
  var a = this;
  return new CNumber(
		     a[0] + b[0],
		     a[1] + b[1],
		     a[2] + b[2],
		     a[3] + b[3],
		     a[4] + b[4],
		     a[5] + b[5],
		     a[6] + b[6],
		     a[7] + b[7]
		     );
}

CNumber.prototype.subtract = function(b) {
  var a = this;
  if (b)
      return new CNumber(
		     a[0] - b[0],
		     a[1] - b[1],
		     a[2] - b[2],
		     a[3] - b[3],
		     a[4] - b[4],
		     a[5] - b[5],
		     a[6] - b[6],
		     a[7] - b[7]
		     );
  else
      return this.negate();
}

CNumber.prototype.inner = function(b) {
  var a = this;
  return new CNumber(
      a[1]*b[1] + a[2]*b[2] + a[3]*b[3] - a[4]*b[4] - a[5]*b[5] - a[6]*b[6] - a[7]*b[7],
    - a[2]*b[6] + a[3]*b[5] - a[4]*b[7] - a[5]*b[3] + a[6]*b[2] - a[7]*b[4],
      a[1]*b[6] - a[3]*b[4] + a[4]*b[3] - a[5]*b[7] - a[6]*b[1] - a[7]*b[5],
    - a[1]*b[5] + a[2]*b[4] - a[4]*b[2] + a[5]*b[1] - a[6]*b[7] - a[7]*b[6],
      a[1]*b[7] + a[7]*b[1],
      a[2]*b[7] + a[7]*b[2],
      a[3]*b[7] + a[7]*b[3],
    0
  );
}

CNumber.prototype.outer = function(b) {
  var a = this;
  return new CNumber(
      a[0]*b[0],
      a[0]*b[1] + a[1]*b[0],
      a[0]*b[2] + a[2]*b[0],
      a[0]*b[3] + a[3]*b[0],
      a[0]*b[4] + a[2]*b[3] - a[3]*b[2] + a[4]*b[0],
      a[0]*b[5] - a[1]*b[3] + a[3]*b[1] + a[5]*b[0],
      a[0]*b[6] + a[1]*b[2] - a[2]*b[1] + a[6]*b[0],
      a[0]*b[7] + a[1]*b[4] + a[2]*b[5] + a[3]*b[6] + a[4]*b[1] + a[5]*b[2] + a[6]*b[3] + a[7]*b[0]
    );
}

CNumber.prototype.multiply = function(b) {
  var a = this;
  return new CNumber(
      a[0]*b[0] + a[1]*b[1] + a[2]*b[2] + a[3]*b[3] - a[4]*b[4] - a[5]*b[5] - a[6]*b[6] - a[7]*b[7],
      a[0]*b[1] + a[1]*b[0] - a[2]*b[6] + a[3]*b[5] - a[4]*b[7] - a[5]*b[3] + a[6]*b[2] - a[7]*b[4],
      a[0]*b[2] + a[1]*b[6] + a[2]*b[0] - a[3]*b[4] + a[4]*b[3] - a[5]*b[7] - a[6]*b[1] - a[7]*b[5],
      a[0]*b[3] - a[1]*b[5] + a[2]*b[4] + a[3]*b[0] - a[4]*b[2] + a[5]*b[1] - a[6]*b[7] - a[7]*b[6],
      a[0]*b[4] + a[1]*b[7] + a[2]*b[3] - a[3]*b[2] + a[4]*b[0] - a[5]*b[6] + a[6]*b[5] + a[7]*b[1],
      a[0]*b[5] - a[1]*b[3] + a[2]*b[7] + a[3]*b[1] + a[4]*b[6] + a[5]*b[0] - a[6]*b[4] + a[7]*b[2],
      a[0]*b[6] + a[1]*b[2] - a[2]*b[1] + a[3]*b[7] - a[4]*b[5] + a[5]*b[4] + a[6]*b[0] + a[7]*b[3],
      a[0]*b[7] + a[1]*b[4] + a[2]*b[5] + a[3]*b[6] + a[4]*b[1] + a[5]*b[2] + a[6]*b[3] + a[7]*b[0]
    );
}
//
// Convert a clifford number into the matrix which emulates
// clifford number multiplication.
// Ie, the clifford number multiplication d * e is equivalent
// to the matrix product a * d after e[] is inserted into a[][].
//
// 1 = +1*1 +x*x +y*y +z*z -i*i -j*j -k*k -I*I
// x = +1*x +x*1 -y*i +z*k +i*y -j*I -k*z -I*j
// y = +1*y +x*i +y*1 -z*j -i*x +j*z -k*I -I*k
// z = +1*z -x*k +y*j +z*1 -i*I -j*y +k*x -I*i
// i = +1*i +x*y -y*x +z*I +i*1 -j*k +k*j +I*z
// j = +1*j +x*I +y*z -z*y +i*k +j*1 -k*i +I*x
// k = +1*k -x*z +y*I +z*x -i*j +j*i +k*1 +I*y
// I = +1*I +x*j +y*k +z*i +i*z +j*x +k*y +I*1
//
CNumber.prototype.insert = function() {
  var a = this;
  return new Array(
		   new Array( a[0],  a[1],  a[2],  a[3], -a[4], -a[5], -a[6], -a[7]),
		   new Array( a[1],  a[0], -a[4],  a[6],  a[2], -a[7], -a[3], -a[5]),
		   new Array( a[2],  a[4],  a[0], -a[5], -a[1],  a[3], -a[7], -a[6]),
		   new Array( a[3], -a[6],  a[5],  a[0], -a[7], -a[2],  a[1], -a[4]),
		   new Array( a[4],  a[2], -a[1],  a[7],  a[0], -a[6],  a[5],  a[3]),
		   new Array( a[5],  a[7],  a[3], -a[2],  a[6],  a[0], -a[4],  a[1]),
		   new Array( a[6], -a[3],  a[7],  a[1], -a[5],  a[4],  a[0],  a[2]),
		   new Array( a[7],  a[5],  a[6],  a[4],  a[3],  a[1],  a[2],  a[0])
		   );
}
//
// compute the inverse, possibly dividing by zero
//
// The following is shamelessly ripped from sge.shar,
// a C version of sgefa/sgeco/sgesl, the gaussian
// elimination routines from LINPACK, written by:
//
//		Dr. Mark K. Seager
//		Lawrence Livermore Nat. Lab.
//		PO Box 808, L-316
//		Livermore, CA 94550
//		(415) 423-3141
//		seager@lll-crg.llnl.gov
//
// and available from the netlib archives.
//
CNumber.prototype.inverse = function() {
  // expand the clifford number into a matrix
  var a = this.insert();
  // Set right hand side
  var b = new Array(1, 0, 0, 0, 0, 0, 0, 0);
  // Solve - sgefa emulator
  // Gaussian elimination with partial pivoting.
  //  Loop over Diagional
  var ipvt = new Array();
  for (k = 0; k < 8; k += 1) {
    // Find index of max elem in col below the diagonal (l = pivot index).
    // isamax emulator
    var t = Math.abs(a[k][k]);
    for (l = k, j = k+1; j < 8; j += 1) {
      if (Math.abs(a[j][k]) > t) {
	l = j;
	t = Math.abs(a[l][k]);
      }
    }
    ipvt[k] = l;

    // Zero pivot implies a column already triangular.
    // Fall through and divide by zero.

    // Interchange a(k,k) and a(l,k) if necessary.
    if (l != k) {
      var t = a[k][k]; a[k][k] = a[l][k]; a[l][k] = t;
    }

    // Compute multipliers for a column.
    for (i = k+1; i < 8; i += 1) {
      a[i][k] = a[i][k] / -a[k][k];
    }

    // Interchange a(k,j) and a(l,j) if necessary.
    if (l != k) {
      for (j = k+1; j < 8; j += 1) {
	var t = a[k][j]; a[k][j] = a[l][j]; a[l][j] = t;
      }
    }

    // Column elimination with row indexing.
    for (j = k+1; j < 8; j += 1) {
      for (i = k+1; i < 8; i += 1) {
	a[i][j] += a[k][j]*a[i][k];
      }
    }
  }
  ipvt[7] = 7;		// set last pivot

  // Substitute - sgesl emulator
  // Forward elimination. Solve L*y = b.
  for (k = 0; k < 8; k += 1) {
	    
    // Interchange b[k] and b[l] if necessary.
    var l = ipvt[k];
    if (l != k) {
      var t = b[l]; b[l] = b[k]; b[k] = t;
    }
    for (i = k+1; i < 8; i += 1) {
      b[i] += b[k]*a[i][k];
    }
  }
  // Back substitution.  Solve  U*x = y.
  for (k = 7; k >= 0; k -= 1) {
    b[k] = b[k] / a[k][k];
    for (i = 0; i < k; i += 1) {
      b[i] -= a[i][k]*b[k];
    }
  }
  // Construct result
  return new CNumber(b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7]);
}
CNumber.prototype.divide = function(b) {
  return this.multiply(b.inverse());
}
CNumber.prototype.magnitude = function() {
  var a = this;
  return new CNumber(
    Math.sqrt(
      a[0]*a[0] +
      a[1]*a[1] +
      a[2]*a[2] +
      a[3]*a[3] +
      a[4]*a[4] +
      a[5]*a[5] +
      a[6]*a[6] +
      a[7]*a[7])
    );
}
CNumber.prototype.rotate = function(b) {
  return this.multiply(b.multiply(this.reverse()));
}
CNumber.prototype.reflect = function(b) {
  return this.multiply(b.multiply(this.negate()));
}
CNumber.prototype.normalize = function() {
  return this.divide(this.magnitude());
}
/*
**
** evaluate a series as a recurrence formula in $k and $term
**
*/
CNumber.EvaluateSeries = function(nterms, sum, recur) {
    for (var k = 1; k < nterms; k += 1)
	sum += recur(k);
    return sum;
}
CNumber.prototype.cos = function() {
    // sum k=0 \inf (-1)^k A^(2k)/(2k)!
    // cos(A) = cosh(xyz A)
    // initial term: term = (-1)^0 * A^0 / (2*0)! = 1 * 1 / 1
    // recurrence: k = 1 \inf,  sum += -1 * A^2 / (2k-1 * 2k)
    // EvaluateSeries 15 [scalar 1] [scalar 1] {multiply $a2 [multiply $term [scalar [expr -1.0/((2*$k)*(2*$k-1))]]]}
    var a2 = this.multiply(this);
    var term = new CNumber(1);
    return CNumber.EvaluateSeries(15, new CNumber(1), function(k) {
	return term = a2.multiply(term.multiply(new CNumber(-1.0/((2*k)*(2*k-1)))));
    });
}
CNumber.prototype.sin = function() {
    // sum k=0 \inf (-1)^k A^(2k+1)/(2k+1)!
    // sin(A) = sinh(xyz A)
    // set a2 [multiply $a $a]
    // EvaluateSeries 15 $a $a {multiply $a2 [multiply $term [scalar [expr -1.0/((2*$k+1)*(2*$k))]]]} a2
    var a2 = this.multiply(this);
    var term = this;
    return CNumber.EvaluateSeries(15, this, function(k) {
	return term = a2.multiply(term.multiply(new CNumber(-1.0/((2*k+1)*(2*k)))));
    });
}
 CNumber.prototype.tan = function() {
    // sin/tan
    return this.sin().divide(this.cos());
}
CNumber.prototype.cosh = function() {
    // sum k=0 \inf A^(2k)/(2k)!
    // set a2 [multiply $a $a]
    // EvaluateSeries 15 [scalar 1] [scalar 1] {multiply $a2 [multiply $term [scalar [expr 1.0/((2*$k)*(2*$k-1))]]]} a2
    var a2 = this.multiply(this);
    var term = new CNumber(1);
    return CNumber.EvaluateSeries(15, new CNumber(1), function(k) {
	return term = a2.multiply(term.multiply(new CNumber(1/((2*k)*(2*k-1)))));
    });
}
CNumber.prototype.sinh = function() {
    // sum k=0 \inf A^(2k+1)/(2k+1)!
    // set a2 [multiply $a $a]
    // EvaluateSeries 15 $a $a {multiply $a2 [multiply $term [scalar [expr 1.0/((2*$k+1)*(2*$k))]]]} a2 
    var a2 = this.multiply(this);
    var term = this;
    return CNumber.EvaluateSeries(15, this, function(k) {
	return term = a2.multiply(term.multiply(new CNumber(1/((2*k+1)*(2*k)))));
    });
}
CNumber.prototype.tanh = function() {
    return this.sinh().divide(this.cosh());
}
CNumber.prototype.acos = function() {
    return this.asScalar(Math.acos, 'arc-cosine');
}
CNumber.prototype.asin = function() {
    return this.asScalar(Math.asin, 'arc-sine');
}
CNumber.prototype.atan = function() {
    return this.asScalar(Math.atan, 'arc-tangent');
}
CNumber.prototype.acosh = function() {
    return this.asScalar(Math.acosh, 'arc-hyperbolic-cosine');
}
CNumber.prototype.asinh = function() {
    return this.asScalar(Math.asinh, 'arc-hyperbolic-sine');
}
CNumber.prototype.atanh = function() {
    return this.asScalar(Math.atanh, 'arc-hyperbolic-tangent');
}
CNumber.prototype.exp = function() {
    // sum k=0 \inf A^k/k!
    // cosh + sinh
    // EvaluateSeries 15 [scalar 1] [scalar 1] {multiply $a [multiply $term [scalar [expr 1.0/$k]]]} a
    var a = this;
    var term = new CNumber(1);
    return CNumber.EvaluateSeries(15, new CNumber(1), function(k) {
	return term = a.multiply(term.multiply(new CNumber(1/k)));
    });
}
CNumber.prototype.log = function() {
    return this.asScalar(Math.log, 'logarithm');
}
CNumber.prototype.sqrt = function() {
    return this.asScalar(Math.sqrt, 'square root');
}
CNumber.prototype.rotate = function(b) {
    return this.multiply(b.multiply(this.reverse()));
}
CNumber.prototype.reflect = function(b) {
    return this.multiply(b.multiply(this)).negate();
}
CNumber.prototype.scalarPart = function() {
    return this[0];
}
CNumber.prototype.vectorPart = function() {
    return this.slice(1,3);
}
CNumber.prototype.bivectorPart = function() {
    return this.slice(4,6);
}
CNumber.prototype.trivectorPart = function() {
    return this[7];
}
CNumber.prototype.asScalar = function(op, name) {
    if (this[1] || this[2] || this[3] || this[4] || this[5] || this[6] || this[7]) {
	alert(name+' is not implemented for non-scalar values');
	return this;
    }
    return new CNumber(op(this[0]));
}

