import sqlite3
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.security import get_password_hash

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "yiran_huanxin.db")

conn = sqlite3.connect(db_path)
c = conn.cursor()

password = "admin123"
hashed = get_password_hash(password)

c.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [t[0] for t in c.fetchall()]
print(f"Tables: {tables}")

if 'users' in tables:
    c.execute("SELECT * FROM users")
    users = c.fetchall()
    print(f"Users count: {len(users)}")
    for u in users:
        print(f"  - {u}")
else:
    print("users table not found!")

c.execute("INSERT OR REPLACE INTO users (username, email, hashed_password, is_superuser, is_active) VALUES (?, ?, ?, ?, ?)",
          ('admin', 'admin@yiran-huanxin.com', hashed, 1, 1))
conn.commit()

c.execute("SELECT username, email FROM users WHERE username = 'admin'")
row = c.fetchone()
print(f"Created admin user: {row}")

conn.close()
