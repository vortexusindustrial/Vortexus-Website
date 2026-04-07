from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
CATALOG_PATH = PUBLIC / "catalog" / "stock-products.json"
SUMMARY_PATH = PUBLIC / "catalog" / "catalog-summary.json"
PLACEHOLDER = "/place holder.jpg"


@dataclass(frozen=True)
class ImageAsset:
    source: str
    destination: str


@dataclass(frozen=True)
class Rule:
    destination: str
    patterns: tuple[str, ...]
    category: str | None = None
    subcategory: str | None = None


ASSETS = [
    ImageAsset("images/DOSINGPUMP.webp", "images/products/pumps-fluid-handling/dosing-pump.webp"),
    ImageAsset("images/Low-Pressure-Industrial-RO-Membrane-4040.jpg", "images/products/reverse-osmosis-systems/ro-membrane-4040.jpg"),
    ImageAsset("images/ro-membranes.jpg", "images/products/reverse-osmosis-systems/ro-membranes.jpg"),
    ImageAsset("images/ultrafiltration.jpeg", "images/products/filtration-systems/ultrafiltration.jpeg"),
    ImageAsset("images/assets/img/products/200cubic-reverse-osmosis-unit.webp", "images/products/reverse-osmosis-systems/ro-skid.webp"),
    ImageAsset("images/assets/img/products/domestic-booster-pump.jpg", "images/products/pumps-fluid-handling/booster-pump.jpg"),
    ImageAsset("images/assets/img/pumps/Submersible-Dewatering-Pumps.webp", "images/products/pumps-fluid-handling/submersible-pump.webp"),
    ImageAsset("images/pumps/Horizontal-booster-sets.jpg", "images/products/pumps-fluid-handling/horizontal-booster-set.jpg"),
    ImageAsset("images/assets/img/pumps/Lowara-GHV30-vertical-booster.webp", "images/products/pumps-fluid-handling/vertical-booster.webp"),
    ImageAsset("images/pumps/control-panel.png", "images/products/automation-control/control-panel.png"),
    ImageAsset("images/pumps/control-panel-500.webp", "images/products/automation-control/ro-control-panel.webp"),
    ImageAsset("images/pumps/ROC-2315.webp", "images/products/automation-control/roc-2315.webp"),
    ImageAsset("images/assets/img/pumps/pumpcontrollers.webp", "images/products/automation-control/pump-controller.webp"),
    ImageAsset("images/pumps/pressure-gauge-20bar.jpg", "images/products/monitoring-instrumentation/pressure-gauge-20bar.jpg"),
    ImageAsset("images/assets/img/borehole/smartmeter.webp", "images/products/monitoring-instrumentation/smart-water-meter.webp"),
    ImageAsset("images/assets/uv/UV-chamber.jpg", "images/products/disinfection-systems/uv-chamber.jpg"),
    ImageAsset("images/assets/uv/Ultraviolet-Sterilizer-UV-for-Killing-Bacteria-lamps.jpg", "images/products/disinfection-systems/uv-lamp.jpg"),
    ImageAsset("images/assets/uv/adaptor-uv.jpg", "images/products/disinfection-systems/uv-adaptor.jpg"),
    ImageAsset("images/assets/uv/sleeve-uv.jpg", "images/products/disinfection-systems/uv-sleeve.jpg"),
    ImageAsset("images/assets/img/watersolutions/4-stage-uv-system.jpg", "images/products/disinfection-systems/uv-complete-system.jpg"),
    ImageAsset("images/assets/img/chemicals/antiscalant_low.webp", "images/products/water-treatment-chemicals/antiscalant-low.webp"),
    ImageAsset("images/assets/img/chemicals/chlorine90.webp", "images/products/water-treatment-chemicals/chlorine-90.webp"),
    ImageAsset("images/assets/img/chemicals/chlorine _65.webp", "images/products/water-treatment-chemicals/chlorine-65.webp"),
    ImageAsset("images/assets/img/chemicals/phplus.webp", "images/products/water-treatment-chemicals/ph-adjuster.webp"),
    ImageAsset("images/assets/img/chemicals/salt.webp", "images/products/water-treatment-chemicals/industrial-salt.webp"),
    ImageAsset("images/assets/chemicals/Resin Cation Softener - 1 sak 25 Liter.webp", "images/products/water-treatment-chemicals/resin-cation.webp"),
    ImageAsset("images/assets/chemicals/water-treatment-chemicals-media.jpg", "images/products/water-treatment-chemicals/chemical-media-generic.jpg"),
    ImageAsset("images/assets/chemicals/Pre-treament-media-for-water.webp", "images/products/filtration-systems/filter-media.webp"),
    ImageAsset("images/assets/img/norwa/sand media D.webp", "images/products/filtration-systems/sand-media.webp"),
    ImageAsset("images/Chemicals/Klormann.jpg", "images/products/filtration-systems/filter-housing-klormann.jpg"),
    ImageAsset("images/1000-lph-domestic-water-softener-500x500.jpg", "images/products/filtration-systems/water-softener-system.jpg"),
    ImageAsset("images/brine-tank/pe-brine-tank.png", "images/products/storage-tanks/brine-tank.png"),
    ImageAsset("images/brine-tank/Chemical-tank.webp", "images/products/storage-tanks/chemical-tank.webp"),
    ImageAsset("images/frp/frp-tank.png", "images/products/storage-tanks/frp-tank.png"),
    ImageAsset("images/vessels.JPG", "images/products/storage-tanks/pressure-vessel.jpg"),
    ImageAsset("images/assets/tanks/Water storage.jpg", "images/products/storage-tanks/water-storage-tank.jpg"),
    ImageAsset("images/assets/tanks/Dosing tanks - Chemical dosing station.jpg", "images/products/storage-tanks/chemical-dosing-tank.jpg"),
    ImageAsset("images/assets/tanks/Brine Tank With Assembly.jpg", "images/products/storage-tanks/brine-tank-assembly.jpg"),
    ImageAsset("images/assets/tanks/Plastic Vertical Water Storage Tank.jpg", "images/products/storage-tanks/vertical-water-storage-tank.jpg"),
    ImageAsset("images/assets/tanks/Coronwater Water Filter Tank 0817 FRP Tank For Water Filter and Water Softener Assembly.jpg", "images/products/storage-tanks/filter-tank.jpg"),
    ImageAsset("images/pumps/Pressure-tank.jpg", "images/products/pumps-fluid-handling/pressure-tank.jpg"),
]


