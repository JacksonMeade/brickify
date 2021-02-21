import requests
import json 
from datetime import datetime

class CitationGenerator:
    def __init__(self):
        pass
    
    def getCitation(self, url):

        s = requests.session()
        s.headers = {
            'authority': 'www.easybib.com',
            'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            #'tracestate': '65366@nr=0-1-501356-568179148-c1871338ebfd7fb8----1613855629828',
            #'traceparent': '00-b0f516730d7eb0e62267bfc1abf38080-c1871338ebfd7fb8-01',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
            #'newrelic': 'eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjUwMTM1NiIsImFwIjoiNTY4MTc5MTQ4IiwiaWQiOiJjMTg3MTMzOGViZmQ3ZmI4IiwidHIiOiJiMGY1MTY3MzBkN2ViMGU2MjI2N2JmYzFhYmYzODA4MCIsInRpIjoxNjEzODU1NjI5ODI4LCJ0ayI6IjY1MzY2In19',
            'content-type': 'application/json',
            'accept': 'application/json',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://www.easybib.com/',
            'accept-language': 'en-US,en;q=0.9',
        # 'cookie': 'al_cell_writing=migration-2020-12-control; al_cell_martech=2019-07-02--main; al_cell=edge-35-test; al_ff=eyJhbGxvY2F0aW9uTWFwIjp7ImFsX2NlbGxfd3JpdGluZyI6Im1pZ3JhdGlvbi0yMDIwLTEyLWNvbnRyb2wiLCJhbF9jZWxsX21hcnRlY2giOiIyMDE5LTA3LTAyLS1tYWluIiwiYWxfY2VsbCI6ImVkZ2UtMzUtdGVzdCJ9LCJzdXBlcmF1dGhSZXNwb25zZVR5cGUiOiJjb2RlIiwiZm9sZGVycyI6dHJ1ZSwidmFsaWRhdG9yIjp0cnVlLCJlYXN5YmliU2VydmljZXMiOiJ3dGFpIiwicmlnaHRUMlZpZXdwb3J0Ijp0cnVlLCJhY3RpdmF0aW9uQ3RhIjoiaW5saW5lLXdpZGdldCIsInVwbG9hZFdpZGdldFRhZyI6dHJ1ZSwib25lVHJ1c3R2MiI6dHJ1ZSwiY2NwYSI6dHJ1ZSwiaXNVY2YiOnRydWUsInNob3J0Q2lyY3VpdHYyIjoiaHR0cHM6Ly9nZHByLnN0dWR5YnJlYWttZWRpYS5jb20vc2hvcnQtY2lyY3VpdC12aWV3ZXItbG9jYXRpb24uanMifQ%3D%3D; optimizelyEndUserId=oeu1613855628702r0.9276676272659217; _gd1613855628774=1; sbm_a_b_test=35-test; sbm_country=US; sbm_sbm_session_id_2=8869f45d-19eb-42f5-b3fa-67d223a396b5; V=6c6a162ae541ba1f8d5e910b988ef95460317b8d676c8c.40631266; sbm_sbm_id=0100007F8E7B316041000B480231BF12; sbm_dma=560; mcid=89876367704185584269067506441774622084',
        }




        params = (
            ('client', 'cfe'),
        )

        response = s.get('https://www.easybib.com/api/auth/token',  params=params)
        data = json.loads(response.text)
        token = data['jwt']
        s.headers['authorization'] = f'Bearer {token}'
        'anuZaem3ChaichuGhoh8gaiNeequee'
        urlScrapeHeaders = {
            'authority': 'autocite.citation-api.com',
            'accept': 'application/vnd.com.easybib.data+json',
            'pragma': 'no-cache',
            'authorization': 'Bearer anuZaem3ChaichuGhoh8gaiNeequee',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
            'x-alcell': 'edge-35-test',
            'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
            'origin': 'https://www.easybib.com',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://www.easybib.com/',
            'accept-language': 'en-US,en;q=0.9',
        }
        params = (
            ('url', url),
        )
        response = s.get("https://autocite.citation-api.com/api/v3/query", params=params, headers=urlScrapeHeaders)
        data = json.loads(response.text)
        primaryResult = data['results'][0]



        data = {
        "operationName":"FoldersCreateProject",
        "variables":{
        "folderId": None,
        "name":"My Citation list 2/20/2021",
        "defaultStyle":"mla8",
        "public":True
        },
        "query":"mutation FoldersCreateProject($name: String!, $public: Boolean!, $defaultStyle: String!, $folderId: Int = null) {\n createProject(name: $name, public: $public, defaultStyle: $defaultStyle, folderId: $folderId) {\n id\n name\n defaultStyle\n date: updatedAt\n public\n __typename\n }\n}\n"
        }

        response = s.post('https://bff.writing.chegg.com/graphql', json=data)

        data = json.loads(response.text)
        projectID = data['data']['createProject']['id']

        data = {
                    "operationName":"CreateCitation",
                    "variables":{
                    "projectId": projectID,
                    "contributors":[
                    {
                    "function":"author",
                    "first": primaryResult['csl']['author'][0]['given'],
                    "middle":"",
                    "last":primaryResult['csl']['author'][0]['family'],
                    "data":{
                    "suffix":""
                    }
                    }
                    ],
                    "annotation":"",
                    "data":{
                    "source":"website",
                    "pubtype":{
                    "main":"pubonline",
                    "suffix":""
                    },
                    "website":{
                    "title": primaryResult['csl']['title']
                    },
                    "pubonline":{
                    "title":primaryResult['csl']['title-short'],
                    "inst": primaryResult['csl']['publisher'],
                    "url": url,
                    "day": primaryResult['csl']['issued']['date-parts'][0][1],
                    "month": primaryResult['csl']['issued']['date-parts'][0][2],
                    "year":primaryResult['csl']['issued']['date-parts'][0][0],
                    "timestamp":""
                    },
                    "annotation":"",
                    "validatorStatus":"complete"
                    }
                    },
                    "query" :"mutation CreateCitation($projectId: String!, $pubType: String, $sourceType: String, $annotation: String, $contributors: [ContributorInput!], $data: JSON!) {\n  createCitation(projectId: $projectId, pubType: $pubType, sourceType: $sourceType, annotation: $annotation, contributors: $contributors, data: $data) {\n    citationId\n    id: citationId\n    projectId\n    data\n    annotation\n    contributors {\n      data\n      first\n      function\n      last\n      __typename\n    }\n    __typename\n  }\n}\n"

                    }
        response = s.post('https://bff.writing.chegg.com/graphql', json=data)

        data = {
        "operationName":"GetFormattedCitations",
        "variables":{
        "order":"desc",
        "limit":500,
        "page":1,
        "projectId": projectID,
        "style":"mla8"
        },
        "query": "query GetFormattedCitations($projectId: String!, $style: String!, $order: Order = desc, $limit: Int = 500, $page: Int = 1) {\n  formattedCitations(projectId: $projectId, style: $style, order: $order, limit: $limit, page: $page) {\n    projectId\n    citationId\n    createdAt\n    annotation\n    data\n    formattedData {\n      citation\n      footnote\n      __typename\n    }\n    contributors {\n      first\n      middle\n      last\n      function\n      data\n      __typename\n    }\n    __typename\n  }\n}\n"
        }

        response = s.post('https://bff.writing.chegg.com/graphql', json=data)
        data = json.loads(response.text)

        citation = data['data']['formattedCitations'][0]['formattedData']['citation']

        return citation
