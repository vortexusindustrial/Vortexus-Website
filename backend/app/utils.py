from datetime import date
from decimal import Decimal, InvalidOperation

from flask import jsonify


def json_error(message, status_code=400):
    response = jsonify({"error": message})
    response.status_code = status_code
    return response


def parse_decimal(value, default="0.00"):
    if value in (None, ""):
        return Decimal(default)

    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        raise ValueError("Invalid decimal value")


def parse_date(value):
    if not value:
        return None

    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError("Invalid date format. Use YYYY-MM-DD.") from exc
