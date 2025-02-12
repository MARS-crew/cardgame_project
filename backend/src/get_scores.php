<!--get_scores.php-->

<?php

header("Content-Type: application/json");

require_once 'firebase.php';
$method = $_SERVER['REQUEST_METHOD'];

if($method == 'GET') {
    try {
        $db = getFirebaseFirestore();
        $scoreCollection = $db-> collection('scores');
        $snapshot = $scoreCollection->documents();

        $scores = [];
        foreach ($snapshot as $document) {
            $scores[] = $document->data();
        }
        
        echo json_encode($scores);
    } catch (Exception $e) {
        echo json_encode(["message" => "Failed to retrieve scores.", "error" => $e-> getMessage()]);
    } 
}   else {
        echo json_encode(["message" => "Invalid request method."]);
}
?>

<!--
Firestore의 scores 컬렉션에서 모든 문서를 가져와서 각 문서의 데이터를 배열로 수집합니다.
documents() 메서드를 사용하여 Firestore에서 문서를 읽고, 각 문서의 data() 메서드를 사용하여 데이터를 추출합니다.
-->