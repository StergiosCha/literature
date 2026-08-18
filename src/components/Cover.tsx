import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { asset, covers } from '../data';

/** Book cover with blur-up. `id` is a covers.json key (book slug or 'panta'). */
export default function Cover({ id, alt, title, sizes = '300px', style, priority }: { id: string; alt: string; title?: string; sizes?: string; style?: CSSProperties; priority?: boolean }) {
  const c = covers[id];
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true); }, []);
  if (!c) return <span className="cover cover--none" style={{ aspectRatio: '2 / 3', ...style }}>{title ?? alt}</span>;
  return (
    <span className={`cover${loaded ? ' is-loaded' : ''}`} style={{ aspectRatio: `${c.w} / ${c.h}`, ...style }}>
      <span className="cover__blur" style={{ backgroundImage: `url("${c.blur}")` }} aria-hidden="true" />
      <img ref={ref} src={asset(c.src['450'])} srcSet={`${asset(c.src['450'])} 450w, ${asset(c.src['900'])} 900w`} sizes={sizes} width={c.w} height={c.h} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" onLoad={() => setLoaded(true)} />
    </span>
  );
}
