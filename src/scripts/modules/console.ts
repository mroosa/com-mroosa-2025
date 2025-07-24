    /* Console functionality */
    const siteConsole = document.getElementById("console");
    const siteDisplay = document.getElementById("display");
    const siteTerminal = document.getElementById("terminal");

    const toggleConsole = (): void => {
        siteConsole?.classList.toggle("open");
    }

    function submitLine() {

    }

    function clearLine() {
        if (siteTerminal) (<HTMLInputElement>siteTerminal).value = "";
    }
    
    function clearDisplay() {
        if (siteDisplay) (<HTMLElement>siteDisplay).innerHTML = "";
    }

    

    /* keypress listener (for console) */
    document.addEventListener("keypress", (e) => {
        if (e.key == "`") {
            toggleConsole();
            if (siteConsole?.classList.contains("open")) {
                (<HTMLInputElement>document.getElementById("terminal")).focus();
            } else {
                setTimeout(()=> {
                    clearLine();
                }, 250)
            }
            e.preventDefault();
        }
        if (e.key == "Enter" && siteConsole?.classList.contains("open") && document.activeElement == siteTerminal) {
            let displayContents = (<HTMLElement>document.getElementById("display")).getHTML();
            let command = (<HTMLInputElement>siteTerminal).value.replace(/^\s+|\s+$/gm,'');
            switch (command) {
                case "clear":
                    clearDisplay();
                    break;
                case "dir":
                case "ls":
                    (<HTMLElement>siteDisplay).innerHTML = displayContents + "<p>DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">about/</a></p><p>DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">contact/</a></p><p>DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">portfolio/</a></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">resume</a></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/<a href=\"#\">socials</a></p>";
                    break;
                case "contra":
                case "konami":
                case "up up down down left right left right b a":
                    (<HTMLElement>siteDisplay).innerHTML = displayContents + "<p>yo!</p>";
                    break;
                default: 
                    (<HTMLElement>siteDisplay).innerHTML = displayContents + "<p>Error: unknown command: " + (<HTMLInputElement>siteTerminal).value + "</p>";
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