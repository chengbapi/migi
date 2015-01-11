<?php
    $title = $_GET['title'];

    $content = file_get_contents('./articles/'.$title);

    sleep(2);

    echo json_encode(
        array(
            'status'=>1,
            'title'=>$title,
            'content'=>$content
        )
    );
?>
