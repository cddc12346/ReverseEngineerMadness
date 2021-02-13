section .data
  msg db '/bin/sh' ; db stands for define byte, msg will now be a string pointer.
 
section .text
  global _start

_start:
  jmp message

main: 
  xor eax, eax
  ;push eax
  ;push 0x68732f2f
  ;push 0x6e69622f
  ;mov ebx, esp
  pop ebx
  mov ecx, eax
  mov al, 0xb
  int 0x80

message:
	call main
	db '/bin/sh', 0