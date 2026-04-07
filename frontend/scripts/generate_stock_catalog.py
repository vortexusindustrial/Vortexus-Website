from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_XLSX = ROOT / "public" / "Item List .xlsx"
OUTPUT_DIR = ROOT / "public" / "catalog"
PRODUCTS_JSON = OUTPUT_DIR / "stock-products.json"
SUMMARY_JSON = OUTPUT_DIR / "catalog-summary.json"

NS = {
    "main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "pkgrel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


CATEGORY_NAMES = {
    "pre-treatment-systems": "Pre-Treatment Systems",
    "filtration-systems": "Filtration Systems",
    "reverse-osmosis-systems": "Reverse Osmosis (RO) Systems",
    "water-treatment-chemicals": "Water Treatment Chemicals",
    "disinfection-systems": "Disinfection Systems",
    "pumps-fluid-handling": "Pumps & Fluid Handling",
    "wastewater-treatment-equipment": "Wastewater Treatment Equipment",
    "industrial-etp": "Industrial Effluent Treatment Plants",
    "sewage-treatment-plants": "Sewage Treatment Plants",
    "desalination-systems": "Desalination Systems",
    "monitoring-instrumentation": "Monitoring & Instrumentation",
    "automation-control": "Automation & Control",
    "storage-tanks": "Storage & Tanks",
    "spare-parts-components": "Spare Parts & Components",
    "recycling-reuse-systems": "Recycling & Reuse Systems",
    "sludge-handling-disposal": "Sludge Handling & Disposal",
    "industry-specific-solutions": "Industry-Specific Solutions",
}


DEFAULT_APPLICATIONS = {
    "pre-treatment-systems": ["Pretreatment lines", "Raw-water protection", "Industrial process buffering"],
    "filtration-systems": ["Water polishing", "Pretreatment for membranes", "Utility water conditioning"],
    "reverse-osmosis-systems": ["Brackish-water treatment", "Industrial desalting", "Purified water preparation"],
    "water-treatment-chemicals": ["Clarification programs", "Disinfection support", "Scaling and corrosion control"],
    "disinfection-systems": ["Microbiological control", "Post-treatment protection", "Storage and delivery hygiene"],
    "pumps-fluid-handling": ["Water transfer", "Pressurization", "Plant utility circulation"],
    "wastewater-treatment-equipment": ["Biological treatment", "Solids separation", "Dewatering support"],
    "industrial-etp": ["Industrial effluent control", "Compliance support", "Wastewater conditioning"],
    "sewage-treatment-plants": ["Domestic wastewater treatment", "Packaged STP systems", "Utility sanitation"],
    "desalination-systems": ["Saline water treatment", "Coastal supply", "High-TDS water recovery"],
    "monitoring-instrumentation": ["Online quality monitoring", "Process verification", "Plant visibility"],
    "automation-control": ["Panel automation", "Control logic", "Remote monitoring"],
    "storage-tanks": ["Chemical storage", "Water balancing", "Process buffering"],
    "spare-parts-components": ["Maintenance planning", "Replacement support", "Operational spares"],
    "recycling-reuse-systems": ["Water recovery", "Reuse planning", "Discharge reduction"],
    "sludge-handling-disposal": ["Sludge transfer", "Volume reduction", "Final disposal preparation"],
    "industry-specific-solutions": ["Industry-focused product selection", "Application alignment", "RFQ preparation"],
}


DEFAULT_INDUSTRIES = {
    "pre-treatment-systems": ["food-beverage", "textile"],
    "filtration-systems": ["food-beverage", "pharmaceutical", "agriculture-irrigation"],
    "reverse-osmosis-systems": ["pharmaceutical", "power-plants", "food-beverage"],
    "water-treatment-chemicals": ["food-beverage", "textile", "power-plants"],
    "disinfection-systems": ["food-beverage", "pharmaceutical"],
    "pumps-fluid-handling": ["agriculture-irrigation", "food-beverage", "mining"],
    "wastewater-treatment-equipment": ["textile", "mining", "food-beverage"],
    "industrial-etp": ["textile", "mining"],
    "sewage-treatment-plants": ["food-beverage", "agriculture-irrigation"],
    "desalination-systems": ["power-plants", "food-beverage"],
    "monitoring-instrumentation": ["power-plants", "food-beverage"],
    "automation-control": ["power-plants", "food-beverage", "agriculture-irrigation"],
    "storage-tanks": ["food-beverage", "agriculture-irrigation", "textile"],
    "spare-parts-components": ["food-beverage", "power-plants", "agriculture-irrigation"],
    "recycling-reuse-systems": ["textile", "agriculture-irrigation", "power-plants"],
    "sludge-handling-disposal": ["textile", "mining"],
    "industry-specific-solutions": ["food-beverage", "pharmaceutical", "textile"],
}


GROUP_RULES = {
    "wt-pvc fittings and pipes": ("pumps-fluid-handling", "Pipes"),
    "wt-pu fittings and pipes": ("pumps-fluid-handling", "Pipes"),
    "wt-ppr fittings": ("pumps-fluid-handling", "Pipes"),
    "wt-gi fittings": ("pumps-fluid-handling", "Pipes"),
    "pvc fittings": ("pumps-fluid-handling", "Pipes"),
    "fixtures & fittings": ("pumps-fluid-handling", "Pipes"),
    "wt-pumps": ("pumps-fluid-handling", None),
    "pumps": ("pumps-fluid-handling", "Centrifugal Pumps"),
    "pool pump": ("pumps-fluid-handling", "Centrifugal Pumps"),
    "wt-pump accessories": ("spare-parts-components", "Pump Spare Parts"),
    "wt-pressure gauge": ("monitoring-instrumentation", "Pressure Gauges"),
    "wt-pressure switch": ("automation-control", "Sensors & Probes"),
    "wt-pressure tanks": ("storage-tanks", "Pressure Vessels"),
    "wt-water meters": ("monitoring-instrumentation", "Flow Meters"),
    "wt-flow meters": ("monitoring-instrumentation", "Flow Meters"),
    "wt-smart water meters": ("monitoring-instrumentation", "SCADA Monitoring Systems"),
    "wt-smart water meter accessories": ("monitoring-instrumentation", "SCADA Monitoring Systems"),
    "wt-ph meter": ("monitoring-instrumentation", "pH Meters"),
    "wt-elecritical": ("automation-control", None),
    "wt-cables": ("automation-control", "Control Panels"),
    "wt-solenoids": ("pumps-fluid-handling", "Valves"),
    "wt-sterilizer": ("disinfection-systems", None),
    "wt-purifiers": ("filtration-systems", None),
    "water purifier": ("filtration-systems", "Reverse Osmosis"),
    "wt-purifier accessories": ("spare-parts-components", "Filter Cartridges"),
    "wt-filters and catridges": ("filtration-systems", "Cartridge Filters"),
    "wt-filter housings": ("filtration-systems", "Cartridge Filters"),
    "wt-filter housing accessories": ("spare-parts-components", "O-Rings & Seals"),
    "wt-microfilters": ("filtration-systems", "Microfiltration"),
    "wt-membranes": ("reverse-osmosis-systems", None),
    "wt-membranes accessories": ("spare-parts-components", "Membranes"),
    "wt-mpvs": ("pumps-fluid-handling", "Valves"),
    "wt-vessels": ("storage-tanks", "Pressure Vessels"),
    "wt-vessels accessories": ("storage-tanks", "Pressure Vessels"),
    "wt-frp tanks": ("storage-tanks", "Pressure Vessels"),
    "wt-frp tank accessories": ("storage-tanks", "Pressure Vessels"),
    "wt-brine tanks": ("storage-tanks", "Chemical Storage Tanks"),
    "wt-chemical tanks": ("storage-tanks", "Chemical Storage Tanks"),
    "wt-medias": ("filtration-systems", None),
    "wt-chemicals": ("water-treatment-chemicals", None),
    "wt-ro machines": ("reverse-osmosis-systems", "RO Plants"),
    "wt-ro machines accessories": ("reverse-osmosis-systems", None),
    "wt-ro unit": ("reverse-osmosis-systems", "RO Plants"),
    "wt-pure water plant": ("reverse-osmosis-systems", "RO Plants"),
    "wt-plant's": ("reverse-osmosis-systems", "RO Plants"),
    "wt-plants &equipments": ("reverse-osmosis-systems", "RO Plants"),
    "wt-uf units": ("filtration-systems", "Ultrafiltration"),
    "wt-blowers": ("wastewater-treatment-equipment", "Aeration Systems"),
    "wt-borehole accessories": ("pumps-fluid-handling", "Submersible Pumps"),
    "wt-project consumable": ("spare-parts-components", "Valve Spare Parts"),
    "wt-pool accessories": ("disinfection-systems", "Chlorination Systems"),
    "wt-solar items": ("automation-control", "Control Panels"),
    "wt-fittings and accessories": ("spare-parts-components", "O-Rings & Seals"),
    "wt-parts": ("spare-parts-components", "Valve Spare Parts"),
    "wte- parts": ("spare-parts-components", "Valve Spare Parts"),
}


SKIP_GROUPS = {
    "office expenses",
    "wt-office consumables",
    "non stock",
}


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "item"


def extract_xlsx_rows(path: Path) -> list[list[str]]:
    with zipfile.ZipFile(path) as z:
        shared = []
        if "xl/sharedStrings.xml" in z.namelist():
            root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in root.findall("main:si", NS):
                shared.append("".join((t.text or "") for t in si.iterfind(".//main:t", NS)))

        wb = ET.fromstring(z.read("xl/workbook.xml"))
        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels.findall("pkgrel:Relationship", NS)}
        first_sheet = next(iter(wb.find("main:sheets", NS)))
        rid = first_sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
        target = "xl/" + rel_map[rid]
        root = ET.fromstring(z.read(target))
        rows = root.find("main:sheetData", NS).findall("main:row", NS)

        extracted = []
        for row in rows:
            values = []
            for cell in row.findall("main:c", NS):
                cell_type = cell.attrib.get("t")
                value_node = cell.find("main:v", NS)
                value = ""
                if value_node is not None:
                    value = value_node.text or ""
                    if cell_type == "s":
                        value = shared[int(value)]
                values.append(value.strip())
            extracted.append(values)
        return extracted


