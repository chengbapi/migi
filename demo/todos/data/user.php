<?php
    $r_username = $_GET['username'];

    $data = file_get_contents('./user.txt');

    $users = explode("\n", $data);

    $user = null;

    for ($i=0;$i<count($users);$i++) {
        if (strlen($users[$i]) == 0) {
            continue;
        }
        $u = explode('|', $users[$i]);
        $username = $u[0];
        $avatar = $u[1];

        if ($username === $r_username) {
            $user = array(
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
