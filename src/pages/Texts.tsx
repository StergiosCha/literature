import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Cover from '../components/Cover';
import { texts } from '../data';
import { useLang } from '../i18n/LanguageContext';

export default function Texts() {
  const { t } = useLang();
  return (
    <>
      <Seo title={t.texts.title} description={t.texts.metaDescription} />
      <header className="page-head wrap"><p className="label">{t.nav.texts}</p><h1 className="display">{t.texts.title}</h1><p className="lead">{t.texts.lead}</p><hr className="rule" /></header>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="texts">
          {texts.map((x) => (
            <Link key={x.slug} to={`/texts/${x.slug}`} className="text-card">
              <Cover id={x.cover} alt="" sizes="90px" />
              <span>
                <span className="label">{x.kind_label}</span>
                <span className="text-card__title" style={{ display: 'block' }}>{x.title}</span>
                <span className="text-card__blurb">{x.blurb}</span>
                <span className="text-card__meta" style={{ display: 'block' }}>{x.note} · {t.texts.minutes(x.minutes)}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
