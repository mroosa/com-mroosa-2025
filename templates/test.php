<?php
$message = (isset($_POST['message'])) ? $_POST['message']: "";
$sender = (isset($_POST['email'])) ? $_POST['email']: "";
$name = (isset($_POST['name'])) ? $_POST['name']: "";

echo $message, $sender, $name;