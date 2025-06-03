from flask import Flask, render_template, request, jsonify
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1' 
import numpy as np
import csv

import tensorflow as tf
from tensorflow import keras 

model = tf.keras.models.load_model("digits_cnn_model3.keras")

app = Flask(__name__, template_folder="templates")

CSV_FILE = "predictions.csv"

if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode="w", newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["pixels", "prediction"])

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/handle_post", methods=["POST"])
def handle_post():
    data = request.get_json()
    pixels = data.get("pixels", [])

    input_array = np.array(pixels, dtype=np.float64).reshape(1,28,28, 1)

    prediction = model.predict(input_array)
    guess = int(np.argmax(prediction[0]))
    probability = round(float(prediction[0][guess]), 4)
    print("the guess is", guess)

    pixel_str = "".join(str(p) for p in pixels)

    with open(CSV_FILE, mode="a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([pixel_str, guess])

    return jsonify(guess=guess, probability=probability)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)