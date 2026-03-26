from flask import jsonify
from app import create_app
from app.extensions import db

app = create_app()


@app.route('/')
def health_check():
    """Health check endpoint for UptimeRobot and other monitors."""
    return jsonify(status='ok', service='NextGen Campus API'), 200


@app.route('/api/health')
def api_health():
    """API health check endpoint."""
    return jsonify(status='ok', service='NextGen Campus API'), 200


@app.cli.command('seed')
def seed_command():
    """Seed the database with initial data."""
    from app.seeds.seed_data import seed
    seed()


@app.cli.command('init-db')
def init_db_command():
    """Create all tables and seed."""
    db.create_all()
    print('✅ Database tables created!')
    from app.seeds.seed_data import seed
    seed()


if __name__ == '__main__':
    app.run(debug=True, port=5001)