def infer_pump_subcategory(name: str) -> str:
    lower = name.lower()
    if any(word in lower for word in ["submersible", "borehole"]):
        return "Submersible Pumps"
    if any(word in lower for word in ["booster", "press controller", "pressure tank"]):
        return "Booster Pumps"
    if "dosing" in lower:
        return "Dosing Pumps"
    if any(word in lower for word in ["sludge", "sewage", "drainage", "effluent"]):
        return "Sludge Pumps"
    if any(word in lower for word in ["valve", "solenoid"]):
        return "Valves"
    if any(word in lower for word in ["pipe", "tube", "pvc", "hdpe", "gi", "ppr", "fitting", "connector", "elbow", "tee", "union"]):
        return "Pipes"
    return "Centrifugal Pumps"


def infer_subcategory(item_group: str, name: str, category_slug: str, preset: str | None) -> str:
    if preset:
        return preset

    lower = name.lower()
    group = item_group.lower()

    if category_slug == "pumps-fluid-handling":
        return infer_pump_subcategory(name)
    if category_slug == "automation-control":
        if any(word in lower for word in ["sensor", "switch", "transmitter", "probe"]):
            return "Sensors & Probes"
        if any(word in lower for word in ["plc"]):
            return "PLC Systems"
        if any(word in lower for word in ["remote", "iot", "gsm", "telemetry"]):
            return "Remote Monitoring Systems"
        return "Control Panels"
    if category_slug == "disinfection-systems":
        if "uv" in lower or "sterilizer" in lower or "lamp" in lower or "sleeve" in lower:
            return "UV Sterilizers"
        if "ozone" in lower:
            return "Ozone Generators"
        if "electro" in lower:
            return "Electrochlorination Systems"
        return "Chlorination Systems"
    if category_slug == "filtration-systems":
        if "carbon" in lower:
            return "Activated Carbon Filters"
        if any(word in lower for word in ["uf", "ultra"]):
            return "Ultrafiltration"
        if any(word in lower for word in ["mf", "micro"]):
            return "Microfiltration"
        if any(word in lower for word in ["nf", "nano"]):
            return "Nanofiltration"
        if any(word in lower for word in ["bag"]):
            return "Bag Filters"
        if any(word in lower for word in ["disc"]):
            return "Disc Filters"
        if any(word in lower for word in ["housing", "cartridge", "pp", "cto", "gac", "sediment", "jumbo"]):
            return "Cartridge Filters"
        return "Sand Filters"
    if category_slug == "reverse-osmosis-systems":
        if any(word in lower for word in ["membrane"]):
            return "RO Membranes"
        if any(word in lower for word in ["vessel"]):
            return "RO Pressure Vessels"
        if any(word in lower for word in ["controller", "panel"]):
            return "RO Controllers"
        if any(word in lower for word in ["pump"]):
            return "High-Pressure Pumps"
        if any(word in lower for word in ["chemical", "antiscalant", "cleaner"]):
            return "Antiscalants & RO Chemicals"
        return "RO Plants"
    if category_slug == "water-treatment-chemicals":
        if any(word in lower for word in ["alum", "pac"]):
            return "Coagulants"
        if any(word in lower for word in ["polymer", "floc"]):
            return "Flocculants"
        if any(word in lower for word in ["chlor", "hypo"]):
            return "Disinfectants"
        if any(word in lower for word in ["acid", "caustic", "ph"]):
            return "pH Adjusters"
        if any(word in lower for word in ["bio"]):
            return "Biocides"
        if any(word in lower for word in ["corrosion"]):
            return "Corrosion Inhibitors"
        return "Scale Inhibitors"
    if category_slug == "monitoring-instrumentation":
        if "ph" in lower:
            return "pH Meters"
        if any(word in lower for word in ["tds", "conductivity"]):
            return "TDS Meters"
        if "turbidity" in lower:
            return "Turbidity Meters"
        if any(word in lower for word in ["flow", "water meter"]):
            return "Flow Meters"
        if any(word in lower for word in ["pressure gauge"]):
            return "Pressure Gauges"
        if any(word in lower for word in ["scada", "smart"]):
            return "SCADA Monitoring Systems"
        return "Online Water Analyzers"
    if category_slug == "storage-tanks":
        if any(word in lower for word in ["chemical", "brine"]):
            return "Chemical Storage Tanks"
        if "mix" in lower:
            return "Mixing Tanks"
        if any(word in lower for word in ["vessel", "pressure"]):
            return "Pressure Vessels"
        return "Water Storage Tanks"
    if category_slug == "spare-parts-components":
        if any(word in lower for word in ["membrane"]):
            return "Membranes"
        if any(word in lower for word in ["cartridge", "filter"]):
            return "Filter Cartridges"
        if any(word in lower for word in ["pump", "seal", "impeller"]):
            return "Pump Spare Parts"
        if any(word in lower for word in ["valve", "solenoid"]):
            return "Valve Spare Parts"
        return "O-Rings & Seals"
    return preset or group or "Industrial Water Products"


