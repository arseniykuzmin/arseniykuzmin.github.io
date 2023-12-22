function generateLoremIpsum(wordCount) {
    const words = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
        "adipiscing", "elit", "sed", "do", "eiusmod", "tempor",
        "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua",
        "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
        "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip",
        "ex", "ea", "commodo", "consequat", "duis", "aute", "irure",
        "dolor", "in", "reprehenderit", "in", "voluptate", "velit",
        "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur"
    ];

    let loremText = "";
    for (let i = 0; i < wordCount; i++) {
        loremText += words[Math.floor(Math.random() * words.length)] + " ";
    }
    return loremText.trim();
}

// Generate lorem ipsum for each section
document.getElementById("section1Content").textContent = generateLoremIpsum(300);
document.getElementById("section2Content").textContent = generateLoremIpsum(300);
document.getElementById("section3Content").textContent = generateLoremIpsum(300);
document.getElementById("section4Content").textContent = generateLoremIpsum(300);