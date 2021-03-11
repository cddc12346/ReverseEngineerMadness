#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main() {
  int *arr = NULL, n = 0, i = 0;

  printf("n = ");
  scanf("%d", &n);
  if (n >= 0x100)
    exit(1);

  //allocate size of arr
  //this is in the heap memory region
  arr = calloc(n, sizeof(int));
  
  //overwrite puts@plt to this statement so i can put my rop
  //puts@plt is here 0x601018
  //choose which index to set
  //no bounds check for this, so i can actually index the rsp
  printf("i = ");
  scanf("%d", &i);

  //set the value
  //arr is in rax
  //0x4007f4 <main+189>    mov    rax, qword ptr [rbp - 8]
  //rdx is the index

  printf("arr[%d] = ", i);
  scanf("%d", &arr[i]);
  puts("Done!");

  return 0;
}

__attribute__((constructor))
void setup() {
  alarm(60);
  setbuf(stdin, NULL);
  setbuf(stdout, NULL);
}
