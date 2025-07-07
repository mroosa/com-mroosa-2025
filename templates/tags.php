<ul class="tags" role="presentation" aria-label="Tags">
    <?php
        # basic tags
        if (isset($project->tags) && count($project->tags) > 0):
            foreach ($project->tags as $tag):
    ?>
    <li><?php echo $tag ?></li>
    <?php
            endforeach;
        endif;

        #award tags
        if (isset($project->awards) && count($project->awards) > 0):
            foreach ($project->awards as $award):
    ?>
    <li class="award" role="presentation" aira-label="Awards"><?php echo $award ?></li>
    <?php
            endforeach;
        endif;
    ?>
</ul>