from datetime import datetime, time, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..extensions import db
from ..models import Lead, LeadStatus, QualificationStatus, User
from ..utils import json_error, parse_date, parse_decimal

leads_bp = Blueprint("leads", __name__)


def build_filtered_query():
    query = Lead.query.order_by(Lead.created_at.desc())

    status = request.args.get("status")
    qualification_status = request.args.get("qualification_status")
    source_channel = request.args.get("source_channel")
    landing_page = request.args.get("landing_page")
    product_interest = request.args.get("product_interest")
    service_interest = request.args.get("service_interest")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if status:
        query = query.filter(Lead.status == status)
    if qualification_status:
        query = query.filter(Lead.qualification_status == qualification_status)
    if source_channel:
        query = query.filter(Lead.source_channel == source_channel)
    if landing_page:
        query = query.filter(Lead.landing_page == landing_page)
    if product_interest:
        query = query.filter(Lead.product_interest == product_interest)
    if service_interest:
        query = query.filter(Lead.service_interest == service_interest)
    if start_date:
        query = query.filter(
            Lead.created_at >= datetime.combine(parse_date(start_date), time.min)
        )
    if end_date:
        end = parse_date(end_date)
        query = query.filter(
            Lead.created_at < datetime.combine(end + timedelta(days=1), time.min)
        )

    return query


def apply_lead_payload(lead, payload, *, public=False):
    if public:
        allowed_fields = {
            "customer_name",
            "company_name",
            "phone",
            "email",
            "country",
            "source_channel",
            "source_medium",
            "source_campaign",
            "referrer",
            "landing_page",
            "first_page",
            "product_interest",
            "service_interest",
            "message",
            "attribution_owner",
        }
    else:
        allowed_fields = {
            "customer_name",
            "company_name",
            "phone",
            "email",
            "country",
            "source_channel",
            "source_medium",
            "source_campaign",
            "referrer",
            "landing_page",
            "first_page",
            "product_interest",
            "service_interest",
            "message",
            "status",
            "qualification_status",
            "estimated_value",
            "quote_value",
            "final_closed_value",
            "currency",
            "closed_date",
            "lost_reason",
            "attribution_owner",
            "assigned_to_id",
        }

    for field in allowed_fields:
        if field not in payload:
            continue

        value = payload[field]

        if field in {"estimated_value", "quote_value", "final_closed_value"}:
            setattr(lead, field, parse_decimal(value))
        elif field == "closed_date":
            setattr(lead, field, parse_date(value))
        elif field == "assigned_to_id":
            setattr(lead, field, int(value) if value else None)
        elif field == "status":
            if value not in {item.value for item in LeadStatus}:
                raise ValueError("Invalid lead status.")
            setattr(lead, field, value)
        elif field == "qualification_status":
            if value not in {item.value for item in QualificationStatus}:
                raise ValueError("Invalid qualification status.")
            setattr(lead, field, value)
        else:
            setattr(lead, field, value)


@leads_bp.post("/public")
def create_public_lead():
    payload = request.get_json(silent=True) or {}
    customer_name = (payload.get("customer_name") or "").strip()

    if not customer_name:
        return json_error("Customer name is required.")

    lead = Lead(customer_name=customer_name)

    try:
        apply_lead_payload(lead, payload, public=True)
    except ValueError as exc:
        return json_error(str(exc))

    if not lead.source_channel:
        lead.source_channel = "website"

    db.session.add(lead)
    db.session.commit()

    return jsonify({"message": "Lead captured successfully.", "lead": lead.to_dict()}), 201


@leads_bp.get("")
@jwt_required()
def list_leads():
    try:
        query = build_filtered_query()
    except ValueError as exc:
        return json_error(str(exc))

    leads = query.all()
    return jsonify({"leads": [lead.to_dict() for lead in leads]})


@leads_bp.get("/<int:lead_id>")
@jwt_required()
def get_lead(lead_id):
    lead = Lead.query.get_or_404(lead_id)
    return jsonify({"lead": lead.to_dict()})


@leads_bp.patch("/<int:lead_id>")
@jwt_required()
def update_lead(lead_id):
    lead = Lead.query.get_or_404(lead_id)
    payload = request.get_json(silent=True) or {}
    current_user = User.query.get(int(get_jwt_identity()))

    try:
        apply_lead_payload(lead, payload, public=False)
    except ValueError as exc:
        return json_error(str(exc))

    if current_user and not lead.captured_by_id:
        lead.captured_by_id = current_user.id

    db.session.commit()
    return jsonify({"message": "Lead updated successfully.", "lead": lead.to_dict()})
