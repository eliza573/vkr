<?php
session_start();
require_once 'config.php';

// Проверка авторизации
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Кируу керек"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['user_role'] ?? 'user';

if ($role === 'admin') {
    // Администратор видит всех
    $school = $_GET['school'] ?? '';
    $class = $_GET['class'] ?? '';
    
    $sql = "SELECT u.first_name, u.last_name, u.school, u.class, er.exercise_name, er.score, er.total_questions, er.percentage, er.completed_at 
            FROM exercise_results er 
            JOIN users u ON er.user_id = u.id 
            WHERE 1=1";
    $params = [];
    
    if (!empty($school)) {
        $sql .= " AND u.school = ?";
        $params[] = $school;
    }
    if (!empty($class)) {
        $sql .= " AND u.class = ?";
        $params[] = $class;
    }
    $sql .= " ORDER BY er.completed_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
} else {
    // Обычный пользователь видит только свои результаты
    $stmt = $pdo->prepare("SELECT exercise_name, score, total_questions, percentage, completed_at FROM exercise_results WHERE user_id = ? ORDER BY completed_at DESC");
    $stmt->execute([$user_id]);
}

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "results" => $results]);
?>