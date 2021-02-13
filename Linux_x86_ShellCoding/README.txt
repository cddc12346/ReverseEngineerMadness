Adapted from: https://0x00sec.org/t/linux-shellcoding-part-1-0/289


My commands:

#compile asm file to object file 
nasm -f elf -o shell.o shell.asm

#compile obj file to elf binary
ld -m elf_i386 -s -o shell shell.o

#dump instructions
objdump -M intel -d shell

#get shellcode --> put into the run_sc.c file
./get_shellcode.sh -f shell

#compile run_sc.c
gcc -m32 -fno-stack-protector -z execstack run_sc.c -o test

just run all
nasm -f elf -o shell.o shell.asm
ld -m elf_i386 -s -o shell shell.o
objdump -M intel -d shell
gcc -m32 -fno-stack-protector -z execstack run_sc.c -o test
./test

Learnings:

A syscall takes arguments like normal functions, however syscalls are different in that they don’t use the stack.

syscall 11 -> sys_execve (execute program)
http://asm.sourceforge.net/syscall.html

first argument in eax register (syscall value = 11)
second argument in ebx register (string "/bin/bash")
third argument in ecx register (string "0" -> specify no arguments in running /bin/bash)

To work on:
Shellcode to run simple command ("/bin/bash -c 'ls -la' ") 
Practice this to familiarize with passing arguments through stack
Also notice that you wont be able to run /bin/ls, but can run /bin/bash!

Additional:
x64 shellcoding
sendfile(1, open("/flag", null), 0, 1000);

;first syscall to open /flag file
mov rdi, address of "/flag" string
mov rsi, 0
mov rax, 2
syscall		;trigger open("/flag", NULL)

mov rdi, 1	;first argument
mov rsi, rax;second argument
mov rdx, 0	;third argument
mov r10, 1000;fourth argument
mov rax, 40	;syscall number of sendfile

syscall

mov rax, 60
syscall		;trigger exit()













