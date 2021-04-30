;nasm -f elf egghunter.asm
;ld -m elf_i386 -o egghunter egghunter.o

section .text
    global _start

_start:
    db 0xcc
    jmp end
    
    myEIP:
    pop eax
    sub eax, 0x20
    and eax, 0xFFFFFFF0
    search:
    mov ebx, [eax]
    cmp ebx, 0x41414141
    jz found
    sub eax, 4
    jmp search

    end:
    call myEIP

    found:
    add eax, 4
    jmp eax

    ret
