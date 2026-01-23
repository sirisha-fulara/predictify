class Config:
    SECRET_KEY= "super-secret"
    import os
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI= f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'login_db.sqlite')}"
    SQLALCHEMY_TRACK_MODIFICATIONS= False
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    
    # Cookie Security for Cross-Site (Vercel -> Render)
    # Browsers block cross-site cookies unless SameSite='None' and Secure=True
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = True  # Required for SameSite=None
    JWT_COOKIE_SAMESITE = 'None' # Required for Cross-Site
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_COOKIE_CSRF_PROTECT = False # Disabled for simplicity in this setup