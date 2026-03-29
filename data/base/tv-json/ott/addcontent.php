<?php
$movieJSON = "";
$seriesJSON = "";

// CREATE UPLOAD FOLDER IF NOT EXISTS
if (!is_dir('uploads')) {
    mkdir('uploads', 0777, true);
}

// HANDLE MOVIES
if (isset($_POST['submit_movies'])) {
    $result = [];

    foreach ($_FILES['movie_image']['name'] as $key => $name) {

        $tmp = $_FILES['movie_image']['tmp_name'][$key];
        $fileName = time() . "_" . basename($name);
        move_uploaded_file($tmp, "movies/" . $fileName);

        $url = $_POST['movie_url'][$key];

        $result[] = [
            "type" => "teaser",
            "color" => "msx-white",
            "image" => "https://infinitytechcmp.github.io/msx/data/base/tv-json/ott/movies/" . $fileName,
            "imageFiller" => "height-center",
            "action" => "link:" . $url
        ];
    }

    $movieJSON = json_encode($result, JSON_PRETTY_PRINT);
}

// HANDLE SERIES
if (isset($_POST['submit_series'])) {
    $result = [];

    foreach ($_FILES['series_image']['name'] as $key => $name) {

        $tmp = $_FILES['series_image']['tmp_name'][$key];
        $fileName = time() . "_" . basename($name);
        move_uploaded_file($tmp, "movies/" . $fileName);

        $url = $_POST['series_url'][$key];

        $result[] = [
            "type" => "teaser",
            "color" => "msx-white",
            "image" => "https://infinitytechcmp.github.io/msx/data/base/tv-json/ott/movies/" . $fileName,
            "imageFiller" => "height-center",
            "action" => "link:" . $url
        ];
    }

    $seriesJSON = json_encode($result, JSON_PRETTY_PRINT);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Movie & Series Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    <h3 class="text-center mb-4">🎬 Movie & Series JSON Generator (PHP)</h3>

    <ul class="nav nav-tabs">
        <li class="nav-item">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#movieTab">Movies</button>
        </li>
        <li class="nav-item">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#seriesTab">Series</button>
        </li>
    </ul>

    <div class="tab-content mt-3">

        <!-- MOVIES -->
        <div class="tab-pane fade show active" id="movieTab">
            <form method="POST" enctype="multipart/form-data">
                <div id="movieContainer"></div>

                <button type="button" class="btn btn-primary mt-2" id="addMovie">+ Add Movie</button>
                <button type="submit" name="submit_movies" class="btn btn-success mt-2">Upload & Generate</button>

                <textarea class="form-control mt-3" rows="8"><?php echo $movieJSON; ?></textarea>
            </form>
        </div>

        <!-- SERIES -->
        <div class="tab-pane fade" id="seriesTab">
            <form method="POST" enctype="multipart/form-data">
                <div id="seriesContainer"></div>

                <button type="button" class="btn btn-primary mt-2" id="addSeries">+ Add Series</button>
                <button type="submit" name="submit_series" class="btn btn-success mt-2">Upload & Generate</button>

                <textarea class="form-control mt-3" rows="8"><?php echo $seriesJSON; ?></textarea>
            </form>
        </div>

    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
// ADD MOVIE
$('#addMovie').click(function () {
    $('#movieContainer').append(`
        <div class="card p-3 mt-2">
            <div class="row">
                <div class="col-md-3">
                    <input type="file" name="movie_image[]" class="form-control" required>
                </div>
                <div class="col-md-7">
                    <input type="text" name="movie_url[]" class="form-control" placeholder="Movie URL" required>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger remove">Remove</button>
                </div>
            </div>
        </div>
    `);
});

// ADD SERIES
$('#addSeries').click(function () {
    $('#seriesContainer').append(`
        <div class="card p-3 mt-2">
            <div class="row">
                <div class="col-md-3">
                    <input type="file" name="series_image[]" class="form-control" required>
                </div>
                <div class="col-md-7">
                    <input type="text" name="series_url[]" class="form-control" placeholder="Series URL" required>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger remove">Remove</button>
                </div>
            </div>
        </div>
    `);
});

// REMOVE
$(document).on('click', '.remove', function () {
    $(this).closest('.card').remove();
});
</script>

</body>
</html>