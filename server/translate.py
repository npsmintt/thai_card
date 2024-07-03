##### google translate #####
# from flask import Flask, request, jsonify
# from google_trans_new import google_translator  

# app = Flask(__name__)
# translator = google_translator()

# @app.route('/translate', methods=['POST'])
# def eng_to_thai():
#     data = request.get_json()
#     english_word = data['english_word']
#     translated = eng_to_thai(english_word)
#     return jsonify(translated)

# def eng_to_thai(english_word):
#     translate_text = translator.translate(english_word, lang_tgt='th', pronounce=True)
#     return {'thai_word': translate_text[0], 'pronunciation': translate_text[2]}

# if __name__ == '__main__':
#     app.run(port=5001, debug=True)

##### thainlp.romanize && translate #####
from flask import Flask, request, jsonify
from pythainlp.transliterate import romanize
from flask_cors import CORS
from pythainlp.translate import Translate
# import torch

app = Flask(__name__)
CORS(app)
th2en = Translate('en', 'th')

@app.route('/translate', methods=['POST'])
def eng_to_thai():
    data = request.get_json()
    english_word = data['english_word']
    translated = full_return(english_word)
    return jsonify(translated)

def full_return(english_word):
    translated_word = th2en.translate(english_word)
    if translated_word and 'Name=สมุดที่อยู่' not in translated_word:
        romanize_word = romanize(translated_word, engine="thai2rom")
        return {'thai_word': translated_word, 'pronunciation': romanize_word}
    else:
        return {'thai_word': '', 'pronunciation': ''}

@app.route('/pronounce', methods=['POST'])
def pronunciation():
    data = request.get_json()
    thai_word = data['thai_word']
    pronunciation = romanization(thai_word)
    return jsonify(pronunciation)

def romanization(thai_word):
    romanize_word = romanize(thai_word, engine="thai2rom")
    return {'pronunciation': romanize_word}

if __name__ == '__main__':
    app.run(port=5001, debug=True)

##### thainlp.transliterate #####
# from flask import Flask, request, jsonify
# from pythainlp.translate import Translate
# from pythainlp.transliterate import transliterate

# app = Flask(__name__)
# th2en = Translate('en', 'th')

# @app.route('/translate', methods=['POST'])
# def eng_to_thai():
#     data = request.get_json()
#     english_word = data['english_word']
#     translated = full_return(english_word)
#     return jsonify(translated)

# def full_return(english_word):
#     translated_word = th2en.translate(english_word)
#     # romanize_word = transliterate(translated_word, engine="icu")
#     # romanize_word = transliterate(translated_word, engine="ipa")
#     romanize_word = transliterate(translated_word, engine="iso_11940")
#     return {'thai_word': translated_word, 'pronunciation': romanize_word}

# if __name__ == '__main__':
#     app.run(port=5001, debug=True)



