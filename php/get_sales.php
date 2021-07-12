<?php 
include 'connection.php';

$sql = "SELECT sales.*, products.product_name FROM sales LEFT JOIN products ON products.id = sales.product_id";
$products = $conn->query($sql);

if ($products->rowCount() > 0){
	$message = [
		'success' => true,
		'data' => $products->fetchAll(\PDO::FETCH_ASSOC)
	];
} else {
	$message = [
		'success' => false,
		'message' => 'No sales yet.'
	];
}

header('Content-Type: application/json');
echo json_encode($message);
?>