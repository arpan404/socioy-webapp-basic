<?php
include("../../includes/db.inc.php");

$rawData = file_get_contents("php://input");
if ($rawData && isset($_COOKIE["token"])) {
    $boundary = substr($rawData, 0, strpos($rawData, "\r\n"));
    $parts = array_slice(explode($boundary, $rawData), 1);
    $data = array();

    foreach ($parts as $part) {
        if ($part == "--\r\n") break;
        $part = ltrim($part, "\r\n");
        list($raw_headers, $body) = explode("\r\n\r\n", $part, 2);
        $headers = array();
        foreach (explode("\r\n", $raw_headers) as $header) {
            list($name, $value) = explode(':', $header);
            $headers[strtolower($name)] = ltrim($value, ' ');
        }
        if (isset($headers['content-disposition'])) {
            $filename = null;
            preg_match(
                '/^(.+); *name="([^"]+)"(; *filename="([^"]+)")?/',
                $headers['content-disposition'],
                $matches
            );
            list(, $type, $name) = $matches;
            if (isset($matches[4])) {
                $filename = $matches[4];
                $data[$name] = array(
                    'contents' => $body,
                    'filename' => $filename,
                    'headers' => $headers,
                );
            } else {
                $data[$name] = $body;
            }
        }
    }

    $isPrivate = str_replace("\r\n", "", $data['isPrivate']);
    $caption = trim($data['caption']);
    $key = str_replace("\r\n", "", $data['key']);
    if (isset($_COOKIE["token"])) {
        $cookie_token = $_COOKIE["token"];
        $ciphering = "AES-256-CTR";
        $iv_length = openssl_cipher_iv_length($ciphering);
        $options = 0;

        $decryption_iv = '@!3$vc3!5#123321';
        $decryption_key = "Cbk*n7cacnXM1F7c9i@W";
        $decrypted_token = openssl_decrypt(
            $cookie_token,
            $ciphering,
            $decryption_key,
            $options,
            $decryption_iv
        );
        $userUID = explode("-&&&&&+", $decrypted_token)[0];
        $userPassword = explode("-&&&&&+", $decrypted_token)[1];

        $check_user = $conn->query("SELECT * FROM loginInfo WHERE password = '$userPassword' AND userUID = '$userUID'");
        if ($check_user->num_rows === 0) {
            echo json_encode(array("status" => "access denied"));
            die();
        } else {
            $userdetails = $check_user->fetch_assoc();
            $momentImage = $data['momentImage'];
            $imageName = $momentImage['filename'];
            $imageTmpName = $momentImage['contents'];
            $imageSize = strlen($imageTmpName);
            $imageError = 0;
            $imageType = $momentImage['headers']['content-type'];
            $file_ext = (explode('.', $imageName));
            $file_ext = strtolower(end($file_ext));
            $allowed_extensions = array("jpeg", "jpg", "png", "gif", "webmp", "svg");
            if (in_array($file_ext, $allowed_extensions) === false) {
                echo json_encode((array("status" => "failed", "message" => "extension not allowed", "key" => $key)));
                die();
            }
            if ($imageSize > 20971520) {
                echo json_encode((array("status" => "failed", "message" => "image is too large", "key" => $key)));
                die();
            }
            $new_image_name = "socioy-moment" . uniqid() . uniqid() . uniqid() . uniqid() . uniqid() . "." . $file_ext;
            if (file_put_contents("../../cdn/" . $new_image_name, $imageTmpName)) {
                $stmt = $conn->prepare("INSERT INTO momentData(imageName, caption, postBy, postedOn, isPrivate) VALUES (?,?,?,?,?)");
                $time = time();
                $stmt->bind_param("sssis", $new_image_name, $caption, $userdetails['userUID'], $time, $isPrivate);
                $stmt->execute();
                echo json_encode((array("status" => "success", "message" => "image upload success", "key" => $key, "data" => array("imageName" => $new_image_name, "uploadedAt" => $time))));
                die();
            } else {
                echo json_encode((array("status" => "failed", "message" => "image upload failed", "key" => $key)));
                die();
            }
        }
    } else {
        echo json_encode(array("status" => "access denied"));
        die();
    }

} else {
    echo json_encode(array("status" => "access denied"));
    die();
}
