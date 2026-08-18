import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Cover from '../components/Cover';
import { books } from '../data';
import { useLang } from '../i18n/LanguageContext';

export default function Books() {
  const { t, lang } = useLang();
  return (
    <>
      <Seo title={t.books.title} description={t.books.metaDescription} />
      <header className="page-head wrap">
        <p className="label">{t.nav.books}</p>
        <h1 className="display">{t.books.title}</h1>
        <p className="lead">{t.books.lead}</p>
        <hr className="rule" />
      </header>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <ul className="list">
          {books.map((b) => (
            <li key={b.slug} className="list__item" style={{ gridTemplateColumns: '110px 1fr', alignItems: 'start' }}>
              <Link to={`/books/${b.slug}`}><Cover id={b.slug} alt={b.title_el} title={b.title_el} sizes="110px" /></Link>
              <div>
                <span className="label">{t.kinds[b.kind] ?? b.kind} · {b.year}</span>
                <h2 className="display list__title" style={{ margin: '.3rem 0 .2rem', fontSize: '1.5rem' }}><Link to={`/books/${b.slug}`}>{lang === 'en' && b.title_en ? b.title_en : b.title_el}</Link></h2>
                {lang === 'en' && b.title_en && <p className="meta" style={{ margin: 0 }}>{b.title_el}</p>}
                <p className="list__sub">{b.publisher}{b.pages ? ` · ${b.pages} ${t.books.pages}` : ''}{b.isbn ? ` · ISBN ${b.isbn}` : ''}</p>
                {b.blurb_el && <p className="list__quote" style={{ fontStyle: 'normal' }}>{b.blurb_el.length > 260 ? b.blurb_el.slice(0, 260).replace(/\s+\S*$/, '') + '…' : b.blurb_el}</p>}
                <p className="list__tags">
                  <Link className="link-quiet" to={`/books/${b.slug}`}>{lang === 'el' ? 'Περισσότερα' : 'More'} →</Link>
                  {b.texts?.length ? <Link className="link-quiet" to={`/texts/${b.texts[0]}`}>{t.home.readOnline}</Link> : null}
                  {b.buy?.slice(0, 2).map((x) => <a key={x.url} className="link-quiet" href={x.url} target="_blank" rel="noopener noreferrer">{t.books.buy} · {x.shop} ↗</a>)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
