<?php

/*
Start apache server: 'systemctl start apache2'

1) browse to http://localhost/ParseStrTest.php
both should be printing the string abc

2) browse to http://localhost/ParseStrTest.php?data=define
the second print statement will now be modified to print def
 
*/
$data = "abc";
print($data);
print("<br>");
parse_str($_SERVER['QUERY_STRING']);
print($data);

?>
