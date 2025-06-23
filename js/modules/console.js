    /* Console functionality */
    const siteConsole = document.getElementById("console");
    const siteDisplay = document.getElementById("display");
    const siteTerminal = document.getElementById("terminal");

    const toggleConsole = el => {
        siteConsole.classList.toggle("open");
        if (el) {
            el.preventDefault();
        }
    }

    function submitLine() {

    }

    function clearLine() {
        siteTerminal.value = "";
    }
    
    function clearDisplay() {
        siteDisplay.innerHTML = "";
    }

    

    /* keypress listener (for console) */
    document.addEventListener("keypress", (e) => {
        if (e.key == "`") {
            toggleConsole();
            if (siteConsole.classList.contains("open")) {
                document.getElementById("terminal").focus();
            } else {
                setTimeout(()=> {
                    clearLine();
                }, 250)
            }
            e.preventDefault();
        }
        if (e.key == "Enter" && siteConsole.classList.contains("open") && document.activeElement == siteTerminal) {
            let displayContents = document.getElementById("display").getHTML();
            let command = siteTerminal.value.replace(/^\s+|\s+$/gm,'');
            switch (command) {
                case "clear":
                    clearDisplay();
                    break;
                case "dir":
                case "ls":
                    siteDisplay.innerHTML = displayContents + "<p>DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">about/</a></p><p>DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">contact/</a></p><p>DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">portfolio/</a></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">resume</a></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">socials</a></p>";
                    break;
                case "contra":
                case "konami":
                case "up up down down left right left right b a":
                    siteDisplay.innerHTML = displayContents + "<p>yo!</p>";
                    break;
                default: 
                    siteDisplay.innerHTML = displayContents + "<p>Error: unknown command: " + siteTerminal.value + "</p>";
            }
            clearLine();
        }
    })

    const Console = {
        siteConsole,
        siteDisplay,
        siteTerminal,
        toggleConsole,
        submitLine,
        clearLine,
        clearDisplay
    }
 export default Console;