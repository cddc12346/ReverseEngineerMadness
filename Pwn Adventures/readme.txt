Learnings from Phoenix Stack:

1) Challenge Stack 5:
Dont be fixated on putting shellcode outside/behind the return address.
This affected me in writing the correct RIP since it contains null characters. 
By writing in the message buffer itself, can just do a partial overwrite of RIP.

2) Challenge Stack 6:
*Setting environment variables in GDB!!!*
Useful commands for GDB:
gdb /opt/phoenix/amd64/stack-six
unset env LINES
unset env COLUMNS
set env _ /opt/phoenix/amd64/stack-six
break *0x000000000040077d
break greet 
r
