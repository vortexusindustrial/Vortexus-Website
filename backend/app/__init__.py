from flask import Flask, jsonify

from .config import Config
from .extensions import cors, db, jwt
from .routes.auth import auth_bp
from .routes.dashboard import dashboard_bp
from .routes.leads import leads_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=False,
    )

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(leads_bp, url_prefix="/api/leads")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    @app.get("/api/health")
    def health_check():
        return jsonify({"status": "ok"})

    with app.app_context():
        from . import models  # noqa: F401

        db.create_all()

    return app
