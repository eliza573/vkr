<?php
require_once 'config.php';

$school = $_GET['school'] ?? '';
$class = $_GET['class'] ?? '';

$sql = "SELECT id, first_name, last_name, school, class, email, created_at FROM users WHERE 1=1";
$params = [];

if (!empty($school)) {
    $sql .= " AND school = ?";
    $params[] = $school;
}

if (!empty($class)) {
    $sql .= " AND class = ?";
    $params[] = $class;
}

$sql .= " ORDER BY school, class, last_name";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "users" => $users]);
?>