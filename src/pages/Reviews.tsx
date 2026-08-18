import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { reviews, getBook } from '../data';
import { useLang } from '../i18n/LanguageContext';
import { fmtDate } from '../lib/format';

export default function Reviews() {
  const { t, lang } = useLang();
  const list = reviews.slice().sort((a, b) => ((a.date ?? '') < (b.date ?? '') ? 1 : -1));
  return (
    <>
      <Seo title={t.reviews.title} description={t.reviews.metaDescription} />
      <header className="page-head wrap"><p className="label">{t.nav.reviews}</p><h1 className="display">{t.reviews.title}</h1><p className="lead">{t.reviews.lead}</p><hr className="rule" /></header>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <ul className="list">
          {list.map((r) => { const b = getBook(r.book); return (
            <li key={r.id} className="list__item">
              <span className="list__date">{fmtDate(r.date ?? '', lang)}<br /><span className="label" style={{ fontSize: '.65rem' }}>{t.reviews.types[r.type] ?? r.type}</span></span>
              <span>
                <span className="list__title">{r.outlet}{r.author ? <span className="list__sub" style={{ display: 'inline' }}> · {r.author}</span> : null}</span>
                {b && <span className="list__sub" style={{ display: 'block' }}>{lang === 'el' ? 'για το' : 'on'} <Link className="link" to={`/books/${b.slug}`}>{b.title_el}</Link></span>}
                {r.quote_el && <p className="list__quote">{r.quote_el}</p>}
                <span className="list__tags"><a className="link-quiet" href={r.url} target="_blank" rel="noopener noreferrer">{t.reviews.read} ↗</a></span>
              </span>
            </li>
          ); })}
        </ul>
      </section>
    </>
  );
}
