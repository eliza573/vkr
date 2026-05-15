<?php
session_start();
require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

// Проверка авторизации
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Кируу керек"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$exercise_name = $data['exercise_name'] ?? '';
$score = $data['score'] ?? 0;
$total_questions = $data['total_questions'] ?? 0;
$percentage = ($total_questions > 0) ? ($score / $total_questions) * 100 : 0;

if (empty($exercise_name)) {
    echo json_encode(["success" => false, "message" => "Упражнениенин аты керек"]);
    exit();
}

$stmt = $pdo->prepare("INSERT INTO exercise_results (user_id, exercise_name, score, total_questions, percentage) VALUES (?, ?, ?, ?, ?)");
$result = $stmt->execute([$user_id, $exercise_name, $score, $total_questions, $percentage]);

if ($result) {
    echo json_encode(["success" => true, "message" => "Натыйжа сакталды"]);
} else {
    echo json_encode(["success" => false, "message" => "Сактоодо ката кетти"]);
}
?>