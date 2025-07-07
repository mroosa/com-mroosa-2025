<?php require_once './vendor/parsedown/Parsedown.php'; #1.8 dev to fix PHP issues ?>
<?php $Parsedown = new Parsedown(); ?>


<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="apple-touch-icon" sizes="180x180" href="images/favico/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favico/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="images/favico/favicon-16x16.png">
    <link rel="manifest" href="images/favico/site.webmanifest">

    <title>Matthew Roosa :: Full Stack Developer</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Oswald:wght@200..700&display=swap" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

    <script src="js/global.js" type="module"></script>
</head>
<body>
<div id="console">
    <div id="display"></div>
    <div id="input"><input id="terminal" type="text"></div>
</div>
<header>
    <nav>
        <ul role="presentation">
            <li><a href="#about">About</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="files/mroosa-resume-202505.pdf" target="_blank">Resume</a></li>
            <li class="spacer"></li>
            <li class="social"><a id="icon-linkedin" target="_blank" href="https://www.linkedin.com/in/matthewroosa/">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M22 3.47059V20.5294C22 20.9194 21.8451 21.2935 21.5693 21.5693C21.2935 21.8451 20.9194 22 20.5294 22H3.47059C3.08056 22 2.70651 21.8451 2.43073 21.5693C2.15494 21.2935 2 20.9194 2 20.5294V3.47059C2 3.08056 2.15494 2.70651 2.43073 2.43073C2.70651 2.15494 3.08056 2 3.47059 2H20.5294C20.9194 2 21.2935 2.15494 21.5693 2.43073C21.8451 2.70651 22 3.08056 22 3.47059ZM7.88235 9.64706H4.94118V19.0588H7.88235V9.64706ZM8.14706 6.41177C8.14861 6.18929 8.10632 5.96869 8.02261 5.76255C7.93891 5.55642 7.81542 5.36879 7.65919 5.21039C7.50297 5.05198 7.31708 4.92589 7.11213 4.83933C6.90718 4.75277 6.68718 4.70742 6.46471 4.70588H6.41177C5.95934 4.70588 5.52544 4.88561 5.20552 5.20552C4.88561 5.52544 4.70588 5.95934 4.70588 6.41177C4.70588 6.86419 4.88561 7.29809 5.20552 7.61801C5.52544 7.93792 5.95934 8.11765 6.41177 8.11765C6.63426 8.12312 6.85565 8.0847 7.06328 8.00458C7.27092 7.92447 7.46074 7.80422 7.62189 7.65072C7.78304 7.49722 7.91237 7.31346 8.00248 7.10996C8.09259 6.90646 8.14172 6.6872 8.14706 6.46471V6.41177ZM19.0588 13.3412C19.0588 10.5118 17.2588 9.41177 15.4706 9.41177C14.8851 9.38245 14.3021 9.50715 13.7799 9.77345C13.2576 10.0397 12.8143 10.4383 12.4941 10.9294H12.4118V9.64706H9.64706V19.0588H12.5882V14.0529C12.5457 13.5403 12.7072 13.0315 13.0376 12.6372C13.3681 12.2429 13.8407 11.9949 14.3529 11.9471H14.4647C15.4 11.9471 16.0941 12.5353 16.0941 14.0176V19.0588H19.0353L19.0588 13.3412Z"></path>
                </svg>
            </a></li>
            <li class="social"><a id="icon-github" target="_blank" href="https://github.com/mroosa">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.475 2 2 6.475 2 12C2 16.425 4.8625 20.1625 8.8375 21.4875C9.3375 21.575 9.525 21.275 9.525 21.0125C9.525 20.775 9.5125 19.9875 9.5125 19.15C7 19.6125 6.35 18.5375 6.15 17.975C6.0375 17.6875 5.55 16.8 5.125 16.5625C4.775 16.375 4.275 15.9125 5.1125 15.9C5.9 15.8875 6.4625 16.625 6.65 16.925C7.55 18.4375 8.9875 18.0125 9.5625 17.75C9.65 17.1 9.9125 16.6625 10.2 16.4125C7.975 16.1625 5.65 15.3 5.65 11.475C5.65 10.3875 6.0375 9.4875 6.675 8.7875C6.575 8.5375 6.225 7.5125 6.775 6.1375C6.775 6.1375 7.6125 5.875 9.525 7.1625C10.325 6.9375 11.175 6.825 12.025 6.825C12.875 6.825 13.725 6.9375 14.525 7.1625C16.4375 5.8625 17.275 6.1375 17.275 6.1375C17.825 7.5125 17.475 8.5375 17.375 8.7875C18.0125 9.4875 18.4 10.375 18.4 11.475C18.4 15.3125 16.0625 16.1625 13.8375 16.4125C14.2 16.725 14.5125 17.325 14.5125 18.2625C14.5125 19.6 14.5 20.675 14.5 21.0125C14.5 21.275 14.6875 21.5875 15.1875 21.4875C17.1727 20.8173 18.8977 19.5415 20.1198 17.8395C21.3419 16.1376 21.9995 14.0953 22 12C22 6.475 17.525 2 12 2Z"></path>
                </svg>
            </a></li>
            <li class="social"><a id="icon-instagram" target="_blank" href="https://www.instagram.com/mroosa/">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C9.284 2 8.944 2.01133 7.87733 2.06C6.81267 2.10867 6.08533 2.278 5.44933 2.52533C4.78267 2.776 4.178 3.16933 3.678 3.67867C3.16948 4.17809 2.77591 4.78233 2.52467 5.44933C2.27867 6.08533 2.10867 6.81333 2.06 7.878C2.012 8.944 2 9.28333 2 12C2 14.7167 2.01133 15.056 2.06 16.1227C2.10867 17.1873 2.278 17.9147 2.52533 18.5507C2.776 19.2173 3.16933 19.822 3.67867 20.322C4.1781 20.8305 4.78234 21.2241 5.44933 21.4753C6.08533 21.722 6.81267 21.8913 7.87733 21.94C8.944 21.9887 9.284 22 12 22C14.716 22 15.056 21.9887 16.1227 21.94C17.1873 21.8913 17.9147 21.722 18.5507 21.4747C19.2173 21.224 19.822 20.8307 20.322 20.3213C20.8305 19.8219 21.2241 19.2177 21.4753 18.5507C21.722 17.9147 21.8913 17.1873 21.94 16.1227C21.9887 15.056 22 14.716 22 12C22 9.284 21.9887 8.944 21.94 7.87733C21.8913 6.81267 21.722 6.08533 21.4747 5.44933C21.2236 4.78204 20.83 4.17755 20.3213 3.678C19.8219 3.16948 19.2177 2.77591 18.5507 2.52467C17.9147 2.27867 17.1867 2.10867 16.122 2.06C15.056 2.012 14.7167 2 12 2ZM12 3.802C14.67 3.802 14.9867 3.812 16.0413 3.86C17.016 3.90467 17.5453 4.06667 17.898 4.20467C18.3647 4.38533 18.698 4.60267 19.048 4.952C19.398 5.302 19.6147 5.63533 19.7953 6.102C19.9327 6.45467 20.0953 6.984 20.14 7.95867C20.188 9.01333 20.198 9.33 20.198 12C20.198 14.67 20.188 14.9867 20.14 16.0413C20.0953 17.016 19.9333 17.5453 19.7953 17.898C19.6353 18.3324 19.3799 18.7253 19.048 19.048C18.7254 19.38 18.3324 19.6354 17.898 19.7953C17.5453 19.9327 17.016 20.0953 16.0413 20.14C14.9867 20.188 14.6707 20.198 12 20.198C9.32933 20.198 9.01333 20.188 7.95867 20.14C6.984 20.0953 6.45467 19.9333 6.102 19.7953C5.66764 19.6353 5.27467 19.3799 4.952 19.048C4.62012 18.7253 4.36475 18.3323 4.20467 17.898C4.06733 17.5453 3.90467 17.016 3.86 16.0413C3.812 14.9867 3.802 14.67 3.802 12C3.802 9.33 3.812 9.01333 3.86 7.95867C3.90467 6.984 4.06667 6.45467 4.20467 6.102C4.38533 5.63533 4.60267 5.302 4.952 4.952C5.27463 4.62003 5.66761 4.36465 6.102 4.20467C6.45467 4.06733 6.984 3.90467 7.95867 3.86C9.01333 3.812 9.33 3.802 12 3.802Z"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 15.3367C11.5618 15.3367 11.128 15.2504 10.7231 15.0827C10.3183 14.915 9.95047 14.6692 9.64064 14.3594C9.3308 14.0495 9.08502 13.6817 8.91734 13.2769C8.74965 12.8721 8.66335 12.4382 8.66335 12C8.66335 11.5618 8.74965 11.1279 8.91734 10.7231C9.08502 10.3183 9.3308 9.95046 9.64064 9.64062C9.95047 9.33078 10.3183 9.08501 10.7231 8.91732C11.128 8.74964 11.5618 8.66333 12 8.66333C12.885 8.66333 13.7336 9.01487 14.3594 9.64062C14.9851 10.2664 15.3367 11.1151 15.3367 12C15.3367 12.8849 14.9851 13.7336 14.3594 14.3594C13.7336 14.9851 12.885 15.3367 12 15.3367ZM12 6.86C10.6368 6.86 9.32942 7.40153 8.36549 8.36547C7.40155 9.32941 6.86002 10.6368 6.86002 12C6.86002 13.3632 7.40155 14.6706 8.36549 15.6345C9.32942 16.5985 10.6368 17.14 12 17.14C13.3632 17.14 14.6706 16.5985 15.6345 15.6345C16.5985 14.6706 17.14 13.3632 17.14 12C17.14 10.6368 16.5985 9.32941 15.6345 8.36547C14.6706 7.40153 13.3632 6.86 12 6.86ZM18.6353 6.76667C18.6353 7.0889 18.5073 7.39794 18.2795 7.6258C18.0516 7.85366 17.7426 7.98167 17.4204 7.98167C17.0981 7.98167 16.7891 7.85366 16.5612 7.6258C16.3334 7.39794 16.2053 7.0889 16.2053 6.76667C16.2053 6.44443 16.3334 6.13539 16.5612 5.90753C16.7891 5.67968 17.0981 5.55167 17.4204 5.55167C17.7426 5.55167 18.0516 5.67968 18.2795 5.90753C18.5073 6.13539 18.6353 6.44443 18.6353 6.76667Z"></path>
                </svg>
            </a></li>
            <li class="social"><a id="icon-twitter" target="_blank" href="https://x.com/frips">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M22 5.9246C21.2645 6.25051 20.4744 6.47071 19.6438 6.57025C20.4911 6.06289 21.1412 5.25782 21.4477 4.29948C20.655 4.76984 19.7768 5.1116 18.8422 5.29481C18.0935 4.49855 17.0277 4 15.8474 4C13.582 4 11.7446 5.8374 11.7446 8.10464C11.7446 8.42526 11.7816 8.73707 11.8503 9.03832C8.43883 8.86656 5.41672 7.23263 3.39258 4.75046C3.04025 5.35823 2.83766 6.06289 2.83766 6.81335C2.83766 8.23677 3.56258 9.4937 4.66273 10.2292C3.98978 10.2072 3.35735 10.0231 2.80419 9.71567V9.76852C2.80419 11.7565 4.21792 13.4151 6.09583 13.7921C5.75055 13.8855 5.38853 13.9348 5.01506 13.9348C4.75081 13.9348 4.49273 13.9102 4.24258 13.8626C4.76491 15.4921 6.27993 16.6795 8.07593 16.7112C6.67101 17.8122 4.90144 18.4684 2.97948 18.4684C2.64829 18.4684 2.3215 18.449 2 18.4112C3.81626 19.5765 5.97252 20.2547 8.28909 20.2547C15.8378 20.2547 19.9644 14.0026 19.9644 8.58029C19.9644 8.40412 19.96 8.2262 19.9521 8.05003C20.7536 7.47045 21.4495 6.74905 21.9982 5.92724L22 5.9246Z"></path>
                </svg>
            </a></li>
            <li class="social"><a id="icon-bs" target="_blank" href="https://mroosa.bsky.social">
                <svg width="24" height="24" viewBox="0 0 64 57">
                    <path d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"></path>
                </svg>
            </a></li>
        </ul>
    </nav>
