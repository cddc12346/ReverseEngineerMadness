# SMEP Protection

SMEP only protects the case of an exploit when RIP is redirected to user memory shellcode.

# SMEP Bypass

1) Using kernel ROP gadgets to overwrite CR4 register

Goal: Place the value 0x70678 into cr4


Example: https://h0mbre.github.io/HEVD_Stackoverflow_SMEP_Bypass_64bit/#

- Find pop rcx gadget
- Mov rc4, rcx gadget

2) Modifying nt!MmUserProbeAddress

Overwriting nt!MmUserProbeAddress global variable.

MmUserProbeAddress is a global variable that holds an address demarcating user space from kernel space. 
Comparisons with this value are used to determine if an address points to user space or kernel space.

|  Symbol  |  Initialize value  |
| -------  |  ----------------  |
|  MmHighestUserAddress  |  0x7FFFFFEFFFF  |
|  MmUserProbeAddress |  0x7FFFFFF0000  |
|  MmSystemRangeStart  |  0xFFFF080000000000  | 
