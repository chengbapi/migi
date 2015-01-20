<?php
    $dir = './articles';
    $dh = opendir($dir);
    $result = [];
    while (($file = readdir($dh)) !== false) {
        if ($file == '.' || $file == '..') {
          continue;
        }
        array_push($result,
            array(
                'title'=>$file
            )
        );
    }
    closedir($dh);

    echo json_encode(
        array(
            'status'=>1,
            'articles'=>$result
        )
    );
?>
