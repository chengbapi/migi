<?php
    $title = $_POST['title'];
    $content = $_POST['content'];

    file_put_contents('./articles/'.$title, $content);

    echo json_encode(
        array(
            'status'=>1,
            'title'=>$title,
            'content'=>$content
        )
    );
?>