def infer_group_mapping(item_group: str, name: str) -> tuple[str, str]:
    normalized_group = item_group.strip().lower()
    normalized_group = normalized_group.replace("catridges", "cartridges")
    mapping = GROUP_RULES.get(normalized_group)

    if mapping:
        category_slug, preset_subcategory = mapping
        return category_slug, infer_subcategory(item_group, name, category_slug, preset_subcategory)

    if "pump" in normalized_group:
        category_slug = "pumps-fluid-handling"
        return category_slug, infer_subcategory(item_group, name, category_slug, None)

    return "industry-specific-solutions", "Food & Beverage Water Systems"


def build_summary(name: str, subcategory: str) -> str:
    return f"{subcategory} item currently available in stock and listed in the product catalog."


def build_description(name: str, item_group: str, category_slug: str, subcategory: str) -> str:
    category_name = CATEGORY_NAMES[category_slug]
    return (
        f"{name} is part of the current stock list under {item_group}. "
        f"It is presented online as a {subcategory.lower()} product within {category_name.lower()} "
        "so buyers can find it quickly, compare related items, and move into RFQ."
    )


def build_spec_highlights(item_group: str, category_slug: str) -> list[str]:
    return [
        f"Stock group: {item_group}",
        f"Category: {CATEGORY_NAMES[category_slug]}",
        "Model, size, or rating is usually included directly in the item name",
    ]


