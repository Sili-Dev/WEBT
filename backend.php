<?php
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$db = "bugs_db";
$user = "root";
$pass = "";

function validate($condition, $message, $code) {
    if (!$condition) {
        echo json_encode(['message' => $message]);
        http_response_code($code);
        exit;
    }
}

function validateRequest($request) {
    validate($request != null, 'Valid JSON syntax required', 400);

    validate(isset($request['description']), 'Property "description" is required', 400);
    validate(isset($request['severity']), 'Property "severity" is required', 400);
    validate($request['severity'] >= 1 && $request['severity'] <= 5, 'Property "severity" must be inside range [1,5]', 400);
    validate(isset($request['date']), 'Property "date" is required', 400);
}

$conn = mysqli_connect($host, $user, $pass, $db);
validate($conn, 'Database connection failed', 500);

// Handle requests
$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

if ($action === "addBug" && $_SERVER['REQUEST_METHOD'] === "POST") {
    validateRequest($data);
    $description = $data['description'] ?? '';
    $severity = $data['severity'] ?? '';
    $date = $data['date'] ?? '';
    $username = $_COOKIE["username"];

    $stmt = $conn->prepare("INSERT INTO bugs (description, severity, date, username) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siss", $description, $severity, $date, $username);
    if ($stmt->execute()) {
        echo json_encode(["message" => 'Bug added successfully']);
    } else {
        echo json_encode(["message" => 'An unexpected error occurred']);
        http_response_code(500);
    }
} elseif ($action === "getBugs" && $_SERVER['REQUEST_METHOD'] === "GET") {
    $result = $conn->query("SELECT id, description, severity, date, username FROM bugs WHERE username = '" . $_COOKIE["username"] . "'");
    $bugs = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($bugs);
} else {
    echo json_encode(['message' => 'Invalid action']);
    http_response_code(404);
}

mysqli_close($conn);
