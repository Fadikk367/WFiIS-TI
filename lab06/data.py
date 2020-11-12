participants = open('./data.csv', 'r')


def generate_html_list(participants):
  html = '<ul id="participants">\n'
  items = ''
  for i, record in enumerate(participants):
    parts = record.split(',')

    items += '<li class="participant">'
    
    items += f'<span class="lp">{i}.</span>'
    items += f'<span class="name">{parts[0]}</span>'
    items += f'<span class="surname">{parts[1]}</span>'
    items += f'<span class="email">{parts[2]}</span>'
    items += f'<span class="year">{parts[3]}</span>'
      
    items += '</li>\n'

  html += items
  html += '</ul>\n'
  return html

print(generate_html_list(participants))

