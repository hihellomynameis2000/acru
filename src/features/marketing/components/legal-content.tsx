import type { LegalBlock } from "@/features/marketing/data/legal";

export function LegalContent({ blocks, tableLabel }: { blocks: LegalBlock[]; tableLabel: string }) {
  return blocks.map((block, blockIndex) => {
    if (block.type === "paragraph") {
      return (
        <p className="legal-copy" key={`paragraph-${blockIndex}`}>
          {block.text}
        </p>
      );
    }

    if (block.type === "subheading") {
      return <h3 key={`subheading-${blockIndex}`}>{block.text}</h3>;
    }

    if (block.type === "callout") {
      return (
        <div className="legal-callout" key={`callout-${blockIndex}`} role="note">
          {block.text}
        </div>
      );
    }

    if (block.type === "bullet_list" || block.type === "numbered_list") {
      const ListElement = block.type === "numbered_list" ? "ol" : "ul";
      return (
        <ListElement key={`${block.type}-${blockIndex}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>{item}</li>
          ))}
        </ListElement>
      );
    }

    return (
      <div className="legal-table-scroll" key={`table-${blockIndex}`}>
        <table>
          <caption className="sr-only">{tableLabel}</caption>
          <thead>
            <tr>
              {block.headers.map((header, headerIndex) => (
                <th key={`${headerIndex}-${header}`} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${row.join("-")}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cellIndex}-${cell}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
}
