# Learning about SEH
https://www.corelan.be/index.php/2009/07/25/writing-buffer-overflow-exploits-a-quick-and-basic-tutorial-part-3-seh/

This readme is just a summary of corelan website above. And my OSED prep maybe, will update if this is useful once course starts.

## Stack view on SEH Chain Components

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

At fs:[0] -> first 4 bytes is the head of the SEH chain.

Going to the pointer, we see it pointing to the next frame.

## Entire SEH Chain
![plot](./Images/SEH_Stack_Frame.png)

### My version
![plot](./Images/SEH_Stack_Frame_1.PNG)

Above Windbg snapshot is taken when application crashes:
```
Running 'd fs:[0]' shows TIB is at 0x00aff95c
```

Looking at the memory pane on the top right, we see a pointer to another exception record. A handler is also registered.
With debug symbols, it can be identified as _except_handler4 which is what written in the code.
The SEH Linked List can be finally parsed to 0xffffffff which is the bottom of the SEH chain.

SEH exploit hardening:

Since windows XP SP1, before exception handler is called, all registers are XORed/NULLed. 

Hence, we won't find a reference to any useful address in one of the registers.

## Exploitation Concept

![plot](./Images/Exploitation_Concept.png)
![plot](./Exercise/another_diagram.png)

Payload must do the following things:

1) Cause an exception. Without an exception, the SEH handler (the one you have overwritten/control) won’t kick in
2) Overwrite the pointer to the next SEH record with some jumpcode (so it can jump to the shellcode)
3) Overwrite the SE handler with a pointer to an instruction that will bring you back to next SEH and execute the jumpcode.
4) The shellcode should be directly after the overwritten SE Handler. Some small jumpcode contained in the overwritten “pointer to next SEH record” will jump to it).

![plot](./Exercise/ExploitationConcept2.png)
				
### Question: Why can't we just do a jump at the SEH to our shellcode?

To think of it, if our SEH is a short jump gadget, it is possible not to use pop pop return. 

However, I guess this instruction might be pretty rare.

### What is SAFESEH?

To stop attacks from easily exploiting exception handling buffer overflow, the pop pop return gadget must reside in a safeSEH unprotected module.

I discovered this by attempting to use a ROP gadget from kernel32.dll which failed. 

Sadly, I have yet to find a way to check if a module is SAFESEH using Windbg.
 

## Finishing up our exploit!

### Useful Windbg Commands
```
!anaylze -v // can also be used for userland exception
d fs:[0]	// view TIB
!exchain 	// output the frame (next SEH pointer | SE Handler)

Debugging SafeSEH specific to exploit
bp ntdll!RtlGetGroupSecurityDescriptor+0x299
bp ntdll!RtlRaiseStatus+0x8e	//prologue of exception handler
bp 625010b4	//this is the pop, pop, ret in SafeSEH module
```

## Analysing the call stack disassembly
![plot](./Exercise/CallStack.png)
![plot](./Exercise/CallStackDisassembly.png)

### Understanding the prologue disassembly...
```
//builds EXCEPTION_REGISTRATION structure on the stack
771e6c99 52              push    edx
771e6c9a 64ff3500000000  push    dword ptr fs:[0]

//Install new EXCEPTION_REGISTRATION
771e6ca1 64892500000000  mov     dword ptr fs:[0],esp

//Don't understand this instructions...
771e6ca8 ff7514          push    dword ptr [ebp+14h]	//DispatcherContext
771e6cab ff7510          push    dword ptr [ebp+10h]	//ContextRecord
771e6cae ff750c          push    dword ptr [ebp+0Ch]	//pointer to next SEH
771e6cb1 ff7508          push    dword ptr [ebp+8]		//_exception_record structure

//Get the SEH handler and execute it
//The SEH Handler must be within a SafeSEH address
771e6cb4 8b4d18          mov     ecx,dword ptr [ebp+18h]
771e6cb7 ffd1            call    ecx {essfunc+0x10b4 (625010b4)}

```

I don't think it is using the Extended Exception Handling Frame....

Note that the address of the next SEH was put on stack at ESP+8. 

Hence, our exploitation concept of putting a working gadget at next SEH works.

Do refer to my exploit.py script in the Exercise folder. 

You may also use the binary for vulnserver.exe as well.

## Additional notes of SEH

### More explaination about exception occurring!
When an exception occurs, ntdll!KiUserExceptionDispatcher is called. 











