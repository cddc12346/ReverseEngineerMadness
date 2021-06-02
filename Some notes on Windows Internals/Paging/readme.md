# Kernel-mode heaps

1) Non-paged pool
	- guaranteed to reside in physical memory at all times
		-> can be accessed at any time without incurring a page fault
	- reason why we need non-paged pool is because page faults cant be satisfied at >= DPC/dispatch level
		-> any code/data that might be executed or accessed at >= DPC/dispatch level must be in non-paged
		
2) Paged pool
	- accessible from any process context

Both memory pools are mapped into the virtual address space of every process.

Routines to allocate memory:
	- ExAllocatePool
	- ExAllocatePoolWithTag
	- ExFreePool
	
System starts with **four paged pools and two non paged pool**

## Look-aside lists

Routines to allocate lookaside list:
	- ExInitializeNPagedLookasideList

```
!lookaside )Viewing system look-aside lists)
```

## Interesting Windows API
HeapWalk
HeapLock
HeapUnlock

## Process Quota types
Non/PagedPoolQuota -> Required privilege = SeIncreaseQuotaPrivilege

## x64 Virtual Address Translation
Page tables contain the physical locations of the pages in memory.

## Reasons for access fault
1) Corrupt PTE/PDE --> Bug-check with code 0x1A (Memory_management)

2) Writing to page that is read-only --> (Access violation exception)

## Windows Page Permission bits
Page level marked as supervisor (U/S) = 0 will result as supervisor for SMEP enforcement

To bypass SMEP, only ONE of the paging structure table entries is needed to be set as kernel in order for SMEP to not trigger.

https://connormcgarr.github.io/pte-overwrites/















