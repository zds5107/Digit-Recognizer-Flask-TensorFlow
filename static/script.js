const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let drawing = false;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    drawing = true;
    draw(e);
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e);
});

canvas.addEventListener("touchend", () => drawing = false);
canvas.addEventListener("touchcancel", () => drawing = false);


function draw(e) {
    if (!drawing) return;

    
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);


    ctx.fillStyle = "black";    
    ctx.fillRect(x, y, 2, 2);

}


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function guess() {
    const imgData = ctx.getImageData(0,0,28,28).data;
    const output = [];

    for (let i = 0; i < imgData.length; i += 4) {
    const a = imgData[i + 3]; // alpha

    if (a > 0){
        output.push(1);
    } else {
        output.push(0);
    }
    
    }
    
    const postUrl = document.body.dataset.postUrl;

    fetch(postUrl, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ pixels: output})
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data)
        const guess = data.guess;
        const probability = data.probability;
        document.getElementById("prediction-box").textContent = guess
        document.getElementById("probability").textContent = "Probability = " + probability

    })

}

function getYear(){
    const date = new Date();
    const year = date.getFullYear();
    document.getElementById("year").textContent = `© ${year} `
}

getYear();