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

Command = /root/.cargo/bin/pwninit
- Place the libc.so.6 in the current directory
- Place the binary in the current directory
- Run command (/root/.cargo/bin/pwninit)
- Patchelf  --set-interpreter ./ld-2.27.so ./environment
- In exploit script:
```
	p = gdb.debug(local_bin, '''
					continue
					''',env={'LD_PRELOAD':"./libc.so.6"})
```	

Learn 2 more things:
## 1) Exit_Handler can be corrupted to control RIP.
This depends on if the libc allows it to be written and might require further leak of stuff.
I tried this method. 
It was workable on Kali, using the unpatched libc and linker.
However, using the server libc, the libc is further hardened, I might require a leak of the ld and _df_ini. 

Refer to below link: 
http://binholic.blogspot.com/2017/05/notes-on-abusing-exit-handlers.html

## 2) Leaking environ pointer can be further used to leak the stack address.
Environ can be found in the below unnamed section. 

0x7ffff7dcf000     0x7ffff7dd3000 rw-p     4000 0      

```
pwndbg> p &environ

$1 = (<data variable, no debug info> *) 0x7ffff7dd0098 <environ>

pwndbg> x/20gx 0x7ffff7dd0098

0x7ffff7dd0098 <environ>:       0x00007fffffffee58      0x0000000000000000
```

## Resources for this challenge:
Python rol script:
https://gist.github.com/trietptm/5cd60ed6add5adad6a34098ce255949a

Decrypting:
http://binholic.blogspot.com/2017/05/notes-on-abusing-exit-handlers.html

Its possible to find fs:[0x30]  in the ld linker section. It is dynamic 
```
0x7f8d2160b000     0x7f8d217f2000 r-xp   1e7000 0      /home/kali/Desktop/HTB_Cyber/pwn_save_the_environment/libc.so.6

0x7f8d217f2000     0x7f8d219f2000 ---p   200000 1e7000 /home/kali/Desktop/HTB_Cyber/pwn_save_the_environment/libc.so.6

0x7f8d219f2000     0x7f8d219f6000 r--p     4000 1e7000 /home/kali/Desktop/HTB_Cyber/pwn_save_the_environment/libc.so.6

0x7f8d219f6000     0x7f8d219f8000 rw-p     2000 1eb000 /home/kali/Desktop/HTB_Cyber/pwn_save_the_environment/libc.so.6

0x7f8d219f8000     0x7f8d219fc000 rw-p     4000 0      

0x7f8d219fc000     0x7f8d21a25000 r-xp    29000 0      /home/kali/Desktop/HTB_Cyber/pwn_save_the_environment/ld-2.27.so

0x7f8d21c23000     0x7f8d21c25000 rw-p     2000 0      
```

Its here at 0x7f8d21c245b0. I tested it by running a few times... 

This challenge does not allow using this method since the check_fun actually checks if the address write is a valid memory...

# Harvester
Learn 2 things!!!

## 1) Format String Exploitation

Although buffer only takes in 5 characters, we can leak more pointers further down the stack by doing '%XX$p'

Initially, I only use %p%p.... Forgot all about that.

Bottom line = as long as we manage to trigger format string vuln once, we can leak everything we want!!!!

## 2) Power of the leave gadget!

I can control RSP to anything I want! This can be used for stack pivoting!

This is what happens when leave is called:
```
MOV RSP, RBP		//RBP can be corrupted to whatever we control, so effectively its a stack pivot!!
POP RBP				//	
```

Since the remote server is no longer up, I have to do it on local. Also, one-gadget does not seem to work on my local. Constraints not matched.

Therefore, my exploitation concept is to use a stack pivot, and then do the normal ROP to get system(/bin/sh).

*Make sure to do it on the unpatched binary or else it will crash at while system(/bin/sh)

This is a better writeup:

https://github.com/datajerk/ctf-write-ups/tree/master/cyberapocalypsectf2021/harvester




