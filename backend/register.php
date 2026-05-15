<?php
require_once 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$first_name = $data['first_name'] ?? '';
$last_name = $data['last_name'] ?? '';
$school = $data['school'] ?? '';
$class = $data['class'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($first_name) || empty($last_name) || empty($school) || empty($class) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Бардык талааларды толтуруңуз"]);
    exit();
}

// Проверка email
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "Бул электрондук почта буга катталган"]);
    exit();
}

// Добавление школы
$stmt = $pdo->prepare("SELECT id FROM schools WHERE name = ?");
$stmt->execute([$school]);
if ($stmt->rowCount() == 0) {
    $stmt = $pdo->prepare("INSERT INTO schools (name) VALUES (?)");
    $stmt->execute([$school]);
    $school_id = $pdo->lastInsertId();
} else {
    $school_id = $stmt->fetch(PDO::FETCH_ASSOC)['id'];
}

// Добавление класса
$stmt = $pdo->prepare("SELECT id FROM classes WHERE school_id = ? AND class_name = ?");
$stmt->execute([$school_id, $class]);
if ($stmt->rowCount() == 0) {
    $stmt = $pdo->prepare("INSERT INTO classes (school_id, class_name) VALUES (?, ?)");
    $stmt->execute([$school_id, $class]);
}

// Хеширование пароля
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Создание пользователя
$stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, school, class, email, password) VALUES (?, ?, ?, ?, ?, ?)");
$result = $stmt->execute([$first_name, $last_name, $school, $class, $email, $hashed_password]);

if ($result) {
    echo json_encode(["success" => true, "message" => "Каттоо ийгиликтүү аяктады!"]);
} else {
    echo json_encode(["success" => false, "message" => "Каттоодо ката кетти"]);
}
?>