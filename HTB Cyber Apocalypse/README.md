# Cyber Apocalypse 2021

Only looked at 3 challenges 

1) Solved controller and system_drop before the CTF
2) Didn't solve minefield in the end :((

# System_drop 
Learn about unique ROP technique (ret2csu)

My technique is a tad complicated. 

I learn about the technique from here:
https://bananamafia.dev/post/x64-rop-redpwn/

# Minefield 
Learn about _fini_array which is a destructor that is called once before elf's termination

# Environment
This binary is hardened with Full-RELRO. 
Unable to do the usual method of overwriting GOT table to get RIP control.

Patchelf Tutorial:
https://github.com/Dvd848/CTFs/blob/master/2021_picoCTF/Cache_Me_Outside.md
command = /root/.cargo/bin/pwninit
- Place the libc.so.6 in the current directory
- Place the binary in the current directory
- Run command (/root/.cargo/bin/pwninit)
- Patchelf  --set-interpreter ./ld-2.27.so ./environment
- In exploit script:
	p = gdb.debug(local_bin, '''
	continue
	''',env={'LD_PRELOAD':"./libc.so.6"})
	

Learn 2 more things:
1) Exit_Handler can be corrupted to control RIP.
This depends on if the libc allows it to be written and might require further leak of stuff.
I tried this method. 
It was workable on Kali, using the unpatched libc and linker.
However, using the server libc, the libc is further hardened, I might require a leak of the ld and _df_ini. 

Refer to below link: 
http://binholic.blogspot.com/2017/05/notes-on-abusing-exit-handlers.html

2) Leaking environ pointer can be further used to leak the stack address
Environ can be found in the below unnamed section. 
0x7ffff7dcf000     0x7ffff7dd3000 rw-p     4000 0      

pwndbg> p &environ
$1 = (<data variable, no debug info> *) 0x7ffff7dd0098 <environ>

pwndbg> x/20gx 0x7ffff7dd0098
0x7ffff7dd0098 <environ>:       0x00007fffffffee58      0x0000000000000000



