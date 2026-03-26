import os
from flask import Flask
from app.config import DevelopmentConfig, ProductionConfig
from app.extensions import db, migrate, jwt, cors


def create_app(config_class=None):
    if config_class is None:
        if os.getenv('FLASK_ENV') == 'production' or os.getenv('RENDER'):
            config_class = ProductionConfig
        else:
            config_class = DevelopmentConfig

    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    from app.models.token_blocklist import TokenBlocklist

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return TokenBlocklist.query.filter_by(jti=jti).first() is not None

    from app.routes import register_blueprints
    register_blueprints(app)

    # Auto-initialize database on first startup
    with app.app_context():
        try:
            from app.models.user import User
            db.create_all()
            if not User.query.first():
                print('🔧 No users found — seeding database...')
                from app.seeds.seed_data import seed
                seed()
            else:
                print('✅ Database already initialized.')
        except Exception as e:
            print(f'⚠️ DB init skipped: {e}')

    return app
