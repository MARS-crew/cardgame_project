<!--점수 저장 api-->

<?php

header("Content-Type: application/json");

require_once 'firebase.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    //요청에서 JSON데이터 받아옴 
    $inputData = json_decode(file_get_contents('php://input'),true);

    if (isset($inputData['user_id']) && isset($inputData['score'])) {
        $userId = $inputData['user_id'];
        $score = $inputData['score'];

        try {
            $db = getFirebaseFirestore();
            $dbsave = $db->collection('scores')->add([
                'user_id' => $userId,
                'score' => $score,
                'created_at' => new \DateTime()
            ]);

            echo json_encode(["message" => "Score saved successfully.", "id" => $dbsave->id()]);
        } catch (Exception $e) {
            echo json_encode(["message" => "Failed to save score.", "error" => $e->getMessage()]);
        }
        } else {
            echo json_encode(["message" => "Invalid input."]);
        }
    } else {
        echo json_encode(["message" => "Invalid request method."]);
    }
?>


<!--
JSON 형식의 데이터를 php://input을 통해 받아와 user_id와 score를 추출합니다.
Firestore에서 scores 컬렉션에 user_id, score, created_at을 포함하는 새로운 문서를 추가합니다.
Firestore의 add 메서드는 문서를 자동으로 생성하고 문서의 ID를 반환합니다.
-->