import "./Pagination.css";

export default function Pagination({ next, prev, hasNext, hasPrev }) {
  return (
    <div className="Container">
      <button className="Button"
        onClick={prev}
        disabled={!hasPrev}
        style={{
          opacity: hasPrev ? 1 : 0.3,
          cursor: !hasPrev ? "default" : "pointer"
         }}
      >
        ← Previous
      </button>

      <button className="Button"
        onClick={next}
        disabled={!hasNext}
        style={{opacity: hasNext ? 1 : 0.3 }}
      >
        Next →
      </button>
    </div>
  );
}