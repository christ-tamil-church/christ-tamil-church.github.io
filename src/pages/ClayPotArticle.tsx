import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  clayPotPath,
  clayPotWritingPath,
  clayPotWritings,
  formatClayPotDate,
  type ClayPotBlock,
  type ClayPotInline,
  type ClayPotWriting
} from "../data/clayPot";
import { ClayPotClosing, IssueNumber, LanguagePill } from "./ClayPot";
import "./ClayPot.css";

const writings: readonly ClayPotWriting[] = clayPotWritings;

// A note number may appear more than once (Hebrews 10:1 is cited twice), so
// only its first reference carries the id the note links back to.
function Inline({ parts, seen }: { parts: readonly ClayPotInline[]; seen?: Set<number> }) {
  return <>{parts.map((part, index) => {
    if (typeof part === "string") return <Fragment key={index}>{part}</Fragment>;
    if ("em" in part) return <em key={index}>{part.em}</em>;
    if ("link" in part) {
      return (
        <a key={index} href={part.href} target="_blank" rel="noreferrer">
          {part.link}<span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    const first = seen ? !seen.has(part.note) : false;
    seen?.add(part.note);
    return (
      <sup key={index} className="cp-ref">
        <a href={`#cp-note-${part.note}`} id={first ? `cp-ref-${part.note}` : undefined} aria-label={`Note ${part.note}`}>{part.note}</a>
      </sup>
    );
  })}</>;
}

function Block({ block, seen }: { block: ClayPotBlock; seen: Set<number> }) {
  if (block.kind === "list") return <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
  if (block.kind === "lines") return <p className="cp-lines">{block.lines.map((line) => <span key={line}>{line}</span>)}</p>;
  return <p><Inline parts={block.content} seen={seen} /></p>;
}

function IssueLink({ writing, direction }: { writing: ClayPotWriting; direction: "older" | "newer" }) {
  return (
    <Link className={`cp-issue-link cp-issue-link-${direction}`} to={clayPotWritingPath(writing.slug)}>
      <span className="cp-issue-link-label">
        {direction === "older" && <ArrowLeft size={16} aria-hidden="true" />}
        {direction === "older" ? "Earlier issue" : "Later issue"}
        {direction === "newer" && <ArrowRight size={16} aria-hidden="true" />}
      </span>
      <IssueNumber slug={writing.slug} />
      <strong lang={writing.language} className={`cp-title-${writing.language}`}>{writing.title}</strong>
    </Link>
  );
}

export default function ClayPotArticle({ slug }: { slug: string }) {
  const index = writings.findIndex((writing) => writing.slug === slug);
  const writing = writings[index];
  const newer = writings[index - 1];
  const older = writings[index + 1];
  const seen = new Set<number>();

  return (
    <div className="cp-page">
      <article className="cp-article" aria-labelledby="cp-article-title">
        <header className="cp-article-head">
          <div className="cp-shell">
            <p className="cp-dateline">
              <Link to={clayPotPath} className="cp-masthead-link">
                <ArrowLeft size={15} aria-hidden="true" />
                <span lang="ta">மண்பாண்டம்</span> · Clay Pot
              </Link>
              <span>{formatClayPotDate(writing.date).replace(/ \d+,/, "")}</span>
            </p>
            <div className="cp-article-opener">
              <IssueNumber slug={writing.slug} className="cp-issue-large" />
              <h1 id="cp-article-title" lang={writing.language} className={`cp-article-title cp-title-${writing.language}`}>{writing.title}</h1>
              <p className="cp-byline">
                <span>{writing.author}</span>
                <time dateTime={writing.date}>{formatClayPotDate(writing.date)}</time>
                <LanguagePill language={writing.language} />
              </p>
            </div>
          </div>
        </header>

        <div className="cp-shell cp-article-body">
          <div className={`cp-prose cp-prose-${writing.language}`} lang={writing.language}>
            {writing.body.map((block, blockIndex) => <Block key={blockIndex} block={block} seen={seen} />)}
            <p className="cp-signoff">{writing.author}</p>
          </div>

          {writing.notes && writing.notes.length > 0 && (
            <section className="cp-notes" aria-labelledby="cp-notes-title">
              <h2 id="cp-notes-title">Notes</h2>
              <ol>
                {writing.notes.map((note, noteIndex) => (
                  <li key={noteIndex} id={`cp-note-${noteIndex + 1}`}>
                    <Inline parts={note} />{" "}
                    <a className="cp-note-back" href={`#cp-ref-${noteIndex + 1}`} aria-label={`Back to reference ${noteIndex + 1}`}><ArrowUp size={14} aria-hidden="true" /></a>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </article>

      <nav className="cp-issue-nav" aria-label="More from Clay Pot">
        <div className="cp-shell cp-issue-nav-grid">
          {older ? <IssueLink writing={older} direction="older" /> : <span />}
          <Link className="cp-issue-all" to={clayPotPath}>All issues</Link>
          {newer ? <IssueLink writing={newer} direction="newer" /> : <span />}
        </div>
      </nav>

      <ClayPotClosing />
    </div>
  );
}
