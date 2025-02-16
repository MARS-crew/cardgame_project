<?php

header('Content-Type: application/json');

//firebase URL -> firebase에서 전체 데이터 조회
$firebase_url = 'https://match--the-card-default-rtdb.firebaseio.com/';

//firebase에서 특정 데이터 조회
$firebase_single_url = 'https://match--the-card-default-rtdb.firebaseio.com/scores/';

//cURL 함수로 firebase에 요청 보내는 함수
function send($url, $data, $method = 'POST') {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    if ($method == 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method == 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}

//데이터 추가
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //post 데이터 받기
    $id = isset($_POST['id']) ? $_POST['id'] : null;
    $score = isset($_POST['score']) ? $_POST['score'] : null;

    if ($id && $score) {
        $data = array(
            'id' => $id,
            'score' => $score
        );
        
        //firebase에 데이터 저장(POST 방식)
        $response = send($firebase_url, $data, 'POST');

        if($response) {
            echo json_encode(["status" => "success", "message" => "데이터 저장완료"]);
        } else {
            echo json_encode(["status" => "error", "message" => "데이터 저장 실패"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "아이디와 점수 중 하나 빠짐"]);
    }
}

//GET : 데이터 조회( 전체 or 특정 데이터 )

elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    //url에서 id 가져오기
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    if ($id) {
        //특정 데이터 조회 (GET 방식)
        $url = $firebase_single_url . $id . '.json';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        if ($response) {
            echo json_encode(["status" => "success", "data" => json_decode($response)]);
        } else {
            echo json_encode(["status" => "error", "message" => "데이터 조회 실패"]);
        }
    } else {
        //전체 데이터 조회

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $firebase_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        if ($response) {
            echo json_encode(["status" => "success", "data" => json_decode($response)]);
        } else {
            echo json_encode(["status" => "error", "message" => "데이터 조회 실패"]);
        }
    }
}

//PUT : 데이터 수정(기존 데이터)
elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    //PUT 데이터 받기 위해 JSON 형식으로 받기(경로?는 이게 맞는건지 모르겠음)
    $inputData = json_decode(file_get_contents("php://input"), true);
    $id = isset($inputData['id']) ? $inputData['id'] : null;
    $score = isset($inputData['score']) ? $inputData['score'] : null;

    if ($id && $score) {
        //수정할 데이터 배열
        $data = array (
            'id' => $id,
            'score' => $score
        );

        //특정 id의 데이터 수정(put 방식)
        $url = $firebase_url . $id . '.json';
        $response = send($url, $data, 'PUT');

        if ($response) {
            echo json_encode(["status" => "success", "message" => "데이터 수정완료"]);
        } else {
            echo json_encode(["status" => "error", "message" => "데이터 수정실패"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "아이디 or 점수 누락"]);
    }
}

else {
    echo json_encode(["status" => "error", "message" => "지원하지 않는 요청 방식"]);
}