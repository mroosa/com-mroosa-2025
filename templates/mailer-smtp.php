<?php

//Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__. '/../../');
$dotenv->load();


$message = (isset($_POST['message'])) ? $_POST['message']: "";
$sender = (isset($_POST['email'])) ? $_POST['email']: "";
$name = (isset($_POST['name'])) ? $_POST['name']: "";

if ($sender !== "") {
    $htmlMessage = $message . "<br><br> - " . $name . "<br>" . $sender;
}

//Create a new PHPMailer instance
$mail = new PHPMailer();

//Tell PHPMailer to use SMTP
$mail->isSMTP();

//Enable SMTP debugging
//SMTP::DEBUG_OFF = off (for production use)
//SMTP::DEBUG_CLIENT = client messages
//SMTP::DEBUG_SERVER = client and server messages
$mail->SMTPDebug = SMTP::DEBUG_SERVER;

//Set the hostname of the mail server
$mail->Host = 'smtp.gmail.com';
//Use `$mail->Host = gethostbyname('smtp.gmail.com');`
//if your network does not support SMTP over IPv6,
//though this may cause issues with TLS

//Set the SMTP port number:
// - 465 for SMTP with implicit TLS, a.k.a. RFC8314 SMTPS or
// - 587 for SMTP+STARTTLS
$mail->Port = 465;

//Set the encryption mechanism to use:
// - SMTPS (implicit TLS on port 465) or
// - STARTTLS (explicit TLS on port 587)
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;

//Whether to use SMTP authentication
$mail->SMTPAuth = true;

//Username to use for SMTP authentication - use full email address for gmail
$mail->Username = $_ENV['GUSER'];

//Password to use for SMTP authentication
$mail->Password = $_ENV['GKEY'];

//Set who the message is to be sent from
//Note that with gmail you can only use your account address (same as `Username`)
//or predefined aliases that you have configured within your account.
//Do not use user-submitted addresses in here
$mail->setFrom($_ENV['GUSER'], 'Matthew Roosa');

//Set an alternative reply-to address
//This is a good place to put user-submitted addresses
$mail->addReplyTo($_ENV['GUSER'], 'Matthew Roosa');

//Set who the message is to be sent to
$mail->addAddress('nasman98@yahoo.com', 'Matthew Roosa');

//Set the subject line
$mail->Subject = 'Message from mroosa.com';

$mail->msgHTML($htmlMessage);

//Replace the plain text body with one created manually
$mail->AltBody = $message . " " . $sender . "  " . $name;

//send the message, check for errors
if (!$mail->send()) {
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message sent!';
}
