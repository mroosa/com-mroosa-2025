<?php $num_media = count($project->media); ?>

<div class="media carousel" data-slides="<?php echo $num_media ?>" role="presentation"><div class="film" role="presentation">
<?php
    foreach($project->media as $media):
?>
    <div class="frame <?php echo $media->type ?>" role="presentation">



    <?php if ($media->type == 'video'): ?>
        <?php
            # grab video properties
            $vid_ht = isset($media->height) ? $media->height : "100%";
            $vid_wd = isset($media->width) ? $media->width : "100%";
            $loop = isset($media->loop) && $media->loop == true ? " loop" : "";
            $controls = isset($media->controls) && $media->controls == true ? " controls" : "";
            $autoplay = isset($media->autoplay) && $media->autoplay == true ? " autoplay muted" : "";
            $video_opt = $loop . $controls . $autoplay;
            $frame = isset($media->frame) ? $media->frame : "default";
        ?>        
        <div class="<?php echo $frame ?>" role="presentation">
            <video width="<?php echo $vid_wd ?>" height="<?php echo $vid_ht ?>"<?php echo $video_opt ?>><source src="projects/<?php echo $project->dir ?>/<?php echo $media->file ?>"></video>
        </div>



    <?php elseif ($media->type == 'vimeo'): ?>
        <?php
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

            $vimeo_ratio = isset($media->height) && isset($media->width) ? round(($media->height / $media->width)*100, 2) : 56.25;

            $shadow = (isset($media->shadow) && $media->shadow === false) ? " class=\"no-shadow\"": "";
        ?>
        <div style="padding:<?php echo $vimeo_ratio ?>% 0 0 0;position:relative;" role="presentation"><iframe<?php echo $shadow ?> src="https://player.vimeo.com/video/<?php echo $vimeo_url ?>&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;dnt=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="<?php echo $media->alt ?>"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>



    <?php elseif ($media->type == 'image'): ?>
        <?php
            $shadow = (isset($media->shadow) && $media->shadow === false) ? " class=\"no-shadow\"": "";
        ?>
        <img<?php echo $shadow ?> src="projects/<?php echo $project->dir ?>/<?php echo $media->file ?>" alt="<?php echo $media->alt ?>">



    <?php elseif ($media->type == 'compare'): ?>
        <div class="onion" role="presentation">
            <button class="grip" role="presentation"></button>
        <?php 
            $num_imgs = count($media->files);
            for($i = 0; $i < $num_imgs; $i++):
        ?>
        <?php if ($i === $num_imgs - 1): ?>
            <img class="after no-shadow" src="projects/<?php echo $project->dir ?>/<?php echo $media->files[$i]->src ?>" alt="<?php echo $media->files[$i]->alt ?>" aria-label="After Image">
            <?php else: ?>
            <div class="before">
                <img class="no-shadow" src="projects/<?php echo $project->dir ?>/<?php echo $media->files[$i]->src ?>" alt="<?php echo $media->files[$i]->alt ?>" aria-label="Before Image">
            </div>
            <?php endif; ?>
        
        <?php endfor; ?>
        </div>
    <?php endif; ?>
    </div><!-- frame -->
    <?php endforeach; ?>
</div></div><!-- media -->





