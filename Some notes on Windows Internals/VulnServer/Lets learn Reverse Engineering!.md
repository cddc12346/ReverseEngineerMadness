# Lets learn Reverse Engineering! 

###### tags: `reverse engineering`, `windows`, `pwn`

I will be doing RE on VulnServer like it is a black box.

## Step 1 (Using TCPView to check for open ports by VulnServer)

![](https://i.imgur.com/kkg8ORU.png)

We see VulnServer is listening on Port 9999.

## Step 2 (Reverse Engineering!!!)

First we break on recv. Recv takes in 4 arguments. The second argument is the buffer.
```
bp ws2_32!recv
```

One may notice that the calling convention is pretty weird in this binary. The arguments are not pushed into the stack. Instead, they are moved into the stack.

![](https://i.imgur.com/U3wzhWa.png)

Following along the recv, there is a strncmp between the front of our buffer with a few commands (HELP, STATS etc). 

Note that this may not always be the case, compare might not be done with the front of the buffer.

## Moving along...

Help doesnt look useful. Shortly after, we see STATS.

![](https://i.imgur.com/hSfdlyz.png)

There is some form of strncpy into a heap memory, we should take a look into this. At first glance, it doesn't look useful as there are restriction on the sizes. But always good to take a look.

## Avoiding rabbitholes

One tip to avoid rabbithole is to look if there are restrictions on size or whether the memory is set to 0 before using. Restrictions on size probably wouldn't allow us to overflow the buffer, while NULLing a memory to 0 wouldn't give us a leak.

We see that commands until LTIME all look the same and are not very interesting.

## TRUN Command

At first glance, TRUN does look intimidating as it looks pretty complex. However, usually complex functions will have bugs.

Final end result of TRUN Command is hit when `0x401D41` has a larger result than **0x1000** or `0x401D4F` when we have a **0x2E** in the buffer. 

`0x401D41` looks like it has nothing interesting. So we should investigate the other path `0x401D4F`.

![](https://i.imgur.com/txO4u9c.png)

Here we have something of interest. 

![](https://i.imgur.com/2WWMjv3.png)

![](https://i.imgur.com/E4cwLpj.png)

Looking at the arguments taken in, it looks like a strcpy into stack!!! This is where we should be especially aware. Do a `!address` too to confirm it is on the stack.

![](https://i.imgur.com/ukCfLMA.png)

![](https://i.imgur.com/LmDYbZp.png)

We notice the first EBP is at `0x00fff9c0` and the first exchain is at `0x00ffffcc`. Overwriting any of them will allow us to get RIP control. `0x00fff9c0` is less than 0x1000 away from the Destination StrCpy buffer. So by changing the buffer size to 0x1000, we can effectively get a buffer overflow!

### RIP Control POC
```
from pwn import *

p = remote('192.168.106.136', 9999)

payload = b"TRUN\x20"
payload += b"\x42" * 0x980
payload += b"\x2E"

p.send(payload)

p.interactive()
```

![](https://i.imgur.com/O4de2eH.png)

## GMON Branch

GMON is almost like the TRUN. But instead of 0x2E, it searches for 0x2F.

There is also an additional check on the length, it has to be longer than 0xF6E to trigger the strcpy vuln.

![](https://i.imgur.com/yqccACv.png)

By specifying a length longer than 0xF6E, we are able to trigger an access violation and overwrite the exception chain!

![](https://i.imgur.com/sMSCiVQ.png)

Overwriting the exception chain also allows RIP Control, although it is tougher to do ROP.

```
from pwn import *

p = remote('192.168.106.136', 9999)

payload = b"GMON\x20"
payload += b"\x42" * 0xF80
payload += b"\x2F"

p.send(payload)

p.interactive()
```

# Onward to exploitation

Sadly, there is no memory leak so there is no proper ASLR bypass. To bypass ASLR, we will be using a module not compiled with ASLR, in this case `essfunc.dll`.

Also, I will be adding DEP Protection Mitigation and I will be doing ROP with a SEH Overwrite, just to make it tougher.

One of the useful tools I encounter recently is narly. It can be downloaded here:

[https://code.google.com/archive/p/narly/downloads
](https://)

`!load narly`, `!nmod` will show us the protections of these loaded modules.
```
00400000 00407000 vulnserver           /SafeSEH OFF                C:\Users\IEUser\Desktop\vulnserver-master (1)\vulnserver-master\vulnserver.exe
62500000 62508000 essfunc              /SafeSEH OFF                C:\Users\IEUser\Desktop\vulnserver-master (1)\vulnserver-master\essfunc.dll
```

# Conclusion (Failed attempt) 

Tried bypassing DEP with gadgets from essfunc.dll only but it looks impossible. I stopped here because I think it will be easy to create gadgets using kernel32.dll which is huge and hence will dump lots of gadget.

# Some useful tips:
## Command to easily hook VulnServer.exe
"C:\Program Files (x86)\Windows Kits\10\Debuggers\x86\windbg.exe" /g vulnserver.exe

## Symbol path in windbg
srv*;srv*c:\symbols*https://msdl.microsoft.com/download/symbols


