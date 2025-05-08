import csv
import sys
import json

def search_universities(query, type_filter, location_filter, level_filter):
    results = []
    with open('admission_data.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if query and query not in row['university_name'] and query not in row['province']:
                continue
            if type_filter and type_filter != row['type']:
                continue
            if location_filter and location_filter != row['province']:
                continue
            if level_filter:
                if level_filter == '985' and row['is_985'] != '1':
                    continue
                if level_filter == '211' and row['is_211'] != '1':
                    continue
            results.append(row)
    return results[:10]  # 返回前10个结果

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else ''
    type_filter = sys.argv[2] if len(sys.argv) > 2 else ''
    location_filter = sys.argv[3] if len(sys.argv) > 3 else ''
    level_filter = sys.argv[4] if len(sys.argv) > 4 else ''
    results = search_universities(query, type_filter, location_filter, level_filter)
    print(json.dumps(results, ensure_ascii=False))  # 返回 JSON 格式的结果