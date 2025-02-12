<?php

require __DIR__ . '/../vendor/autoload.php'; // Composer로 설치한 라이브러리를 불러옴

use Kreait\Firebase\Factory; // Firebase Factory 클래스를 불러옴


function getFirebaseFirestore() {
$factory = (new Factory) // Firebase Factory 인스턴스 생성 (Firebase 프로젝트 설정)
    ->withServiceAccount(__DIR__ . '/../match.the.game.json') // 서비스 계정 키 파일 경로
    ->withDatabaseUri('https://match--the-card-default-rtdb.firebaseio.com/'); // Realtime Database URL

    $realtimeDatabase = $factory->createDatabase(); // Realtime Database 인스턴스 생성

    return $firebase->database(); //Firestore 데이터베이스 인스턴스 반환

}


// $requestUri = $_SERVER['REQUEST_URI']; // 요청 URI
// $parsedUrl = parse_url($requestUri); // 요청 URI를 파싱 (쿼리 스트링을 제외한 경로만 추출)
// $path = $parsedUrl['path']; // 경로만 추출
// $method = $_SERVER['REQUEST_METHOD'];

// switch ($requestUri) {
//     case '/api/users':
//         $controller = new UserController($realtimeDatabase);
//         switch ($method) {
//             case 'GET': 0
//                 $response = $controller->getUsers();
//                 break;
//             case 'POST':
//                 $response = $controller->createUser();
//                 break;
//             case 'PUT':
//                 $response = $controller->updateUser();
//             default:
//                 $response = notFoundResponse();
//                 break;
//         }
//         break;

//     default:
//         $response = notFoundResponse();
//         break;
// }

// echo json_encode($response);

// function notFoundResponse() {
//     http_response_code(404);
//     return ['status' => 404, 'message' => 'Not Found'];
// }


// if ($path == '/') {
//     echo "Hello, world!";
// } elseif ($path == '/about') {
//     echo "This is the about page.";
// } elseif ($path == '/save-score') {
//     // 사용자 ID와 점수를 받아서 저장
//     $userId = $_GET['user_id'] ?? 'unknown';
//     $score = $_GET['score'] ?? 0;

//     $realtimeDatabase->getReference('rankings/' . $userId)->set([
//         'user_id' => $userId,
//         'score' => (int)$score
//     ]);

//     echo "Score saved.";
// } elseif ($path == '/get-rankings') {
//     $rankings = $realtimeDatabase->getReference('rankings');

//     $rankings = $rankings->getValue();



//     echo json_encode($rankings);
// } else {
//     http_response_code(404);
//     echo "Page not found.";
// }
