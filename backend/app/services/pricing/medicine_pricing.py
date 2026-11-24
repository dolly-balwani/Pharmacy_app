import re
from typing import Dict, Any, Optional, List

# Indian National Drug Pricing Master (MRP, Generic Equivalents & CDSCO Schedules)
INDIAN_MEDICINE_CATALOG: List[Dict[str, Any]] = [
    {
        "keywords": ["sizodon plus", "sizodon", "risperidone trihexyphenidyl"],
        "name": "Tab Sizodon Plus",
        "brand": "Sun Pharmaceutical Industries",
        "active_salt": "Risperidone (2mg) + Trihexyphenidyl (2mg)",
        "pack_size": "10 Tablets",
        "mrp_pack": 118.00,
        "unit_mrp": 11.80,
        "ptr_price": 8.50, # Price to Retailer
        "schedule": "Schedule H",
        "generic": {
            "name": "Generic Risperidone + Trihexyphenidyl 2mg",
            "manufacturer": "Jan Aushadhi / Cipla Generics",
            "unit_price": 3.20,
            "savings_percentage": 72.8
        }
    },
    {
        "keywords": ["qutipin", "qutipin 200", "quetiapine"],
        "name": "Tab Qutipin 200mg",
        "brand": "Sun Pharmaceutical Industries",
        "active_salt": "Quetiapine Fumarate (200mg)",
        "pack_size": "10 Tablets",
        "mrp_pack": 265.00,
        "unit_mrp": 26.50,
        "ptr_price": 19.20,
        "schedule": "Schedule H",
        "generic": {
            "name": "Generic Quetiapine 200mg",
            "manufacturer": "Torrent Generics",
            "unit_price": 8.50,
            "savings_percentage": 67.9
        }
    },
    {
        "keywords": ["ativan", "ativan 2mg", "lorazepam"],
        "name": "Tab Ativan 2mg",
        "brand": "Pfizer India Ltd",
        "active_salt": "Lorazepam (2mg)",
        "pack_size": "10 Tablets",
        "mrp_pack": 78.50,
        "unit_mrp": 7.85,
        "ptr_price": 5.80,
        "schedule": "Schedule H1",
        "generic": {
            "name": "Generic Lorazepam 2mg",
            "manufacturer": "Intas Pharma Generics",
            "unit_price": 2.40,
            "savings_percentage": 69.4
        }
    },
    {
        "keywords": ["rivotril", "rivotril 0.5", "clonazepam"],
        "name": "Tab Rivotril 0.5mg",
        "brand": "Abbott India Ltd",
        "active_salt": "Clonazepam (0.5mg)",
        "pack_size": "15 Tablets",
        "mrp_pack": 102.00,
        "unit_mrp": 6.80,
        "ptr_price": 4.90,
        "schedule": "Schedule H1",
        "generic": {
            "name": "Generic Clonazepam 0.5mg",
            "manufacturer": "Mankind Pharma",
            "unit_price": 1.80,
            "savings_percentage": 73.5
        }
    },
    {
        "keywords": ["serta", "serta 50", "sertraline"],
        "name": "Tab Serta 50mg",
        "brand": "Torrent Pharmaceuticals",
        "active_salt": "Sertraline Hydrochloride (50mg)",
        "pack_size": "10 Tablets",
        "mrp_pack": 145.00,
        "unit_mrp": 14.50,
        "ptr_price": 10.50,
        "schedule": "Schedule H",
        "generic": {
            "name": "Generic Sertraline 50mg",
            "manufacturer": "Zydus Cadila",
            "unit_price": 4.20,
            "savings_percentage": 71.0
        }
    },
    {
        "keywords": ["betaloc", "metoprolol"],
        "name": "Tab Betaloc 100mg",
        "brand": "AstraZeneca Pharma India",
        "active_salt": "Metoprolol Tartrate (100mg)",
        "pack_size": "30 Tablets",
        "mrp_pack": 235.00,
        "unit_mrp": 7.83,
        "ptr_price": 5.60,
        "schedule": "Schedule H",
        "generic": {
            "name": "Generic Metoprolol 100mg",
            "manufacturer": "Cipla Generics",
            "unit_price": 2.50,
            "savings_percentage": 68.0
        }
    },
    {
        "keywords": ["augmentin", "amoxicillin clavulanate"],
        "name": "Tab Augmentin 625 Duo",
        "brand": "GlaxoSmithKline Pharmaceuticals",
        "active_salt": "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
        "pack_size": "10 Tablets",
        "mrp_pack": 204.00,
        "unit_mrp": 20.40,
        "ptr_price": 14.80,
        "schedule": "Schedule H1",
        "generic": {
            "name": "Generic Amoxyclav 625",
            "manufacturer": "Alkem Laboratories",
            "unit_price": 8.00,
            "savings_percentage": 60.7
        }
    },
    {
        "keywords": ["pan 40", "pan-d", "pantoprazole"],
        "name": "Tab Pan 40",
        "brand": "Alkem Laboratories",
        "active_salt": "Pantoprazole (40mg)",
        "pack_size": "15 Tablets",
        "mrp_pack": 165.00,
        "unit_mrp": 11.00,
        "ptr_price": 7.90,
        "schedule": "Schedule H",
        "generic": {
            "name": "Generic Pantoprazole 40mg",
            "manufacturer": "Jan Aushadhi",
            "unit_price": 2.20,
            "savings_percentage": 80.0
        }
    },
    {
        "keywords": ["telma", "telmisartan"],
        "name": "Tab Telma 40",
        "brand": "Glenmark Pharmaceuticals",
        "active_salt": "Telmisartan (40mg)",
        "pack_size": "15 Tablets",
        "mrp_pack": 142.00,
        "unit_mrp": 9.46,
        "ptr_price": 6.80,
        "schedule": "Schedule H",
        "generic": {
            "name": "Generic Telmisartan 40mg",
            "manufacturer": "Micro Labs",
            "unit_price": 2.60,
            "savings_percentage": 72.5
        }
    },
    {
        "keywords": ["glycomet", "metformin"],
        "name": "Tab Glycomet 500",
        "brand": "USV Private Limited",
        "active_salt": "Metformin Hydrochloride (500mg)",
        "pack_size": "20 Tablets",
        "mrp_pack": 48.00,
        "unit_mrp": 2.40,
        "ptr_price": 1.70,
        "schedule": "Schedule G",
        "generic": {
            "name": "Generic Metformin 500mg",
            "manufacturer": "Jan Aushadhi",
            "unit_price": 0.80,
            "savings_percentage": 66.7
        }
    }
]

