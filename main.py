from shareplum import Site
from shareplum import Office365
from shareplum.site import Version
from office365.runtime.auth.authentication_context import AuthenticationContext
from office365.sharepoint.client_context import ClientContext
from office365.sharepoint.files.file import File
from operator import itemgetter
import re
import datetime
from dateutil import relativedelta
from datetime import datetime
import time

authcookie = Office365('https://grupolsl.sharepoint.com', username='reldery_assuncao@lslgr.com.br', password='23#manaus').GetCookies()
site = Site('https://grupolsl.sharepoint.com/sites/RW/', authcookie=authcookie)

new_list = site.List('PL')
sp_data = new_list.GetListItems(fields=['PL', 'ID'])

i = len(sp_data)
i += 1

# my_data = data=[{'Title': 'ZZAKI X YALLO','ID_': i}]
# new_list.UpdateListItems(data=my_data,kind='New')

sp_data = new_list.GetListItems(fields=['PL', 'ID'])
id = new_list.GetListItems(fields=['ID'])

qtd = len(sp_data)

try:

    outraLista = re.findall('\d+', str(id))



    nm = []


    for item in outraLista:
        nm = [int(item)]
        # print (nm)
        
    qtd_ttl = max(nm)
    qtd = int(qtd)
    pri = qtd_ttl - qtd
    pri += 1
    fim = max(nm)
    fim += 1 
    i = int(pri)
    até = int(fim)

    while i < fim:
        my_range = [int(i)]
        new_list.UpdateListItems(data=my_range,kind='Delete')

        i += 1
except:
    pass




from operator import concat
from re import I
from tkinter.ttk import Separator
import requests
import json
from datetime import date, datetime
from dateutil.relativedelta import relativedelta
from datetime import date
import os





def getYour(your: str):

    # concatena a hora atual + o minuto de aposta e subtrai 2 minutos
    your = datetime.strptime(your, '%d/%m/%Y %H:%M')

    # Monta hora que deve aposta
    your = datetime.strftime(your + relativedelta(hours=-4), '%d/%m/%Y %H:%M')

    return your


data_atual = date.today()


data = date.today().strftime('%d%m%Y')
data = str(data)
#https://football.esportsbattle.com/en/schedule?page=1&dateFrom=2022%2F08%2F21+08%3A00&dateTo=2022%2F08%2F21+23%3A59
dateFrom = f'{data[4:10]}%2F{data[2:4]}%2F{data[0:2]}+10%3A00'
dateTo = f'{data[4:10]}%2F{data[2:4]}%2F{int(data[0:2])+1}+23%3A59'
URL = f'https://football.esportsbattle.com/api/tournaments?page=1&dateFrom={dateFrom}&dateTo={dateTo}'

dados = json.loads(requests.get(URL).text)
paginas = int(dados['totalPages'])

pagina = 1
while pagina <= paginas:
    URL = f'https://football.esportsbattle.com/api/tournaments?page={pagina}&dateFrom={dateFrom}&dateTo={dateTo}'
    linhas = json.loads(requests.get(URL).text)['tournaments']
   
    for linha in linhas:
        page = json.loads(requests.get(f"https://football.esportsbattle.com/api/tournaments/{linha['id']}/matches").text)

        for lin in page:
            your = str(lin['date']).replace('T', ' ').replace('Z', '').replace('-', '/')
            your = getYour(datetime.strptime(your, '%Y/%m/%d %H:%M:%S').strftime('%d/%m/%Y %H:%M'))
            ID = 'ECF_'
            player_01 = lin['participant1']['nickname']
            player_01 = player_01.replace(ID,'')
    
            player_02 = lin['participant2']['nickname']
            player_02 = player_02.replace(ID,'')

            team_01 = lin['participant1']['team']['token_international']
            team_02 = lin['participant2']['team']['token_international']

            your = your [11:]

            res = your + ';' + team_01 + ' (' + player_01 + ') Esports ' + 'x ' +  team_02 + ' (' + player_02 + ') Esports' + '\n'

            res = your + ';' + team_01 + ' (' + player_01 + ') Esports ' + 'x ' +  team_02 + ' (' + player_02 + ') Esports' + '\n'
            my_data = data=[{'PL': res, 'LIGA': '8 min', 'DT_CONFRONTO': your, 'PL_H': player_01, 'PL_A': player_02, 'TEAM_H': team_01, 'TEAM_A': team_02,
                            'CH_H': player_01 + ' com ' + team_01, 'CH_A': player_02+ ' com ' + team_02}]
            new_list.UpdateListItems(data=my_data,kind='New')
            
            pagina += 1
            print(res)

            




