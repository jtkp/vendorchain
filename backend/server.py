# standard library imports
import json
import random
import sys

# third-party imports
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_restx import Resource, Api, fields, inputs, reqparse
import sqlite3

# local imports
from db import *
import contracts
import users

app = Flask(__name__)
api = Api(app,
          default="Default",  # Default namespace
          title="Vendor Management System COMP6452",  # Documentation Title
          description="This page contains all of the HTTP requests that we service.")  # Documentation Description

app.register_blueprint(contracts.bp)
api.add_namespace(contracts.api)
app.register_blueprint(users.bp)
api.add_namespace(users.api)

cors = CORS(app)

# Register an account
register_payload = api.model('register account', {
    "email": fields.String,
    "password": fields.String,
    "first_name": fields.String,
    "last_name": fields.String,
})

@api.route('/register', methods=['POST'])
class Users(Resource):
    # Use received information to register an account
    @api.response(200, 'New account registered successfully')
    @api.response(400, 'Bad request')
    @api.doc(description="Register a new account")
    @api.expect(register_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        parser.add_argument('first_name', required=True)
        parser.add_argument('last_name', required=True)
        args = parser.parse_args()
        # print(args)

        # if email is already registered, return false
        # if (email_exists(args.email)):
        #     return {'message': f'A user with that email already exists',
        #             'value': False}

        # at this point, all inputs should be valid
        # insert values into users table
        columns = "email, password, first_name, last_name"
        params = f"'{args.email}', '{args.password}', '{args.first_name}', '{args.last_name}'"
        db_insert('users', columns, params)

        return {'value': True}


# login
login_payload = api.model('login info', {
    "email": fields.String,
    "password": fields.String
})

@api.route('/login', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully logged in')
    @api.response(400, 'Bad request')
    @api.doc(description="Enter email and password")
    @api.expect(login_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True)
        parser.add_argument('password', required=True)
        args = parser.parse_args()

        # code here


# logout
logout_payload = api.model('logout info', {
    "id": fields.Integer
})

@api.route('/logout', methods=['POST'])
class Users(Resource):
    @api.response(200, 'Successfully logged out')
    @api.response(400, 'Bad request')
    @api.doc(description="Automatically logs out")
    @api.expect(logout_payload)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        args = parser.parse_args()

        # code here


if __name__ == '__main__':
    app.run(debug=True)