def lookup_medicine_pricing(medicine_name: str, strength: Optional[str] = None) -> Dict[str, Any]:
    """
    Intelligently looks up exact Indian MRP, active ingredient, and chemist wholesale margins.
    Falls back to therapeutic cost modeling if not in pre-indexed catalog.
    """
    query = (medicine_name or "").lower().strip()
    query = re.sub(r'^(tab|cap|syrup|inj|tablet|capsule)\s+', '', query)

    # 1. Exact or keyword match
    for med in INDIAN_MEDICINE_CATALOG:
        for kw in med["keywords"]:
            if kw in query or query in kw:
                return {
                    "matched": True,
                    "name": med["name"],
                    "brand": med["brand"],
                    "active_salt": med["active_salt"],
                    "unit_mrp": med["unit_mrp"],
                    "pack_size": med["pack_size"],
                    "ptr_price": med["ptr_price"],
                    "schedule": med["schedule"],
                    "generic_alternative": med["generic"]
                }

    # 2. Heuristic fallback based on strength / formulation
    # Clean extract numeric strength if present
    extracted_strength = 50
    if strength:
        match = re.search(r'(\d+)', str(strength))
        if match:
            extracted_strength = int(match.group(1))

    # Base price calculation in INR per tablet
    if extracted_strength >= 200:
        base_unit_mrp = 22.0
    elif extracted_strength >= 100:
        base_unit_mrp = 14.5
    elif extracted_strength >= 20:
        base_unit_mrp = 8.5
    else:
        base_unit_mrp = 6.0

    return {
        "matched": False,
        "name": medicine_name,
        "brand": "Standard Pharma",
        "active_salt": medicine_name,
        "unit_mrp": round(base_unit_mrp, 2),
        "pack_size": "10 Tablets",
        "ptr_price": round(base_unit_mrp * 0.72, 2), # standard 28% chemist margin
        "schedule": "Schedule H",
        "generic_alternative": {
            "name": f"Generic {medicine_name}",
            "manufacturer": "Jan Aushadhi / PMBJP",
            "unit_price": round(base_unit_mrp * 0.35, 2),
            "savings_percentage": 65.0
        }
    }
