<?php
// backend.php
// This script handles loading, adding, editing, and deleting tasks stored in tasks.json

$tasksFile = __DIR__ . '/tasks.json';

function readTasks($file) {
if (!file_exists($file)) {
file_put_contents($file, json_encode(new stdClass()));
}
$json = file_get_contents($file);
return json_decode($json, true) ?: [];
}

function writeTasks($file, $tasks) {
file_put_contents($file, json_encode($tasks, JSON_PRETTY_PRINT));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'load') {
header('Content-Type: application/json');
echo json_encode(readTasks($tasksFile));
exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
$tasks = readTasks($tasksFile);
$action = $_POST['action'] ?? '';
$date = $_POST['date'] ?? '';

if ($action === 'add') {
$task = trim($_POST['task']);
if ($task !== '') {
if (!isset($tasks[$date])) $tasks[$date] = [];
$tasks[$date][] = $task;
}
}
if ($action === 'edit') {
$task = trim($_POST['task']);
$index = intval($_POST['index']);
if (isset($tasks[$date][$index])) {
$tasks[$date][$index] = $task;
}
}
if ($action === 'delete') {
$index = intval($_POST['index']);
if (isset($tasks[$date][$index])) {
array_splice($tasks[$date], $index, 1);
if (empty($tasks[$date])) unset($tasks[$date]);
}
}
writeTasks($tasksFile, $tasks);
header('Content-Type: application/json');
echo json_encode(['status'=>'success']);
exit;
}
?>