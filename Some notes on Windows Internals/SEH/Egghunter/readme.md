To use compile.sh, make sure to install nasm. This script will compile asm and output as a elf, and output the hex string. 

Note that for my exploit, to find the egghunter string, eax at **myEIP** has to be aligned to 0x0 or 0x8.

Also reverse shell payload should be aligned to 0x0 or 0x8.

