class Config:
    SECRET_KEY= "super-secret"
    SQLALCHEMY_DATABASE_URI= "sqlite:///login_db.sqlite"
    SQLALCHEMY_TRACK_MODIFICATIONS= False
    JWT_TOKEN_LOCATION= ["cookies"]
    JWT_COOKIE_SECURE= False
    JWT_ACCESS_COOKIE_PATH= '/'
    JWT_COOKIE_CSRF_PROTECT= False