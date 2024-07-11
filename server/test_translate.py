import unittest
import json
from translate import app, full_return, romanization

class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app.testing = True

    def test_eng_to_thai_translation(self):
        # Mocking the translation function
        response = self.app.post('/translate', json={'english_word': 'hello'})
        data = json.loads(response.get_data(as_text=True))
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('thai_word', data)
        self.assertIn('pronunciation', data)
    
    def test_pronunciation(self):
        response = self.app.post('/pronounce', json={'thai_word': 'สวัสดี'})
        data = json.loads(response.get_data(as_text=True))
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('pronunciation', data)
    
    def test_full_return_function(self):
        result = full_return('hello')
        self.assertIn('thai_word', result)
        self.assertIn('pronunciation', result)
    
    def test_romanization_function(self):
        result = romanization('สวัสดี')
        self.assertIn('pronunciation', result)

if __name__ == '__main__':
    unittest.main()