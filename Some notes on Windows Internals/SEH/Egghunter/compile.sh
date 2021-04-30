nasm -f elf egghunter.asm;
ld -m elf_i386 -o egghunter egghunter.o;
echo "\"$(objdump -d egghunter | grep '[0-9a-f]:' | cut -d$'\t' -f2 | grep -v 'file' | tr -d " \n" | sed 's/../\\x&/g')\""