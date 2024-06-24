<?php
// Function to get the base URL of the server
function getBaseUrl() {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    return "{$protocol}://{$host}";
}

// Path to the logos directory
$logosDir = __DIR__ . '/logos/';

// Get the 'partial_name' parameter from the query string
$partialName = isset($_GET['partial_name']) ? $_GET['partial_name'] : '';

// Validate the 'partial_name' parameter (to prevent directory traversal)
if (preg_match('/^[a-zA-Z0-9_-]+$/', $partialName)) {
    // Array to hold matched logos
    $matchedLogos = [];

    // Scan the logos directory for matching files
    $files = scandir($logosDir);
    foreach ($files as $file) {
        // Check if the file name contains the partial name
        if (stripos($file, $partialName) !== false) {
            // Construct the full path to the logo file
            $logoPath = $logosDir . $file;

            // Get the file extension
            $extension = pathinfo($logoPath, PATHINFO_EXTENSION);

            // Get the base URL of the server
            $baseUrl = getBaseUrl();

            // Build the logo URL
            $logoUrl = "https://infinitytechcmp.github.io/msx/data/base/tv-json/php-api/logos/{$file}";

            echo $logoUrl;
        }
    }

    // Check if any logos were found
    if (!empty($matchedLogos)) {
        // Set the content type header
        header('Content-Type: application/json');

        // Output the matched logos as JSON
        echo json_encode($matchedLogos);
        exit;
    } else {
        // No matching logos found
        header("HTTP/1.0 404 Not Found");
        echo "No logos found matching '{$partialName}'.";
        exit;
    }
} else {
    // Invalid 'partial_name' parameter
    header("HTTP/1.0 400 Bad Request");
    echo "Invalid request.";
    exit;
}
?>
