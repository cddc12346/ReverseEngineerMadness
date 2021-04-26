# Stack view on SEH Chain Components

![plot](./Images/SEH_Stack_Frame.png)

## Structure of SEH record 

Note that SEH record is 8 bytes and has 2 elements.
1. Pointer to next SEH record
2. Pointer to Exception Handler

At the most bottom is the default exception handler, the OS handler.

0xff ff ff ff indicates the end of the SEH chain

## Happenings when code faults
At position FS:[0x00] or the TIB, there is the head of the exception handler chain.
When an exception occurs, ntdll.dll kicks in and retrieves the head of the SEH chain, walks through the list and finds the suitable handler. If no handler is found, the default Win32 handler will be used (at the bottom of the stack)

at fs:[0] -> first 4 bytes is the head of the SEH chain
Going to the pointer, will have it pointing to the next frame.

## Entire SEH Chain
![plot](./Images/SEH_Stack_Frame.png)

### My version
![plot](./Images/SEH_Stack_Frame1.png)

Windbg snapshot is when application crashes:
```
d fs:[0] 
```
shows TIB is at 0x00aff95c

Looking at the memory pane on the top left, we see a pointer to another exception record. A handler is also registered, with debug symbols, it can be identified as _except_handler4.



