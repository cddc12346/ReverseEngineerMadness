stringArray = ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '|', '+', '-', '*', '/', '(', ')', '.', '~', '^', '&', "'");
f = open("demofile2.txt", "w")


#stringArray = ('0', '1', '2')
for char in stringArray:
	hex_char = char.encode("utf-8").hex()
	#print("Outer loop: ")
	#print(hex_char)
	for char2 in stringArray:
		hex_char2 = char2.encode("utf-8").hex()
		#print("Inner Loop: ")
		#print(chr(int(hex_char,16)) + " xor " + chr(int(hex_char2,16)))
		#xor_result = int(hex_char, 16) & int(hex_char2, 16)
		xor_result = int(hex_char, 16) ^ int(hex_char2, 16)
		#print("Result of xor: ", chr(xor_result))
		#print("")
		for char3 in stringArray:
			hex_char3 = char3.encode("utf-8").hex()
			xor_result1 = xor_result ^ int(hex_char3,16)
			f.write(chr(int(hex_char,16)) + " " + chr(int(hex_char2,16)) + " " + chr(int(hex_char3,16)) + "\n")
			print(chr(int(hex_char,16)) + " xor " + chr(int(hex_char2,16)) + " xor " + chr(int(hex_char3,16)))
			print(xor_result1);
			f.write("Result of xor: " + chr(xor_result1) + "\n")



f.close()