RULES = [
    Rule("images/products/automation-control/roc-2315.webp", ("roc 2315",), category="automation-control"),
    Rule("images/products/automation-control/roc-2315.webp", ("roc 2015", "roc 2315", "roc "), category="reverse-osmosis-systems"),
    Rule("images/products/automation-control/control-panel.png", ("control panel",), category="automation-control"),
    Rule("images/products/automation-control/pump-controller.webp", ("mother board", "selector switch", "overload", "contactor", "enclosure", "terminal block", "mcb ", "indicator lights", "emergency stop", "pump start pb", "auto cable", "flex cable", "flex conduit", "expersion module"), category="automation-control"),

    Rule("images/products/monitoring-instrumentation/pressure-gauge-20bar.jpg", ("pressure gauge", "pressure guage", "air pressure regulator"), category="monitoring-instrumentation"),
    Rule("images/products/monitoring-instrumentation/smart-water-meter.webp", ("water meter", "smart water meter"), category="monitoring-instrumentation"),
    Rule("images/products/monitoring-instrumentation/smart-water-meter.webp", ("flow meter", "flow sensor", "digital clamp meter"), category="monitoring-instrumentation"),

    Rule("images/products/disinfection-systems/uv-adaptor.jpg", ("uv adaptor",), category="disinfection-systems"),
    Rule("images/products/disinfection-systems/uv-lamp.jpg", ("uv lamp",), category="disinfection-systems"),
    Rule("images/products/disinfection-systems/uv-sleeve.jpg", ("uv sleeve", "sleeve for uv"), category="disinfection-systems"),
    Rule("images/products/disinfection-systems/uv-chamber.jpg", ("uv chamber",), category="disinfection-systems"),
    Rule("images/products/disinfection-systems/uv-complete-system.jpg", ("uv complete", "submersible uv", "sita uv", "uv sterilizer", "uv-plus"), category="disinfection-systems"),

    Rule("images/products/pumps-fluid-handling/dosing-pump.webp", ("dosing pump",), category="pumps-fluid-handling"),
    Rule("images/products/pumps-fluid-handling/booster-pump.jpg", ("booster pump",), category="pumps-fluid-handling"),
    Rule("images/products/pumps-fluid-handling/submersible-pump.webp", ("submersible pump", "submersible motor"), category="pumps-fluid-handling"),
    Rule("images/products/pumps-fluid-handling/vertical-booster.webp", ("centrifugal booster",), category="pumps-fluid-handling"),
    Rule("images/products/pumps-fluid-handling/horizontal-booster-set.jpg", ("ddg1000", "emh", "booster sets"), category="pumps-fluid-handling"),
    Rule("images/products/pumps-fluid-handling/pressure-tank.jpg", ("pressure tank",), category="pumps-fluid-handling"),

    Rule("images/products/reverse-osmosis-systems/ro-skid.webp", ("ro skid", "display", "ro system", "eco pro", "reverse osmosis", "rowpu", "pure water", "water purifier", "min ro", "portable reverse osmosis", "norwa reverse osmosis", "keensen"), category="reverse-osmosis-systems"),
    Rule("images/products/reverse-osmosis-systems/ro-membrane-4040.jpg", ("4040",), category="reverse-osmosis-systems"),
    Rule("images/products/reverse-osmosis-systems/ro-membranes.jpg", ("membrane", "filmtec", "vontron", "dupont", "hidrotek"), category="reverse-osmosis-systems"),

    Rule("images/products/filtration-systems/ultrafiltration.jpeg", ("uf ", "uf-", " uf", "ultrafiltration", "washable uf"), category="filtration-systems"),
    Rule("images/products/filtration-systems/sand-media.webp", ("sand media", "glass media"), category="filtration-systems"),
    Rule("images/products/filtration-systems/filter-media.webp", ("activated carbon", "jacobi", "filter media"), category="filtration-systems"),
    Rule("images/products/filtration-systems/filter-housing-klormann.jpg", ("filter housing", "housing", "cartridge"), category="filtration-systems"),
    Rule("images/products/filtration-systems/water-softener-system.jpg", ("softener",), category="filtration-systems"),

    Rule("images/products/water-treatment-chemicals/antiscalant-low.webp", ("antiscallant", "antiscalant", "hypersperse", "kleen"), category="water-treatment-chemicals"),
    Rule("images/products/water-treatment-chemicals/resin-cation.webp", ("resin cation", "resin anion", "indion", "resin "), category="water-treatment-chemicals"),
    Rule("images/products/water-treatment-chemicals/chlorine-90.webp", ("chlorine 90",), category="water-treatment-chemicals"),
    Rule("images/products/water-treatment-chemicals/chlorine-65.webp", ("chlorine 65",), category="water-treatment-chemicals"),
    Rule("images/products/water-treatment-chemicals/ph-adjuster.webp", ("ph minus", "ph plus", "caustic soda", "citric acid"), category="water-treatment-chemicals"),
    Rule("images/products/water-treatment-chemicals/industrial-salt.webp", ("salt",), category="water-treatment-chemicals"),
    Rule("images/products/water-treatment-chemicals/chemical-media-generic.jpg", ("flocculant", "coagulant", "decolorant", "algicure", "chemical"), category="water-treatment-chemicals"),

    Rule("images/products/storage-tanks/brine-tank-assembly.jpg", ("brine tank",), category="storage-tanks"),
    Rule("images/products/storage-tanks/chemical-dosing-tank.jpg", ("chemical dosing tank",), category="storage-tanks"),
    Rule("images/products/storage-tanks/chemical-tank.webp", ("chemical tank",), category="storage-tanks"),
    Rule("images/products/storage-tanks/frp-tank.png", ("frp tank",), category="storage-tanks"),
    Rule("images/products/storage-tanks/pressure-vessel.jpg", ("vessel", "tank "), category="storage-tanks"),
    Rule("images/products/storage-tanks/vertical-water-storage-tank.jpg", ("storage tank", "plastic tank", "water storage"), category="storage-tanks"),
]


