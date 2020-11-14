#!/usr/bin/env python3
import sys 
sys.stderr = sys.stdout 
import os 
import cgi


data_file = open('../cgi-static/data.csv', "a")     

form = cgi.FieldStorage()

name = form.getvalue('name')
surname = form.getvalue('surname')
email = form.getvalue('email')
year = form.getvalue('year')

data_file.write(f'{name},{surname},{email},{year}')
data_file.close()

print("Content-type: text/html") 
print()
print('<h1>THANKS</h1><a href="./data.py">DANE</a>')
print(f'<h1>{name}</h1>')
print(f'<h1>{surname}</h1>')
print(f'<h1>{email}</h1>')
print(f'<h1>{year}</h1>')
print(f'<p>{data_file.read()}</p>')