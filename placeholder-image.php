<?php
// Generate realistic placeholder images for items
header('Content-Type: image/png');

$category = isset($_GET['category']) ? sanitize($_GET['category']) : 'tools';
$width = isset($_GET['w']) ? (int)$_GET['w'] : 300;
$height = isset($_GET['h']) ? (int)$_GET['h'] : 200;
$text = isset($_GET['text']) ? substr($_GET['text'], 0, 50) : 'Item Photo';

function sanitize($input) {
    return preg_replace('/[^a-zA-Z0-9_-]/', '', $input);
}

// Create image
$image = imagecreatetruecolor($width, $height);

// Define colors for different categories
$colors = [
    'electronics' => ['bg' => [52, 152, 219], 'accent' => [41, 128, 185]],
    'furniture' => ['bg' => [155, 89, 182], 'accent' => [142, 68, 173]],
    'tools' => ['bg' => [230, 126, 34], 'accent' => [211, 84, 0]],
    'books' => ['bg' => [52, 73, 94], 'accent' => [44, 62, 80]],
    'sports' => ['bg' => [46, 204, 113], 'accent' => [39, 174, 96]],
    'other' => ['bg' => [149, 165, 166], 'accent' => [127, 140, 141]],
];

$color = isset($colors[$category]) ? $colors[$category] : $colors['other'];

// Fill background with gradient-like effect
imagefilledrectangle($image, 0, 0, $width, $height, imagecolorallocate($image, $color['bg'][0], $color['bg'][1], $color['bg'][2]));

// Add accent stripe
$stripe_height = floor($height / 3);
imagefilledrectangle($image, 0, $stripe_height, $width, $stripe_height * 2, imagecolorallocate($image, $color['accent'][0], $color['accent'][1], $color['accent'][2]));

// Add icon/symbol based on category
$white = imagecolorallocate($image, 255, 255, 255);
$font = 5;

// Add category-specific icon patterns
switch($category) {
    case 'electronics':
        // Draw a phone-like shape
        imagefilledrectangle($image, floor($width/3), floor($height/3), floor($width*2/3), floor($height*2/3), $white);
        break;
    case 'furniture':
        // Draw a chair-like shape
        imagefilledrectangle($image, floor($width/3), floor($height/3), floor($width*2/3), floor($height*2/3), $white);
        imagefilledrectangle($image, floor($width/3), floor($height/2), floor($width/2.5), floor($height*2/3), imagecolorallocate($image, 200, 200, 200));
        break;
    case 'tools':
        // Draw a wrench
        imagearc($image, floor($width/2), floor($height/2), 60, 60, 0, 360, $white);
        imageline($image, floor($width/2), floor($height/3), floor($width/2+30), floor($height/3+30), $white);
        break;
    case 'books':
        // Draw stacked books
        imagefilledrectangle($image, floor($width/4), floor($height/2+20), floor($width*3/4), floor($height/2+40), $white);
        imagefilledrectangle($image, floor($width/4), floor($height/2), floor($width*3/4), floor($height/2+15), imagecolorallocate($image, 200, 200, 200));
        imagefilledrectangle($image, floor($width/4), floor($height/2-20), floor($width*3/4), floor($height/2), imagecolorallocate($image, 220, 220, 220));
        break;
    case 'sports':
        // Draw a ball
        imagearc($image, floor($width/2), floor($height/2), 50, 50, 0, 360, $white);
        imagearc($image, floor($width/2), floor($height/2), 48, 48, 0, 360, $white);
        break;
}

// Add text
$text_color = imagecolorallocate($image, 255, 255, 255);
$text_x = floor($width / 2) - strlen($text) * 2;
$text_y = $height - 30;
imagestring($image, $font, $text_x > 0 ? $text_x : 5, $text_y, $text, $text_color);

// Add category label
$category_label = ucfirst($category);
imagestring($image, 3, 10, 10, $category_label, $text_color);

imagepng($image);
imagedestroy($image);
?>
