<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Fetch POST Request Example</title>
  <link rel = "stylesheet" type="text/css" href="./css/common.css">
  <link rel = "stylesheet" type="text/css" href="./css/login.css">
  <script type="text/javascript" src="./js/login.js"></script>
</head>
<body>
  <h1>로그인 및 점수</h1>

  <div id = "login_box">
    <div id="login_title">
      <span>로그인</span>
    </div>
    <div id="login_form">
      <form name = "login_form" method="post" action="login.php">
        <ul>
          <li><input type="Text" name = "id" placeholder="아이디"></li>
          <li><input type="password" id="pass" name = "pass" placeholder="비밀번호"></li>
        </ul>
      <div id="login_btn"></div>
      </form>
    </div><!--login_form-->
</div><!--login_box-->
  </div>
  <script>

  </script>
</body>
</html>