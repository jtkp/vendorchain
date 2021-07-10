# standard library imports
import json

# third-party imports
from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

# local imports


bp = Blueprint('contracts', __name__, url_prefix='/contracts')
api = Namespace("contracts", "Operations for contracts")

# create contract
contract_payload = api.model('contract', {
    "title": fields.String,
    "description": fields.String,
    "creation_date": fields.String,
    "last_updated": fields.String,
    "conditions": fields.String,
    "contract_path": fields.String,
    "state": fields.String
})

@api.route('/create', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully created contract')
    @api.response(400, 'Bad Request')
    @api.doc(description="Creates a contract with the given info")
    @api.expect(contract_payload)
    def post(self):
        parser = reqparse.RequestParser()
        
        # code here

        return


# update contract info
update_payload = api.model('update info', {
    "title": fields.String,
    "description": fields.String,
    "creation_date": fields.String,
    "last_updated": fields.String,
    "conditions": fields.String,
    "contract_path": fields.String,
    "state": fields.String
})

@api.route('/update', methods=['PUT'])
class Users(Resource):
    @api.response(200, 'Successfully updated contract')
    @api.response(404, 'Not Found')
    @api.doc(description="Updates a contract given its id")
    @api.expect(update_payload)
    def put(self, id):
        parser = reqparse.RequestParser()

        # code here

        return {'value': True}

