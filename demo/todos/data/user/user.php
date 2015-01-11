<?php
    $r_username = $_GET['username'];

    $data = file_get_contents('./user.txt');

    $data = trim($data);
    $users = explode("\n", $data);

    $user = null;

    for ($i=0;$i<count($users);$i++) {
        if (strlen($users[$i]) == 0) {
            continue;
        }
        $u = explode('|', $users[$i]);
        $uid = $u[0];
        $username = $u[1];
        $avatar = $u[2];

        if ($username === $r_username) {
            $user = array(
                'uid'=>$uid,
                'name'=>$username,
                'avatar'=>$avatar
            );
            break;
        }
    }

    sleep(2);

    if (!$user) {
        echo json_encode(array('status'=>0, 'error'=>'not found!'));
    } else {
        echo json_encode(array('status'=>1, 'user'=>$user));
    }
?>