</header>
<main>
    <section id="intro">
        <h1>Matthew Roosa</h1>
        <p>Full-Stack Developer</p>
    </section>
    <section id="about" data-current-scene="1">
        <div class="contain" role="presentation">
            <h2>
                <span class="brick" role="presentation">A</span>
                <span class="brick" role="presentation">B</span>
                <span class="brick special" role="presentation">O</span>
                <span class="brick" role="presentation">U</span>
                <span class="brick" role="presentation">T</span>
            </h2>
            <?php
            #    $md = file_get_contents('data/about.md');
            #    echo $Parsedown->text($md);
            ?>
            <p class="platform" data-scene="1">I am a full-stack developer with over 20 years experience creating accessible, comprehensive, and scalable web experiences. My experience as a full-stack developer allows me to solve design challenges while creating straight-forward and maintainable solutions to best serve the needs of the client. I have developed and maintained small and large-scale websites for businesses, schools, and non-profits in the greater Philadelphia area, working with Comcast/Xfinity, AARP, Cheshire Law Group, and many more.</p>
            <p class="platform" data-scene="1">When I am not working or watching my kids at their school sport events, I enjoy gaming on my custom-built PC, buidling and designing with LEGO, and practicing real-life and in-game photography. I have been interested in programming since I was a kid, learning other programming languages that appealed to my problem-solving nature while looking for fun and creative ways to put the code the use.</p>
            <p class="platform eegg" data-scene="2">I also enjoy including Easter Eggs in fun projects, but who doesn't?</p>
        </div>
        <div class="monitor" role="presentation">
            <img class="asset" id="cloud" data-type="sprite" src="images/about/cloud_sprite.png" alt="">
            <img class="asset" id="playerSprite" data-type="sprite" src="images/about/LEGO-sprite.png" alt="">
            <div class="shrub" role="presentation"></div>
            <div class="shrub" role="presentation"></div>
            <div class="tile curtain left" role="presentation"></div>
            <div class="tile curtain right" role="presentation"></div>
            <div class="tile ground" role="presentation"></div>
        </div>
    </section>
    <section id="work" class="alt">
        <div class="contain" role="presentation">
            <h2>Work</h2>
            <div class="projects" role="presentation">

            <?php
                $proj_data = json_decode(file_get_contents('data/projects.json'));
                $count = 0;

                foreach($proj_data->projects as $project):
                    if(!isset($project -> hide) || $project -> hide !== true):
                        $count++;
                        $projNum = ($count < 10) ? sprintf("%'.02d",$count): $count;
                        $checked = ($count===1) ? " checked": "";
            ?>
                <div class="project" role="presentation">
                    <input type="radio" id="<?php echo $project->id ?>" name="project"<?php echo $checked ?>><label for="<?php echo $project->id ?>"><h3><span class="proj-num"><?php echo $projNum ?></span><span class="proj-ttl"><span class="dots">::</span><span class="ttl"><?php echo $project->title ?></span></span></a></h3></label>
                    <div class="project-nfo" role="presentation">


                        <?php
                            # check for tags
                            if ((isset($project->tags) && count($project->tags) > 0) || (isset($project->awards) && count($project->awards > 0))): 
                                include './templates/tags.php';
                            endif;
                        ?>
                        <?php
                            # check for media
                            if (isset($project->media)):
                                include './templates/media.php';
                            endif;
                        ?>
                        <?php if (isset($project->description)): ?>
                        <div class="project-dsc" aria-label="Project Description"><p><?php echo $project->description ?></p></div>
                        <?php endif; ?>

                                
                    </div><!-- project-nfo -->
                </div><!-- project -->
            <?php 
                    endif;
                endforeach; 
            ?>
            </div>
        </div>
    </section>
    <section id="contact">
        <div class="contain" role="presentation">
            <h2>Want to get in touch?</h2>
            <p>Fill out the form below, and I'll get back to you as soon as I can.</p>
            <form id="contact-form" method="post" action="">
                <div class="input-wrap">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="input-wrap">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="input-wrap">
                    <label for="lname">Message</label>
                    <textarea id="message" name="message" required></textarea>
                </div>
                <input type="submit" value="Submit" id="submit" name="submit">
            </form>
        </div>
    </section>
</main>
</body>
</html>