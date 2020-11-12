<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" version="5.0" indent="yes" doctype-system="about:legacy-compact" />
<xsl:param name="sortby">name</xsl:param>
<xsl:template match="/">
<html>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Zadanie 5 - TI</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&amp;display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="../cgi-static/style.css"/>
  </head>
  <body>
    <header>
      <h1>Laboratorium nr 5 - Interfejs CGI</h1>
    </header>
    <main>
      <nav>
        <h2>Stan magazynu kawiarni</h2>
        <div>
          <span>Sortuj według:</span>
          <a href="?sortby=name">nazwa</a>
          <a href="?sortby=price">cena</a>
          <a href="?sortby=quantity">ilość</a>
        </div>
      </nav>
      <table>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Cena</th>
            <th>Ilość</th>
          </tr>
        </thead>
        <tbody>
        <xsl:for-each select="//group" >
          <tr>
            <th colspan="3"><xsl:value-of select="title" /></th>
          </tr>
            
          <xsl:if test="$sortby = 'name'">
            <xsl:for-each select="products/product" >
              <xsl:sort select="name/text()" data-type="text" />
              <xsl:call-template name="product" />
            </xsl:for-each>
          </xsl:if>

          <xsl:if test="$sortby = 'price'">
            <xsl:for-each select="products/product" >
              <xsl:sort select="price/text()" data-type="number" />
              <xsl:call-template name="product" />
            </xsl:for-each>
          </xsl:if>

          <xsl:if test="$sortby = 'quantity'">
            <xsl:for-each select="products/product" >
              <xsl:sort select="quantity/text()" data-type="number" />
              <xsl:call-template name="product" />
            </xsl:for-each>
          </xsl:if>

        </xsl:for-each>
        </tbody>
      </table>
    </main>
    <footer>TI - 2020 - Adrian Furman</footer>
  </body>
</html>
</xsl:template>
<xsl:template name="product" >
  <tr class="row">
   <td class="name"><xsl:value-of select="name" /></td>
   <td class="price"><xsl:value-of select="price" /></td>
   <td class="quantity"><xsl:value-of select="quantity" /></td>
  </tr>
</xsl:template>
</xsl:stylesheet>