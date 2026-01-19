class Config:
    SECRET_KEY= "super-secret"
    import os
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI= f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'login_db.sqlite')}"
    SQLALCHEMY_TRACK_MODIFICATIONS= False
    JWT_TOKEN_LOCATION= ["cookies"]
    JWT_COOKIE_SECURE= False
    JWT_ACCESS_COOKIE_PATH= '/'
    JWT_COOKIE_CSRF_PROTECT= False