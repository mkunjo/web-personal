import React, { useState, useEffect, useRef } from "react";
import '../styles/index.css'; 
import '../styles/tech.css'; 

const Terminal = () => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([
        { output: "Welcome to my Terminal" },
        { output: "Type 'help' to see available commands." },
        {
            output: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣀⣀⣠⣤⠴⠦⠶⠿⠿⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠿⠷⠶⠦⠤⢤⣤⣀⣀⣀⠀⠀⠀⠀⠀⠀
⠀⠀⣸⡏⠉⠀⠀⢀⣀⣀⣄⣤⣴⣶⠶⠶⠶⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠒⠲⠶⠶⢶⣤⣴⣴⣀⣀⠀⠀⢀⠀⠉⠙⡗⠲⣤⡀⠀⠀
⠀⠀⡟⠀⠀⢰⡞⢹⡏⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠙⢻⡄⠀⠀⣿⠀⠀⢻⡆⠀
⠀⣺⠇⠀⠀⣼⠀⡾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣷⠀⠀⢸⡇⠀⠸⡇⠀
⢠⣿⠀⠀⢨⡇⠀⡧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⢈⣇⠀⠀⢿⠀
⢸⣿⠀⠀⣿⣇⢠⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀⠐⣿⠀⠀⢺⡇
⢸⡟⠀⠀⣿⠀⢸⠃⠀⠀⠀⠘⠷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡾⠗⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⣿⠀⠀⢸⡇
⢸⡇⠀⠀⣿⠈⢸⠀⠀⠀⠀⠀⠀⠀⠉⠙⢶⣤⡄⠀⠀⠀⠀⠀⢀⣦⣶⠚⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⣿⠀⠀⢸⡇
⢸⡇⠀⠀⣿⠀⢸⠀⠀⠀⠀⠀⣀⣠⠶⠞⠛⠋⠀⠀⠀⢀⠀⠀⠀⠉⠛⠛⠶⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⣿⠀⠀⢸⡇
⢸⡇⠀⠀⣿⠀⢸⠀⠀⠀⠀⠈⠉⠀⠀⠀⠀⠀⠸⣷⣴⣿⣦⣽⡷⠀⠀⠀⠀⠀⠉⠃⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⣿⠀⠀⢸⡇
⢸⡇⠀⠀⣿⠀⢸⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡇⠀⢀⣿⠀⠀⣼⡇
⢸⣇⠀⠀⣿⡀⢺⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣇⠀⢸⣿⠀⠀⣿⡇
⠸⢿⠀⠀⢻⡇⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠈⣿⠀⠀⢺⠃
⠀⣿⠀⠀⢸⣇⠀⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⠀⠀⢰⡇⠀⢀⣿⠀
⠀⠹⡇⠀⠀⢹⡄⢹⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡟⠀⠀⢼⠀⠀⠸⡇⠀
⠀⠰⣿⡆⠀⠈⠛⠚⠳⠦⠤⣤⣤⣤⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣠⣤⣤⠤⠶⠛⠛⠁⠀⠀⡿⠀⠀⢸⡇⠀
⠀⠀⠘⢿⠦⣤⣤⣤⣄⣀⠀⢀⠀⠀⠀⠉⠙⠛⠛⠛⢛⡛⠛⠛⡛⠛⠛⠛⠛⠋⠋⠉⠀⠉⠁⠀⠀⢀⣤⣤⣤⣴⠾⠃⠀⠀⣾⠀⠀
⠀⠀⠀⠈⠷⣄⣀⣀⣈⠉⠉⠉⠙⠛⠛⠛⠚⠛⠻⠿⣿⣿⣿⣿⣿⣿⡿⠿⠟⠛⠒⠒⠛⠛⠉⠉⠉⠉⠉⠁⠀⠀⠀⣀⣀⣾⡏⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠓⠲⠦⠶⣦⣤⣤⣼⠛⠛⠛⠛⠛⠻⢿⡷⣄⣀⣀⣀⣀⣀⣀⣀⣠⠤⠶⠶⠶⠒⠛⠛⠉⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡇⠀⠀⠀⠀⠀⠀⢀⣿⣏⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⣠⣤⣤⡤⠤⣿⣇⡀⠀⠀⠀⠀⠀⢸⣿⡿⠿⠦⠤⢤⣤⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣶⠞⠙⠋⠀⠀⠀⠀⠀⠀⠀⠙⠿⠶⠶⠶⠶⠶⠿⠟⠃⠀⠀⠀⠀⠀⠀⠀⠈⠉⠙⠲⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣻⢿⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⡾⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢿⣤⡀⠈⠙⠛⠛⠲⠶⠤⠤⣤⡤⠤⠤⠤⠤⠤⠤⠤⠤⠤⢤⠤⠤⠤⠶⠿⠛⠛⠋⣁⣤⣴⠇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠉⠓⠒⠒⠶⠦⣦⣤⣤⣤⣤⣠⣠⣠⣀⣄⣀⣀⣀⣠⣤⣤⣤⣤⣤⠾⠶⠚⠛⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`}
    ]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const terminalBodyRef = useRef(null); //Reference for scrolling

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
    }, [history]); //Auto-scroll on new history updates
    const poopArt = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⢿⣇⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⡶⠿⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣇⠀⠀⠀⠀⠀⠀⢻⣿⠁⠀⠀⠀⠀⠀⠘⢷⡄⠀⠀⠀⠀⠀
⠐⠴⣗⣦⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⠇⠀⠀⢠⣶⠟⠛⠉⠀⠀⠀⢠⡄⠀⠀⠈⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠉⠀⠀⠀⠸⣧⠀⠀⠀⠀⠀⢀⣼⠇⠀⢀⣼⠏⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣆⠀⠀⠀⠀⢹⣷⠀⠀⠀⠀⣿⠁⠀⠠⣏⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡘⠀⠀⠀⢘⡇⠀⠀⠀⠀⠀⠱⢄⠀⠀⠀⠘⡆⠀⠀⢰⡟⠁⠀⠀⠀⠀⠹⣷⡄⠀⠙⢦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢸⠇⠀⠀⢀⡾⠃⠀⠀⠀⠀⠀⠀⡶⣤⠀⠈⠁⠀⠀⠀⠘⣗⠀⠀⠀⠀⠀⠀⢈⡿⠀⠀⠀⠃⠀⠀⢀⠀⠀
⠀⠀⠀⢠⠟⠀⠀⠀⡏⠀⠀⠀⠀⠀⠀⠀⣰⠃⢸⡀⠀⠀⠀⠀⠀⠀⣸⠀⠀⠀⠀⢀⡾⠋⠀⠀⠀⠀⠀⠰⠤⠿⠒⠂
⠀⠀⠀⣞⠀⠀⠀⢸⡇⠀⠀⠀⠀⣠⡴⠟⠁⠀⠈⠳⠦⣤⣀⠀⠀⠀⠁⠀⠀⠀⠀⢸⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠹⠀⠀⠀⠀⠧⠀⠀⠀⢰⡟⠀⠀⠀⠐⠼⢟⣲⡐⠈⣻⣤⣤⣀⠀⠀⠀⠀⠀⠙⢶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣇⠐⠀⢀⠀⠀⠀⠀⡉⠉⠉⢠⡘⠙⣿⣦⡀⠀⠀⠀⠰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣿⣦⡀⠈⠐⠀⠄⠀⠀⠀⠀⠀⣀⣀⢈⠘⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡾⠋⠁⣠⠌⠉⠓⠒⠀⠀⠀⠀⠐⠊⠊⠇⠿⠀⣀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣼⠯⣷⡀⡜⢡⠆⠰⠂⠀⠀⠀⠀⠒⠦⠄⠌⠙⠲⢻⠉⡿⢶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⣾⠟⢠⠇⢩⠃⠀⠀⠀⠀⠀⠀⠤⠃⠀⠀⠀⠀⠀⠹⣄⠀⡈⠙⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣴⠟⡋⠁⠀⠀⠀⠀⠀⠀⣰⠓⡀⠠⠀⠀⠀⠀⠀⠀⠀⠀⢀⡈⡆⠳⣌⢸⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣰⡟⠱⠡⠃⠐⠂⡄⠀⠀⠠⠄⣀⣀⠀⠀⠀⠀⠀⠀⠀⠆⢹⣴⣀⣳⣷⣶⠾⠟⠛⢷⣄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢰⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠉⠉⣉⡙⡛⠛⠛⠛⠛⠋⠉⠉⠀⠀⠀⢣⡑⠈⢻⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⡇⢹⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⠁⠀⠀⡀⢰⢠⠀⡆⠀⠆⠀⡄⢄⢶⠼⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠹⣷⡀⠘⡟⡆⡄⡀⠀⠀⠀⢀⠀⠀⠰⠀⠀⠀⠀⠐⣶⠄⡇⠾⠘⠀⢉⡄⢠⢧⢧⢸⠀⣰⡟⢀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣼⣷⡄⠀⣡⠁⢀⠈⡀⠀⠈⠐⠰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠀⠃⠘⠢⠘⠊⢈⣡⣴⠟⡠⠋⡰⠃⡄⠀⠀
⠀⠀⣸⠕⢋⡽⠻⣶⣅⣇⠈⠰⠁⡇⠄⢰⠀⠀⠀⠀⠠⢠⣴⠠⠀⠃⠀⠀⢀⣀⣤⣴⡾⢟⡿⢣⠞⣡⠞⢀⡜⠁⠀⠀
⠀⠀⡴⠊⢁⡠⠚⠉⢉⡿⠛⢿⠷⢶⣶⣶⣦⣤⣤⣤⣤⣶⣶⣶⠶⡾⠿⠛⡿⠋⡩⠋⠠⠋⡴⢃⡜⠁⠀⠎⠀⠈⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⠁⠀⠚⠁⠐⠋⠀⠊⠀⠘⠁⠀⠁⠀⠈⠀⠘⠁⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
    const exp = `Languages: Java, JavaScript, Python, C++, R, SQL (PostgreSQL, Oracle);

Frameworks: ASP.NET Web API, ReactJS, AngularJS, Android SDK, jQuery,
Bootstrap, MaterializeCSS, Spring;

APIs & Tools: Google Maps API, Socket.io, Tesseract.js OCR, 
JSON Web Tokens (JWT), bcrypt, Spotify API;

Databases & Backend: MongoDB, MySQL, MySQLi, Node.js, Express.js;

Software & DevOps: Docker, Kubernetes, Tableau, Adobe Creative Suite;

Environments: Terminal, Eclipse, Visual Studio, PyCharm, IntelliJ,
R Studio, Android Studio, Sitecore CMS, WordPress;`;

    const handleCommand = () => {
        const command = input.toLowerCase().trim();
        let output;

        switch (command) {
            case "ascii":
                output = poopArt;
                break;
            case "alert":
                document.body.style.backgroundColor = "red";
                output = "🚨 SYSTEM BREACH 🚨";
                setTimeout(() => document.body.style.backgroundColor = "", 1000);
                break;
            case "about":
                output = "Hello! I'm Muhammad Kunjo, a software developer with experience in React, JavaScript, Java and more.";
                break;
            case "play song":
                const audio = new Audio("../../assets/music/Purpose.mp3");
                audio.play();
                output = "Now playing: Purpose!";
                break;
            case command.startsWith("weather") ? command : null:
                const city = command.split(" ").slice(1).join(" ") || "San Francisco";
                output = `Fetching weather data for ${city}...`;

                fetch(`https://wttr.in/${city}?format=3`)
                    .then(res => res.text())
                    .then(data => {
                        setHistory([...history, { command, output: data }]);
                    })
                    .catch(() => {
                        setHistory([...history, { command, output: "❌ Failed to fetch weather." }]);
                    });
                break;
            case "experience":
                output = exp;
                break;
            case "hack":
                return fakeHackingSequence();
            case "clear":
                setHistory([]);
                setInput("");
                return;
            case "help":
                output = "Available commands: about, experience, play song, hack, ascii, alert, weather city-name, clear";
                break;
            default:
                output = `Command not found: ${command}. Type "help" for a list of commands.`;

        }

        setHistory([...history, { command, output }]);
        setCommandHistory([...commandHistory, command]);
        setHistoryIndex(-1);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleCommand();
        } else if (e.key === "ArrowUp") {
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput("");
            }
        }
    };

    const fakeHackingSequence = () => {
        const hackingTexts = [
            "Connecting to mainframe...",
            "Bypassing firewall...",
            "Accessing confidential files...",
            "Decrypting RSA keys...",
            "Uploading trojan horse...",
            "Hack complete. You are now in control of the system.",
        ];

        hackingTexts.forEach((text, index) => {
            setTimeout(() => {
                setHistory((prevHistory) => [...prevHistory, { output: text }]);
            }, index * 1000);
        });
    };

    return (
        <>
            <div className="terminal" onClick={() => inputRef.current.focus()}>
                <div className="terminal-header">Interactive Terminal</div>
                <div className="terminal-body" ref={terminalBodyRef}>
                    {history.map((entry, index) => (
                        <div key={index}>
                            {entry.command && <p className="terminal-command">$ {entry.command}</p>}
                            <p className="terminal-output">{entry.output}</p>
                        </div>
                    ))}
                </div>
                <div className="terminal-input-line">
                    <span className="terminal-symbol">$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="terminal-input"
                    />
                </div>
            </div>
            <div className="Utilities">
                <h2 className="Utilities-heading">Tools/Utilities:</h2>
                <div className="utilities-grid">
                    <div className="utility-item">
                        <h3 className="util">Pomodoro timer:</h3>
                        <a href="#/Pomodoro">
                            <img
                                src="assets/images/pomodoro-thumb.png"
                                alt="Pomodoro Tool Thumbnail"
                                className="tech-thumbnail"
                            />
                        </a>
                    </div>
                    <div className="utility-item">
                        <h3 className="util">Password Generator:</h3>
                        <a href="#/PasswordGenerator">
                            <img
                                src="assets/images/passGenerator-thumb.png"
                                alt="Password Generator Tool Thumbnail"
                                className="tech-thumbnail"
                            />
                        </a>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Terminal;
