#!/usr/bin/env python3
import cgi
import cgitb
import sys
import json

from os import environ
from urllib.parse import unquote

cgitb.enable()


data = cgi.FieldStorage()
encodedAnswer = data.getvalue("answer")

j = json.loads(unquote(encodedAnswer))

read_db = open('./data.json', 'r')
db = json.load(read_db)
read_db.close()

db['0']['answers'][j['0']]['votes'] += 1
db['1']['answers'][j['1']]['votes'] += 1
db['2']['answers'][j['2']]['votes'] += 1

write_db = open('./data.json', 'w')
json.dump(db, write_db)
write_db.close()


print("Content-type: application/json")
print()
print(json.dumps(db))