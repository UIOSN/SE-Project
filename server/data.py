import mysql.connector
import sys
import json

def search_universities(query, type_filter, location_filter, level_filter):
    results = []
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="123456",
            database="gkvr_system"
        )
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT school_name, province_name, school_type, is985, is211 FROM school_info WHERE 1=1"
        params = []

        if query:
            sql += " AND (school_name LIKE %s OR province_name LIKE %s)"
            params.extend([f"%{query}%", f"%{query}%"])

        if type_filter:
            sql += " AND school_type = %s"
            params.append(type_filter)

        if location_filter:
            sql += " AND province_name = %s"
            params.append(location_filter)

        if level_filter:
            if level_filter == '985':
                sql += " AND is985 = 1"
            elif level_filter == '211':
                sql += " AND is211 = 1"

        cursor.execute(sql, params)
        results = cursor.fetchall()

    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

    return results[:10]  # 返回前10个结果

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else ''
    type_filter = sys.argv[2] if len(sys.argv) > 2 else ''
    location_filter = sys.argv[3] if len(sys.argv) > 3 else ''
    level_filter = sys.argv[4] if len(sys.argv) > 4 else ''
    results = search_universities(query, type_filter, location_filter, level_filter)
    print(json.dumps(results, ensure_ascii=False))  # 返回 JSON 格式的结果