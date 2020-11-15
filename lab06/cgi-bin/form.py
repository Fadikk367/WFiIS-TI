#!/usr/bin/env python3
import sys 
sys.stderr = sys.stdout 
import os 
import cgi


form = cgi.FieldStorage()

name = form.getvalue('name')
surname = form.getvalue('surname')
email = form.getvalue('email')
year = form.getvalue('year')


data_file = open('../cgi-static/data.csv', 'a')     
data_file.write(f'{name},{surname},{email},{year}\n')
data_file.close()


with open('../cgi-static/redirect.html') as redirect_template:
  html = redirect_template.read()

  print("Content-type: text/html") 
  print("Refresh: 1; URL=data.py") 
  print()
  print(html)
