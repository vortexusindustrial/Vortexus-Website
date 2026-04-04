from collections import defaultdict

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from ..models import Lead, LeadStatus, QualificationStatus
from .leads import build_filtered_query

dashboard_bp = Blueprint("dashboard", __name__)


def money(value):
    return float(value or 0)


@dashboard_bp.get("/summary")
@jwt_required()
def summary():
    try:
        leads = build_filtered_query().all()
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    website_leads = [lead for lead in leads if lead.source_channel == "website"]
    qualified_leads = [
        lead
        for lead in website_leads
        if lead.qualification_status == QualificationStatus.QUALIFIED.value
    ]
    won_leads = [lead for lead in website_leads if lead.status == LeadStatus.WON.value]
    open_pipeline_leads = [
        lead
        for lead in website_leads
        if lead.status
        in {
            LeadStatus.NEW.value,
            LeadStatus.CONTACTED.value,
            LeadStatus.QUALIFIED.value,
            LeadStatus.QUOTED.value,
            LeadStatus.NEGOTIATION.value,
        }
    ]

    pipeline_value = sum(
        money(lead.quote_value) if money(lead.quote_value) > 0 else money(lead.estimated_value)
        for lead in open_pipeline_leads
    )
    won_revenue = sum(money(lead.final_closed_value) for lead in won_leads)
    conversion_rate = (len(won_leads) / len(website_leads) * 100) if website_leads else 0

    stage_counts = defaultdict(int)
    page_leads = defaultdict(int)
    page_revenue = defaultdict(float)
    product_leads = defaultdict(int)
    product_revenue = defaultdict(float)

    for lead in website_leads:
        stage_counts[lead.status] += 1
        page_key = lead.landing_page or "Unknown"
        product_key = lead.product_interest or lead.service_interest or "Unspecified"
        page_leads[page_key] += 1
        product_leads[product_key] += 1

        if lead.status == LeadStatus.WON.value:
            page_revenue[page_key] += money(lead.final_closed_value)
            product_revenue[product_key] += money(lead.final_closed_value)

    top_pages = [
        {"page": page, "leads": count, "revenue": round(page_revenue.get(page, 0), 2)}
        for page, count in sorted(page_leads.items(), key=lambda item: item[1], reverse=True)
    ]
    top_products = [
        {
            "product": product,
            "leads": count,
            "revenue": round(product_revenue.get(product, 0), 2),
        }
        for product, count in sorted(product_leads.items(), key=lambda item: item[1], reverse=True)
    ]

    recent_closed_deals = [
        {
            "id": lead.id,
            "customer_name": lead.customer_name,
            "company_name": lead.company_name,
            "landing_page": lead.landing_page,
            "product_interest": lead.product_interest,
            "final_closed_value": money(lead.final_closed_value),
            "currency": lead.currency,
            "closed_date": lead.closed_date.isoformat() if lead.closed_date else None,
        }
        for lead in sorted(
            won_leads,
            key=lambda item: item.closed_date.isoformat() if item.closed_date else "",
            reverse=True,
        )[:10]
    ]

    return jsonify(
        {
            "kpis": {
                "website_leads": len(website_leads),
                "qualified_website_leads": len(qualified_leads),
                "website_pipeline_value": round(pipeline_value, 2),
                "website_sourced_revenue": round(won_revenue, 2),
                "lead_to_sale_conversion_rate": round(conversion_rate, 2),
                "won_deals": len(won_leads),
            },
            "stage_counts": dict(stage_counts),
            "top_pages": top_pages[:10],
            "top_products": top_products[:10],
            "recent_closed_deals": recent_closed_deals,
        }
    )
