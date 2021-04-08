#include <stdlib.h>

int main(){
	int *ptr1;
	int *ptr2;
	int *ptr3;
	int *ptr4;
	int *ptr5;
	int *ptr6;
	int *ptr7;
	int *ptr8;

	//0x5555555592a0
	ptr1 = malloc(0x80); /* a block of 15 integers */

	//0x555555559330
	ptr2 = malloc(0x80); /* a block of 15 integers */

	//free(ptr1);
	//free(ptr2);
	//0x5555555593c0
	ptr3 = malloc(0x80); /* a block of 15 integers */


	//0x555555559450
	ptr4 = malloc(0x80); /* a block of 15 integers */

	//0x5555555594e0
	ptr5 = malloc(0x80); /* a block of 15 integers */

	//0x555555559570
	ptr6 = malloc(0x80); /* a block of 15 integers */

	//free(ptr4); 	//0x555555559450 

	//ptr8 = malloc(0x80); /* a block of 15 integers */

	free(ptr3);		//0x5555555593c0

	free(ptr4);		//0x555555559450

	'''
	pwndbg> set *0x5555555590c8=0x00005555555593c0
	'''
	ptr7 = malloc(0x80); /* a block of 15 integers */


}