section .data
  msg db '/bin/sh' ; db stands for define byte, msg will now be a string pointer.
 
section .text
  global _start

_start:
  jmp firstArg

main: 
  xor eax, eax
  pop ebx			;ebx = address of '/bin/sh'
  jmp secondArg

main2:
  pop esi 			;esi = address of '-c'
  jmp thirdArg

main3:
  pop edi 			;edi = address of 'ls -la'

  xor eax, eax
  push eax
  mov edx, esp		;edx = address of null

  push edi			;push address of ls -la
  push esi			;push address of -c
  push ebx			;push address of /bin/sh
  mov ecx, esp

  mov al, 11		;syscall value
  int 0x80

firstArg:
	call main
	db '/bin/sh', 0

secondArg:
	call main2
	db '-c',0

thirdArg:
	call main3
	db 'ls -la', 0


;before syscall is called, this is what is in the different registers
;eax = 11
;ebx = address to '/bin/sh'
;ecx = address to arguments that are pushed onto the stack prior
;how the stack looks like ------------------------
;esp ---> top of stack:   | address to /bin/sh   |
;						  ------------------------
;						  | address to /bin/ls   |
;						  ------------------------
;						  | address to -la       |
;						  ------------------------
;edx = address of null string