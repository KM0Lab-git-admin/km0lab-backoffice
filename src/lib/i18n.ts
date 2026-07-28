// Centralized copy for the merchant backoffice.
// Default language: catalan (ca). Never hardcode visible strings in JSX.

export type Lang = "ca" | "es" | "en";

export const DEFAULT_LANG: Lang = "ca";

type Dict = Record<Lang, string>;

export const messages = {
  "app.brand": { ca: "KM0 LAB", es: "KM0 LAB", en: "KM0 LAB" },
  "app.merchantSubtitle": {
    ca: "Comerç adherit",
    es: "Comercio adherido",
    en: "Partner merchant",
  },
  "app.editMerchant": {
    ca: "Editar fitxa",
    es: "Editar ficha",
    en: "Edit profile",
  },

  "nav.resum": { ca: "Resum", es: "Resumen", en: "Overview" },
  "nav.elMeuQR": { ca: "El meu QR", es: "Mi QR", en: "My QR" },
  "nav.promocions": { ca: "Promocions", es: "Promociones", en: "Promotions" },
  "nav.estadistiques": { ca: "Estadístiques", es: "Estadísticas", en: "Statistics" },
  "nav.laMevaFitxa": { ca: "La meva fitxa", es: "Mi ficha", en: "My profile" },
  "nav.configuracio": { ca: "Configuració", es: "Configuración", en: "Settings" },
  "nav.openMenu": { ca: "Obrir menú", es: "Abrir menú", en: "Open menu" },

  "common.loading": { ca: "Carregant…", es: "Cargando…", en: "Loading…" },
  "common.retry": { ca: "Tornar a provar", es: "Reintentar", en: "Try again" },
  "common.error": {
    ca: "S'ha produït un error",
    es: "Se ha producido un error",
    en: "Something went wrong",
  },
  "common.cancel": { ca: "Cancel·lar", es: "Cancelar", en: "Cancel" },
  "common.save": { ca: "Desar", es: "Guardar", en: "Save" },
  "common.delete": { ca: "Eliminar", es: "Eliminar", en: "Delete" },
  "common.edit": { ca: "Editar", es: "Editar", en: "Edit" },
  "common.close": { ca: "Tancar", es: "Cerrar", en: "Close" },
  "common.optional": { ca: "opcional", es: "opcional", en: "optional" },
  "common.yes": { ca: "Sí", es: "Sí", en: "Yes" },
  "common.no": { ca: "No", es: "No", en: "No" },

  // QR view
  "qr.title": { ca: "El meu codi QR", es: "Mi código QR", en: "My QR code" },
  "qr.subtitle": {
    ca: "Aquest és el QR únic del teu comerç. Imprimeix-lo i col·loca'l al taulell: els veïns l'escanejaran per guanyar punts en visitar-te.",
    es: "Este es el QR único de tu comercio. Imprímelo y colócalo en el mostrador: los vecinos lo escanearán para ganar puntos al visitarte.",
    en: "This is your shop's unique QR. Print it and place it on the counter so neighbours can scan it and earn points when they visit.",
  },
  "qr.metrics.visits": { ca: "Visites escanejades", es: "Visitas escaneadas", en: "Scanned visits" },
  "qr.metrics.points": { ca: "Punts atorgats", es: "Puntos otorgados", en: "Points granted" },
  "qr.metrics.newVisitors": {
    ca: "Nous visitants aquesta setmana",
    es: "Nuevos visitantes esta semana",
    en: "New visitors this week",
  },
  "qr.pointsPerVisit": { ca: "punts per visita", es: "puntos por visita", en: "points per visit" },
  "qr.download.title": {
    ca: "Descarrega o imprimeix",
    es: "Descarga o imprime",
    en: "Download or print",
  },
  "qr.download.pdfHint": {
    ca: "El PDF és un cartell de taulell amb el logo de KM0 LAB i el text «Escaneja i guanya punts».",
    es: "El PDF es un cartel de mostrador con el logo de KM0 LAB y el texto «Escanea y gana puntos».",
    en: "The PDF is a counter poster with the KM0 LAB logo and the message “Scan and earn points”.",
  },
  "qr.download.pngHint": {
    ca: "El PNG serveix per a altres usos (xarxes, aparadors, etiquetes…).",
    es: "El PNG sirve para otros usos (redes, escaparates, etiquetas…).",
    en: "The PNG works for other uses (social, shop windows, labels…).",
  },
  "qr.download.pdf": { ca: "Descarregar PDF", es: "Descargar PDF", en: "Download PDF" },
  "qr.download.png": { ca: "Descarregar PNG", es: "Descargar PNG", en: "Download PNG" },
  "qr.download.print": { ca: "Imprimir", es: "Imprimir", en: "Print" },
  "qr.note": {
    ca: "El QR es genera automàticament en donar-te d'alta i no caduca. Si sospites que s'ha copiat de manera fraudulenta, pots regenerar-lo des de Configuració (l'anterior deixarà de funcionar).",
    es: "El QR se genera automáticamente al darte de alta y no caduca. Si sospechas que se ha copiado de forma fraudulenta, puedes regenerarlo desde Configuración (el anterior dejará de funcionar).",
    en: "Your QR is generated automatically on signup and never expires. If you suspect it has been copied fraudulently, you can regenerate it from Settings (the previous one will stop working).",
  },
  "qr.regenerate": { ca: "Regenerar QR", es: "Regenerar QR", en: "Regenerate QR" },
  "qr.toast.downloaded": {
    ca: "Descàrrega preparada",
    es: "Descarga preparada",
    en: "Download ready",
  },
  "qr.toast.printed": {
    ca: "Enviant a la impressora…",
    es: "Enviando a la impresora…",
    en: "Sending to printer…",
  },

  // Promotions view
  "promos.title": { ca: "Promocions", es: "Promociones", en: "Promotions" },
  "promos.subtitle": {
    ca: "Promocions informatives que veuran els veïns a la teva fitxa. Actives i desactives quan vulguis.",
    es: "Promociones informativas que verán los vecinos en tu ficha. Activas y desactivas cuando quieras.",
    en: "Informative promotions shown to neighbours on your profile. Turn them on and off whenever you like.",
  },
  "promos.add": { ca: "Afegir promoció", es: "Añadir promoción", en: "Add promotion" },
  "promos.addFirst": {
    ca: "Afegir la primera promoció",
    es: "Añadir la primera promoción",
    en: "Add the first promotion",
  },
  "promos.empty.title": {
    ca: "Encara no tens promocions",
    es: "Todavía no tienes promociones",
    en: "You have no promotions yet",
  },
  "promos.empty.subtitle": {
    ca: "Crea la teva primera promoció perquè els veïns la vegin a la teva fitxa.",
    es: "Crea tu primera promoción para que los vecinos la vean en tu ficha.",
    en: "Create your first promotion so neighbours can see it on your profile.",
  },
  "promos.col.promo": { ca: "Promoció", es: "Promoción", en: "Promotion" },
  "promos.col.state": { ca: "Estat", es: "Estado", en: "State" },
  "promos.col.actions": { ca: "Accions", es: "Acciones", en: "Actions" },
  "promos.state.active": { ca: "Activa", es: "Activa", en: "Active" },
  "promos.state.inactive": { ca: "Desactivada", es: "Desactivada", en: "Inactive" },
  "promos.deactivated": { ca: "desactivat", es: "desactivado", en: "deactivated" },
  "promos.confirmDelete.title": {
    ca: "Eliminar promoció?",
    es: "¿Eliminar promoción?",
    en: "Delete promotion?",
  },
  "promos.confirmDelete.body": {
    ca: "Aquesta acció no es pot desfer. La promoció deixarà d'estar visible per als veïns.",
    es: "Esta acción no se puede deshacer. La promoción dejará de estar visible para los vecinos.",
    en: "This action cannot be undone. The promotion will no longer be visible to neighbours.",
  },

  // Promo form
  "form.new.title": { ca: "Nova promoció", es: "Nueva promoción", en: "New promotion" },
  "form.edit.title": { ca: "Editar promoció", es: "Editar promoción", en: "Edit promotion" },
  "form.name.label": { ca: "Nom de la promoció", es: "Nombre de la promoción", en: "Promotion name" },
  "form.name.placeholder": {
    ca: "P. ex. 5% de descompte en pa",
    es: "P. ej. 5% de descuento en pan",
    en: "E.g. 5% off bread",
  },
  "form.type.label": { ca: "Tipus", es: "Tipo", en: "Type" },
  "form.type.descompte": { ca: "% descompte", es: "% descuento", en: "% discount" },
  "form.type.dos_x_un": { ca: "2×1", es: "2×1", en: "2×1" },
  "form.type.regal": { ca: "Regal", es: "Regalo", en: "Gift" },
  "form.type.preu_especial": { ca: "Preu especial", es: "Precio especial", en: "Special price" },
  "form.value.label": { ca: "Valor", es: "Valor", en: "Value" },
  "form.value.placeholder": { ca: "P. ex. 5%", es: "P. ej. 5%", en: "E.g. 5%" },
  "form.minPurchase.label": { ca: "Compra mínima", es: "Compra mínima", en: "Minimum purchase" },
  "form.minPurchase.placeholder": { ca: "P. ex. 20€", es: "P. ej. 20€", en: "E.g. 20€" },
  "form.detail.label": { ca: "Detall", es: "Detalle", en: "Detail" },
  "form.detail.placeholder": {
    ca: "P. ex. En pa i brioixeria",
    es: "P. ej. En pan y bollería",
    en: "E.g. On bread and pastries",
  },
  "form.validity.label": { ca: "Vigència", es: "Vigencia", en: "Validity" },
  "form.validity.from": { ca: "Des de", es: "Desde", en: "From" },
  "form.validity.to": { ca: "Fins a", es: "Hasta", en: "To" },
  "form.condition.label": {
    ca: "Condició (lletra petita)",
    es: "Condición (letra pequeña)",
    en: "Condition (fine print)",
  },
  "form.condition.placeholder": {
    ca: "No acumulable amb altres ofertes",
    es: "No acumulable con otras ofertas",
    en: "Not combinable with other offers",
  },
  "form.active.label": {
    ca: "Activa i visible per als veïns",
    es: "Activa y visible para los vecinos",
    en: "Active and visible to neighbours",
  },
  "form.submit": { ca: "Desar promoció", es: "Guardar promoción", en: "Save promotion" },
  "form.submitting": { ca: "Desant…", es: "Guardando…", en: "Saving…" },
  "form.error.required": { ca: "Camp obligatori", es: "Campo obligatorio", en: "Required field" },
  "form.error.dateRange": {
    ca: "La data final ha de ser posterior a la inicial",
    es: "La fecha final debe ser posterior a la inicial",
    en: "The end date must be after the start date",
  },

  // Toasts
  "toast.promo.saved": { ca: "Promoció desada", es: "Promoción guardada", en: "Promotion saved" },
  "toast.promo.activated": {
    ca: "Promoció activada",
    es: "Promoción activada",
    en: "Promotion activated",
  },
  "toast.promo.deactivated": {
    ca: "Promoció desactivada",
    es: "Promoción desactivada",
    en: "Promotion deactivated",
  },
  "toast.promo.deleted": {
    ca: "Promoció eliminada",
    es: "Promoción eliminada",
    en: "Promotion deleted",
  },
  "toast.promo.saveError": {
    ca: "No s'ha pogut desar la promoció",
    es: "No se ha podido guardar la promoción",
    en: "Could not save the promotion",
  },

  // "La meva fitxa" view
  "fitxa.title": { ca: "La meva fitxa", es: "Mi ficha", en: "My profile" },
  "fitxa.subtitle": {
    ca: "Edita el que veuran els veïns a la teva fitxa dins l'app. Comprova la vista prèvia mentre canvies dades.",
    es: "Edita lo que verán los vecinos en tu ficha dentro de la app. Comprueba la vista previa mientras cambias datos.",
    en: "Edit what neighbours will see on your profile inside the app. Check the live preview while you change data.",
  },
  "fitxa.section.brand": { ca: "Imatges i identitat", es: "Imágenes e identidad", en: "Images and brand" },
  "fitxa.section.info": { ca: "Informació del comerç", es: "Información del comercio", en: "Merchant info" },
  "fitxa.section.contact": { ca: "Contacte", es: "Contacto", en: "Contact" },
  "fitxa.section.horari": { ca: "Horari", es: "Horario", en: "Opening hours" },
  "fitxa.preview.title": {
    ca: "Vista prèvia a l'app",
    es: "Vista previa en la app",
    en: "App preview",
  },
  "fitxa.preview.hint": {
    ca: "Així es veurà la teva fitxa als veïns.",
    es: "Así se verá tu ficha para los vecinos.",
    en: "This is how your profile will look to neighbours.",
  },
  "fitxa.logo.label": { ca: "Logo (llistat)", es: "Logo (listado)", en: "Logo (listing)" },
  "fitxa.logo.hint": {
    ca: "Imatge petita quadrada. Es mostra al resum i al llistat de comerços.",
    es: "Imagen pequeña cuadrada. Se muestra en el resumen y en el listado.",
    en: "Small square image. Shown in summaries and the merchant list.",
  },
  "fitxa.logo.recommendation": {
    ca: "Recomanat: 512 × 512 px (quadrat, PNG o JPG, màx. 5 MB).",
    es: "Recomendado: 512 × 512 px (cuadrado, PNG o JPG, máx. 5 MB).",
    en: "Recommended: 512 × 512 px (square, PNG or JPG, max. 5 MB).",
  },
  "fitxa.hero.label": { ca: "Imatge de portada", es: "Imagen de portada", en: "Cover image" },
  "fitxa.hero.hint": {
    ca: "Imatge gran apaïsada. Es mostra a la part superior de la fitxa.",
    es: "Imagen grande apaisada. Se muestra en la parte superior de la ficha.",
    en: "Large landscape image. Shown at the top of the profile.",
  },
  "fitxa.hero.recommendation": {
    ca: "Recomanat: 1600 × 900 px (proporció 16:9, PNG o JPG, màx. 5 MB).",
    es: "Recomendado: 1600 × 900 px (proporción 16:9, PNG o JPG, máx. 5 MB).",
    en: "Recommended: 1600 × 900 px (16:9 ratio, PNG or JPG, max. 5 MB).",
  },
  "fitxa.upload": { ca: "Pujar imatge", es: "Subir imagen", en: "Upload image" },
  "fitxa.replace": { ca: "Canviar imatge", es: "Cambiar imagen", en: "Replace image" },
  "fitxa.remove": { ca: "Treure", es: "Quitar", en: "Remove" },
  "lang.switcher.label": { ca: "Canviar idioma", es: "Cambiar idioma", en: "Change language" },
  "fitxa.preview.listing.title": {
    ca: "Al llistat de comerços",
    es: "En el listado de comercios",
    en: "In the merchant list",
  },
  "fitxa.preview.listing.hint": {
    ca: "Així apareix el teu comerç a la llista «Comerços adherits».",
    es: "Así aparece tu comercio en la lista «Comercios adheridos».",
    en: "This is how your shop shows up in the «Partner merchants» list.",
  },
  "fitxa.preview.detail.title": {
    ca: "A la fitxa del comerç",
    es: "En la ficha del comercio",
    en: "On the merchant profile",
  },
  "fitxa.preview.points": { ca: "+20 pts", es: "+20 pts", en: "+20 pts" },
  "fitxa.nom.label": { ca: "Nom del comerç", es: "Nombre del comercio", en: "Merchant name" },
  "fitxa.categories.label": { ca: "Categories", es: "Categorías", en: "Categories" },
  "fitxa.categories.hint": {
    ca: "Separa-les per comes. P. ex. Alimentació, Fleca",
    es: "Sepáralas por comas. P. ej. Alimentación, Panadería",
    en: "Comma-separated. E.g. Food, Bakery",
  },
  "fitxa.descripcio.label": { ca: "Descripció", es: "Descripción", en: "Description" },
  "fitxa.descripcio.hint": {
    ca: "Text curt que veuran els veïns a la fitxa.",
    es: "Texto corto que verán los vecinos en la ficha.",
    en: "Short text shown to neighbours on the profile.",
  },
  "fitxa.adreca.label": { ca: "Adreça", es: "Dirección", en: "Address" },
  "fitxa.codiPostal.label": { ca: "Codi postal", es: "Código postal", en: "Postal code" },
  "fitxa.poblacio.label": { ca: "Població", es: "Población", en: "Town" },
  "fitxa.telefon.label": { ca: "Telèfon", es: "Teléfono", en: "Phone" },
  "fitxa.web.label": { ca: "Web", es: "Web", en: "Website" },
  "fitxa.horari.tancat": { ca: "Tancat", es: "Cerrado", en: "Closed" },
  "fitxa.horari.obertura": { ca: "Obertura", es: "Apertura", en: "Opens" },
  "fitxa.horari.tancament": { ca: "Tancament", es: "Cierre", en: "Closes" },
  "fitxa.horari.obertAra": { ca: "Obert ara", es: "Abierto ahora", en: "Open now" },
  "fitxa.horari.tancaAvui": {
    ca: "tanca a les {hora}",
    es: "cierra a las {hora}",
    en: "closes at {hora}",
  },
  "fitxa.horari.tancatAvui": { ca: "Tancat avui", es: "Cerrado hoy", en: "Closed today" },
  "fitxa.day.dilluns": { ca: "Dilluns", es: "Lunes", en: "Monday" },
  "fitxa.day.dimarts": { ca: "Dimarts", es: "Martes", en: "Tuesday" },
  "fitxa.day.dimecres": { ca: "Dimecres", es: "Miércoles", en: "Wednesday" },
  "fitxa.day.dijous": { ca: "Dijous", es: "Jueves", en: "Thursday" },
  "fitxa.day.divendres": { ca: "Divendres", es: "Viernes", en: "Friday" },
  "fitxa.day.dissabte": { ca: "Dissabte", es: "Sábado", en: "Saturday" },
  "fitxa.day.diumenge": { ca: "Diumenge", es: "Domingo", en: "Sunday" },
  "fitxa.preview.info": { ca: "Informació", es: "Información", en: "Information" },
  "fitxa.preview.adreca": { ca: "Adreça", es: "Dirección", en: "Address" },
  "fitxa.preview.horariAvui": { ca: "Horari d'avui", es: "Horario de hoy", en: "Today's hours" },
  "fitxa.preview.telefon": { ca: "Telèfon", es: "Teléfono", en: "Phone" },
  "fitxa.preview.web": { ca: "Web", es: "Web", en: "Website" },
  "fitxa.preview.trucar": { ca: "Trucar", es: "Llamar", en: "Call" },
  "fitxa.preview.obrir": { ca: "Obrir", es: "Abrir", en: "Open" },
  "fitxa.preview.encaraNoVisitat": {
    ca: "Encara no visitat",
    es: "Aún no visitado",
    en: "Not visited yet",
  },
  "fitxa.preview.jaEscanejat": { ca: "Ja escanejat", es: "Ya escaneado", en: "Already scanned" },
  "fitxa.preview.logoPlaceholder": {
    ca: "Sense logo",
    es: "Sin logo",
    en: "No logo",
  },
  "fitxa.preview.heroPlaceholder": {
    ca: "Sense imatge de portada",
    es: "Sin imagen de portada",
    en: "No cover image",
  },
  "fitxa.form.submit": { ca: "Desar canvis", es: "Guardar cambios", en: "Save changes" },
  "fitxa.toast.saved": { ca: "Fitxa desada", es: "Ficha guardada", en: "Profile saved" },
  "fitxa.toast.error": {
    ca: "No s'ha pogut desar la fitxa",
    es: "No se ha podido guardar la ficha",
    en: "Could not save the profile",
  },
  "fitxa.error.imageTooLarge": {
    ca: "La imatge és massa gran (màx. 5 MB).",
    es: "La imagen es demasiado grande (máx. 5 MB).",
    en: "Image is too large (max. 5 MB).",
  },

  // Placeholders for unimplemented views
  "placeholder.title": { ca: "Pròximament", es: "Próximamente", en: "Coming soon" },
  "placeholder.subtitle": {
    ca: "Aquesta secció encara està en construcció.",
    es: "Esta sección todavía está en construcción.",
    en: "This section is still under construction.",
  },

  // Statistics view
  "stats.title": { ca: "Estadístiques", es: "Estadísticas", en: "Statistics" },
  "stats.subtitle": {
    ca: "Descobreix com funciona el teu QR i les teves promocions: qui et visita, quan i què crida més l'atenció.",
    es: "Descubre cómo funciona tu QR y tus promociones: quién te visita, cuándo y qué llama más la atención.",
    en: "See how your QR and promotions perform: who visits, when, and what draws attention.",
  },
  "stats.range.7d": { ca: "Últims 7 dies", es: "Últimos 7 días", en: "Last 7 days" },
  "stats.range.30d": { ca: "Últims 30 dies", es: "Últimos 30 días", en: "Last 30 days" },
  "stats.range.90d": { ca: "Últims 90 dies", es: "Últimos 90 días", en: "Last 90 days" },
  "stats.range.any": { ca: "Últim any", es: "Último año", en: "Last year" },
  "stats.vsPrev": { ca: "vs. període anterior", es: "vs. periodo anterior", en: "vs. previous period" },
  "stats.kpi.scans": { ca: "Escanejos totals", es: "Escaneos totales", en: "Total scans" },
  "stats.kpi.uniqueVisitors": { ca: "Visitants únics", es: "Visitantes únicos", en: "Unique visitors" },
  "stats.kpi.mix": { ca: "Nous vs. recurrents", es: "Nuevos vs. recurrentes", en: "New vs. returning" },
  "stats.kpi.points": { ca: "Punts atorgats", es: "Puntos otorgados", en: "Points granted" },
  "stats.mix.new": { ca: "Nous", es: "Nuevos", en: "New" },
  "stats.mix.returning": { ca: "Recurrents", es: "Recurrentes", en: "Returning" },

  "stats.evolution.title": { ca: "Evolució", es: "Evolución", en: "Evolution" },
  "stats.evolution.subtitle": {
    ca: "Escanejos diaris i visitants únics.",
    es: "Escaneos diarios y visitantes únicos.",
    en: "Daily scans and unique visitors.",
  },
  "stats.series.scans": { ca: "Escanejos", es: "Escaneos", en: "Scans" },
  "stats.series.unique": { ca: "Visitants únics", es: "Visitantes únicos", en: "Unique visitors" },

  "stats.promos.title": { ca: "Rendiment de promocions", es: "Rendimiento de promociones", en: "Promotion performance" },
  "stats.promos.subtitle": {
    ca: "Vegades que els veïns han vist i han obert cada promoció.",
    es: "Veces que los vecinos han visto y abierto cada promoción.",
    en: "How many times neighbours saw and opened each promotion.",
  },
  "stats.promos.col.promo": { ca: "Promoció", es: "Promoción", en: "Promotion" },
  "stats.promos.col.views": { ca: "Vistes", es: "Vistas", en: "Views" },
  "stats.promos.col.opens": { ca: "Obertes", es: "Abiertas", en: "Opens" },
  "stats.promos.col.rate": { ca: "Conversió", es: "Conversión", en: "Rate" },
  "stats.promos.col.state": { ca: "Estat", es: "Estado", en: "State" },

  "stats.heatmap.title": { ca: "Quan t'escanegen més", es: "Cuándo te escanean más", en: "When scans happen" },
  "stats.heatmap.subtitle": {
    ca: "Distribució per dia de la setmana i franja horària.",
    es: "Distribución por día de la semana y franja horaria.",
    en: "Distribution by day of week and time slot.",
  },
  "stats.heatmap.legendLow": { ca: "Menys", es: "Menos", en: "Less" },
  "stats.heatmap.legendHigh": { ca: "Més", es: "Más", en: "More" },
  "stats.day.mon": { ca: "Dl", es: "Lu", en: "Mo" },
  "stats.day.tue": { ca: "Dm", es: "Ma", en: "Tu" },
  "stats.day.wed": { ca: "Dc", es: "Mi", en: "We" },
  "stats.day.thu": { ca: "Dj", es: "Ju", en: "Th" },
  "stats.day.fri": { ca: "Dv", es: "Vi", en: "Fr" },
  "stats.day.sat": { ca: "Ds", es: "Sá", en: "Sa" },
  "stats.day.sun": { ca: "Dg", es: "Do", en: "Su" },

  "stats.visitors.title": { ca: "Els meus clients", es: "Mis clientes", en: "My customers" },
  "stats.visitors.subtitle": {
    ca: "Persones que han escanejat el teu QR. L'email i el telèfon només es mostren si l'usuari els ha compartit amb el teu comerç des de l'app.",
    es: "Personas que han escaneado tu QR. El email y el teléfono solo se muestran si el usuario los ha compartido con tu comercio desde la app.",
    en: "People who scanned your QR. Email and phone are shown only when the user has shared them with your shop from the app.",
  },
  "stats.visitors.col.name": { ca: "Client", es: "Cliente", en: "Customer" },
  "stats.visitors.col.visits": { ca: "Visites", es: "Visitas", en: "Visits" },
  "stats.visitors.col.last": { ca: "Última visita", es: "Última visita", en: "Last visit" },
  "stats.visitors.col.points": { ca: "Punts", es: "Puntos", en: "Points" },
  "stats.visitors.col.contact": { ca: "Contacte", es: "Contacto", en: "Contact" },
  "stats.visitors.notShared": {
    ca: "No compartit",
    es: "No compartido",
    en: "Not shared",
  },
  "stats.visitors.empty": {
    ca: "Encara ningú no ha escanejat el teu QR en aquest període.",
    es: "Todavía nadie ha escaneado tu QR en este periodo.",
    en: "Nobody has scanned your QR in this period yet.",
  },

  // Auth · shared
  "auth.otp.hint": {
    ca: "En mode prototip pots utilitzar el codi {codi}.",
    es: "En modo prototipo puedes usar el código {codi}.",
    en: "In prototype mode you can use the code {codi}.",
  },
  "auth.otp.label": { ca: "Codi de verificació", es: "Código de verificación", en: "Verification code" },
  "auth.otp.subtitle": {
    ca: "Hem enviat un codi de 6 dígits a {email}. Introdueix-lo per continuar.",
    es: "Hemos enviado un código de 6 dígitos a {email}. Introdúcelo para continuar.",
    en: "We sent a 6-digit code to {email}. Enter it to continue.",
  },
  "auth.otp.resend": { ca: "Tornar a enviar el codi", es: "Reenviar código", en: "Resend code" },
  "auth.otp.change": { ca: "Canviar l'adreça", es: "Cambiar la dirección", en: "Change email" },
  "auth.otp.invalid": {
    ca: "El codi no és correcte. Torna-ho a provar.",
    es: "El código no es correcto. Inténtalo de nuevo.",
    en: "That code is not valid. Try again.",
  },
  "auth.otp.sent": { ca: "Codi enviat", es: "Código enviado", en: "Code sent" },

  // Login
  "login.title": { ca: "Entra al teu comerç", es: "Entra a tu comercio", en: "Sign in to your shop" },
  "login.subtitle": {
    ca: "Accedeix al panell del teu comerç per gestionar el QR i les promocions.",
    es: "Accede al panel de tu comercio para gestionar el QR y las promociones.",
    en: "Access your merchant panel to manage the QR and promotions.",
  },
  "login.email.label": { ca: "Correu electrònic", es: "Correo electrónico", en: "Email" },
  "login.email.placeholder": {
    ca: "correu@delteucomerç.cat",
    es: "correo@tucomercio.es",
    en: "you@yourshop.com",
  },
  "login.submit": { ca: "Enviar codi", es: "Enviar código", en: "Send code" },
  "login.submitting": { ca: "Enviant…", es: "Enviando…", en: "Sending…" },
  "login.verify": { ca: "Entrar", es: "Entrar", en: "Sign in" },
  "login.verifying": { ca: "Comprovant…", es: "Comprobando…", en: "Checking…" },
  "login.error.email": {
    ca: "Introdueix un correu electrònic vàlid.",
    es: "Introduce un correo electrónico válido.",
    en: "Enter a valid email address.",
  },
  "login.error.generic": {
    ca: "No hem pogut enviar el codi. Torna-ho a provar.",
    es: "No hemos podido enviar el código. Inténtalo de nuevo.",
    en: "We couldn't send the code. Please try again.",
  },
  "login.toRegister.text": {
    ca: "Encara no tens compte?",
    es: "¿Aún no tienes cuenta?",
    en: "Don't have an account yet?",
  },
  "login.toRegister.cta": { ca: "Registra el teu comerç", es: "Registra tu comercio", en: "Register your shop" },
  "login.toast.welcome": { ca: "Sessió iniciada", es: "Sesión iniciada", en: "Signed in" },

  // Register
  "register.title": { ca: "Registra el teu comerç", es: "Registra tu comercio", en: "Register your shop" },
  "register.subtitle": {
    ca: "Uneix-te a KM0 LAB i comença a fidelitzar els veïns del teu barri.",
    es: "Únete a KM0 LAB y empieza a fidelizar a los vecinos de tu barrio.",
    en: "Join KM0 LAB and start rewarding the neighbours of your area.",
  },
  "register.nomComerc.label": { ca: "Nom del comerç", es: "Nombre del comercio", en: "Shop name" },
  "register.nomComerc.placeholder": {
    ca: "P. ex. Forn Rovira",
    es: "P. ej. Panadería Rovira",
    en: "E.g. Rovira Bakery",
  },
  "register.persona.label": { ca: "Persona de contacte", es: "Persona de contacto", en: "Contact person" },
  "register.persona.placeholder": { ca: "Nom i cognoms", es: "Nombre y apellidos", en: "Full name" },
  "register.email.label": { ca: "Correu electrònic", es: "Correo electrónico", en: "Email" },
  "register.email.placeholder": {
    ca: "correu@delteucomerç.cat",
    es: "correo@tucomercio.es",
    en: "you@yourshop.com",
  },
  "register.email.hint": {
    ca: "Enviarem un codi de 6 dígits a aquest correu per verificar-lo.",
    es: "Enviaremos un código de 6 dígitos a este correo para verificarlo.",
    en: "We'll send a 6-digit code to this email to verify it.",
  },
  "register.telefon.label": { ca: "Telèfon del negoci", es: "Teléfono del negocio", en: "Business phone" },
  "register.telefon.placeholder": {
    ca: "P. ex. +34 900 000 000",
    es: "P. ej. +34 900 000 000",
    en: "E.g. +34 900 000 000",
  },
  "register.terms.label": {
    ca: "Accepto les condicions d'ús i la política de privadesa.",
    es: "Acepto las condiciones de uso y la política de privacidad.",
    en: "I accept the terms of use and privacy policy.",
  },
  "register.submit": { ca: "Crear compte", es: "Crear cuenta", en: "Create account" },
  "register.submitting": { ca: "Creant…", es: "Creando…", en: "Creating…" },
  "register.verify": { ca: "Verificar i entrar", es: "Verificar y entrar", en: "Verify and sign in" },
  "register.verifying": { ca: "Verificant…", es: "Verificando…", en: "Verifying…" },
  "register.error.required": { ca: "Camp obligatori", es: "Campo obligatorio", en: "Required field" },
  "register.error.email": {
    ca: "Introdueix un correu electrònic vàlid.",
    es: "Introduce un correo electrónico válido.",
    en: "Enter a valid email address.",
  },
  "register.error.phone": {
    ca: "Introdueix un telèfon vàlid.",
    es: "Introduce un teléfono válido.",
    en: "Enter a valid phone number.",
  },
  "register.error.terms": {
    ca: "Cal acceptar les condicions per continuar.",
    es: "Debes aceptar las condiciones para continuar.",
    en: "You must accept the terms to continue.",
  },
  "register.error.generic": {
    ca: "No hem pogut completar el registre. Torna-ho a provar.",
    es: "No hemos podido completar el registro. Inténtalo de nuevo.",
    en: "We couldn't complete the registration. Please try again.",
  },
  "register.toLogin.text": {
    ca: "Ja tens compte?",
    es: "¿Ya tienes cuenta?",
    en: "Already have an account?",
  },
  "register.toLogin.cta": { ca: "Inicia sessió", es: "Inicia sesión", en: "Sign in" },
  "register.toast.welcome": { ca: "Comerç registrat", es: "Comercio registrado", en: "Shop registered" },

  // Sidebar · session
  "auth.signOut": { ca: "Tanca la sessió", es: "Cerrar sesión", en: "Sign out" },
  "auth.signOut.toast": { ca: "Sessió tancada", es: "Sesión cerrada", en: "Signed out" },

  // Roles & admin shell
  "app.adminSubtitle": {
    ca: "Panell de gestor municipal",
    es: "Panel de gestor municipal",
    en: "Municipal manager panel",
  },
  "role.tag.admin": { ca: "Administrador", es: "Administrador", en: "Administrator" },
  "role.tag.comerc": { ca: "Comerç", es: "Comercio", en: "Merchant" },
  "role.switcher.label": { ca: "Canviar de rol", es: "Cambiar de rol", en: "Switch role" },
  "role.switcher.aria": { ca: "Canviar de rol", es: "Cambiar de rol", en: "Switch role" },
  "role.switcher.comerc": {
    ca: "Veure com a comerç",
    es: "Ver como comercio",
    en: "View as merchant",
  },
  "role.switcher.admin": {
    ca: "Veure com a administrador",
    es: "Ver como administrador",
    en: "View as administrator",
  },
  "role.switcher.hint": {
    ca: "Simulació de rols (només prototip)",
    es: "Simulación de roles (solo prototipo)",
    en: "Role simulation (prototype only)",
  },

  // Admin navigation
  "nav.accions": { ca: "Accions", es: "Acciones", en: "Actions" },
  "nav.recompenses": { ca: "Recompenses", es: "Recompensas", en: "Rewards" },
  "nav.comercos": { ca: "Comerços", es: "Comercios", en: "Merchants" },
  "nav.usuaris": { ca: "Usuaris", es: "Usuarios", en: "Users" },

  "admin.error.title": { ca: "S'ha produït un error", es: "Se ha producido un error", en: "Something went wrong" },
  "admin.error.desc": {
    ca: "No s'han pogut carregar les dades. Torna-ho a provar més tard.",
    es: "No se han podido cargar los datos. Inténtalo de nuevo más tarde.",
    en: "Could not load the data. Please try again later.",
  },

  // Admin · Resum
  "admin.resum.title": { ca: "Resum", es: "Resumen", en: "Overview" },
  "admin.resum.subtitle": {
    ca: "Panoràmica del programa de fidelització de la teva població.",
    es: "Panorámica del programa de fidelización de tu población.",
    en: "Overview of the loyalty program for your town.",
  },
  "admin.kpi.usuarisActius": { ca: "Usuaris actius", es: "Usuarios activos", en: "Active users" },
  "admin.kpi.usuarisActius.hint": {
    ca: "Veïns amb activitat aquest mes",
    es: "Vecinos con actividad este mes",
    en: "Residents active this month",
  },
  "admin.kpi.puntsCirculacio": {
    ca: "Punts en circulació",
    es: "Puntos en circulación",
    en: "Points in circulation",
  },
  "admin.kpi.puntsCirculacio.hint": {
    ca: "Punts acumulats i no bescanviats",
    es: "Puntos acumulados y no canjeados",
    en: "Points earned and not redeemed",
  },
  "admin.kpi.bescanvis": { ca: "Bescanvis del mes", es: "Canjes del mes", en: "Redemptions this month" },
  "admin.kpi.bescanvis.hint": {
    ca: "Recompenses bescanviades pels veïns",
    es: "Recompensas canjeadas por los vecinos",
    en: "Rewards redeemed by residents",
  },
  "admin.kpi.accionsActives": { ca: "Accions actives", es: "Acciones activas", en: "Active actions" },
  "admin.kpi.accionsActives.hint": {
    ca: "Sobre {total} accions configurades",
    es: "Sobre {total} acciones configuradas",
    en: "Out of {total} configured actions",
  },
  "admin.accionsTop.title": { ca: "Accions més utilitzades", es: "Acciones más utilizadas", en: "Top actions" },
  "admin.accionsTop.subtitle": {
    ca: "Les accions que més punts donen als teus veïns.",
    es: "Las acciones que más puntos otorgan a tus vecinos.",
    en: "Actions that grant the most points to residents.",
  },
  "admin.accionsTop.col.accio": { ca: "Acció", es: "Acción", en: "Action" },
  "admin.accionsTop.col.punts": { ca: "Punts", es: "Puntos", en: "Points" },
  "admin.accionsTop.col.usos": { ca: "Usos", es: "Usos", en: "Uses" },
  "admin.bescanvis.title": { ca: "Últims bescanvis", es: "Últimos canjes", en: "Latest redemptions" },
  "admin.bescanvis.subtitle": {
    ca: "Recompenses que els veïns han bescanviat recentment.",
    es: "Recompensas que los vecinos han canjeado recientemente.",
    en: "Rewards recently redeemed by residents.",
  },
  "admin.bescanvis.col.recompensa": { ca: "Recompensa", es: "Recompensa", en: "Reward" },
  "admin.bescanvis.col.usuari": { ca: "Usuari", es: "Usuario", en: "User" },
  "admin.bescanvis.col.quan": { ca: "Quan", es: "Cuándo", en: "When" },
  "admin.bescanvis.col.punts": { ca: "Punts", es: "Puntos", en: "Points" },

  "admin.accio.tipus.registre": { ca: "Registre", es: "Registro", en: "Sign-up" },
  "admin.accio.tipus.escaneig": { ca: "Escaneig", es: "Escaneo", en: "Scan" },
  "admin.accio.tipus.web": { ca: "Web", es: "Web", en: "Web" },
  "admin.accio.tipus.esdeveniment": { ca: "Esdeveniment", es: "Evento", en: "Event" },
  "admin.accio.tipus.compra": { ca: "Compra", es: "Compra", en: "Purchase" },
  "admin.accio.tipus.altre": { ca: "Altre", es: "Otro", en: "Other" },

  // Admin · Accions de punts (llistat + form)
  "accions.title": { ca: "Accions de punts", es: "Acciones de puntos", en: "Point actions" },
  "accions.subtitle": {
    ca: "Configura per què guanyen punts els veïns a {poblacio}.",
    es: "Configura por qué ganan puntos los vecinos en {poblacio}.",
    en: "Configure how residents of {poblacio} earn points.",
  },
  "accions.subtitle.generic": {
    ca: "Configura per què guanyen punts els veïns.",
    es: "Configura por qué ganan puntos los vecinos.",
    en: "Configure how residents earn points.",
  },
  "accions.add": { ca: "Afegir acció", es: "Añadir acción", en: "Add action" },
  "accions.addFirst": {
    ca: "Afegir la primera acció",
    es: "Añadir la primera acción",
    en: "Add the first action",
  },
  "accions.empty.title": {
    ca: "Encara no hi ha accions",
    es: "Aún no hay acciones",
    en: "No actions yet",
  },
  "accions.empty.subtitle": {
    ca: "Crea la primera acció perquè els veïns puguin començar a guanyar punts.",
    es: "Crea la primera acción para que los vecinos empiecen a ganar puntos.",
    en: "Create the first action so residents can start earning points.",
  },
  "accions.col.accio": { ca: "Acció", es: "Acción", en: "Action" },
  "accions.col.tipus": { ca: "Tipus", es: "Tipo", en: "Type" },
  "accions.col.punts": { ca: "Punts", es: "Puntos", en: "Points" },
  "accions.col.estat": { ca: "Estat", es: "Estado", en: "State" },
  "accions.col.actions": { ca: "Accions", es: "Acciones", en: "Actions" },
  "accions.state.active": { ca: "Activa", es: "Activa", en: "Active" },
  "accions.state.inactive": { ca: "Desactivada", es: "Desactivada", en: "Inactive" },
  "accions.confirmDelete.title": {
    ca: "Eliminar acció?",
    es: "¿Eliminar acción?",
    en: "Delete action?",
  },
  "accions.confirmDelete.body": {
    ca: "Aquesta acció no es pot desfer. Els veïns deixaran de guanyar punts amb aquesta acció.",
    es: "Esta acción no se puede deshacer. Los vecinos dejarán de ganar puntos con ella.",
    en: "This cannot be undone. Residents will stop earning points from this action.",
  },

  "accions.tipus.registre": {
    ca: "Registre a l'app",
    es: "Registro en la app",
    en: "App sign-up",
  },
  "accions.tipus.escaneig_qr": {
    ca: "Escaneig d'un comerç",
    es: "Escaneo de un comercio",
    en: "Merchant scan",
  },
  "accions.tipus.visita_web": {
    ca: "Visita web",
    es: "Visita web",
    en: "Web visit",
  },
  "accions.tipus.registre_web": {
    ca: "Registre web",
    es: "Registro web",
    en: "Web sign-up",
  },
  "accions.tipus.esdeveniment": {
    ca: "Inscripció a esdeveniment",
    es: "Inscripción a evento",
    en: "Event sign-up",
  },
  "accions.tipus.personalitzada": {
    ca: "Personalitzada",
    es: "Personalizada",
    en: "Custom",
  },

  "accions.form.new.title": { ca: "Nova acció de punts", es: "Nueva acción de puntos", en: "New point action" },
  "accions.form.new.subtitle": {
    ca: "Defineix una acció per la qual els veïns guanyaran punts.",
    es: "Define una acción por la que los vecinos ganarán puntos.",
    en: "Define an action for residents to earn points.",
  },
  "accions.form.edit.title": { ca: "Editar acció", es: "Editar acción", en: "Edit action" },
  "accions.form.tipus.label": { ca: "Tipus d'acció", es: "Tipo de acción", en: "Action type" },
  "accions.form.nom.label": { ca: "Nom de l'acció", es: "Nombre de la acción", en: "Action name" },
  "accions.form.nom.placeholder": {
    ca: "P. ex. Visita la web de turisme",
    es: "P. ej. Visita la web de turismo",
    en: "E.g. Visit the tourism website",
  },
  "accions.form.descripcio.label": { ca: "Descripció", es: "Descripción", en: "Description" },
  "accions.form.descripcio.placeholder": {
    ca: "Explica breument què ha de fer el veí per guanyar els punts.",
    es: "Explica brevemente qué debe hacer el vecino para ganar los puntos.",
    en: "Briefly explain what residents must do to earn the points.",
  },
  "accions.form.punts.label": { ca: "Punts atorgats", es: "Puntos otorgados", en: "Points granted" },
  "accions.form.punts.error": {
    ca: "Introdueix un nombre de punts vàlid.",
    es: "Introduce un número de puntos válido.",
    en: "Enter a valid number of points.",
  },
  "accions.form.limitPerUsuari.label": {
    ca: "Límit d'usos per usuari",
    es: "Límite de usos por usuario",
    en: "Uses per user",
  },
  "accions.form.limitTotal.label": {
    ca: "Límit total d'usos",
    es: "Límite total de usos",
    en: "Total uses",
  },
  "accions.form.vigencia.from": { ca: "Vàlida des de", es: "Válida desde", en: "Valid from" },
  "accions.form.vigencia.to": { ca: "Vàlida fins", es: "Válida hasta", en: "Valid until" },
  "accions.form.condicions.label": {
    ca: "Condicions (lletra petita)",
    es: "Condiciones (letra pequeña)",
    en: "Conditions (fine print)",
  },
  "accions.form.condicions.placeholder": {
    ca: "P. ex. Un únic ús per usuari.",
    es: "P. ej. Un único uso por usuario.",
    en: "E.g. One use per user.",
  },
  "accions.form.active.label": {
    ca: "Acció activa i visible per als veïns",
    es: "Acción activa y visible para los vecinos",
    en: "Action active and visible to residents",
  },
  "accions.form.active.hint": {
    ca: "Si la desactives, l'acció deixarà d'atorgar punts.",
    es: "Si la desactivas, la acción dejará de otorgar puntos.",
    en: "If disabled, the action will stop granting points.",
  },
  "accions.form.url.label": { ca: "URL de destí", es: "URL de destino", en: "Target URL" },
  "accions.form.url.placeholder": {
    ca: "https://…",
    es: "https://…",
    en: "https://…",
  },
  "accions.form.esdeveniment.label": { ca: "Esdeveniment", es: "Evento", en: "Event" },
  "accions.form.esdeveniment.placeholder": {
    ca: "Tria un esdeveniment",
    es: "Elige un evento",
    en: "Choose an event",
  },
  "accions.form.comerc.label": { ca: "Comerç", es: "Comercio", en: "Merchant" },
  "accions.form.comerc.any": {
    ca: "Qualsevol comerç",
    es: "Cualquier comercio",
    en: "Any merchant",
  },
  "accions.form.submit": { ca: "Desar acció", es: "Guardar acción", en: "Save action" },

  "toast.accio.saved": { ca: "Acció desada", es: "Acción guardada", en: "Action saved" },
  "toast.accio.activated": { ca: "Acció activada", es: "Acción activada", en: "Action activated" },
  "toast.accio.deactivated": {
    ca: "Acció desactivada",
    es: "Acción desactivada",
    en: "Action deactivated",
  },
  "toast.accio.deleted": { ca: "Acció eliminada", es: "Acción eliminada", en: "Action deleted" },
  "toast.accio.saveError": {
    ca: "No s'ha pogut desar l'acció",
    es: "No se ha podido guardar la acción",
    en: "Could not save the action",
  },

  // Recompenses (admin)
  "recompenses.title": { ca: "Recompenses", es: "Recompensas", en: "Rewards" },
  "recompenses.subtitle": {
    ca: "Catàleg de recompenses que els veïns poden bescanviar per punts.",
    es: "Catálogo de recompensas que los vecinos pueden canjear por puntos.",
    en: "Catalogue of rewards neighbours can redeem with their points.",
  },
  "recompenses.add": {
    ca: "Afegir recompensa",
    es: "Añadir recompensa",
    en: "Add reward",
  },
  "recompenses.addFirst": {
    ca: "Afegir la primera recompensa",
    es: "Añadir la primera recompensa",
    en: "Add the first reward",
  },
  "recompenses.empty.title": {
    ca: "Encara no hi ha recompenses",
    es: "Aún no hay recompensas",
    en: "No rewards yet",
  },
  "recompenses.empty.subtitle": {
    ca: "Crea la primera recompensa perquè els veïns la puguin bescanviar amb els seus punts.",
    es: "Crea la primera recompensa para que los vecinos la puedan canjear con sus puntos.",
    en: "Create the first reward so neighbours can redeem it with their points.",
  },
  "recompenses.card.stock": { ca: "Estoc", es: "Stock", en: "Stock" },
  "recompenses.card.stockUnlimited": {
    ca: "Estoc il·limitat",
    es: "Stock ilimitado",
    en: "Unlimited stock",
  },
  "recompenses.card.value": { ca: "Valor", es: "Valor", en: "Value" },
  "recompenses.card.usableAll": {
    ca: "Tots els comerços adherits",
    es: "Todos los comercios adheridos",
    en: "All partner merchants",
  },
  "recompenses.card.usableCount": {
    ca: "{count} comerços",
    es: "{count} comercios",
    en: "{count} merchants",
  },
  "recompenses.confirmDelete.title": {
    ca: "Eliminar recompensa?",
    es: "¿Eliminar recompensa?",
    en: "Delete reward?",
  },
  "recompenses.confirmDelete.body": {
    ca: "Aquesta acció no es pot desfer. La recompensa deixarà d'estar disponible al catàleg.",
    es: "Esta acción no se puede deshacer. La recompensa dejará de estar disponible en el catálogo.",
    en: "This action cannot be undone. The reward will no longer be available in the catalogue.",
  },
  "recompenses.tipus.descompte": { ca: "Descompte", es: "Descuento", en: "Discount" },
  "recompenses.tipus.saldo": { ca: "Saldo", es: "Saldo", en: "Balance" },
  "recompenses.tipus.producte": { ca: "Producte", es: "Producto", en: "Product" },
  "recompenses.tipus.servei": { ca: "Servei", es: "Servicio", en: "Service" },
  "recompenses.tipus.marxandatge": { ca: "Marxandatge", es: "Merchandising", en: "Merchandise" },
  "recompenses.tipus.experiencia": { ca: "Experiència", es: "Experiencia", en: "Experience" },
  "recompenses.estat.activa": { ca: "Activa", es: "Activa", en: "Active" },
  "recompenses.estat.inactiva": { ca: "Inactiva", es: "Inactiva", en: "Inactive" },
  "recompenses.estat.esgotada": { ca: "Esgotada", es: "Agotada", en: "Sold out" },

  "recompenses.form.new.title": {
    ca: "Nova recompensa",
    es: "Nueva recompensa",
    en: "New reward",
  },
  "recompenses.form.new.subtitle": {
    ca: "Afegeix una recompensa al catàleg de bescanvi.",
    es: "Añade una recompensa al catálogo de canje.",
    en: "Add a reward to the redemption catalogue.",
  },
  "recompenses.form.edit.title": {
    ca: "Editar recompensa",
    es: "Editar recompensa",
    en: "Edit reward",
  },
  "recompenses.form.imatge.label": { ca: "Imatge", es: "Imagen", en: "Image" },
  "recompenses.form.imatge.hint": {
    ca: "Imatge que veuran els veïns al catàleg de la app.",
    es: "Imagen que verán los vecinos en el catálogo de la app.",
    en: "Image neighbours will see in the app catalogue.",
  },
  "recompenses.form.imatge.recommendation": {
    ca: "Recomanat: 1200 × 900 px (proporció 4:3, PNG o JPG, màx. 5 MB).",
    es: "Recomendado: 1200 × 900 px (proporción 4:3, PNG o JPG, máx. 5 MB).",
    en: "Recommended: 1200 × 900 px (4:3, PNG or JPG, max. 5 MB).",
  },
  "recompenses.form.imatge.placeholder": {
    ca: "Sense imatge",
    es: "Sin imagen",
    en: "No image",
  },
  "recompenses.form.nom.label": { ca: "Nom", es: "Nombre", en: "Name" },
  "recompenses.form.nom.placeholder": {
    ca: "P. ex. Val de 5€",
    es: "P. ej. Vale de 5€",
    en: "E.g. 5€ voucher",
  },
  "recompenses.form.descripcio.label": { ca: "Descripció", es: "Descripción", en: "Description" },
  "recompenses.form.descripcio.placeholder": {
    ca: "Breu descripció que veuran els veïns.",
    es: "Breve descripción que verán los vecinos.",
    en: "Short description shown to neighbours.",
  },
  "recompenses.form.tipus.label": { ca: "Tipus de recompensa", es: "Tipo de recompensa", en: "Reward type" },
  "recompenses.form.punts.label": { ca: "Punts necessaris", es: "Puntos necesarios", en: "Points required" },
  "recompenses.form.punts.error": {
    ca: "Introdueix un número positiu",
    es: "Introduce un número positivo",
    en: "Enter a positive number",
  },
  "recompenses.form.valor.label": { ca: "Valor / import", es: "Valor / importe", en: "Value / amount" },
  "recompenses.form.valor.placeholder": {
    ca: "P. ex. 5 €, 10%, 1 entrada",
    es: "P. ej. 5 €, 10%, 1 entrada",
    en: "E.g. 5 €, 10%, 1 ticket",
  },
  "recompenses.form.comercos.label": {
    ca: "Comerços / serveis on es pot fer servir",
    es: "Comercios / servicios donde se puede usar",
    en: "Merchants / services where it can be used",
  },
  "recompenses.form.comercos.tots": {
    ca: "Tots els comerços adherits",
    es: "Todos los comercios adheridos",
    en: "All partner merchants",
  },
  "recompenses.form.comercos.hint": {
    ca: "Selecciona en quins comerços es pot bescanviar.",
    es: "Selecciona en qué comercios se puede canjear.",
    en: "Choose the merchants where it can be redeemed.",
  },
  "recompenses.form.estoc.label": { ca: "Estoc disponible", es: "Stock disponible", en: "Available stock" },
  "recompenses.form.estoc.unlimited": {
    ca: "Estoc il·limitat",
    es: "Stock ilimitado",
    en: "Unlimited stock",
  },
  "recompenses.form.dates.from": { ca: "Data d'inici", es: "Fecha de inicio", en: "Start date" },
  "recompenses.form.dates.to": { ca: "Data de fi", es: "Fecha de fin", en: "End date" },
  "recompenses.form.condicions.label": {
    ca: "Condicions d'ús",
    es: "Condiciones de uso",
    en: "Terms of use",
  },
  "recompenses.form.condicions.placeholder": {
    ca: "P. ex. No acumulable amb altres ofertes.",
    es: "P. ej. No acumulable con otras ofertas.",
    en: "E.g. Not combinable with other offers.",
  },
  "recompenses.form.estat.label": { ca: "Estat", es: "Estado", en: "State" },
  "recompenses.form.estat.hintEsgotada": {
    ca: "L'estoc és 0. La recompensa es marcarà com a esgotada.",
    es: "El stock es 0. La recompensa se marcará como agotada.",
    en: "Stock is 0. The reward will be marked as sold out.",
  },
  "recompenses.form.submit": {
    ca: "Desar recompensa",
    es: "Guardar recompensa",
    en: "Save reward",
  },

  "toast.recompensa.saved": {
    ca: "Recompensa desada",
    es: "Recompensa guardada",
    en: "Reward saved",
  },
  "toast.recompensa.saveError": {
    ca: "No s'ha pogut desar la recompensa",
    es: "No se ha podido guardar la recompensa",
    en: "Could not save the reward",
  },
  "toast.recompensa.deleted": {
    ca: "Recompensa eliminada",
    es: "Recompensa eliminada",
    en: "Reward deleted",
  },
  "toast.recompensa.activated": {
    ca: "Recompensa activada",
    es: "Recompensa activada",
    en: "Reward activated",
  },
  "toast.recompensa.deactivated": {
    ca: "Recompensa desactivada",
    es: "Recompensa desactivada",
    en: "Reward deactivated",
  },

  // ==== Admin · Comerços ====
  "comercos.title": { ca: "Comerços", es: "Comercios", en: "Merchants" },
  "comercos.subtitle": {
    ca: "Els comerços adherits de {poblacio}.",
    es: "Los comercios adheridos de {poblacio}.",
    en: "The partner merchants of {poblacio}.",
  },
  "comercos.add": {
    ca: "Afegir comerç",
    es: "Añadir comercio",
    en: "Add merchant",
  },
  "comercos.addFirst": {
    ca: "Afegir el primer comerç",
    es: "Añadir el primer comercio",
    en: "Add the first merchant",
  },
  "comercos.empty.title": {
    ca: "Encara no hi ha comerços",
    es: "Aún no hay comercios",
    en: "No merchants yet",
  },
  "comercos.empty.subtitle": {
    ca: "Convida el primer comerç perquè comenci a repartir punts.",
    es: "Invita al primer comercio para que empiece a repartir puntos.",
    en: "Invite the first merchant to start giving points.",
  },
  "comercos.search.placeholder": {
    ca: "Cerca per nom, categoria o email…",
    es: "Busca por nombre, categoría o email…",
    en: "Search by name, category or email…",
  },
  "comercos.filter.all": { ca: "Tots els estats", es: "Todos los estados", en: "All statuses" },
  "comercos.filter.noResults": {
    ca: "No hi ha comerços amb aquests criteris.",
    es: "No hay comercios con estos criterios.",
    en: "No merchants match these filters.",
  },
  "comercos.estat.actiu": { ca: "Actiu", es: "Activo", en: "Active" },
  "comercos.estat.pendent": {
    ca: "Pendent d'accés",
    es: "Pendiente de acceso",
    en: "Pending access",
  },
  "comercos.estat.inactiu": { ca: "Inactiu", es: "Inactivo", en: "Inactive" },

  "comercos.col.comerc": { ca: "Comerç", es: "Comercio", en: "Merchant" },
  "comercos.col.categories": { ca: "Categories", es: "Categorías", en: "Categories" },
  "comercos.col.estat": { ca: "Estat", es: "Estado", en: "Status" },
  "comercos.col.qr": { ca: "QR", es: "QR", en: "QR" },
  "comercos.col.promos": {
    ca: "Promos actives",
    es: "Promos activas",
    en: "Active promos",
  },
  "comercos.col.punts": {
    ca: "Punts/visita",
    es: "Puntos/visita",
    en: "Points/visit",
  },
  "comercos.col.alta": { ca: "Alta", es: "Alta", en: "Joined" },
  "comercos.col.actions": { ca: "Accions", es: "Acciones", en: "Actions" },
  "comercos.card.altaLabel": { ca: "Alta:", es: "Alta:", en: "Joined:" },

  "comercos.form.new.title": {
    ca: "Afegir comerç",
    es: "Añadir comercio",
    en: "Add merchant",
  },
  "comercos.form.new.subtitle": {
    ca: "Dona d'alta un comerç i envia-li la invitació per accedir al seu panell.",
    es: "Da de alta un comercio y envíale la invitación para acceder a su panel.",
    en: "Register a merchant and send them the invitation to access their panel.",
  },
  "comercos.form.edit.title": {
    ca: "Editar comerç",
    es: "Editar comercio",
    en: "Edit merchant",
  },
  "comercos.form.emoji.label": { ca: "Emoji", es: "Emoji", en: "Emoji" },
  "comercos.form.nom.label": {
    ca: "Nom del comerç",
    es: "Nombre del comercio",
    en: "Merchant name",
  },
  "comercos.form.nom.placeholder": {
    ca: "Ex: Forn Rovira",
    es: "Ej: Horno Rovira",
    en: "E.g. Rovira Bakery",
  },
  "comercos.form.categories.label": {
    ca: "Categories",
    es: "Categorías",
    en: "Categories",
  },
  "comercos.form.categories.placeholder": {
    ca: "Alimentació, Fleca",
    es: "Alimentación, Panadería",
    en: "Food, Bakery",
  },
  "comercos.form.categories.hint": {
    ca: "Separa les categories amb comes.",
    es: "Separa las categorías con comas.",
    en: "Separate categories with commas.",
  },
  "comercos.form.email.label": {
    ca: "Email de contacte",
    es: "Email de contacto",
    en: "Contact email",
  },
  "comercos.form.email.placeholder": {
    ca: "hola@elmeucomerc.cat",
    es: "hola@micomercio.es",
    en: "hello@mymerchant.com",
  },
  "comercos.form.email.hintNew": {
    ca: "Enviarem la invitació a aquest email (mock).",
    es: "Enviaremos la invitación a este email (mock).",
    en: "We'll send the invitation to this email (mock).",
  },
  "comercos.form.email.hintEdit": {
    ca: "Email de contacte del comerç.",
    es: "Email de contacto del comercio.",
    en: "Merchant's contact email.",
  },
  "comercos.form.email.error": {
    ca: "Introdueix un email vàlid.",
    es: "Introduce un email válido.",
    en: "Enter a valid email.",
  },
  "comercos.form.punts.label": {
    ca: "Punts per visita",
    es: "Puntos por visita",
    en: "Points per visit",
  },
  "comercos.form.punts.hint": {
    ca: "Punts que rep un usuari cada vegada que escaneja el QR d'aquest comerç.",
    es: "Puntos que recibe un usuario cada vez que escanea el QR de este comercio.",
    en: "Points a user gets each time they scan this merchant's QR.",
  },
  "comercos.form.punts.error": {
    ca: "Introdueix un valor positiu.",
    es: "Introduce un valor positivo.",
    en: "Enter a positive value.",
  },
  "comercos.form.adreca.label": { ca: "Adreça", es: "Dirección", en: "Address" },
  "comercos.form.adreca.placeholder": {
    ca: "C. Major, 12",
    es: "C. Mayor, 12",
    en: "12 Main St.",
  },
  "comercos.form.inviteHint": {
    ca: "Es crearà el comerç en estat 'Pendent d'accés' i es generarà el seu QR automàticament.",
    es: "Se creará el comercio en estado 'Pendiente de acceso' y se generará su QR automáticamente.",
    en: "The merchant will be created as 'Pending access' and its QR will be generated automatically.",
  },
  "comercos.form.submit.new": {
    ca: "Convidar comerç",
    es: "Invitar comercio",
    en: "Invite merchant",
  },
  "comercos.form.submit.edit": {
    ca: "Desar canvis",
    es: "Guardar cambios",
    en: "Save changes",
  },

  "toast.comerc.invited": {
    ca: "Comerç convidat",
    es: "Comercio invitado",
    en: "Merchant invited",
  },
  "toast.comerc.saved": {
    ca: "Comerç desat",
    es: "Comercio guardado",
    en: "Merchant saved",
  },
  "toast.comerc.saveError": {
    ca: "No s'ha pogut desar el comerç",
    es: "No se ha podido guardar el comercio",
    en: "Could not save the merchant",
  },
  "toast.comerc.activated": {
    ca: "Comerç activat",
    es: "Comercio activado",
    en: "Merchant activated",
  },
  "toast.comerc.deactivated": {
    ca: "Comerç desactivat",
    es: "Comercio desactivado",
    en: "Merchant deactivated",
  },

  // ==== Admin · Usuaris (veïns) ====
  "usuaris.title": { ca: "Usuaris", es: "Usuarios", en: "Users" },
  "usuaris.subtitle": {
    ca: "Veïns inscrits al programa de punts de {poblacio}.",
    es: "Vecinos inscritos en el programa de puntos de {poblacio}.",
    en: "Residents enrolled in the {poblacio} points programme.",
  },
  "usuaris.empty.title": {
    ca: "Encara no hi ha veïns inscrits",
    es: "Aún no hay vecinos inscritos",
    en: "No residents enrolled yet",
  },
  "usuaris.empty.subtitle": {
    ca: "Quan un veí s'inscrigui al programa des de l'app, apareixerà aquí.",
    es: "Cuando un vecino se inscriba al programa desde la app, aparecerá aquí.",
    en: "When a resident joins the programme from the app, they'll show up here.",
  },
  "usuaris.search.placeholder": {
    ca: "Cerca per nom o email…",
    es: "Busca por nombre o email…",
    en: "Search by name or email…",
  },
  "usuaris.filter.allLevels": {
    ca: "Tots els nivells",
    es: "Todos los niveles",
    en: "All levels",
  },
  "usuaris.filter.noResults": {
    ca: "No hi ha veïns amb aquests criteris.",
    es: "No hay vecinos con estos criterios.",
    en: "No residents match these filters.",
  },
  "usuaris.nivell.short": { ca: "Nivell", es: "Nivel", en: "Level" },
  "usuaris.contact.notShared": {
    ca: "No compartit",
    es: "No compartido",
    en: "Not shared",
  },
  "usuaris.col.nom": { ca: "Nom", es: "Nombre", en: "Name" },
  "usuaris.col.punts": { ca: "Punts", es: "Puntos", en: "Points" },
  "usuaris.col.nivell": { ca: "Nivell", es: "Nivel", en: "Level" },
  "usuaris.col.escanejos": { ca: "Escanejos", es: "Escaneos", en: "Scans" },
  "usuaris.col.alta": { ca: "Alta", es: "Alta", en: "Joined" },
  "usuaris.col.ultima": {
    ca: "Última activitat",
    es: "Última actividad",
    en: "Last activity",
  },
  "usuaris.col.contacte": { ca: "Contacte", es: "Contacto", en: "Contact" },

  "usuaris.activitat.escaneig": {
    ca: "Escaneig de QR",
    es: "Escaneo de QR",
    en: "QR scan",
  },
  "usuaris.activitat.accio": {
    ca: "Acció de punts",
    es: "Acción de puntos",
    en: "Points action",
  },
  "usuaris.activitat.bescanvi": {
    ca: "Bescanvi de recompensa",
    es: "Canje de recompensa",
    en: "Reward redeemed",
  },

  "usuaris.detall.puntsAcumulats": {
    ca: "punts acumulats",
    es: "puntos acumulados",
    en: "points accrued",
  },
  "usuaris.detall.escanejos": { ca: "Escanejos", es: "Escaneos", en: "Scans" },
  "usuaris.detall.comercos": {
    ca: "Comerços visitats",
    es: "Comercios visitados",
    en: "Merchants visited",
  },
  "usuaris.detall.bescanvis": { ca: "Bescanvis", es: "Canjes", en: "Redemptions" },
  "usuaris.detall.alta": { ca: "Alta", es: "Alta", en: "Joined" },
  "usuaris.detall.contacte": { ca: "Contacte", es: "Contacto", en: "Contact" },
  "usuaris.detall.historial": {
    ca: "Historial d'activitat",
    es: "Historial de actividad",
    en: "Activity history",
  },
  "usuaris.detall.historialEmpty": {
    ca: "Encara no hi ha activitat registrada.",
    es: "Aún no hay actividad registrada.",
    en: "No activity recorded yet.",
  },

  // Admin · Configuració
  "config.title": {
    ca: "Configuració de la població",
    es: "Configuración de la población",
    en: "Town configuration",
  },
  "config.subtitle": {
    ca: "Ajusta les dades de l'entitat gestora, la marca del programa i les regles de punts.",
    es: "Ajusta los datos de la entidad gestora, la marca del programa y las reglas de puntos.",
    en: "Manage the operator details, program brand and point rules.",
  },
  "config.tabs.dades": { ca: "Dades", es: "Datos", en: "Details" },
  "config.tabs.marca": { ca: "Marca", es: "Marca", en: "Brand" },
  "config.tabs.regles": { ca: "Regles de punts", es: "Reglas de puntos", en: "Point rules" },
  "config.tabs.idioma": { ca: "Idioma", es: "Idioma", en: "Language" },
  "config.tabs.perill": { ca: "Zona de perill", es: "Zona de peligro", en: "Danger zone" },

  "config.dades.title": {
    ca: "Dades de la població i entitat gestora",
    es: "Datos de la población y entidad gestora",
    en: "Town and operator details",
  },
  "config.dades.poblacio": { ca: "Població", es: "Población", en: "Town" },
  "config.dades.poblacioHint": {
    ca: "El nom de la població és gestionat per KM0 LAB.",
    es: "El nombre de la población lo gestiona KM0 LAB.",
    en: "The town name is managed by KM0 LAB.",
  },
  "config.dades.entitat": {
    ca: "Nom de l'entitat gestora",
    es: "Nombre de la entidad gestora",
    en: "Operator name",
  },
  "config.dades.entitatPlaceholder": {
    ca: "Ex.: Ajuntament de Malgrat de Mar",
    es: "Ej.: Ayuntamiento de Malgrat de Mar",
    en: "E.g. Malgrat de Mar Town Council",
  },
  "config.dades.tipus": { ca: "Tipus d'entitat", es: "Tipo de entidad", en: "Operator type" },
  "config.dades.tipus.ajuntament": { ca: "Ajuntament", es: "Ayuntamiento", en: "Town council" },
  "config.dades.tipus.privada": {
    ca: "Entitat privada",
    es: "Entidad privada",
    en: "Private entity",
  },
  "config.dades.email": {
    ca: "Email de contacte",
    es: "Email de contacto",
    en: "Contact email",
  },
  "config.dades.responsable": {
    ca: "Persona responsable",
    es: "Persona responsable",
    en: "Responsible person",
  },

  "config.marca.title": { ca: "Marca del programa", es: "Marca del programa", en: "Program brand" },
  "config.marca.logo": {
    ca: "Logo de la població / programa",
    es: "Logo de la población / programa",
    en: "Town / program logo",
  },
  "config.marca.logoHint": {
    ca: "Aquest logo es mostra a l'app dels veïns i als materials del programa.",
    es: "Este logo se muestra en la app de los vecinos y en los materiales del programa.",
    en: "This logo appears in the resident app and program materials.",
  },
  "config.marca.logoReco": {
    ca: "Recomanat: PNG o SVG, 512 × 512 px, fons transparent.",
    es: "Recomendado: PNG o SVG, 512 × 512 px, fondo transparente.",
    en: "Recommended: PNG or SVG, 512 × 512 px, transparent background.",
  },
  "config.marca.logoPlaceholder": {
    ca: "Puja el logo",
    es: "Sube el logo",
    en: "Upload logo",
  },

  "config.regles.title": {
    ca: "Regles de punts",
    es: "Reglas de puntos",
    en: "Point rules",
  },
  "config.regles.equivalencia": {
    ca: "Equivalència punts → valor",
    es: "Equivalencia puntos → valor",
    en: "Points → value ratio",
  },
  "config.regles.equivalenciaHint": {
    ca: "Defineix quants punts equivalen a 1 €.",
    es: "Define cuántos puntos equivalen a 1 €.",
    en: "Set how many points equal 1 €.",
  },
  "config.regles.puntsPerEuro": {
    ca: "Punts per 1 €",
    es: "Puntos por 1 €",
    en: "Points per 1 €",
  },
  "config.regles.exemple": {
    ca: "Exemple: {punts} punts = {euros} €",
    es: "Ejemplo: {punts} puntos = {euros} €",
    en: "Example: {punts} points = {euros} €",
  },
  "config.regles.caducitat": {
    ca: "Caducitat dels punts (mesos)",
    es: "Caducidad de los puntos (meses)",
    en: "Points expiry (months)",
  },
  "config.regles.noCaduquen": {
    ca: "Els punts no caduquen",
    es: "Los puntos no caducan",
    en: "Points don't expire",
  },
  "config.regles.puntsVisita": {
    ca: "Punts per visita per defecte (comerços nous)",
    es: "Puntos por visita por defecto (comercios nuevos)",
    en: "Default points per visit (new merchants)",
  },
  "config.regles.puntsVisitaHint": {
    ca: "S'aplica als comerços nous mentre no configurin el seu propi valor.",
    es: "Se aplica a los comercios nuevos mientras no configuren su propio valor.",
    en: "Applied to new merchants until they set their own value.",
  },

  "config.idioma.title": {
    ca: "Idioma per defecte del programa",
    es: "Idioma por defecto del programa",
    en: "Default program language",
  },
  "config.idioma.hint": {
    ca: "És l'idioma amb què es mostra el contingut del programa als veïns. No afecta a l'idioma d'aquest backoffice.",
    es: "Es el idioma con el que se muestra el contenido del programa a los vecinos. No afecta al idioma de este backoffice.",
    en: "The language used for program content shown to residents. Does not affect this backoffice language.",
  },
  "config.idioma.ca": { ca: "Català", es: "Catalán", en: "Catalan" },
  "config.idioma.es": { ca: "Castellà", es: "Castellano", en: "Spanish" },
  "config.idioma.en": { ca: "Anglès", es: "Inglés", en: "English" },

  "config.perill.title": { ca: "Zona de perill", es: "Zona de peligro", en: "Danger zone" },
  "config.perill.subtitle": {
    ca: "Accions sensibles sobre el programa. Requereixen confirmació.",
    es: "Acciones sensibles sobre el programa. Requieren confirmación.",
    en: "Sensitive program actions. They require confirmation.",
  },
  "config.perill.export.title": {
    ca: "Exportar dades del programa",
    es: "Exportar datos del programa",
    en: "Export program data",
  },
  "config.perill.export.desc": {
    ca: "Descarrega un fitxer amb les dades del programa (mock).",
    es: "Descarga un fichero con los datos del programa (mock).",
    en: "Download a file with the program data (mock).",
  },
  "config.perill.export.cta": { ca: "Exportar", es: "Exportar", en: "Export" },
  "config.perill.export.confirmTitle": {
    ca: "Exportar dades del programa?",
    es: "¿Exportar datos del programa?",
    en: "Export program data?",
  },
  "config.perill.export.confirmDesc": {
    ca: "Es generarà un fitxer amb totes les dades del programa d'aquesta població.",
    es: "Se generará un fichero con todos los datos del programa de esta población.",
    en: "A file with all this town's program data will be generated.",
  },
  "config.perill.export.done": {
    ca: "Exportació preparada",
    es: "Exportación preparada",
    en: "Export ready",
  },

  "config.perill.regen.title": {
    ca: "Regenerar credencials / codis",
    es: "Regenerar credenciales / códigos",
    en: "Regenerate credentials / codes",
  },
  "config.perill.regen.desc": {
    ca: "Invalida les credencials i els codis actuals i en genera de nous (mock).",
    es: "Invalida las credenciales y códigos actuales y genera nuevos (mock).",
    en: "Invalidates current credentials and codes and issues new ones (mock).",
  },
  "config.perill.regen.cta": { ca: "Regenerar", es: "Regenerar", en: "Regenerate" },
  "config.perill.regen.confirmTitle": {
    ca: "Regenerar credencials?",
    es: "¿Regenerar credenciales?",
    en: "Regenerate credentials?",
  },
  "config.perill.regen.confirmDesc": {
    ca: "Les credencials actuals deixaran de funcionar immediatament.",
    es: "Las credenciales actuales dejarán de funcionar de inmediato.",
    en: "Current credentials will stop working immediately.",
  },
  "config.perill.regen.done": {
    ca: "Credencials regenerades",
    es: "Credenciales regeneradas",
    en: "Credentials regenerated",
  },

  "config.perill.deactivate.title": {
    ca: "Desactivar el programa",
    es: "Desactivar el programa",
    en: "Deactivate program",
  },
  "config.perill.deactivate.desc": {
    ca: "Atura el programa a tota la població. Els veïns i comerços perdran l'accés (mock).",
    es: "Detiene el programa en toda la población. Vecinos y comercios perderán el acceso (mock).",
    en: "Stops the program across the whole town. Residents and merchants will lose access (mock).",
  },
  "config.perill.deactivate.cta": { ca: "Desactivar", es: "Desactivar", en: "Deactivate" },
  "config.perill.deactivate.confirmTitle": {
    ca: "Segur que vols desactivar el programa?",
    es: "¿Seguro que quieres desactivar el programa?",
    en: "Are you sure you want to deactivate the program?",
  },
  "config.perill.deactivate.confirmDesc": {
    ca: "Aquesta acció aturarà el programa immediatament. Podràs reactivar-lo posteriorment.",
    es: "Esta acción detendrá el programa de inmediato. Podrás reactivarlo más tarde.",
    en: "This will stop the program immediately. You can reactivate it later.",
  },
  "config.perill.deactivate.done": {
    ca: "Programa desactivat",
    es: "Programa desactivado",
    en: "Program deactivated",
  },
  "config.perill.confirmActionLabel": {
    ca: "Confirmar",
    es: "Confirmar",
    en: "Confirm",
  },

  "config.save": { ca: "Desar canvis", es: "Guardar cambios", en: "Save changes" },
  "config.saving": { ca: "Desant…", es: "Guardando…", en: "Saving…" },
  "config.saved": { ca: "Configuració desada", es: "Configuración guardada", en: "Settings saved" },
  "config.saveError": {
    ca: "No s'han pogut desar els canvis",
    es: "No se han podido guardar los cambios",
    en: "Couldn't save the changes",
  },

  "config.error.emailRequired": {
    ca: "L'email és obligatori",
    es: "El email es obligatorio",
    en: "Email is required",
  },
  "config.error.emailInvalid": {
    ca: "Email no vàlid",
    es: "Email no válido",
    en: "Invalid email",
  },
  "config.error.entitatRequired": {
    ca: "El nom de l'entitat és obligatori",
    es: "El nombre de la entidad es obligatorio",
    en: "Operator name is required",
  },
  "config.error.responsableRequired": {
    ca: "El nom de la persona responsable és obligatori",
    es: "El nombre de la persona responsable es obligatorio",
    en: "Responsible person is required",
  },
  "config.error.puntsPerEuro": {
    ca: "Ha de ser un nombre més gran que 0",
    es: "Debe ser un número mayor que 0",
    en: "Must be a number greater than 0",
  },
  "config.error.caducitat": {
    ca: "Ha de ser un nombre positiu",
    es: "Debe ser un número positivo",
    en: "Must be a positive number",
  },
  "config.error.puntsVisita": {
    ca: "Ha de ser un nombre positiu",
    es: "Debe ser un número positivo",
    en: "Must be a positive number",
  },

  // Admin · Bescanvis
  "nav.bescanvis": { ca: "Bescanvis", es: "Canjes", en: "Redemptions" },
  "bescanvis.title": { ca: "Bescanvis", es: "Canjes", en: "Redemptions" },
  "bescanvis.subtitle": {
    ca: "Seguiment de tots els premis bescanviats pels veïns de {poblacio}.",
    es: "Seguimiento de todos los premios canjeados por los vecinos de {poblacio}.",
    en: "Tracking of all rewards redeemed by residents of {poblacio}.",
  },
  "bescanvis.kpi.total": { ca: "Total de bescanvis", es: "Total de canjes", en: "Total redemptions" },
  "bescanvis.kpi.pendents": { ca: "Pendents", es: "Pendientes", en: "Pending" },
  "bescanvis.kpi.completats": {
    ca: "Completats aquest mes",
    es: "Completados este mes",
    en: "Completed this month",
  },

  "bescanvis.search.placeholder": {
    ca: "Cerca per usuari…",
    es: "Buscar por usuario…",
    en: "Search by user…",
  },
  "bescanvis.filter.tipus": { ca: "Tipus de premi", es: "Tipo de premio", en: "Reward type" },
  "bescanvis.filter.estat": { ca: "Estat", es: "Estado", en: "Status" },
  "bescanvis.filter.comerc": { ca: "Comerç", es: "Comercio", en: "Merchant" },
  "bescanvis.filter.allTipus": { ca: "Tots els tipus", es: "Todos los tipos", en: "All types" },
  "bescanvis.filter.allEstats": { ca: "Tots els estats", es: "Todos los estados", en: "All statuses" },
  "bescanvis.filter.allComercos": { ca: "Tots els comerços", es: "Todos los comercios", en: "All merchants" },
  "bescanvis.filter.desde": { ca: "Des de", es: "Desde", en: "From" },
  "bescanvis.filter.fins": { ca: "Fins a", es: "Hasta", en: "To" },
  "bescanvis.filter.clear": { ca: "Netejar filtres", es: "Limpiar filtros", en: "Clear filters" },
  "bescanvis.filter.noResults": {
    ca: "Cap resultat amb aquests filtres",
    es: "Ningún resultado con estos filtros",
    en: "No results with these filters",
  },

  "bescanvis.empty.title": {
    ca: "Encara no hi ha bescanvis",
    es: "Aún no hay canjes",
    en: "No redemptions yet",
  },
  "bescanvis.empty.subtitle": {
    ca: "Quan els veïns bescanviïn recompenses, apareixeran aquí.",
    es: "Cuando los vecinos canjeen recompensas, aparecerán aquí.",
    en: "When residents redeem rewards, they will appear here.",
  },

  "bescanvis.col.usuari": { ca: "Usuari", es: "Usuario", en: "User" },
  "bescanvis.col.premi": { ca: "Premi", es: "Premio", en: "Reward" },
  "bescanvis.col.punts": { ca: "Punts", es: "Puntos", en: "Points" },
  "bescanvis.col.dataSolicitud": { ca: "Sol·licitud", es: "Solicitud", en: "Requested" },
  "bescanvis.col.estat": { ca: "Estat", es: "Estado", en: "Status" },
  "bescanvis.col.comerc": { ca: "Comerç", es: "Comercio", en: "Merchant" },
  "bescanvis.col.dataUs": { ca: "Ús / lliurament", es: "Uso / entrega", en: "Used / delivered" },

  "bescanvis.flux.val_qr": { ca: "Val amb QR", es: "Vale con QR", en: "QR voucher" },
  "bescanvis.flux.lliurament": { ca: "Lliurament físic", es: "Entrega física", en: "Physical delivery" },

  "bescanvis.tipus.saldo": { ca: "Saldo", es: "Saldo", en: "Balance" },
  "bescanvis.tipus.descompte": { ca: "Descompte", es: "Descuento", en: "Discount" },
  "bescanvis.tipus.producte": { ca: "Producte", es: "Producto", en: "Product" },
  "bescanvis.tipus.servei": { ca: "Servei", es: "Servicio", en: "Service" },
  "bescanvis.tipus.marxandatge": { ca: "Marxandatge", es: "Merchandising", en: "Merchandise" },
  "bescanvis.tipus.experiencia": { ca: "Experiència", es: "Experiencia", en: "Experience" },

  "bescanvis.estat.pendent_us": { ca: "Pendent d'ús", es: "Pendiente de uso", en: "Pending use" },
  "bescanvis.estat.utilitzat": { ca: "Utilitzat", es: "Utilizado", en: "Used" },
  "bescanvis.estat.solicitat": { ca: "Sol·licitat", es: "Solicitado", en: "Requested" },
  "bescanvis.estat.pendent_preparacio": {
    ca: "Pendent de preparació",
    es: "Pendiente de preparación",
    en: "Pending preparation",
  },
  "bescanvis.estat.preparat": { ca: "Preparat", es: "Preparado", en: "Prepared" },
  "bescanvis.estat.pendent_recollida": {
    ca: "Pendent de recollida",
    es: "Pendiente de recogida",
    en: "Pending pickup",
  },
  "bescanvis.estat.entregat": { ca: "Entregat", es: "Entregado", en: "Delivered" },
  "bescanvis.estat.cancel·lat": { ca: "Cancel·lat", es: "Cancelado", en: "Cancelled" },

  "bescanvis.detall.title": { ca: "Detall del bescanvi", es: "Detalle del canje", en: "Redemption detail" },
  "bescanvis.detall.usuari": { ca: "Usuari", es: "Usuario", en: "User" },
  "bescanvis.detall.premi": { ca: "Premi", es: "Premio", en: "Reward" },
  "bescanvis.detall.punts": { ca: "Punts descomptats", es: "Puntos descontados", en: "Points spent" },
  "bescanvis.detall.dataSolicitud": {
    ca: "Data de sol·licitud",
    es: "Fecha de solicitud",
    en: "Requested at",
  },
  "bescanvis.detall.estatActual": { ca: "Estat actual", es: "Estado actual", en: "Current status" },
  "bescanvis.detall.import": { ca: "Import del val", es: "Importe del vale", en: "Voucher amount" },
  "bescanvis.detall.qrGenerat": { ca: "QR generat", es: "QR generado", en: "QR generated" },
  "bescanvis.detall.comerc": {
    ca: "Comerç que ha escanejat",
    es: "Comercio que ha escaneado",
    en: "Merchant that scanned",
  },
  "bescanvis.detall.sensecomerc": { ca: "Cap comerç encara", es: "Ningún comercio aún", en: "No merchant yet" },
  "bescanvis.detall.dataUs": { ca: "Data d'escaneig", es: "Fecha de escaneo", en: "Scanned at" },
  "bescanvis.detall.importAplicat": { ca: "Import aplicat", es: "Importe aplicado", en: "Amount applied" },
  "bescanvis.detall.dataLliurament": {
    ca: "Data de lliurament",
    es: "Fecha de entrega",
    en: "Delivered at",
  },
  "bescanvis.detall.historial": { ca: "Historial d'estats", es: "Historial de estados", en: "Status history" },
  "bescanvis.detall.historialEmpty": {
    ca: "Encara no hi ha canvis d'estat",
    es: "Aún no hay cambios de estado",
    en: "No status changes yet",
  },
  "bescanvis.detall.notaOpt": {
    ca: "Nota (opcional)",
    es: "Nota (opcional)",
    en: "Note (optional)",
  },
  "bescanvis.detall.notaPlaceholder": {
    ca: "Ex: recollida a l'ajuntament",
    es: "Ej: recogida en el ayuntamiento",
    en: "e.g. pickup at the town hall",
  },
  "bescanvis.detall.advance": {
    ca: "Avançar a «{estat}»",
    es: "Avanzar a «{estat}»",
    en: "Advance to “{estat}”",
  },
  "bescanvis.detall.cancel": { ca: "Cancel·lar bescanvi", es: "Cancelar canje", en: "Cancel redemption" },
  "bescanvis.detall.cancelVal": { ca: "Cancel·lar val", es: "Cancelar vale", en: "Cancel voucher" },
  "bescanvis.detall.finalState": {
    ca: "Aquest bescanvi ja està tancat.",
    es: "Este canje ya está cerrado.",
    en: "This redemption is closed.",
  },
  "bescanvis.detall.valNote": {
    ca: "L'estat «utilitzat» s'activa quan el comerç escaneja el QR.",
    es: "El estado «utilizado» se activa cuando el comercio escanea el QR.",
    en: "The “used” status is set when the merchant scans the QR.",
  },

  "bescanvis.confirmCancel.title": {
    ca: "Cancel·lar aquest bescanvi?",
    es: "¿Cancelar este canje?",
    en: "Cancel this redemption?",
  },
  "bescanvis.confirmCancel.body": {
    ca: "Aquesta acció no es pot desfer. El bescanvi quedarà marcat com a cancel·lat.",
    es: "Esta acción no se puede deshacer. El canje quedará marcado como cancelado.",
    en: "This action cannot be undone. The redemption will be marked as cancelled.",
  },

  "bescanvis.toast.estatUpdated": {
    ca: "Estat actualitzat",
    es: "Estado actualizado",
    en: "Status updated",
  },
  "bescanvis.toast.cancelled": {
    ca: "Bescanvi cancel·lat",
    es: "Canje cancelado",
    en: "Redemption cancelled",
  },
  "bescanvis.toast.error": {
    ca: "No s'ha pogut actualitzar",
    es: "No se ha podido actualizar",
    en: "Update failed",
  },

} satisfies Record<string, Dict>;



export type MessageKey = keyof typeof messages;

export function translate(key: MessageKey, lang: Lang): string {
  return messages[key][lang] ?? messages[key][DEFAULT_LANG];
}
