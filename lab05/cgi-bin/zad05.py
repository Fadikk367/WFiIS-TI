#!/usr/bin/python3 
import sys 
sys.stderr = sys.stdout 
import os 
import cgi
from lxml import etree


xmlfile = open('../cgi-static/warehouse.xml')     
xslfile = open('../cgi-static/warehouse.xsl')

xmldom = etree.parse(xmlfile)
xsldom = etree.parse(xslfile)
transform = etree.XSLT(xsldom) 

form = cgi.FieldStorage()
sortby = form.getvalue('sortby', 'name')

result = transform(xmldom, sortby=f"'{sortby}'")

print("Content-type: text/html") 
print()
print(result)
