Files in this repo:

1) Random Notes: contains my untidy analysis of what the program is doing

2) Script without server: need to specify cookie that is leaked

3) Script with server: does everything 

I have both version because initially my server code kept breaking. It was slow to debug as it takes time for the listener port / thread to die.

How to use:

Scripts are written in python 3.

1) Modify the script with your IP address and blog IP address.

2) Start netcat listener on port 443

3) Run the python script that contains the server server, make sure the libraries are installed. 

Script will send a XSS comment, and start listening on port 80. 

Once received a call back that leak the admin cookie, use it to authenticate to admin panel and execute the sql injection. 
The injection writes a php shell to /css/shell.php and then execute netcat payload.



