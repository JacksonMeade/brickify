from flask import Flask, render_template, request, redirect, url_for, abort, jsonify
from citation import CitationGenerator
from summarize import summaryGenerator

app = Flask(__name__)
gen = CitationGenerator()
summaryGen = summaryGenerator()


@app.route("/api/get/citation")
def getCitation():
    try:
        url = request.args.get("url")
        citation = gen.getCitation(url)
        response = {
            "success" : True,
            "citation" : citation
        }
        return jsonify(response), 200
    except Exception as e:
        response = {
            "success" : False,
            "error" : str(e)
        }
        return jsonify(response), 501



@app.route("/api/get/summary")
def getSummary():
    try:
        url = request.args.get("url")
        summary = summaryGen.getSummary(url)
        response = {
            "success" : True,
            "summary" : summary
        }
        return jsonify(response), 200
    except Exception as e:
        response = {
            "success" : True,
            "error" : e
        }
        return jsonify(response), 501



if __name__ == "__main__":
    app.run(debug=False)
    #app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWwdadwadawdawdX/,?RT'
    #app.run()