def main() -> None:
    rows = extract_xlsx_rows(SOURCE_XLSX)
    header, entries = rows[0], rows[1:]

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    products = []
    slug_counts: dict[str, int] = defaultdict(int)
    featured_by_category: set[str] = set()
    category_counts: dict[str, int] = defaultdict(int)
    industry_counts: dict[str, int] = defaultdict(int)

    for index, row in enumerate(entries, start=1):
        if len(row) < 2:
            continue

        name = row[0].strip()
        item_group = row[1].strip()
        if not name or not item_group:
            continue

        if item_group.lower() in SKIP_GROUPS:
            continue

        category_slug, subcategory = infer_group_mapping(item_group, name)
        industry_slugs = DEFAULT_INDUSTRIES[category_slug]

        base_slug = slugify(name)
        slug_counts[base_slug] += 1
        slug = base_slug if slug_counts[base_slug] == 1 else f"{base_slug}-{slug_counts[base_slug]}"

        featured = False
        if category_slug not in featured_by_category and len(featured_by_category) < 12:
            featured = True
            featured_by_category.add(category_slug)

        product = {
            "id": index,
            "slug": slug,
            "name": name,
            "itemGroup": item_group,
            "categorySlug": category_slug,
            "subcategory": subcategory,
            "summary": build_summary(name, subcategory),
            "description": build_description(name, item_group, category_slug, subcategory),
            "applications": DEFAULT_APPLICATIONS[category_slug],
            "specHighlights": build_spec_highlights(item_group, category_slug),
            "industrySlugs": industry_slugs,
            "image": "/place holder.jpg",
            "featured": featured,
        }
        products.append(product)
        category_counts[category_slug] += 1
        for slug_name in industry_slugs:
            industry_counts[slug_name] += 1

    featured_products = [product for product in products if product["featured"]][:12]

    summary = {
        "totalProducts": len(products),
        "featuredProducts": featured_products,
        "categoryCounts": category_counts,
        "industryCounts": industry_counts,
    }

    PRODUCTS_JSON.write_text(json.dumps(products, ensure_ascii=False), encoding="utf-8")
    SUMMARY_JSON.write_text(json.dumps(summary, ensure_ascii=False), encoding="utf-8")

    print(f"Generated {len(products)} products")
    print(f"Wrote {PRODUCTS_JSON}")
    print(f"Wrote {SUMMARY_JSON}")


if __name__ == "__main__":
    main()
