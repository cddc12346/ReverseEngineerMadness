import itertools
import string
import array
import codecs

keyspace = string.digits + string.ascii_lowercase


T=lambda A,B,C,D,E,F,G,H,I:A*E*I+B*F*G+C*D*H-G*E*C-H*F*A-I*D*B&255

def U(K):
    R=pow(T(*K),-1,256)
    A,B,C,D,E,F,G,H,I=K
    return [R*V%256 for V in
     [E*I-F*H,C*H-B*I,B*F-C*E,F*G-D*I,A*I-C*G,C*D-A*F,D*H-E*G,B*G-A*H,A*E-B*D]]
def C(K,M):
    B=lambda A,B,C,D,E,F,G,H,I,X,Y,Z:bytes((A*X+B*Y+C*Z&0xFF,
        D*X+E*Y+F*Z&0xFF,G*X+H*Y+I*Z&0xFF))
    N=len(M)
    R=N%3
    R=R and 3-R
    M=M+R*B'\0'
    return B''.join(B(*K,*W) for W in zip(*[iter(M)]*3)).rstrip(B'\0')

def all_casings(input_string):
    if not input_string:
        yield ""
    else:
        first = input_string[:1]
        if first.lower() == first.upper():
            for sub_casing in all_casings(input_string[1:]):
                yield first + sub_casing
        else:
            for sub_casing in all_casings(input_string[1:]):
                yield first.lower() + sub_casing
                yield first.upper() + sub_casing

# (or `itertools.product(keyspace, repeat=5)`)

print('Finding letter S')

result1Array = []

for combination in itertools.product(*[keyspace] * 3):  
    key = ''.join(combination)
    for key in (list(all_casings(key))):
    	K = bytes(key, 'utf-8')
    	result = (K[0]*0x25) + (K[1]*0x9F) + (K[2]*0x8D)
    	str_result = ((hex(result))[-2::])
    	#print(str_result)
    	if (str_result == '53'):
    		result = (K[0]*0x01) + (K[1]*0x4A) + (K[2]*0x44)
    		str_result = ((hex(result))[-2::])
    		if (str_result == '43'):
    			result = (K[0]*0xC2) + (K[1]*0xBE) + (K[2]*0x8F)
    			str_result = ((hex(result))[-2::])
    			if (str_result == '52'):
    				result1Array.append(key)
    	#print('found')



print('----------------------------------------')
for element in result1Array:
	print(element)
    	
print('****************************************')

print('Finding letter P')
result2Array = []
for combination in itertools.product(*[keyspace] * 3):  
    key = ''.join(combination)
    for key in (list(all_casings(key))):
    #key = '1a2'
    #key = '1a2b3c4d5'
    #print(key)
    	K = bytes(key, 'utf-8')
    	result = (K[0]*0x25) + (K[1]*0x9F) + (K[2]*0x8D)
    	str_result = ((hex(result))[-2::])
    #print(str_result)
    	if (str_result == '50'):
    		result = (K[0]*0x01) + (K[1]*0x4A) + (K[2]*0x44)
    		str_result = ((hex(result))[-2::])
    		if (str_result == '45'):
    			result = (K[0]*0xC2) + (K[1]*0xBE) + (K[2]*0x8F)
    			str_result = ((hex(result))[-2::])
    			if (str_result == '4d'):
    				result2Array.append(key)
    	#print('found')

print('----------------------------------------')
for element in result2Array:
	print(element)

print('****************************************')

print('Finding letter A')

result3Array = []
for combination in itertools.product(*[keyspace] * 3):  
    key = ''.join(combination)
    for key in (list(all_casings(key))):
    	K = bytes(key, 'utf-8')
    	result = (K[0]*0x25) + (K[1]*0x9F) + (K[2]*0x8D)
    	str_result = ((hex(result))[-2::])
    	#print(str_result)
    	if (str_result == '41'):
    		result = (K[0]*0x01) + (K[1]*0x4A) + (K[2]*0x44)
    		str_result = ((hex(result))[-2::])
    		if (str_result == '41'):
    			result = (K[0]*0xC2) + (K[1]*0xBE) + (K[2]*0x8F)
    			str_result = ((hex(result))[-2::])
    			if (str_result == '59'):
    				result3Array.append(key)
    	#print('found')

print('----------------------------------------')
for element in result3Array:
	print(element)
    	
print('****************************************')


print('now i have all the different variations that make SPA')
print('need to find valid ones that pass the function T checks')


#append result1Array with result2Array with result3Array and check with T

for element1 in result1Array:
	for element2 in result2Array:
		for element3 in result3Array:
			full_result = element1 + element2 + element3
			#print(full_result)
			K = bytes(full_result, 'utf-8')
			#print(*K)
			#print(T(*test))
			full_result_T = T(*K)&1
			if(full_result_T == 1):
				print(full_result)
			#print(full_result_T)


