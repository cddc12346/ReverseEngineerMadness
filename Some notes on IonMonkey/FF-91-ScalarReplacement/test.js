function complex(r, i) {
    return { r: r};
}

function norm_multiply(a, b) {
 
    //mul is an object with properties
    var mul = complex(a, b);
    mulGlobal = mul;
    return (mul.r + 0xCC);
}

mulGlobal = {};

for (i = 0; i < 0x10000; i ++){
	norm_multiply(0x40, 0x41)
}