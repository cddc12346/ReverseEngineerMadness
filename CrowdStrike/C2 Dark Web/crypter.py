#!/usr/bin/env python3
# -*- coding: utf-8 -*-
'''              ,
                /|      ,
   ,--.________/ /-----/|-------------------------------------.._
  (    /_/_/_/_  |--------- DEATH TO ALL TABS ---------------<  _`>
   `--´        \ \-----\|-------------------------------------''´
                \|      '
'''#             '
assert __name__ == '__main__'
import sys
def die(E):
    print(F'E:',E,file=sys.stderr)
    sys.exit(1)
T=lambda A,B,C,D,E,F,G,H,I:A*E*I+B*F*G+C*D*H-G*E*C-H*F*A-I*D*B&255
print(T)
def U(K):
    R=pow(T(*K),-1,256)
    A,B,C,D,E,F,G,H,I=K
    return [R*V%256 for V in
     [E*I-F*H,C*H-B*I,B*F-C*E,F*G-D*I,A*I-C*G,C*D-A*F,D*H-E*G,B*G-A*H,A*E-B*D]]
def C(K,M):
    B=lambda A,B,C,D,E,F,G,H,I,X,Y,Z:bytes((A*X+B*Y+C*Z&0xFF,
        D*X+E*Y+F*Z&0xFF,G*X+H*Y+I*Z&0xFF))

    #print(" In function C: ")
    #print(B)
    N=len(M)
    #print(N)
    R=N%3
    #print(R)
    R=R and 3-R
    M=M+R*B'\0'
    #print(M)
    return B''.join(B(*K,*W) for W in zip(*[iter(M)]*3)).rstrip(B'\0')

len(sys.argv) == 3 or die('FOOL')
K=bytes(sys.argv[2], 'ascii')
#print('check K')
#print(K)
#print(*K)
#print(T(*K))
#print("T(*K)&1 = ", T(*K)&1  )
#print("length K = " , len(K))

len(K)==9 and T(*K)&1 or die('INVALID')
M=sys.stdin.readline()
if sys.argv[1].upper() == 'E':
    #print("i am here 1");
    M=B'SPACEARMY'+bytes(M,'ascii')
    #print(C(U(K),M).hex().upper())
else:
    #print("i am here 2")
    #print(bytes.fromhex(M))
    #print("i am here 3")
    M=C(K,bytes.fromhex(M))
    M[:9]==B'SPACEARMY' or die('INVALID')
    print(M[9:])
    #print(M[9:].decode('ascii'))
