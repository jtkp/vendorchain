# standard library imports
import json

# third-party imports
from flask import Flask, request, jsonify, Blueprint
from flask_restx import Resource, Api, fields, inputs, reqparse, Namespace
import sqlite3

# local imports


bp = Blueprint('users', __name__, url_prefix='/users')
api = Namespace("users", "Operations for users")
