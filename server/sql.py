import sqlite3
import pandas as pd

# 读取 CSV 文件
df = pd.read_csv("admission_data.csv")

# 连接 SQLite 数据库（不存在会自动创建）
conn = sqlite3.connect("universities.db")
cursor = conn.cursor()

# 建表（如果不存在）
cursor.execute("""
CREATE TABLE IF NOT EXISTS admission_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    university_name TEXT,
    year INTEGER,
    province TEXT,
    category TEXT,
    min_score INTEGER,
    min_rank INTEGER,
    is_985 BOOLEAN,
    is_211 BOOLEAN,
    city TEXT,
    type TEXT
)
""")

# 导入数据
df.to_sql("admission_info", conn, if_exists="append", index=False)

print("✅ 数据已导入数据库 universities.db 中的 admission_info 表。")

conn.close()
