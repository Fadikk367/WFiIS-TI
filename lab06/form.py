#!/usr/bin/python3 
import sys 
sys.stderr = sys.stdout 
import os 
import cgi


data_file = open('./data.csv', 'w+')     

form = cgi.FieldStorage()

name = form.getvalue('name')
surname = form.getvalue('surname')
email = form.getvalue('email')
year = form.getvalue('year')

data_file.write(f'{name},{surname},{email},{year}')
data_file.close()

print("Content-type: text/html") 
print()
print(result)
