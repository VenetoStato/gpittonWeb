#!/usr/bin/env python3
"""
Unisce lista-aziende-it.csv, b3, b4 e aggiunge grandi aziende italiane (FTSE MIB, multinazionali).
Output: lista-aziende-it-300.csv per lo scraper.
"""
import csv
from pathlib import Path

BASE = Path(__file__).parent

# Grandi aziende italiane aggiuntive (FTSE MIB, multinazionali) - dominio da email o sito
EXTRA = [
    ("Eni", "info@eni.com", "https://eni.com"),
    ("Enel", "info@enel.com", "https://enel.com"),
    ("Intesa Sanpaolo", "info@intesasanpaolo.com", "https://intesasanpaolo.com"),
    ("Generali", "info@generali.com", "https://generali.com"),
    ("UniCredit", "info@unicredit.it", "https://unicredit.it"),
    ("Poste Italiane", "info@posteitaliane.it", "https://posteitaliane.it"),
    ("Telecom Italia", "info@tim.it", "https://tim.it"),
    ("Leonardo", "info@leonardocompany.com", "https://leonardocompany.com"),
    ("Pirelli", "info@pirelli.com", "https://pirelli.com"),
    ("Ferrari", "info@ferrari.com", "https://ferrari.com"),
    ("Stellantis", "info@stellantis.com", "https://stellantis.com"),
    ("Moncler", "info@moncler.com", "https://moncler.com"),
    ("Prada", "info@prada.com", "https://prada.com"),
    ("Salvatore Ferragamo", "info@ferragamo.com", "https://ferragamo.com"),
    ("Terna", "info@terna.it", "https://terna.it"),
    ("Snam", "info@snam.it", "https://snam.it"),
    ("Italgas", "info@italgas.it", "https://italgas.it"),
    ("A2A", "info@a2a.eu", "https://a2a.eu"),
    ("Hera", "info@gruppohera.it", "https://gruppohera.it"),
    ("Iren", "info@iren.it", "https://iren.it"),
    ("Amplifon", "info@amplifon.com", "https://amplifon.com"),
    ("DiaSorin", "info@diasorin.com", "https://diasorin.com"),
    ("Recordati", "info@recordati.com", "https://recordati.com"),
    ("Datalogic", "info@datalogic.com", "https://datalogic.com"),
    ("Technogym", "info@technogym.com", "https://technogym.com"),
    ("Brunello Cucinelli", "info@brunellocucinelli.com", "https://brunellocucinelli.com"),
    ("Campari", "info@campari.com", "https://campari.com"),
    ("Davide Campari", "info@campari.com", "https://campari.com"),
    ("Prysmian", "info@prysmian.com", "https://prysmian.com"),
    ("Tenaris", "info@tenaris.com", "https://tenaris.com"),
    ("Saipem", "info@saipem.com", "https://saipem.com"),
    ("Saras", "info@saras.it", "https://saras.it"),
    ("ERG", "info@erg.it", "https://erg.it"),
    ("Banca Mediolanum", "info@mediolanum.it", "https://mediolanum.it"),
    ("FinecoBank", "info@finecobank.com", "https://finecobank.com"),
    ("Mediobanca", "info@mediobanca.com", "https://mediobanca.com"),
    ("Assicurazioni Generali", "info@generali.com", "https://generali.com"),
    ("CNH Industrial", "info@cnhindustrial.com", "https://cnhindustrial.com"),
    ("Iveco Group", "info@ivecogroup.com", "https://ivecogroup.com"),
    ("Webuild", "info@webuild.it", "https://webuild.it"),
    ("Atlantia", "info@atlantia.it", "https://atlantia.it"),
    ("Autostrade per l'Italia", "info@autostrade.it", "https://autostrade.it"),
    ("Ansaldo Energia", "info@ansaldoenergia.com", "https://ansaldoenergia.com"),
    ("Ansaldo STS", "info@hitachirail.com", "https://hitachirail.com"),
    ("Cattolica Assicurazioni", "info@cattolica.it", "https://cattolica.it"),
    ("Banca Monte dei Paschi", "info@mps.it", "https://mps.it"),
    ("BPER Banca", "info@bper.it", "https://bper.it"),
    ("Banca Popolare di Sondrio", "info@popso.it", "https://popso.it"),
    ("Credem", "info@credem.it", "https://credem.it"),
    ("UBI Banca", "info@ubibanca.it", "https://ubibanca.it"),
    ("Banco BPM", "info@bancobpm.it", "https://bancobpm.it"),
    ("De' Longhi", "info@delonghi.com", "https://delonghi.com"),
    ("Candy Hoover", "info@candy-home.com", "https://candy-home.com"),
    ("Whirlpool EMEA", "info@whirlpool.com", "https://whirlpool.com"),
    ("Indesit", "info@indesit.com", "https://indesit.com"),
    ("Mapei", "info@mapei.com", "https://mapei.com"),
    ("Marazzi", "info@marazzi.it", "https://marazzi.it"),
    ("Iris Ceramica", "info@irisceramica.com", "https://irisceramica.com"),
    ("Barilla", "info@barilla.com", "https://barilla.com"),
    ("Ferrero", "info@ferrero.com", "https://ferrero.com"),
    ("Lavazza", "info@lavazza.com", "https://lavazza.com"),
    ("Parmalat", "info@parmalat.it", "https://parmalat.it"),
    ("Granarolo", "info@granarolo.it", "https://granarolo.it"),
    ("illycaffè", "info@illy.com", "https://illy.com"),
    ("Davines", "info@davines.com", "https://davines.com"),
    ("Luxottica", "info@luxottica.com", "https://luxottica.com"),
    ("Safilo", "info@safilo.com", "https://safilo.com"),
    ("Marcolin", "info@marcolin.com", "https://marcolin.com"),
    ("Geox", "info@geox.com", "https://geox.com"),
    ("Tod's", "info@tods.com", "https://tods.com"),
    ("Ermenegildo Zegna", "info@zegna.com", "https://zegna.com"),
    ("Diesel", "info@diesel.com", "https://diesel.com"),
    ("Benetton", "info@benetton.com", "https://benetton.com"),
    ("Stefanel", "info@stefanel.com", "https://stefanel.com"),
    ("Calzedonia", "info@calzedonia.com", "https://calzedonia.com"),
    ("OVS", "info@ovs.it", "https://ovs.it"),
    ("Esselunga", "info@esselunga.it", "https://esselunga.it"),
    ("Conad", "info@conad.it", "https://conad.it"),
    ("Coop Italia", "info@e.coop.it", "https://e.coop.it"),
    ("Esselunga", "info@esselunga.it", "https://esselunga.it"),
    ("Autogrill", "info@autogrill.net", "https://autogrill.net"),
    ("D'Amico", "info@damicoship.com", "https://damicoship.com"),
    ("Grimaldi", "info@grimaldi.napoli.it", "https://grimaldi-lines.com"),
    ("MSC", "info@msc.com", "https://msc.com"),
    ("Costa Crociere", "info@costacruises.com", "https://costacruises.com"),
    ("Fincantieri", "info@fincantieri.com", "https://fincantieri.com"),
    ("Rai", "info@rai.it", "https://rai.it"),
    ("Mediaset", "info@mediaset.it", "https://mediaset.it"),
    ("RCS MediaGroup", "info@rcs.it", "https://rcs.it"),
    ("GEDI", "info@gedi.it", "https://gedi.it"),
    ("Il Sole 24 Ore", "info@ilsole24ore.com", "https://ilsole24ore.com"),
    ("Brembo", "info@brembo.com", "https://brembo.com"),
    ("Pirelli", "info@pirelli.com", "https://pirelli.com"),
    ("Marposs", "info@marposs.com", "https://marposs.com"),
    ("Carraro", "info@carraro.com", "https://carraro.com"),
    ("Danieli", "info@danieli.com", "https://danieli.com"),
    ("Riva Acciaio", "info@rivaacciao.it", "https://rivaacciao.it"),
    ("Alfa Acciai", "info@alfaacciai.it", "https://alfaacciai.it"),
    ("Fincantieri", "info@fincantieri.com", "https://fincantieri.com"),
    ("Ansaldo", "info@ansaldoenergia.com", "https://ansaldoenergia.com"),
    ("Bonfiglioli", "info@bonfiglioli.com", "https://bonfiglioli.com"),
    ("Sew-Eurodrive", "info@sew-eurodrive.it", "https://sew-eurodrive.it"),
    ("ABB", "info@abb.com", "https://abb.com"),
    ("Bosch Rexroth", "info@boschrexroth.it", "https://boschrexroth.it"),
    ("Festo", "info@festo.com", "https://festo.com"),
    ("SMC Italia", "info@smc.it", "https://smc.it"),
    ("Schneider Electric", "info@se.com", "https://se.com"),
    ("Omron", "info@omron.com", "https://omron.com"),
    ("Mitsubishi Electric", "info@mitsubishielectric.com", "https://mitsubishielectric.com"),
    ("Yaskawa", "info@yaskawa.eu", "https://yaskawa.eu"),
    ("Epson", "info@epson.it", "https://epson.it"),
    ("Dassault Systèmes", "info@3ds.com", "https://3ds.com"),
    ("Siemens", "info@siemens.com", "https://siemens.com"),
    ("Rockwell Automation", "info@rockwellautomation.com", "https://rockwellautomation.com"),
    ("Honeywell", "info@honeywell.com", "https://honeywell.com"),
    ("Emerson", "info@emerson.com", "https://emerson.com"),
    ("Endress+Hauser", "info@endress.com", "https://endress.com"),
    ("Pepperl+Fuchs", "info@pepperl-fuchs.com", "https://pepperl-fuchs.com"),
    ("Pilz", "info@pilz.com", "https://pilz.com"),
    ("Beckhoff", "info@beckhoff.com", "https://beckhoff.com"),
    ("B&R", "info@br-automation.com", "https://br-automation.com"),
    ("Phoenix Contact", "info@phoenixcontact.com", "https://phoenixcontact.com"),
    ("Wago", "info@wago.com", "https://wago.com"),
    ("Weidmüller", "info@weidmueller.com", "https://weidmueller.com"),
    ("Turck", "info@turck.com", "https://turck.com"),
    ("ifm electronic", "info@ifm.com", "https://ifm.com"),
    ("Sick", "info@sick.com", "https://sick.com"),
    ("Cognex", "info@cognex.com", "https://cognex.com"),
    ("Keyence", "info@keyence.com", "https://keyence.com"),
    ("Basler", "info@baslerweb.com", "https://baslerweb.com"),
    ("Datalogic", "info@datalogic.com", "https://datalogic.com"),
    ("Leuze", "info@leuze.com", "https://leuze.com"),
    ("Balluff", "info@balluff.com", "https://balluff.com"),
    ("Baumer", "info@baumer.com", "https://baumer.com"),
    ("Contrinex", "info@contrinex.com", "https://contrinex.com"),
    ("Bticino", "info@bticino.it", "https://bticino.it"),
    ("Vimar", "info@vimar.com", "https://vimar.com"),
    ("Gewiss", "info@gewiss.com", "https://gewiss.com"),
    ("ABB Sace", "info@abb.com", "https://abb.com"),
    ("Riello UPS", "info@riello-ups.it", "https://riello-ups.com"),
    ("Socomec", "info@socomec.com", "https://socomec.com"),
    ("Chloride", "info@chloride.com", "https://chloride.com"),
    ("Rittal", "info@rittal.com", "https://rittal.com"),
    ("Danfoss", "info@danfoss.com", "https://danfoss.com"),
    ("Parker Hannifin", "info@parker.com", "https://parker.com"),
    ("Festo", "info@festo.com", "https://festo.com"),
    ("SMC", "info@smc.it", "https://smc.it"),
    ("Camozzi", "info@camozzi.com", "https://camozzi.com"),
    ("CEME", "info@ceme.it", "https://ceme.it"),
    ("Univer", "info@univer.it", "https://univer.it"),
    ("Cavagna", "info@cavagnagroup.com", "https://cavagnagroup.com"),
    ("Atos", "info@atos.net", "https://atos.net"),
    ("CGI", "info@cgi.com", "https://cgi.com"),
    ("DXC Technology", "info@dxc.com", "https://dxc.com"),
    ("HCL Technologies", "info@hcl.com", "https://hcl.com"),
    ("Wipro", "info@wipro.com", "https://wipro.com"),
    ("Tech Mahindra", "info@techmahindra.com", "https://techmahindra.com"),
    ("Infosys", "info@infosys.com", "https://infosys.com"),
    ("Tata Consultancy", "info@tcs.com", "https://tcs.com"),
    ("Cognizant", "info@cognizant.com", "https://cognizant.com"),
    ("EPAM", "info@epam.com", "https://epam.com"),
    ("Luxoft", "info@luxoft.com", "https://luxoft.com"),
    ("Softtek", "info@softtek.com", "https://softtek.com"),
    ("Hexagon", "info@hexagon.com", "https://hexagon.com"),
    ("PTC", "info@ptc.com", "https://ptc.com"),
    ("Autodesk", "info@autodesk.com", "https://autodesk.com"),
    ("Ansys", "info@ansys.com", "https://ansys.com"),
    ("Mathworks", "info@mathworks.com", "https://mathworks.com"),
    ("Unity", "info@unity.com", "https://unity.com"),
    ("Unity Technologies", "info@unity3d.com", "https://unity.com"),
    ("Epic Games", "info@epicgames.com", "https://epicgames.com"),
    ("Nvidia", "info@nvidia.com", "https://nvidia.com"),
    ("AMD", "info@amd.com", "https://amd.com"),
    ("Intel", "info@intel.com", "https://intel.com"),
    ("Qualcomm", "info@qualcomm.com", "https://qualcomm.com"),
    ("ARM", "info@arm.com", "https://arm.com"),
    ("STMicroelectronics", "info@st.com", "https://st.com"),
    ("Infineon", "info@infineon.com", "https://infineon.com"),
    ("Texas Instruments", "info@ti.com", "https://ti.com"),
    ("Analog Devices", "info@analog.com", "https://analog.com"),
    ("Renesas", "info@renesas.com", "https://renesas.com"),
    ("NXP", "info@nxp.com", "https://nxp.com"),
    ("ON Semiconductor", "info@onsemi.com", "https://onsemi.com"),
    ("Microchip", "info@microchip.com", "https://microchip.com"),
    ("Rohm", "info@rohm.com", "https://rohm.com"),
    ("TDK", "info@tdk.com", "https://tdk.com"),
    ("Murata", "info@murata.com", "https://murata.com"),
    ("Vishay", "info@vishay.com", "https://vishay.com"),
    ("TE Connectivity", "info@te.com", "https://te.com"),
    ("Molex", "info@molex.com", "https://molex.com"),
    ("Amphenol", "info@amphenol.com", "https://amphenol.com"),
    ("Jabil", "info@jabil.com", "https://jabil.com"),
    ("Flex", "info@flex.com", "https://flex.com"),
    ("Foxconn", "info@foxconn.com", "https://foxconn.com"),
    ("Celestica", "info@celestica.com", "https://celestica.com"),
    ("Sanmina", "info@sanmina.com", "https://sanmina.com"),
    ("Benchmark", "info@bench.com", "https://bench.com"),
    ("Plexus", "info@plexus.com", "https://plexus.com"),
]


def load_csv(path):
    rows = []
    if not path.exists():
        return rows
    with open(path, encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f, delimiter=";"):
            company = r.get("Company", "").strip()
            email = r.get("Email", "").strip()
            if company and email and "@" in email:
                rows.append((company, email))
    return rows


def main():
    seen = set()
    out_rows = []

    for f in ["lista-aziende-it.csv", "lista-aziende-it-b3.csv", "lista-aziende-it-b4.csv"]:
        path = BASE / f
        for company, email in load_csv(path):
            key = (company.lower(), email.lower())
            if key not in seen:
                seen.add(key)
                dom = email.split("@", 1)[1] if "@" in email else ""
                sito = f"https://{dom}" if dom else ""
                out_rows.append({"Company": company, "Email": email, "Sito": sito})

    for company, email, sito in EXTRA:
        key = (company.lower(), email.lower())
        if key not in seen:
            seen.add(key)
            out_rows.append({"Company": company, "Email": email, "Sito": sito})

    out = BASE / "lista-aziende-it-300.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["Company", "Email", "Sito"], delimiter=";")
        w.writeheader()
        w.writerows(out_rows)

    print(f"Scritte {len(out_rows)} aziende in {out}")
    return 0


if __name__ == "__main__":
    exit(main())
