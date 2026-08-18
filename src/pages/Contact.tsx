import Seo from '../components/Seo';
import { author, books } from '../data';
import { useLang } from '../i18n/LanguageContext';

export default function Contact() {
  const { t } = useLang();
  const pubs = Array.from(new Map(books.filter((b) => b.publisher_url).map((b) => [b.publisher, b.publisher_url!])).entries());
  return (
    <>
      <Seo title={t.contact.title} description={t.contact.metaDescription} />
      <header className="page-head wrap"><p className="label">{t.nav.contact}</p><h1 className="display">{t.contact.title}</h1><p className="lead">{t.contact.lead}</p><hr className="rule" /></header>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <p className="label">{t.contact.email}</p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,2.6vw,2rem)', margin: '.4rem 0 0' }}>{author.emails.map((e) => <a key={e} className="link" href={`mailto:${e}`} style={{ display: 'block' }}>{e}</a>)}</p>
        <p className="label" style={{ marginTop: '2.5rem' }}>{t.contact.elsewhere}</p>
        <p className="list__tags" style={{ fontSize: '1rem', marginTop: '.5rem' }}>
          <a className="link" href={author.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          {author.socials.goodreads && <a className="link" href={author.socials.goodreads} target="_blank" rel="noopener noreferrer">Goodreads</a>}
          <a className="link" href={author.socials.academic_site} target="_blank" rel="noopener noreferrer">{t.about.academic}</a>
        </p>
        {pubs.length > 0 && (<><p className="label" style={{ marginTop: '2.5rem' }}>{t.contact.publishers}</p><p className="list__tags" style={{ fontSize: '1rem', marginTop: '.5rem' }}>{pubs.map(([n, u]) => <a key={n} className="link" href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}</p></>)}
      </section>
    </>
  );
}
