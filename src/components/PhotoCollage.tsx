import type { CSSProperties } from "react";
import type { SiteImage } from "../data/images";
import "./PhotoCollage.css";

export type CollageTile = {
  image: SiteImage;
  width: number;
  height: number;
  /** Fixed tile shape (CSS aspect-ratio). Omit to use the photo's own shape. */
  ratio?: string;
};

type PhotoCollageProps = {
  /** Two columns of photos, top to bottom. */
  columns: CollageTile[][];
  /** Give every tile in the first column an equal share of the column height. */
  evenFirstColumn?: boolean;
  className?: string;
};

/*
 * Two-column photo mosaic used in inner-page heroes. The last tile in each
 * column stretches so both columns end on the same line; tiles reveal one by
 * one on load (disabled under prefers-reduced-motion).
 */
export default function PhotoCollage({ columns, evenFirstColumn = false, className }: PhotoCollageProps) {
  return (
    <div className={className ? `ctc-collage ${className}` : "ctc-collage"}>
      {columns.map((column, columnIndex) => (
        <div
          className={`ctc-collage-column${evenFirstColumn && columnIndex === 0 ? " is-even" : ""}`}
          key={columnIndex}
        >
          {column.map(({ image, width, height, ratio }, index) => (
            <span
              className="ctc-collage-tile"
              key={image.id}
              style={{ "--tile-order": index * 2 + columnIndex } as CSSProperties}
            >
              <img
                src={image.src}
                alt={image.alt}
                width={width}
                height={height}
                fetchPriority={columnIndex === 0 && index === 0 ? "high" : undefined}
                style={{ objectPosition: image.objectPosition, aspectRatio: ratio }}
              />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
