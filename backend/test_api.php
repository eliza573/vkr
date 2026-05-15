<?php
header("Content-Type: application/json; charset=UTF-8");
echo json_encode([
    "success" => true,
    "message" => "API работает!",
    "endpoints" => [
        "/register.php",
        "/login.php",
        "/get_schools.php",
        "/get_users_by_school.php"
    ]
]);
?>