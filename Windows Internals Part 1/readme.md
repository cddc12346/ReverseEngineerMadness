# Chapter 4 - Threads

## Things that I never knew

1) Optional stack size

2) CreateRemoteThread is a common technique for debugger to force a break in debugged process
	- Also use to obtain internal information about another process
	
3) CreateThread and CreateRemoteThread eventually calls CreateRemoteThreadEx and NtCreateThreadEx
	- NtCreateThreadEx will trainsit into kernel mode

4) Creating a thread in kernel mode is achieved with the PsCreateSystemThread (can create thread in ANY process)

5) Windows thread is represented by an executive thread object 
	- ETHREAD structure
	- KTHREAD structure
	
6) ETHREAD structure exists in system address space, while TEB exists in process address space
![plot](./Images/ETHREAD.PNG)

	- Interesting fields:
		1) Process this thread belongs to -> EPROCESS
		2) Access Token
		3) Pending I/O Requests points to IRP
		4) ETHREAD -> Thread List Entry -> ETHREAD
	
	- First member is called TCB (actually a structure of type KTHREAD)
	- **Process Identification Information**
		- **Stores a pointer to the owning process**

7) KTHREAD structure
![plot](./Images/KTHREAD.PNG)


	- Interesting fields:
		1) Dispatcher Header
		2) TEB
		3) Wait Block
		4) List of pending APCs
		5) KTHREAD -> Thread List Entry -> KTHREAD

## The second largest heading

###### The smallest heading