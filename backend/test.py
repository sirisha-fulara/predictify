from werkzeug.security import generate_password_hash

hashed_password = generate_password_hash("adminpassword", method='scrypt')
print(hashed_password)
