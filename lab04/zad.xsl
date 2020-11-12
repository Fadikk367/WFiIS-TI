<?xml version="1.0" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" version="1.0" indent="yes" doctype-system="about:legacy-compact" />
<xsl:template match="/">
<xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
<html>
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Zadanie 4 - TI</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&amp;display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="./style.css"/>
  </head>
  <body>
    <header>
      <h1>Laboratorium nr 4 - Transformacja XSLT</h1>
    </header>
    <main>
      <nav>
        <h3>Spis cwiczeń do wykonania:</h3>
        <ul>
          <xsl:for-each select="//lab/title" >
            <xsl:call-template name="nav-link" />
          </xsl:for-each>
        </ul>
      </nav>
      <xsl:apply-templates select="labs" />
    </main>
    <footer>TI - 2020 - Adrian Furman</footer>
  </body>
</html>
</xsl:template>
<xsl:template match="labs" >
  <xsl:for-each select="//lab" >
    <article id="{concat('cwiczenie', translate(title,translate(title, '0123456789', ''), ''))}">
      <h2><xsl:value-of select="title" /></h2>
      <p><xsl:value-of select="description" /></p>
      <pre>
        <code>
          <xsl:value-of select="code" />
        </code>
      </pre>
    </article>
  </xsl:for-each>
</xsl:template> 
<xsl:template name="nav-link" >
  <li>
    <a href="{concat('#cwiczenie', translate(.,translate(., '0123456789', ''), ''))}">
      <xsl:value-of select="." />
    </a>
  </li>
</xsl:template> 
</xsl:stylesheet>