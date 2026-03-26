from app import create_app
from app.extensions import db

app = create_app()


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
