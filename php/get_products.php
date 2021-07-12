<?php 
include 'connection.php';

$sql = "SELECT * FROM products";
$products = $conn->query($sql);

if ($products->rowCount() > 0){
	$message = [
		'success' => true,
		'data' => $products->fetchAll(\PDO::FETCH_ASSOC)
	];
} else {
	$message = [
		'success' => false,
		'message' => 'No products yet.'
	];
}

header('Content-Type: application/json');
echo json_encode($message);
?>