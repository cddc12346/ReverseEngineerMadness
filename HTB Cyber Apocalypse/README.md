# Cyber Apocalypse 2021

Only looked at 3 challenges 

1) Solved controller and system_drop before the CTF
2) Didn't solve minefield in the end :((

# system_drop 
Learn about unique ROP technique (ret2csu)

My technique is a tad complicated. 

I learn about the technique from here:
https://bananamafia.dev/post/x64-rop-redpwn/

# minefield 
Learn about _fini_array which is a destructor that is called once before elf's termination

# environment
This binary is hardened with Full-RELRO. 
Unable to overwrite GOT table to get RIP control.

Learn 2 more things:
1) Exit_Handler can be corrupted to control RIP
This depends on if the libc allows it to be written and might require further leak of stuff
I tried this method, workable on Kali, using the unpatched libc and linker.
Using the server libc, the libc is futher hardened...

2) Leaking environ pointer can be further use to leak the stack address
0x7ffff7dcf000     0x7ffff7dd3000 rw-p     4000 0      
0x7ffff7dd3000     0x7ffff7dfc000 r-xp    29000 0      /home/kali/Desktop/HTB_Cyber/pwn_save_the_environment/ld-2.27.so

pwndbg> x/20gx 0x7ffff7dd0098
0x7ffff7dd0098 <environ>:       0x00007fffffffee58      0x0000000000000000
0x7ffff7dd00a8: 0x0000000000000000      0x0000000000000000
 
