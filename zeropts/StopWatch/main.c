#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/time.h>

char name[0x80];

void readuntil(char t) {
  char c;
  do {
    c = getchar();
    if (c == EOF) exit(1);
  } while(c != t);
}

int ask_again(void) {
  char buf[0x10];
  printf("Play again? (Y/n) ");
  scanf("%s", buf);
  readuntil('\n');
  if (buf[0] == 'n' || buf[0] == 'N')
    return 0;
  else
    return 1;
}

void ask_time(double *t) {
  printf("Time[sec]: ");
  scanf("%lf", t);
  readuntil('\n');
}

double play_game(void) {
  struct timeval start, end;
  double delta, goal, diff;

  ask_time(&goal);
  printf("Stop the timer as close to %lf seconds as possible!\n", goal);
  puts("Press ENTER to start / stop the timer.");

  readuntil('\n');
  gettimeofday(&start, NULL);
  puts("Timer started.");

  readuntil('\n');
  gettimeofday(&end, NULL);
  puts("Timer stopped.");

  diff = end.tv_sec - start.tv_sec
    + (double)(end.tv_usec - start.tv_usec) / 1000000;

    printf("Exactly %lf seconds! Congratulaions!\n", goal);
  if (diff == goal) {
    printf("Exactly %lf seconds! Congratulaions!\n", goal);
  } else if (diff < goal) {
    delta = goal - diff;
    printf("Faster by %lf sec!\n", delta);
  } else {
    delta = diff - goal;
    printf("Slower by %lf sec!\n", delta);
  }
  if (delta > 0.5) {
    puts("Too lazy. Try harder!");
  }

  return delta;
}

unsigned char ask_number(void) {
  unsigned int n;
  printf("How many times do you want to try?\n> ");
  scanf("%d", &n);
  return (unsigned char)n;
}

void ask_name(void) {
  char _name[0x80];
  //buffer overflow here but require the stack canary
  printf("What is your name?\n> ");
  scanf("%s", _name);
  strcpy(name, _name);
}

/**
 * Entry Point
 */
int main(void) {
  unsigned char i, n;
  double *records, best = 31137.31337;

  ask_name();
  n = ask_number();
  /*
  
  */
  //unsigned char n casted to double
  //size of double is 8
  //i can actually input n=0
  records = (double*)alloca(n * sizeof(double));

  //31137.31337 = 0x40de68540e410b63
  //i stored in rbp-0x29
  for(i = 0; i < n; i++) records[i] = 31137.31337;

  //weird checking here...
  //i stored in rbp-0x2a
  for(i = 0; ; i++) {
    printf("-=-=-=-= CHALLENGE %03d =-=-=-=-\n", i + 1);
    records[i] = play_game();
    if (i >= n - 1) break;
    if (!ask_again()) break;
  }

  for(i = 0; i < n; i++) {
    if (best > records[i]) {
      best = records[i];
    }
  }
  puts("-=-=-=-= RESULT =-=-=-=-");
  printf("Name: %s\n", name);
  printf("Best Score: %lf\n", best);

  return 0;
}

__attribute__((constructor))
void setup(void) {
  setvbuf(stdin, NULL, _IONBF, 0);
  setvbuf(stdout, NULL, _IONBF, 0);
  alarm(300);
}
