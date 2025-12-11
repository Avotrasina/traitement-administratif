  import puppeteer from "puppeteer";
  import fs from "fs";
  import path from "path";
import { deflate } from "zlib";
import {formatDateToMalagasy, formatDateToFrench, getTodayYYYYMMDD, formatDateToFR} from "./dateMalagasy";
import { formatHeureToMalagasy } from "./heureMalagasy";



export default async function generatePDF(enfant: any, pere: any, mere: any, sage_femme: any) {
 
  // Prepara data
  enfant.nom_complet = `${enfant.nom} ${enfant.prenom}`;
  pere.nom_complet = `${pere.nom} ${pere.prenom}`;
  mere.nom_complet = `${mere.nom} ${mere.prenom}`;
  sage_femme.nom_complet = `${sage_femme.nom} ${sage_femme.prenom}`;

  const enfant_french_date_format = formatDateToFR(new Date(enfant.date_nais));

  const date_now = formatDateToFR(new Date());
  const date_now_malagasy = formatDateToMalagasy(new Date());
  const heure_nais = formatHeureToMalagasy(new Date(enfant.date_nais));
  const long_sexe = enfant.sexe === "M" ? 'zazalahy' : 'zazavavy';
  // Load HTML file
  const htmlPath = path.join(
    __dirname,
    "./../public/html/acte_naissance",
    "index.html"
  );
  let html = fs.readFileSync(htmlPath, "utf8");
  
  // Load CSS file
  const cssPath = path.join(
    __dirname,
    "./../public/html/acte_naissance",
    "index.css"
  );
  const css = fs.readFileSync(cssPath, "utf8");
  console.log(formatDateToMalagasy(new Date(pere.date_nais)));
  // Inject CSS inside <style> tag
  html = html
		.replace("</head>", `<style>${css}</style></head>`)

		.replace(/{{date_now}}/g, date_now)

		.replace(/{{enfant.nom_complet}}/g, enfant.nom_complet)
		.replace(/{{enfant.lieu_nais}}/g, enfant.lieu_nais)
    .replace(/{{enfant.date_nais}}/g, enfant_french_date_format)
    .replace(/{{enfant.sexe_malagasy}}/g, long_sexe)
    .replace(/{{enfant.heure_nais_malagasy}}/g, heure_nais)
    
		.replace(
      /{{enfant.date_nais_malagasy}}/g,
			formatDateToMalagasy(new Date(enfant.date_nais))
    )
    .replace(/{{date_now_malagasy}}/g, date_now_malagasy)
    

		.replace(/{{pere.nom_complet}}/g, pere.nom_complet)
		.replace(/{{pere.profession}}/g, pere.profession)
		.replace(/{{pere.lieu_nais}}/g, pere.lieu_nais)
		.replace(
			/{{pere.date_nais_malagasy}}/g,
			formatDateToMalagasy(new Date(pere.date_nais))
		)

		.replace(/{{mere.nom_complet}}/g, mere.nom_complet)
		.replace(/{{mere.profession}}/g, mere.profession)
		.replace(/{{mere.lieu_nais}}/g, mere.lieu_nais)
		.replace(/{{mere.adresse}}/g, mere.adresse)
		.replace(
			/{{mere.date_nais_malagasy}}/g,
			formatDateToMalagasy(new Date(mere.date_nais))
		)

		.replace(
			/{{sage_femme.date_nais_malagasy}}/g,
			formatDateToMalagasy(new Date(sage_femme.date_nais))
		)
		.replace(/{{sage_femme.lieu_nais}}/g, sage_femme.lieu_nais)
		.replace(/{{sage_femme.nom_complet}}/g, sage_femme.nom_complet)
		.replace(/{{sage_femme.adresse}}/g, sage_femme.adresse);
  
  
  // Launch puppeteer
  const browser = await puppeteer.launch({
    headless: true, // ensures new chromium headless
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  
  const pdfBuffer = await page.pdf({
		format: "A4",
		printBackground: true,
		width: "210mm",
		height: "297mm",
		margin: {
			top: "0mm",
			bottom: "0mm",
			left: "0mm",
			right: "0mm",
		},
	});
  
  await browser.close();

  return pdfBuffer;

}
