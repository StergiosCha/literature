import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import Cover from '../components/Cover';
import NotFound from './NotFound';
import { getText, getTextHtml, texts, getBook } from '../data';
import { useLang } from '../i18n/LanguageContext';
import { useTheme } from '../components/Theme';

export default function TextPage() {
  const { slug = '' } = useParams();
  const { t } = useLang();
  const { toggle, theme, size, setSize } = useTheme();
  const x = getText(slug);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const on = () => { const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0); };
    on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on);
  }, [slug]);
  if (!x) return <NotFound message={t.texts.notFound} />;
  const html = getTextHtml(slug);
  const i = texts.findIndex((q) => q.slug === slug);
  const prev = texts[(i - 1 + texts.length) % texts.length], next = texts[(i + 1) % texts.length];
  const book = x.book ? getBook(x.book) : undefined;
  return (
    <>
      <Seo title={x.title} description={x.blurb} image={x.cover} type="article" />
      <div className="progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <header className="reader-hero wrap">
        <Cover id={x.cover} alt="" sizes="150px" priority />
        <p className="label">{x.kind_label}</p>
        <h1 className="display">{x.title}</h1>
        <p className="meta" dangerouslySetInnerHTML={{ __html: x.note_html }} />
        {x.cover_credit && <p className="meta">{x.cover_credit}</p>}
        <p className="meta">{t.texts.minutes(x.minutes)}{book ? <> · <Link className="link-quiet" to={`/books/${book.slug}`}>{t.texts.fromBook}: {book.title_el}</Link></> : null}</p>
      </header>
      <article className="reader" lang="el" dangerouslySetInnerHTML={{ __html: html }} />
      <nav className="reader-nav" aria-label={t.nav.texts}>
        <Link className="link-quiet meta" to={`/texts/${prev.slug}`}>← {prev.title}</Link>
        <Link className="link-quiet meta" to="/texts">{t.texts.back}</Link>
        <Link className="link-quiet meta" to={`/texts/${next.slug}`}>{next.title} →</Link>
      </nav>
      <div className="reader-tools" role="toolbar" aria-label="Reader">
        <button type="button" onClick={() => setSize(size - 1)} aria-label={t.texts.fontSmaller}>A−</button>
        <button type="button" onClick={() => setSize(size + 1)} aria-label={t.texts.fontLarger}>A+</button>
        <button type="button" onClick={toggle} aria-label={t.themeToggle}>{theme === 'dark' ? '☀' : '◐'}</button>
      </div>
    </>
  );
}
