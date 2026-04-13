from sqlmodel import Session, select
from database import engine
from models import SiteContent

# Delete old ones and insert new ES and EN versions matching LanguageContext
def sync():
    translations = {
        "es": {
            "aboutSummary": "Mi formación en Administración y Negocios Digitales en UTEC me permite alinear la estrategia comercial con la ejecución técnica. Como Desarrollador, no me limito a escribir líneas de código; creo activos digitales que aportan valor medible a la empresa. Me especializo en desarrollar plataformas escalables que impulsan el crecimiento del negocio y mejoran la retención de los usuarios."
        },
        "en": {
            "aboutSummary": "My background in Digital Business at UTEC allows me to align commercial strategy with technical execution. As a Developer, I don’t just write lines of code; I build digital assets that deliver measurable value to the company. I specialize in developing scalable platforms that drive business growth and improve user retention."
        }
    }

    mappings = [
        {"old_key": "home_about_summary", "new_key": "home_about_summary", "label": "Home About Summary", "source_key": "aboutSummary", "category": "home"}
    ]

    with Session(engine) as session:
        for m in mappings:
            old = session.get(SiteContent, m["old_key"])
            if old:
                session.delete(old)
            
            cat = m.get("category", "home")
            input_type = "textarea"

            sc_es = session.get(SiteContent, f"{m['new_key']}_es")
            if sc_es:
                sc_es.value = translations["es"][m["source_key"]]
                sc_es.label = f"{m['label']} (ES)"
            else:
                session.add(SiteContent(key=f"{m['new_key']}_es", category=cat, input_type=input_type, label=f"{m['label']} (ES)", value=translations["es"][m["source_key"]]))
                
            sc_en = session.get(SiteContent, f"{m['new_key']}_en")
            if sc_en:
                sc_en.value = translations["en"][m["source_key"]]
                sc_en.label = f"{m['label']} (EN)"
            else:
                session.add(SiteContent(key=f"{m['new_key']}_en", category=cat, input_type=input_type, label=f"{m['label']} (EN)", value=translations["en"][m["source_key"]]))
                
        session.commit()
    print("Database sync completed securely.")

if __name__ == "__main__":
    sync()
