<?php 

$conn = mysqli_connect("localhost","francesco","some_pass","shop");

if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  exit();
}

if (preg_match('/union|and|or|on|cast|sys|inno|mid|substr|pad|space|if|case|exp|like|sound|produce|extract|xml|between|count|column|sleep|benchmark|\<|\>|\=/is' , $_GET['id'])) 
 {
	echo("caught");
	echo("<br>");       
 }


#$id = mysqli_real_escape_string($conn, $_GET["id"]);

$id = $_GET["id"];

echo ($id);
$query = "select * from flag_here_hihi where id=".$id;
echo("<br>");  
echo($query);
 $run_query = mysqli_query($conn,$query);

        if(!$run_query) {
            echo mysqli_error($conn);
        }
        else
        {    
            // I'm kidding, just the name of flag, not flag :(
            echo '<br>';
            $res = $run_query->fetch_array()[1];
            echo $res; 
        }

?>