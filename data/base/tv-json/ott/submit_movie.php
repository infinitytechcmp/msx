<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $movieName = $_POST['movieName'];
    $moviePosterUrl = $_POST['moviePoster'];
    $movieVideoUrl = $_POST['movieVideo'];

    // Validate input
    if (empty($movieName) || empty($moviePosterUrl) || empty($movieVideoUrl)) {
        echo json_encode(['error' => 'All fields are required']);
        exit;
    }

    // Save the image
    $imageContent = file_get_contents($moviePosterUrl);
    if ($imageContent === FALSE) {
        echo json_encode(['error' => 'Failed to fetch the image']);
        exit;
    }
    $imageName = basename($moviePosterUrl);
    $imagePath = 'movies/' . $imageName;
    file_put_contents($imagePath, $imageContent);

    // Create JSON object
    $jsonObject = [
        "type" => "teaser",
        "color" => "msx-white",
        "image" => $_SERVER['HTTP_HOST'] . '/' . $imagePath,
        "imageFiller" => "height-center",
        "action" => "video:" . $movieVideoUrl
    ];

    // Output JSON object
    echo json_encode($jsonObject);
}
?>
