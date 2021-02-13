<?php 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

print('testing');

#strlen is ineffective when supply a parameter that is an array!
$length = strlen($a=$_GET['cmd']);
var_dump($length);
if ($length > 10){
	print('caught');	
}

/* 
#checks to prevent this things from happening

print(gettype($a));
if (gettype($a) !== string){
	print('caught');
}
*/

#preg_match is ineffective when supply a parameter that is an array!
if (preg_match('/[a-z0-9`]/i',$a)){
	print('caught');
}

#$b = "system('ls');";
#print(eval(print_r($b,1)));
#$a = "system('ls');";
print("Output from print_r statement: <br>");

print(print_r($a,1));
print(eval(print_r($a,1)));
#print(eval(print_r($a,1)));

/*
#supplying this command will give command execution
cmd[$a]=1)?> <?php print `whoami` ?>
*/

?>