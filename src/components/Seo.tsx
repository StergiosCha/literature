import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { author, covers, books, asset } from '../data';

interface Props {
  /** page title without the site name */
  title?: string;
  description: string;
  /** photo id for og:image (defaults to the site hero) */
  image?: string;
  type?: 'website' | 'article';
}

const SITE_ORIGIN = 'https://stergioscha.github.io';

function upsertJsonLd(id: string, data: object | null) {
  let el = document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${id}"]`);
  if (!data) { el?.remove(); return; }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.dataset.jsonld = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const sel = `link[rel="${rel}"]` + (extra?.hreflang ? `[hreflang="${extra.hreflang}"]` : '');
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (extra) for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Client-side per-page <head> management: title, description, OpenGraph, canonical. */
export default function Seo({ title, description, image, type = 'website' }: Props) {
  const { lang, t } = useLang();
  const { pathname } = useLocation();

  useEffect(() => {
    const full = title ? `${title} · ${t.siteName}` : `${t.siteName} · ${t.tagline}`;
    document.title = full;

    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const url = `${SITE_ORIGIN}${base}${pathname}`;
    const coverId = image && covers[image] ? image : books.find((b) => covers[b.slug])?.slug ?? '';
    const cov = covers[coverId];
    const img = cov ? new URL(asset(cov.src['900']), `${SITE_ORIGIN}/`).toString() : '';
    const hero = { width: cov?.w ?? 0, height: cov?.h ?? 0 };

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:site_name', t.siteName);
    upsertMeta('property', 'og:title', full);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', img);
    upsertMeta('property', 'og:image:width', String(hero.width));
    upsertMeta('property', 'og:image:height', String(hero.height));
    upsertMeta('property', 'og:locale', lang === 'el' ? 'el_GR' : 'en_GB');
    upsertMeta('property', 'og:locale:alternate', lang === 'el' ? 'en_GB' : 'el_GR');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', full);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', img);
    upsertLink('canonical', url);

    upsertJsonLd('person', {
      '@context': 'https://schema.org', '@type': 'Person', name: lang === 'el' ? author.name_el : author.name_en,
      jobTitle: lang === 'el' ? 'Συγγραφέας, Καθηγητής Υπολογιστικής Γλωσσολογίας' : 'Author, Professor of Computational Linguistics',
      birthDate: String(author.birth_year), birthPlace: 'Grevena, Greece', url: `${SITE_ORIGIN}${base}/`,
      sameAs: Object.values(author.socials), affiliation: { '@type': 'CollegeOrUniversity', name: 'University of Crete' },
    });
  }, [title, description, image, type, lang, t, pathname]);

  return null;
}
