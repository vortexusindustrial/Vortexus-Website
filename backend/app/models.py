from datetime import datetime
from decimal import Decimal
from enum import StrEnum

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db


class UserRole(StrEnum):
    ADMIN = "admin"
    STAFF = "staff"
    SALES = "sales"


class LeadStatus(StrEnum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    QUOTED = "quoted"
    NEGOTIATION = "negotiation"
    WON = "won"
    LOST = "lost"


class QualificationStatus(StrEnum):
    PENDING = "pending"
    QUALIFIED = "qualified"
    UNQUALIFIED = "unqualified"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default=UserRole.STAFF.value)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    assigned_leads = db.relationship(
        "Lead",
        foreign_keys="Lead.assigned_to_id",
        back_populates="assigned_to",
    )
    captured_leads = db.relationship(
        "Lead",
        foreign_keys="Lead.captured_by_id",
        back_populates="captured_by",
    )

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
        }


class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    customer_name = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255))
    phone = db.Column(db.String(60))
    email = db.Column(db.String(255), index=True)
    country = db.Column(db.String(120))

    source_channel = db.Column(db.String(80), nullable=False, default="website", index=True)
    source_medium = db.Column(db.String(80), default="organic")
    source_campaign = db.Column(db.String(120))
    referrer = db.Column(db.String(255))
    landing_page = db.Column(db.String(255), index=True)
    first_page = db.Column(db.String(255))

    product_interest = db.Column(db.String(255), index=True)
    service_interest = db.Column(db.String(255), index=True)
    message = db.Column(db.Text)

    status = db.Column(db.String(30), nullable=False, default=LeadStatus.NEW.value, index=True)
    qualification_status = db.Column(
        db.String(30),
        nullable=False,
        default=QualificationStatus.PENDING.value,
        index=True,
    )

    estimated_value = db.Column(db.Numeric(14, 2), default=Decimal("0.00"))
    quote_value = db.Column(db.Numeric(14, 2), default=Decimal("0.00"))
    final_closed_value = db.Column(db.Numeric(14, 2), default=Decimal("0.00"))
    currency = db.Column(db.String(10), nullable=False, default="KES")
    closed_date = db.Column(db.Date)
    lost_reason = db.Column(db.String(255))

    attribution_owner = db.Column(db.String(120), default="website")

    assigned_to_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    captured_by_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    assigned_to = db.relationship(
        "User",
        foreign_keys=[assigned_to_id],
        back_populates="assigned_leads",
    )
    captured_by = db.relationship(
        "User",
        foreign_keys=[captured_by_id],
        back_populates="captured_leads",
    )

    def money(self, value):
        return float(value or 0)

    def to_dict(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "customer_name": self.customer_name,
            "company_name": self.company_name,
            "phone": self.phone,
            "email": self.email,
            "country": self.country,
            "source_channel": self.source_channel,
            "source_medium": self.source_medium,
            "source_campaign": self.source_campaign,
            "referrer": self.referrer,
            "landing_page": self.landing_page,
            "first_page": self.first_page,
            "product_interest": self.product_interest,
            "service_interest": self.service_interest,
            "message": self.message,
            "status": self.status,
            "qualification_status": self.qualification_status,
            "estimated_value": self.money(self.estimated_value),
            "quote_value": self.money(self.quote_value),
            "final_closed_value": self.money(self.final_closed_value),
            "currency": self.currency,
            "closed_date": self.closed_date.isoformat() if self.closed_date else None,
            "lost_reason": self.lost_reason,
            "attribution_owner": self.attribution_owner,
            "assigned_to": self.assigned_to.to_dict() if self.assigned_to else None,
            "captured_by": self.captured_by.to_dict() if self.captured_by else None,
        }
