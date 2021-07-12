<?php 
include 'connection.php';

$stock_sql = $conn->prepare("UPDATE products SET stock = ?, price = ? WHERE id = ?");
$stock_sql->execute([$_POST['stock'], $_POST['price'], $_POST['id']]);

$message = [
	'success' => true
];

header('Content-Type: application/json');
echo json_encode($message);
exit();
?>