def copy_assets():
    copied = []
    for asset in ASSETS:
        src = PUBLIC / asset.source
        dst = PUBLIC / asset.destination
        if not src.exists():
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not dst.exists():
            shutil.copy2(src, dst)
            copied.append(asset.destination)
    return copied


def normalize(value: str) -> str:
    return re.sub(r"\s+", " ", value.lower()).strip()


def match_rule(product: dict) -> str | None:
    name = normalize(product["name"])
    category = product["categorySlug"]
    subcategory = product["subcategory"]

    for rule in RULES:
        if rule.category and rule.category != category:
            continue
        if rule.subcategory and rule.subcategory != subcategory:
            continue
        if any(pattern in name for pattern in rule.patterns):
            return "/" + rule.destination

    # Fall back to a generic image for known subcategories/category families so the
    # catalog uses the best-matching existing asset instead of the placeholder.
    subcategory_defaults = {
        "Control Panels": "/images/products/automation-control/control-panel.png",
        "Sensors & Probes": "/images/products/automation-control/pump-controller.webp",
        "Flow Meters": "/images/products/monitoring-instrumentation/smart-water-meter.webp",
        "Pressure Gauges": "/images/products/monitoring-instrumentation/pressure-gauge-20bar.jpg",
        "UV Sterilizers": "/images/products/disinfection-systems/uv-complete-system.jpg",
        "RO Plants": "/images/products/reverse-osmosis-systems/ro-skid.webp",
        "RO Membranes": "/images/products/reverse-osmosis-systems/ro-membranes.jpg",
        "Dosing Pumps": "/images/products/pumps-fluid-handling/dosing-pump.webp",
        "Booster Pumps": "/images/products/pumps-fluid-handling/booster-pump.jpg",
        "Submersible Pumps": "/images/products/pumps-fluid-handling/submersible-pump.webp",
        "Pressure Vessels": "/images/products/storage-tanks/pressure-vessel.jpg",
        "Chemical Storage Tanks": "/images/products/storage-tanks/chemical-tank.webp",
        "Water Storage Tanks": "/images/products/storage-tanks/water-storage-tank.jpg",
        "Filter Cartridges": "/images/products/filtration-systems/filter-housing-klormann.jpg",
        "Sand Filters": "/images/products/filtration-systems/sand-media.webp",
        "Activated Carbon Filters": "/images/products/filtration-systems/filter-media.webp",
        "Ultrafiltration": "/images/products/filtration-systems/ultrafiltration.jpeg",
        "Scale Inhibitors": "/images/products/water-treatment-chemicals/antiscalant-low.webp",
        "pH Adjusters": "/images/products/water-treatment-chemicals/ph-adjuster.webp",
        "Disinfectants": "/images/products/water-treatment-chemicals/chlorine-90.webp",
        "Coagulants": "/images/products/water-treatment-chemicals/chemical-media-generic.jpg",
        "Flocculants": "/images/products/water-treatment-chemicals/chemical-media-generic.jpg",
    }
    if subcategory in subcategory_defaults:
        return subcategory_defaults[subcategory]

    category_defaults = {
        "automation-control": "/images/products/automation-control/pump-controller.webp",
        "monitoring-instrumentation": "/images/products/monitoring-instrumentation/smart-water-meter.webp",
        "disinfection-systems": "/images/products/disinfection-systems/uv-complete-system.jpg",
        "reverse-osmosis-systems": "/images/products/reverse-osmosis-systems/ro-skid.webp",
        "pumps-fluid-handling": "/images/products/pumps-fluid-handling/booster-pump.jpg",
        "filtration-systems": "/images/products/filtration-systems/filter-media.webp",
        "water-treatment-chemicals": "/images/products/water-treatment-chemicals/chemical-media-generic.jpg",
        "storage-tanks": "/images/products/storage-tanks/water-storage-tank.jpg",
    }
    return category_defaults.get(category)


def refresh_summary(products: list[dict]):
    featured = [product for product in products if product.get("featured")]
    summary = {
        "totalProducts": len(products),
        "featuredProducts": featured[:12],
    }
    SUMMARY_PATH.write_text(json.dumps(summary, indent=2))


def main():
    copied = copy_assets()
    products = json.loads(CATALOG_PATH.read_text())
    matched = 0

    for product in products:
        if product.get("image") and product["image"] != PLACEHOLDER:
            continue

        image = match_rule(product)
        if image:
            product["image"] = image
            matched += 1

    CATALOG_PATH.write_text(json.dumps(products, indent=2))
    refresh_summary(products)

    print(f"Copied {len(copied)} assets into product category folders.")
    print(f"Assigned {matched} catalog products to non-placeholder images.")


if __name__ == "__main__":
    main()
