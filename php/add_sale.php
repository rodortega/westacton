<?php 
include 'connection.php';

if (empty($_POST['order'])) {
	$message = [
		'success' => false,
		'message' => 'No order selected.'
	];

	header('Content-Type: application/json');
	echo json_encode($message);
	exit();
}

$order = json_decode($_POST['order']);

$transaction_sql = $conn->prepare("INSERT INTO transactions() VALUES ()");
$transaction = $transaction_sql->execute();
$transaction_id = $conn->lastInsertId();

foreach ($order as $key => $value) {

	$products_sql = $conn->prepare("SELECT * FROM products WHERE id = ?");
	$products_sql->execute([$key]);
	$product = $products_sql->fetch();

	if ($product['stock'] < $value) {
		$message = [
			'success' => false,
			'message' => 'Order is greater than the stock available.'
		];

		header('Content-Type: application/json');
		echo json_encode($message);
		exit();
	}

	$sales_sql = $conn->prepare("INSERT INTO sales(transaction_id, product_id, quantity, price) VALUES(?,?,?,?);");
	$sales_sql->execute([$transaction_id, $product['id'], $value, $product['price']]);

	$stock_sql = $conn->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
	$stock_sql->execute([$value, $product['id']]);
}

$message = [
	'success' => true
];

header('Content-Type: application/json');
echo json_encode($message);
exit();
?>