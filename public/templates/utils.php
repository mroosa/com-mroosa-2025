<?php
function format_vimeo_link($input) {
    // Check for vimeo URL, return only the video ID
    if (strpos($media->file, 'vimeo.com/') > -1) {
        // after finding vimeo.com, pull out the id based on position/length, then trim off trailing /
        // Not using terniary operator for clarity
        $vimeo_id = substr($media->file, strpos($media->file, 'vimeo.com/') + 10, strlen($media->file));
    } else {
        // domain is not present, assuming its just the id
        $vimeo_id = $media->file;
    }
    $vimeo_id = rtrim($vimeo_id, '/');
    // put id into an array, it would be less efficient to check for the '/' first
    $vimeo_id_ary = explode('/', $vimeo_id);
    $vimeo_url = (count($vimeo_id_ary) > 1) ? $vimeo_id_ary[0] . "?h=" . $vimeo_id_ary[1]: $vimeo_id_ary[0];

    return $vimeo_url;
}