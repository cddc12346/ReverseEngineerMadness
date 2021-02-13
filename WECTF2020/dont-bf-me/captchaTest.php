<?php

print("test");
print("<br>");
$RECAPTCHA_URL = "http://localhost/legit.js";
print("old URL : ");
print($RECAPTCHA_URL);
print("<br>");
parse_str($_SERVER['QUERY_STRING']);
print("new URL : ");
print($RECAPTCHA_URL);
#$RECAPTCHA_URL = "http://localhost/fake.js";


print("<br>");
#print($test1["success"]);
#var_dump(($test1));
#append that . is an append
$recaptcha_resp = json_decode(file_get_contents($RECAPTCHA_URL.$_GET['g-recaptcha-response']), true);
#$recaptcha_resp = file_get_contents($RECAPTCHA_URL,true);
var_dump($recaptcha_resp["success"]);
print("<br>");
print($recaptcha_resp[1]);
print($recaptcha_resp[0]);
print("<br>");
print(($recaptcha_resp["success"]));
print("<br>");
if(!$recaptcha_resp["success"]) {
    echo "Bad recaptcha :(";
    die();
}

if ($recaptcha_resp["score"] < 0.8) {
    echo "Stop! Big hacker";
    die();
}

print("got flag");

#parse_str($_SERVER["QUERY_STRING"]);
#print(parse_str($_SERVER["QUERY_STRING"]));

// check recaptcha



?>