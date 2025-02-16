<?php

$firebase_url = 'https://match--the-card-default-rtdb.firebaseio.com/';

$id = $_POST['id'];
$score = $_POST['score'];

$data = array (
    'id' => $id,
    'score' => $score,
);

//cURL을 사용해 Firebase로 POST 요청을 보냄
$ch = curl_init();

//Firebase에 데이터를 POST 요청
curl_setopt($ch, CURLOPT_URL, $firebase_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
));

$response = curl_exec($ch);
curl_close($ch);

//결과 출력
if($response) {
    echo "데이터 저장완료";
} else {
    echo "데이터 저장실패";
}
?>